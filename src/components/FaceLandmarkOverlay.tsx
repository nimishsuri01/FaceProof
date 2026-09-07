import React, { useState } from 'react';
import { Scan, Eye, CheckCircle2 } from 'lucide-react';
import { FaceLandmarks } from '../types';

interface FaceLandmarkOverlayProps {
  imageSrc: string;
  landmarks?: FaceLandmarks;
  isScanning?: boolean;
  label?: string;
  confidence?: number;
}

export const FaceLandmarkOverlay: React.FC<FaceLandmarkOverlayProps> = ({
  imageSrc,
  landmarks,
  isScanning = false,
  label = 'SUBJECT BIOMETRICS',
  confidence
}) => {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#050816] border border-blue-900/40 group aspect-[4/3] flex items-center justify-center">
      {/* Background Image */}
      <img
        src={imageSrc}
        alt="Biometric Subject"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center filter contrast-105"
      />

      {/* Cyber Grid Texture Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      {/* Scan Laser Animation */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-12 radar-scan absolute animate-[scan_2s_linear_infinite]" />
        </div>
      )}

      {/* Facial Landmarks Overlay */}
      {showOverlay && landmarks && (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          {/* Facial Target Bounding Box */}
          <rect
            x="24"
            y="18"
            width="52"
            height="64"
            rx="4"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="0.8"
            strokeDasharray="2,2"
            className="animate-pulse"
          />

          {/* Corner Brackets */}
          <path d="M 22 28 L 22 16 L 34 16" fill="none" stroke="#38BDF8" strokeWidth="1.6" />
          <path d="M 78 28 L 78 16 L 66 16" fill="none" stroke="#38BDF8" strokeWidth="1.6" />
          <path d="M 22 72 L 22 84 L 34 84" fill="none" stroke="#38BDF8" strokeWidth="1.6" />
          <path d="M 78 72 L 78 84 L 66 84" fill="none" stroke="#38BDF8" strokeWidth="1.6" />

          {/* Eye Landmarks */}
          <circle cx={landmarks.leftEye[0] * 100} cy={landmarks.leftEye[1] * 100} r="1.8" fill="#22D3EE" />
          <circle cx={landmarks.rightEye[0] * 100} cy={landmarks.rightEye[1] * 100} r="1.8" fill="#22D3EE" />

          {/* Interpupillary connecting line */}
          <line
            x1={landmarks.leftEye[0] * 100}
            y1={landmarks.leftEye[1] * 100}
            x2={landmarks.rightEye[0] * 100}
            y2={landmarks.rightEye[1] * 100}
            stroke="#22D3EE"
            strokeWidth="0.6"
            strokeOpacity="0.7"
          />

          {/* Nose Tip */}
          <circle cx={landmarks.noseTip[0] * 100} cy={landmarks.noseTip[1] * 100} r="1.5" fill="#F59E0B" />

          {/* Mouth points and contour */}
          <circle cx={landmarks.mouthLeft[0] * 100} cy={landmarks.mouthLeft[1] * 100} r="1.4" fill="#60A5FA" />
          <circle cx={landmarks.mouthRight[0] * 100} cy={landmarks.mouthRight[1] * 100} r="1.4" fill="#60A5FA" />
          <line
            x1={landmarks.mouthLeft[0] * 100}
            y1={landmarks.mouthLeft[1] * 100}
            x2={landmarks.mouthRight[0] * 100}
            y2={landmarks.mouthRight[1] * 100}
            stroke="#60A5FA"
            strokeWidth="0.6"
          />

          {/* Facial Vertical Symmetry Axis */}
          <line
            x1="50"
            y1="16"
            x2="50"
            y2="84"
            stroke="#22D3EE"
            strokeWidth="0.4"
            strokeDasharray="1,2"
            strokeOpacity="0.5"
          />
        </svg>
      )}

      {/* Top Overlay Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-md bg-[#050816]/85 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold tracking-wider flex items-center gap-1.5 shadow-md">
          <Scan className="w-3 h-3 text-cyan-400" />
          {label}
        </span>
        {confidence !== undefined && (
          <span className="px-2 py-1 rounded-md bg-blue-950/80 backdrop-blur-md border border-blue-500/30 text-[10px] font-mono text-blue-200 font-bold">
            {(confidence * 100).toFixed(1)}% SIMILARITY
          </span>
        )}
      </div>

      {/* Toggle Landmark Button */}
      {landmarks && (
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          aria-label={showOverlay ? 'Hide biometric landmark overlay' : 'Show biometric landmark overlay'}
          className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#050816]/85 hover:bg-slate-900 border border-blue-900/60 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
        >
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>{showOverlay ? 'Landmarks ON' : 'Landmarks OFF'}</span>
        </button>
      )}
    </div>
  );
};
