import React from 'react';
import { 
  Shield, 
  Search, 
  Scan, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Database,
  ExternalLink,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { ActiveTab, Investigation } from '../types';
import { PipelineVisualizer } from '../components/PipelineVisualizer';

interface OverviewPageProps {
  currentInvestigation: Investigation | null;
  setActiveTab: (tab: ActiveTab) => void;
  onRunDemoInvestigation: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  currentInvestigation,
  setActiveTab,
  onRunDemoInvestigation
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-blue-900/40 bg-gradient-to-br from-[#080D1F] via-[#050816] to-[#0A1128] shadow-2xl shadow-blue-950/40">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-cyan-300 font-mono text-xs shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>CYBER FORENSICS + AI INTELLIGENCE + DIGITAL EVIDENCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-mono leading-tight">
            From Face Discovery <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              to Immutable Evidence.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
            FaceProof discovers matching web evidence, evaluates candidate similarity using 512-dimensional facial embeddings, cryptographically fingerprints the selected record with SHA-256, and anchors that fingerprint on blockchain so its integrity can be independently proven.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              id="btn-start-investigation"
              onClick={() => setActiveTab('new_investigation')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Scan className="w-4 h-4" />
              <span>Start Investigation</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              id="btn-overview-demo"
              onClick={onRunDemoInvestigation}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Load Genesis Demo Investigation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Interactive Pipeline */}
      <PipelineVisualizer
        currentInvestigation={currentInvestigation}
        activeTab="overview"
        setActiveTab={setActiveTab}
      />

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 01 */}
        <div className="p-6 rounded-2xl bg-[#080D1F]/80 border border-blue-900/30 hover:border-cyan-500/40 transition-all group space-y-3">
          <div className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
            01 / BIOMETRICS
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <Scan className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">Face Intelligence</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-stage landmark detection, Laplacian blur scoring, lighting assessment, and 512-dimensional vector embedding normalization.
          </p>
        </div>

        {/* Pillar 02 */}
        <div className="p-6 rounded-2xl bg-[#080D1F]/80 border border-blue-900/30 hover:border-cyan-500/40 transition-all group space-y-3">
          <div className="text-[10px] font-mono font-bold text-blue-400 tracking-widest uppercase">
            02 / RETRIEVAL
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">Web Discovery</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reverse-image indexing via genuine search providers with URL canonicalization, metadata normalization, and deduplication.
          </p>
        </div>

        {/* Pillar 03 */}
        <div className="p-6 rounded-2xl bg-[#080D1F]/80 border border-blue-900/30 hover:border-cyan-500/40 transition-all group space-y-3">
          <div className="text-[10px] font-mono font-bold text-indigo-400 tracking-widest uppercase">
            03 / CORRELATION
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">Evidence Analysis</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-signal explainable confidence engine evaluating facial cosine distance, structural histogram, and platform reputation.
          </p>
        </div>

        {/* Pillar 04 */}
        <div className="p-6 rounded-2xl bg-[#080D1F]/80 border border-blue-900/30 hover:border-cyan-500/40 transition-all group space-y-3">
          <div className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
            04 / IMMUTABILITY
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">Blockchain Provenance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deterministic SHA-256 canonical fingerprint anchored into EVM smart contract for independent mathematical integrity proof.
          </p>
        </div>
      </div>

      {/* Active Session Spotlight */}
      {currentInvestigation && (
        <div className="p-6 rounded-3xl border border-cyan-500/30 bg-[#080D1F]/90 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/50 shrink-0">
              <img
                src={currentInvestigation.inputImage}
                alt="Target subject"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  ACTIVE INVESTIGATION
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {currentInvestigation.status.toUpperCase()}
                </span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">
                {currentInvestigation.title}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Discovered Candidates: {currentInvestigation.candidates?.length || 0} | Quality: {currentInvestigation.faceAnalysis.qualityScore}/100
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setActiveTab('search')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
            >
              <span>View Discovered Evidence</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Verify Provenance</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
