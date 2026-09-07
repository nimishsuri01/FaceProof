import os
import sys
import io
import time
import math
import numpy as np
import cv2
from typing import Optional, List
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import insightface
from insightface.app import FaceAnalysis

app = FastAPI(title="FaceProof Biometric Face Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global FaceAnalysis model instance
face_analyzer: Optional[FaceAnalysis] = None

def get_face_analyzer() -> FaceAnalysis:
    global face_analyzer
    if face_analyzer is None:
        print("[InsightFace] Initializing buffalo_sc models on CPU...")
        start_t = time.time()
        analyzer = FaceAnalysis(name='buffalo_sc', providers=['CPUExecutionProvider'])
        analyzer.prepare(ctx_id=0, det_size=(640, 640))
        face_analyzer = analyzer
        print(f"[InsightFace] Models loaded successfully in {time.time() - start_t:.2f}s")
    return face_analyzer

@app.on_event("startup")
def startup_event():
    # Pre-warm analyzer
    try:
        get_face_analyzer()
    except Exception as e:
        print(f"[InsightFace] Warning during startup pre-warming: {e}")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "FastAPI + InsightFace Biometric Intelligence",
        "models": ["det_500m", "w600k_mbf"],
        "embeddingDimension": 512
    }

def decode_image(image_bytes: bytes) -> np.ndarray:
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image payload received.")
    
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Could not decode image. Supported formats: JPG, PNG, WebP.")
    return img

def calculate_quality(img: np.ndarray, face) -> dict:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 1. Laplacian variance for blur
    lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    
    # 2. Lighting brightness & contrast
    mean_bright = float(np.mean(gray))
    std_contrast = float(np.std(gray))
    
    # 3. Face size relative to image
    img_h, img_w = img.shape[:2]
    x1, y1, x2, y2 = [float(v) for v in face.bbox]
    face_w = max(1.0, x2 - x1)
    face_h = max(1.0, y2 - y1)
    face_area_ratio = (face_w * face_h) / (img_w * img_h)
    
    # Detection confidence
    det_score = float(face.det_score) if hasattr(face, 'det_score') else 0.95
    
    # Calibrated quality score calculation (0 - 100)
    # Blur component (0 to 35 pts)
    blur_pts = min(35.0, (lap_var / 150.0) * 35.0)
    
    # Detection score component (0 to 35 pts)
    det_pts = min(35.0, det_score * 35.0)
    
    # Face resolution/size component (0 to 15 pts)
    # Ideal face ratio between 0.05 and 0.40
    size_pts = 15.0 if 0.05 <= face_area_ratio <= 0.60 else max(5.0, 15.0 * (face_area_ratio / 0.05))
    
    # Lighting balance (0 to 15 pts)
    # Ideal brightness between 60 and 190
    light_pts = 15.0 if 70 <= mean_bright <= 180 else max(5.0, 15.0 - abs(mean_bright - 125) / 10.0)
    
    total_quality = round(min(100.0, max(15.0, blur_pts + det_pts + size_pts + light_pts)), 1)
    
    if lap_var > 120.0:
        blur_label = "Optimal Sharpness"
    elif lap_var > 45.0:
        blur_label = "Acceptable Resolution"
    else:
        blur_label = "Slightly Blurry"
        
    return {
        "qualityScore": total_quality,
        "laplacianVariance": round(lap_var, 2),
        "blurLabel": blur_label,
        "brightness": round(mean_bright, 1),
        "contrast": round(std_contrast, 1),
        "faceAreaRatio": round(face_area_ratio, 4)
    }

