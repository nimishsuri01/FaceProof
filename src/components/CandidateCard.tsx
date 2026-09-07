import React from 'react';
import { 
  ExternalLink, 
  Award, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Globe, 
  ArrowRight,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';
import { SearchCandidate } from '../types';

interface CandidateCardProps {
  candidate: SearchCandidate;
  isBest?: boolean;
  isSelected?: boolean;
  onCompare: (candidate: SearchCandidate) => void;
  onSelectEvidence: (candidate: SearchCandidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isBest = false,
  isSelected = false,
  onCompare,
  onSelectEvidence
}) => {
  const getBadgeStyle = (label: SearchCandidate['confidenceLabel']) => {
    switch (label) {
      case 'HIGH':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'POTENTIAL':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'LOW':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'NO_MATCH':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
    }
  };

  return (
    <div 
      id={`candidate-card-${candidate.id}`}
      className={`rounded-2xl border transition-all duration-200 bg-[#080D1F]/90 backdrop-blur-md overflow-hidden flex flex-col justify-between group ${
        isSelected
          ? 'border-cyan-400 ring-2 ring-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
          : isBest
          ? 'border-blue-500/50 hover:border-cyan-400/80 shadow-lg shadow-blue-950/40'
          : 'border-blue-900/30 hover:border-blue-700/60'
      }`}
    >
      <div>
        {/* Card Header & Ranking */}
        <div className="p-4 border-b border-blue-900/30 flex items-center justify-between bg-[#050816]/60">
          <div className="flex items-center gap-2">
            {isBest ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-mono text-[10px] font-bold tracking-wider shadow-sm">
                <Award className="w-3 h-3" />
                #1 BEST CANDIDATE
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded font-mono text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800">
                #{candidate.ranking} CANDIDATE
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getBadgeStyle(candidate.confidenceLabel)}`}>
              {candidate.confidenceLabel} CONFIDENCE
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(candidate.timestamp).toLocaleDateString()}
          </span>
        </div>

        {/* Media & Content Grid */}
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          {/* Candidate Image preview */}
          <div className="relative w-full sm:w-36 h-36 shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-blue-900/50">
            <img
              src={candidate.imageUrl}
              alt={candidate.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-cyan-300">
              {(candidate.faceSimilarity * 100).toFixed(1)}% SIMILAR
            </span>
          </div>

          {/* Details & Source */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{candidate.source}</span>
            </div>

            <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2">
              {candidate.title}
            </h4>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {candidate.snippet}
            </p>

            <a
              href={candidate.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-cyan-300 transition-colors truncate max-w-full"
            >
              <span className="truncate">{candidate.canonicalUrl}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>

        {/* Metric Gauges */}
        <div className="px-4 py-3 bg-[#050816]/40 border-t border-blue-900/20 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-blue-950/20 border border-blue-900/30">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Face Similarity</div>
            <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
              {(candidate.faceSimilarity * 100).toFixed(1)}%
            </div>
          </div>
          <div className="p-2 rounded-lg bg-blue-950/20 border border-blue-900/30">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Image Struct</div>
            <div className="text-sm font-mono font-bold text-blue-300 mt-0.5">
              {(candidate.imageSimilarity * 100).toFixed(1)}%
            </div>
          </div>
          <div className="p-2 rounded-lg bg-blue-950/20 border border-blue-900/30">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Composite Score</div>
            <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
              {(candidate.finalScore * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 border-t border-blue-900/30 flex items-center gap-3 bg-[#080D1F]">
        <button
          onClick={() => onCompare(candidate)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-blue-900/40 text-xs font-medium transition-all cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Compare Landmark</span>
        </button>

        <button
          onClick={() => onSelectEvidence(candidate)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            isSelected
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>{isSelected ? '✓ Selected Evidence' : 'Select As Evidence'}</span>
        </button>
      </div>
    </div>
  );
};
