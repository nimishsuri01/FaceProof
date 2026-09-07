import React, { useState } from 'react';
import { 
  Scan, 
  Layers, 
  CheckCircle2, 
  Percent, 
  Info, 
  ExternalLink, 
  ArrowRight, 
  Lock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab, Investigation, SearchCandidate } from '../types';
import { FaceLandmarkOverlay } from '../components/FaceLandmarkOverlay';

interface MatchesComparisonPageProps {
  currentInvestigation: Investigation | null;
  onSelectAsEvidence: (candidate: SearchCandidate) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MatchesComparisonPage: React.FC<MatchesComparisonPageProps> = ({
  currentInvestigation,
  onSelectAsEvidence,
  setActiveTab
}) => {
  if (!currentInvestigation || !currentInvestigation.candidates?.length) {
    return (
      <div className="rounded-3xl border border-blue-900/30 bg-[#080D1F]/80 p-12 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-500/30 text-cyan-400 mx-auto flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold font-mono text-white">No Matches To Compare</h3>
        <p className="text-xs text-slate-400">
          Run an investigation to discover and rank matching web candidates.
        </p>
        <button
          onClick={() => setActiveTab('new_investigation')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>New Investigation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Selected candidate or default to #1
  const selectedCandidate = currentInvestigation.candidates.find(
    c => c.id === currentInvestigation.selectedCandidateId
  ) || currentInvestigation.candidates[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Scan className="w-5 h-5 text-cyan-400" />
            <span>Biometric Landmark Comparison & Scoring Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Forensic side-by-side evaluation between Primary Input Face and Discovered Candidate Evidence
          </p>
        </div>

        {/* Candidate Selector Tab */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Select Candidate:</span>
          <div className="flex items-center gap-1 bg-[#050816] p-1 rounded-xl border border-blue-900/50">
            {currentInvestigation.candidates.slice(0, 3).map((cand) => (
              <button
                key={cand.id}
                onClick={() => onSelectAsEvidence(cand)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedCandidate.id === cand.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                #{cand.ranking} ({(cand.faceSimilarity * 100).toFixed(0)}%)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Comparison Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Input Face */}
        <div className="rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Primary Subject Input Face
            </span>
            <span className="text-xs font-mono text-slate-400">
              Quality: {currentInvestigation.faceAnalysis.qualityScore}/100
            </span>
          </div>

          <FaceLandmarkOverlay
            imageSrc={currentInvestigation.inputImage}
            landmarks={currentInvestigation.faceAnalysis.landmarks}
            label="SUBJECT BIOMETRIC"
          />

          <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#050816] border border-blue-900/30">
              <div className="text-[10px] text-slate-400">Pose Orientation</div>
              <div className="font-bold text-white mt-0.5">{currentInvestigation.faceAnalysis.pose.label}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#050816] border border-blue-900/30">
              <div className="text-[10px] text-slate-400">Laplacian Blur</div>
              <div className="font-bold text-emerald-400 mt-0.5">{currentInvestigation.faceAnalysis.blurScore}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#050816] border border-blue-900/30">
              <div className="text-[10px] text-slate-400">Vector Length</div>
              <div className="font-bold text-cyan-300 mt-0.5">512 dims</div>
            </div>
          </div>
        </div>

        {/* Right: Discovered Candidate */}
        <div className="rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              Discovered Web Candidate #{selectedCandidate.ranking}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {(selectedCandidate.faceSimilarity * 100).toFixed(1)}% Match
            </span>
          </div>

          <FaceLandmarkOverlay
            imageSrc={selectedCandidate.imageUrl}
            landmarks={selectedCandidate.landmarks || currentInvestigation.faceAnalysis.landmarks}
            label="WEB DISCOVERY"
            confidence={selectedCandidate.faceSimilarity}
          />

          <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#050816] border border-blue-900/30">
              <div className="text-[10px] text-slate-400">Source Platform</div>
              <div className="font-bold text-cyan-300 mt-0.5 truncate">{selectedCandidate.source}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#050816] border border-blue-900/30">
              <div className="text-[10px] text-slate-400">Image Struct</div>
              <div className="font-bold text-blue-300 mt-0.5">{(selectedCandidate.imageSimilarity * 100).toFixed(1)}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#050816] border border-blue-900/30">
              <div className="text-[10px] text-slate-400">Confidence</div>
              <div className="font-bold text-emerald-400 mt-0.5">{selectedCandidate.confidenceLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Confidence Engine Breakdown (Section 15) */}
      <div className="p-6 rounded-3xl bg-[#080D1F]/90 border border-blue-900/40 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-900/30">
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Percent className="w-4 h-4 text-cyan-400" />
              Transparent Confidence Scoring Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Dynamic multi-signal weighted calculation with explainable component weights
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-slate-400">Composite Score</div>
            <div className="text-xl font-mono font-bold text-emerald-400">
              {(selectedCandidate.finalScore * 100).toFixed(1)}% ({selectedCandidate.confidenceLabel})
            </div>
          </div>
        </div>

        {/* Progress Bar Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Bar 1 */}
          <div className="p-4 rounded-2xl bg-[#050816] border border-blue-900/30 space-y-2">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>FACE SIMILARITY (Cosine Vector Distance • Weight 45%)</span>
              <span className="text-cyan-300 font-bold">{(selectedCandidate.faceSimilarity * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
                style={{ width: `${selectedCandidate.faceSimilarity * 100}%` }}
              />
            </div>
          </div>

          {/* Bar 2 */}
          <div className="p-4 rounded-2xl bg-[#050816] border border-blue-900/30 space-y-2">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>IMAGE SIMILARITY (Structural Histogram • Weight 30%)</span>
              <span className="text-blue-300 font-bold">{(selectedCandidate.imageSimilarity * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-700 to-blue-400 transition-all duration-700"
                style={{ width: `${selectedCandidate.imageSimilarity * 100}%` }}
              />
            </div>
          </div>

          {/* Bar 3 */}
          <div className="p-4 rounded-2xl bg-[#050816] border border-blue-900/30 space-y-2">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>METADATA CONSISTENCY (Headers & Timestamp • Weight 15%)</span>
              <span className="text-amber-300 font-bold">{(selectedCandidate.metadataScore * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
                style={{ width: `${selectedCandidate.metadataScore * 100}%` }}
              />
            </div>
          </div>

          {/* Bar 4 */}
          <div className="p-4 rounded-2xl bg-[#050816] border border-blue-900/30 space-y-2">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>SOURCE CREDIBILITY (Platform Trust Score • Weight 10%)</span>
              <span className="text-purple-300 font-bold">{(selectedCandidate.sourceSignalScore * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-700"
                style={{ width: `${selectedCandidate.sourceSignalScore * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Explainability factors */}
        <div className="p-4 rounded-2xl bg-[#050816] border border-blue-900/30 space-y-3">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Why did we select this candidate?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedCandidate.scoringRationale.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action to proceed to Blockchain Anchoring */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-blue-900/30">
          <a
            href={selectedCandidate.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <span>Verify Canonical Source ({selectedCandidate.canonicalUrl.slice(0, 45)}...)</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => setActiveTab('blockchain')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Proceed to Blockchain Fingerprinting & Anchoring</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