@app.post("/detect")
async def detect_face(image: UploadFile = File(...)):
    """
    Real Face Detection using InsightFace buffalo_sc.
    Validates uploaded file, detects faces, checks count,
    calculates real quality & generates 512-D embedding.
    """
    start_time = time.time()
    contents = await image.read()
    
    if len(contents) > 20 * 1024 * 1024:
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": {"code": "FILE_TOO_LARGE", "message": "Image exceeds 20MB limit."}}
        )
        
    try:
        img = decode_image(contents)
    except HTTPException as he:
        return JSONResponse(
            status_code=he.status_code,
            content={"success": False, "error": {"code": "INVALID_IMAGE", "message": he.detail}}
        )

    img_h, img_w = img.shape[:2]
    analyzer = get_face_analyzer()
    
    # InsightFace inference
    faces = analyzer.get(img)
    processing_time_ms = int((time.time() - start_time) * 1000)

    # 1. No face detected
    if len(faces) == 0:
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "faceDetected": False,
                "faceCount": 0,
                "error": {
                    "code": "NO_FACE_DETECTED",
                    "message": "No face detected in the uploaded evidence image. Please provide a clear facial photograph."
                }
            }
        )

    # 2. Multiple faces detected
    if len(faces) > 1:
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "faceDetected": True,
                "faceCount": len(faces),
                "error": {
                    "code": "MULTIPLE_FACES",
                    "message": "Multiple faces detected. Please upload an image containing one primary face."
                }
            }
        )

    # 3. Single face detected (InsightFace primary subject)
    face = faces[0]
    quality = calculate_quality(img, face)

    # Format bounding box
    x1, y1, x2, y2 = [float(val) for val in face.bbox]
    bbox = {
        "x": max(0, round(x1)),
        "y": max(0, round(y1)),
        "width": round(x2 - x1),
        "height": round(y2 - y1)
    }

    # Format 5 key landmarks
    landmarks = {}
    if hasattr(face, 'kps') and face.kps is not None and len(face.kps) >= 5:
        kps = face.kps
        landmarks = {
            "leftEye": [round(float(kps[0][0]), 1), round(float(kps[0][1]), 1)],
            "rightEye": [round(float(kps[1][0]), 1), round(float(kps[1][1]), 1)],
            "nose": [round(float(kps[2][0]), 1), round(float(kps[2][1]), 1)],
            "leftMouth": [round(float(kps[3][0]), 1), round(float(kps[3][1]), 1)],
            "rightMouth": [round(float(kps[4][0]), 1), round(float(kps[4][1]), 1)],
        }

    # Normalize 512-D embedding
    raw_emb = face.embedding
    norm = np.linalg.norm(raw_emb)
    if norm > 0:
        normalized_emb = (raw_emb / norm).tolist()
    else:
        normalized_emb = raw_emb.tolist()

    return {
        "success": True,
        "faceDetected": True,
        "faceCount": 1,
        "qualityScore": quality["qualityScore"],
        "blurScore": quality["laplacianVariance"],
        "blurLabel": quality["blurLabel"],
        "brightness": quality["brightness"],
        "contrast": quality["contrast"],
        "embeddingGenerated": True,
        "embeddingDimension": len(normalized_emb),
        "embedding": normalized_emb,
        "landmarks": landmarks,
        "boundingBox": bbox,
        "imageDimensions": {"width": img_w, "height": img_h},
        "detectionScore": round(float(face.det_score), 4) if hasattr(face, 'det_score') else 0.98,
        "processingTimeMs": processing_time_ms
    }

@app.post("/compare")
async def compare_faces(
    subject_embedding: str = Form(...),
    candidate_image: UploadFile = File(...)
):
    """
    Compares uploaded candidate image against subject 512-D embedding using InsightFace.
    Returns calculated cosine similarity.
    """
    try:
        import json
        emb_list = json.loads(subject_embedding)
        emb_subject = np.array(emb_list, dtype=np.float32)
    except Exception as e:
        return JSONResponse(status_code=400, content={"success": False, "error": f"Invalid subject embedding format: {e}"})

    contents = await candidate_image.read()
    try:
        img = decode_image(contents)
    except HTTPException as he:
        return JSONResponse(status_code=he.status_code, content={"success": False, "error": he.detail})

    analyzer = get_face_analyzer()
    faces = analyzer.get(img)

    if len(faces) == 0:
        return {
            "success": True,
            "faceDetected": False,
            "cosineSimilarity": 0.0,
            "message": "No face found in candidate image to compare"
        }

    # If multiple, take largest face
    best_face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
    cand_emb = best_face.embedding
    
    # Cosine similarity
    norm_s = np.linalg.norm(emb_subject)
    norm_c = np.linalg.norm(cand_emb)
    
    if norm_s > 0 and norm_c > 0:
        sim = float(np.dot(emb_subject, cand_emb) / (norm_s * norm_c))
        # Clip between 0.0 and 1.0
        sim = max(0.0, min(1.0, sim))
    else:
        sim = 0.0

    return {
        "success": True,
        "faceDetected": True,
        "cosineSimilarity": round(sim, 4),
        "candidateFaceCount": len(faces),
        "candidateDetectionScore": round(float(best_face.det_score), 4) if hasattr(best_face, 'det_score') else 0.9
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("FACE_SERVICE_PORT", 8001))
    uvicorn.run("face_service:app", host="127.0.0.1", port=port, log_level="info")
