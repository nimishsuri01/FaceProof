# FACEPROOF REST API Documentation

Base URL: `/api`

All JSON endpoints respond with a standard format:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable explanation"
  }
}
```

---

## Endpoints

### 1. Health & Node Status
- **GET** `/api/health`
- **Response**:
  ```json
  {
    "status": "operational",
    "timestamp": 1725700000000,
    "blockchain": {
      "connected": true,
      "network": "Ethereum Sepolia / Local EVM Runner",
      "latestBlock": 142894,
      "contract": "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
    "searchProvider": {
      "mode": "DEMO_FALLBACK" // or "LIVE_WEB_SEARCH"
    }
  }
  ```

### 2. Create Investigation
- **POST** `/api/investigations`
- **Body**:
  ```json
  {
    "image": "data:image/jpeg;base64,...",
    "sourceNote": "Optional reference",
    "investigatorId": "INV-2026-901"
  }
  ```
- **Response**: Full Investigation object with face detection metrics, image quality score (0-100), facial landmarks, and execution timeline.

### 3. Face Analysis & Landmark Extraction
- **POST** `/api/face/analyze`
- **Body**: `{ "image": "data:image/jpeg;base64,..." }`
- **Returns**: Face count, blur score, pose estimation (yaw, pitch, roll), lighting score, quality score, and 512-D embedding metadata. Rejects zero faces or multiple faces with clear error code.

### 4. Search Evidence Discovery
- **POST** `/api/search`
- **Body**:
  ```json
  {
    "investigationId": "inv_12345",
    "queryFilter": "news, public records",
    "searchMode": "live" // or "demo"
  }
  ```
- **Returns**: Ranked candidates discovered across public platforms, with source platform, URL, snippet, timestamps, and deduplication info.

### 5. Multi-Signal Candidate Comparison
- **POST** `/api/matches/compare`
- **Body**:
  ```json
  {
    "investigationId": "inv_12345",
    "candidateId": "cand_987"
  }
  ```
- **Returns**: Explainable scoring breakdown:
  - `faceSimilarity` (0.00 - 1.00)
  - `imageSimilarity` (0.00 - 1.00)
  - `metadataScore` (0.00 - 1.00)
  - `sourceSignalScore` (0.00 - 1.00)
  - `finalScore` (weighted)
  - `confidenceLabel`: `HIGH` | `POTENTIAL` | `LOW` | `NO_MATCH`
  - `scoringRationale`: Array of positive/negative explainable factors.

### 6. Create Deterministic Evidence Hash
- **POST** `/api/evidence/hash`
- **Body**:
  ```json
  {
    "investigationId": "inv_12345",
    "candidateId": "cand_987"
  }
  ```
- **Returns**: SHA-256 evidence fingerprint (`0x...` 32-byte hex) and canonical package payload.

### 7. Anchor Evidence to Blockchain
- **POST** `/api/evidence/register`
- **Body**:
  ```json
  {
    "investigationId": "inv_12345",
    "candidateId": "cand_987"
  }
  ```
- **Returns**: Blockchain transaction hash, block number, gas used, confirmed timestamp, and contract address.

### 8. Verify Evidence Integrity & Tamper Detection
- **POST** `/api/evidence/:id/verify`
- **Body**:
  ```json
  {
    "tamperSimulation": false // set to true in controlled demo to modify payload
  }
  ```
- **Returns**:
  ```json
  {
    "verified": true,
    "status": "CRYPTOGRAPHICALLY_VERIFIED",
    "currentHash": "0xa91fc83...",
    "blockchainHash": "0xa91fc83...",
    "match": true,
    "blockNumber": 142895,
    "timestamp": 1725700200000
  }
  ```

### 9. Get Blockchain Records & History
- **GET** `/api/blockchain/records`
- **GET** `/api/investigations`
- **GET** `/api/system/evaluation` (Provides real benchmarks across benchmark dataset).
