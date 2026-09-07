import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Globe,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { ActiveTab, Investigation, SearchCandidate } from '../types';
import { CandidateCard } from '../components/CandidateCard';
import { FaceComparisonModal } from '../components/FaceComparisonModal';

interface SearchEvidencePageProps {
  currentInvestigation: Investigation | null;
  onSelectAsEvidence: (candidate: SearchCandidate) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SearchEvidencePage: React.FC<SearchEvidencePageProps> = ({
  currentInvestigation,
  onSelectAsEvidence,
  setActiveTab
}) => {
  const [filterConfidence, setFilterConfidence] = useState<string>('ALL');
  const [comparingCandidate, setComparingCandidate] = useState<SearchCandidate | null>(null);
  const [showResponseMetadata, setShowResponseMetadata] = useState(false);

  if (!currentInvestigation) {
    return (
      <div className="rounded-3xl border border-blue-900/30 bg-[#080D1F]/80 p-12 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-500/30 text-cyan-400 mx-auto flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold font-mono text-white">No Active Evidence Discovery Session</h3>
        <p className="text-xs text-slate-400">
          Start a new face investigation or load the genesis demo to initiate reverse-image web discovery.
        </p>
        <button
          onClick={() => setActiveTab('new_investigation')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>Start Investigation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const candidates = currentInvestigation.candidates || [];

  const filteredCandidates = candidates.filter(c => {
    if (filterConfidence === 'ALL') return true;
    return c.confidenceLabel === filterConfidence;
  });

  const topSimilarity = candidates[0]?.faceSimilarity;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Stats Banner */}
      <div className="rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md p-6 space-y-4 shadow-xl shadow-blue-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span>Evidence Discovery Results</span>
              </h2>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                currentInvestigation.searchMode === 'DEMO'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
              }`}>
                {currentInvestigation.searchMode === 'DEMO' ? 'DEMO MODE' : 'LIVE SEARCH'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Provider: {currentInvestigation.searchProviderName}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-[#050816] border border-blue-900/40">
              <span className="text-slate-400">Candidates Found: </span>
              <strong className="text-cyan-400">{candidates.length}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#050816] border border-blue-900/40">
              <span className="text-slate-400">Top Similarity: </span>
              <strong className="text-emerald-400">
                {topSimilarity === null || topSimilarity === undefined ? 'Not available' : `${(topSimilarity * 100).toFixed(1)}%`}
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div><span className="text-slate-500 block">Search ID</span><span className="text-cyan-300 break-all">{currentInvestigation.searchId || 'Not available'}</span></div>
          <div><span className="text-slate-500 block">Search timestamp</span><span className="text-slate-300">{currentInvestigation.searchTimestamp ? new Date(currentInvestigation.searchTimestamp).toLocaleString() : 'Not available'}</span></div>
          <div><span className="text-slate-500 block">Candidates retrieved</span><span className="text-slate-300">{candidates.length}</span></div>
          <div><span className="text-slate-500 block">Processing time</span><span className="text-slate-300">{currentInvestigation.timeline.find(event => event.stage === 'Web Discovery')?.durationMs ?? 'Not available'} ms</span></div>
        </div>

        <div className="rounded-2xl border border-blue-900/30 bg-[#050816]/70 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowResponseMetadata(previous => !previous)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono text-slate-300 hover:text-cyan-300 cursor-pointer"
          >
            <span>VIEW SEARCH RESPONSE METADATA</span>
            <span>{showResponseMetadata ? 'Hide' : 'Show'}</span>
          </button>
          {showResponseMetadata && (
            <pre className="border-t border-blue-900/30 p-4 overflow-x-auto text-[11px] leading-relaxed text-cyan-200 whitespace-pre-wrap">
              {JSON.stringify(currentInvestigation.searchResponseMetadata || {}, null, 2)}
            </pre>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between pt-3 border-t border-blue-900/30">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Filter Confidence:</span>
            {['ALL', 'HIGH', 'POTENTIAL', 'LOW'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterConfidence(level)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  filterConfidence === level
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-500">
            Showing {filteredCandidates.length} candidate assets
          </span>
        </div>
      </div>

      {/* Candidates List */}
      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate, idx) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isBest={candidate.ranking === 1}
              isSelected={currentInvestigation.selectedCandidateId === candidate.id}
              onCompare={(c) => setComparingCandidate(c)}
              onSelectEvidence={(c) => onSelectAsEvidence(c)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#080D1F]/50 border border-dashed border-blue-900/40 text-xs font-mono text-slate-500 space-y-2">
          <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
          <p>No candidates match the selected filter criteria.</p>
        </div>
      )}

      {candidates.length > 0 && candidates.every(candidate => candidate.finalScore === null || candidate.confidenceLabel === 'NO_MATCH') && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-5 text-sm text-amber-200">
          <strong className="font-mono block mb-1">NO RELIABLE MATCH</strong>
          <span>Search results were retrieved, but no candidate completed a qualifying face comparison. No evidence can be registered.</span>
        </div>
      )}

      {/* Comparison Modal */}
      {comparingCandidate && (
        <FaceComparisonModal
          investigation={currentInvestigation}
          candidate={comparingCandidate}
          onClose={() => setComparingCandidate(null)}
          onSelectAsEvidence={(c) => onSelectAsEvidence(c)}
        />
      )}
    </div>
  );
};
