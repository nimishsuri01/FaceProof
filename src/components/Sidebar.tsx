import React from 'react';
import { 
  Shield, 
  Search, 
  ScanFace, 
  Layers, 
  CheckCircle2, 
  History, 
  BarChart3, 
  Settings, 
  PlusCircle,
  FileCheck,
  Lock,
  Cpu,
  Info
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPrivacyModal: () => void;
  isDemoMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPrivacyModal,
  isDemoMode
}) => {
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: Layers, desc: 'Forensic mission control' },
    { id: 'new_investigation' as ActiveTab, label: 'New Investigation', icon: PlusCircle, desc: 'Biometric face ingestion' },
    { id: 'search' as ActiveTab, label: 'Search Evidence', icon: Search, desc: 'Web discovery results' },
    { id: 'matches' as ActiveTab, label: 'Matches', icon: ScanFace, desc: 'Visual face comparison' },
    { id: 'blockchain' as ActiveTab, label: 'Blockchain Registry', icon: Lock, desc: 'On-chain evidence proofs' },
    { id: 'verification' as ActiveTab, label: 'Verification', icon: CheckCircle2, desc: 'Tamper & integrity checks' },
    { id: 'certificate' as ActiveTab, label: 'Certificate', icon: FileCheck, desc: 'Proof receipt export' },
    { id: 'history' as ActiveTab, label: 'Investigation History', icon: History, desc: 'Audit trails & logs' },
    { id: 'evaluation' as ActiveTab, label: 'System Evaluation', icon: BarChart3, desc: 'Benchmarks & test suites' },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings, desc: 'API keys & model weights' }
  ];

  return (
    <aside 
      id="main-sidebar" 
      className="w-64 bg-[#080D1F]/95 backdrop-blur-md border-r border-blue-900/30 flex flex-col h-screen select-none z-30 shrink-0"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-blue-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 p-0.5 shadow-lg shadow-blue-600/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#050816] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <Shield className="w-5 h-5 text-cyan-400" />
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-wider text-white">FACEPROOF</span>
            </div>
            <p className="text-[10px] text-cyan-400 font-medium tracking-widest uppercase">
              AI Evidence Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
          Forensic Pipeline
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group relative ${
                isActive
                  ? 'bg-blue-600/15 text-cyan-300 font-medium border border-blue-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
              }`} />
              <div className="flex-1 truncate">
                <div className="text-xs truncate">{item.label}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer / Status Area */}
      <div className="p-4 border-t border-blue-900/30 space-y-3 bg-[#050816]/60">
        {/* Live operational badge */}
        <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-medium tracking-tight">SYSTEM OPERATIONAL</span>
          </div>
          <Cpu className="w-3.5 h-3.5 opacity-70" />
        </div>

        {/* Search Mode indicator */}
        <div className="flex items-center justify-between text-[11px] px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <span>Search Engine</span>
          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
            isDemoMode 
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
              : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
          }`}>
            {isDemoMode ? 'DEMO MODE' : 'LIVE API'}
          </span>
        </div>

        {/* Responsible use link */}
        <button
          id="btn-privacy-notice"
          onClick={onOpenPrivacyModal}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors py-1 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Responsible Use & Privacy</span>
        </button>
      </div>
    </aside>
  );
};
