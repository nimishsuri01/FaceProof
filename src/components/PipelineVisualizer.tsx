import React from 'react';
import { 
  UserCheck, 
  Scan, 
  Binary, 
  Search, 
  Target, 
  FileKey, 
  Link, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { ActiveTab, Investigation } from '../types';

interface PipelineVisualizerProps {
  currentInvestigation: Investigation | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  currentInvestigation,
  activeTab,
  setActiveTab
}) => {
  const stages = [
    { id: 'new_investigation' as ActiveTab, label: '01. FACE', sublabel: 'Input Biometric', icon: UserCheck },
    { id: 'new_investigation' as ActiveTab, label: '02. DETECT', sublabel: 'Quality & Pose', icon: Scan },
    { id: 'new_investigation' as ActiveTab, label: '03. EMBED', sublabel: '512-D Vector', icon: Binary },
    { id: 'search' as ActiveTab, label: '04. SEARCH', sublabel: 'Web Discovery', icon: Search },
    { id: 'matches' as ActiveTab, label: '05. MATCH', sublabel: 'Similarity & Rank', icon: Target },
    { id: 'blockchain' as ActiveTab, label: '06. HASH', sublabel: 'SHA-256 Digest', icon: FileKey },
    { id: 'blockchain' as ActiveTab, label: '07. BLOCKCHAIN', sublabel: 'Immutable Anchor', icon: Link },
    { id: 'verification' as ActiveTab, label: '08. VERIFY', sublabel: 'Integrity Proven', icon: CheckCircle2 }
  ];

  // Determine stage progression
  const getStageStatus = (index: number) => {
    if (!currentInvestigation) {
      return index === 0 ? 'active' : 'idle';
    }

    const status = currentInvestigation.status;
    if (status === 'created') {
      return index <= 2 ? 'completed' : index === 3 ? 'active' : 'idle';
    }
    if (status === 'searched') {
      return index <= 4 ? 'completed' : index === 5 ? 'active' : 'idle';
    }
    if (status === 'evidence_selected') {
      return index <= 5 ? 'completed' : index === 6 ? 'active' : 'idle';
    }
    if (status === 'anchored') {
      return index <= 6 ? 'completed' : index === 7 ? 'active' : 'idle';
    }
    if (status === 'verified' || status === 'tamper_detected') {
      return 'completed';
    }
    return 'completed';
  };

  return (
    <div className="w-full bg-[#080D1F]/70 border border-blue-900/30 rounded-2xl p-4 backdrop-blur-md relative overflow-hidden shadow-lg shadow-blue-950/20">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            End-to-End Forensic Provenance Pipeline
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Status: <strong className="text-cyan-400">{currentInvestigation?.status.toUpperCase() || 'IDLE'}</strong>
        </span>
      </div>

      {/* Horizontal Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const status = getStageStatus(idx);
          const isCurrentTab = activeTab === stage.id;

          let badgeColor = 'border-slate-800 bg-slate-900/40 text-slate-500';
          if (status === 'completed') {
            badgeColor = 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
          } else if (status === 'active') {
            badgeColor = 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)] animate-pulse';
          }

          return (
            <button
              key={idx}
              id={`pipeline-step-${idx}`}
              onClick={() => setActiveTab(stage.id)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 group relative flex flex-col justify-between cursor-pointer ${badgeColor} ${
                isCurrentTab ? 'ring-1 ring-cyan-400/50 scale-[1.02]' : 'hover:border-blue-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${
                  status === 'completed' ? 'text-emerald-400' : status === 'active' ? 'text-cyan-400' : 'text-slate-600'
                }`} />
                {status === 'completed' ? (
                  <span className="text-[10px] font-mono font-bold text-emerald-400">✓</span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                )}
              </div>

              <div>
                <div className="text-[11px] font-bold tracking-wider truncate font-mono text-white">
                  {stage.label.split('. ')[1]}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {stage.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
