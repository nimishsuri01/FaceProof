import React from 'react';
import { 
  X, 
  Scan, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { Investigation, SearchCandidate } from '../types';
import { FaceLandmarkOverlay } from './FaceLandmarkOverlay';

interface FaceComparisonModalProps {
  investigation: Investigation;
  candidate: SearchCandidate;
  onClose: () => void;
  onSelectAsEvidence: (candidate: SearchCandidate) => void;
}

export const FaceComparisonModal: React.FC<FaceComparisonModalProps> = ({
  investigation,
  candidate,
  onClose,
  onSelectAsEvidence
}) => {
  const formatScore = (value: number | null) => value === null ? 'Not available' : `${(value * 100).toFixed(1)}%`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-face-comparison"
        className="w-full max-w-4xl bg-[#080D1F] border border-blue-800/60 rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/60 my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-blue-900/40 flex items-center justify-between bg-[#050816]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono tracking-tight">
                Biometric Facial Comparison & Landmark Alignment
              </h3>
              <p className="text-xs text-slate-400">
                Evaluating candidate feature vector against primary subject embedding
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Dual Image Visual Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Face */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Primary Input Subject
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Quality: {investigation.faceAnalysis.qualityScore}/100
                </span>
              </div>
              <FaceLandmarkOverlay
                imageSrc={investigation.inputImage}
                landmarks={investigation.faceAnalysis.landmarks}
                label="PRIMARY BIOMETRIC"
              />
              <div className="p-2.5 rounded-xl bg-[#050816] border border-blue-900/30 text-[11px] font-mono text-slate-400 space-y-1">
                <div>Pose: <strong className="text-slate-200">{investigation.faceAnalysis.pose.label}</strong> (Yaw {investigation.faceAnalysis.pose.yaw}°)</div>
                <div>Blur Index: <strong className="text-emerald-400">{investigation.faceAnalysis.blurScore} ({investigation.faceAnalysis.blurLabel})</strong></div>
              </div>
            </div>

            {/* Matched Web Evidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Discovered Candidate #{candidate.ranking}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {formatScore(candidate.faceSimilarity)} Match
                </span>
              </div>
              <FaceLandmarkOverlay
                imageSrc={candidate.imageUrl}
                landmarks={candidate.landmarks || investigation.faceAnalysis.landmarks}
                label="WEB DISCOVERY"
                confidence={candidate.faceSimilarity}
              />
              <div className="p-2.5 rounded-xl bg-[#050816] border border-blue-900/30 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="truncate">Source: <strong className="text-cyan-300">{candidate.source}</strong></div>
                <div className="truncate">Discovered: <strong className="text-slate-200">{new Date(candidate.timestamp).toLocaleDateString()}</strong></div>
              </div>
            </div>
          </div>

          {/* Transparent Confidence Engine Breakdown */}
          <div className="p-5 rounded-2xl bg-[#050816] border border-blue-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Percent className="w-3.5 h-3.5 text-cyan-400" />
                Transparent Multi-Signal Scoring Engine
              </h4>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                Confidence: {candidate.confidenceLabel} ({formatScore(candidate.finalScore)})
              </span>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3 font-mono text-xs">
              {/* Face Similarity */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1 text-[11px]">
                  <span>Biometric Facial Cosine Similarity (Weight 45%)</span>
                  <span className="text-cyan-300 font-bold">{formatScore(candidate.faceSimilarity)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
                    style={{ width: `${candidate.faceSimilarity * 100}%` }}
                  />
                </div>
              </div>

              {/* Image Similarity */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1 text-[11px]">
                  <span>Structural Image Consistency (Weight 30%)</span>
                  <span className="text-blue-300 font-bold">{formatScore(candidate.imageSimilarity)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-700 to-blue-400 transition-all duration-500"
                    style={{ width: `${candidate.imageSimilarity * 100}%` }}
                  />
                </div>
              </div>

              {/* Metadata Score */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1 text-[11px]">
                  <span>Metadata & Temporal Consistency (Weight 15%)</span>
                  <span className="text-amber-300 font-bold">{formatScore(candidate.metadataScore)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                    style={{ width: `${candidate.metadataScore * 100}%` }}
                  />
                </div>
              </div>

              {/* Source Signal Score */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1 text-[11px]">
                  <span>Source Platform Credibility (Weight 10%)</span>
                  <span className="text-purple-300 font-bold">{formatScore(candidate.sourceSignalScore)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                    style={{ width: `${candidate.sourceSignalScore * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Disclaimer pill */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-950/30 border border-blue-900/30 text-[11px] text-slate-400 leading-normal">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Scores are model and system outputs and are not proof of real-world identity. They represent mathematical similarity between visual digital records.
              </span>
            </div>
          </div>

          {/* Explainable Selection Rationale */}
          <div className="p-5 rounded-2xl bg-[#050816] border border-blue-900/40 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Why did we select this candidate?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {candidate.scoringRationale.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-blue-900/40 flex items-center justify-between bg-[#050816]/90">
          <a
            href={candidate.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 font-mono transition-colors"
          >
            <span>Inspect Canonical Source URL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onSelectAsEvidence(candidate);
                onClose();
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Select Evidence</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
