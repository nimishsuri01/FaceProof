import React from 'react';
import { 
  ShieldCheck, 
  Network, 
  Sparkles, 
  User, 
  Terminal, 
  Activity, 
  AlertTriangle,
  Menu,
  Shield
} from 'lucide-react';
import { Investigation } from '../types';

interface TopbarProps {
  currentInvestigation?: Investigation | null;
  investigations?: Investigation[];
  onSelectInvestigation?: (id: string) => void;
  onRunDemoInvestigation?: () => void;
  onRunGenesisDemo?: () => void;
  onToggleSidebar?: () => void;
  onOpenPrivacyModal?: () => void;
  isDemoMode?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentInvestigation = null,
  investigations = [],
  onSelectInvestigation,
  onRunDemoInvestigation,
  onRunGenesisDemo,
  onToggleSidebar,
  onOpenPrivacyModal,
  isDemoMode = true
}) => {
  const triggerDemo = onRunGenesisDemo || onRunDemoInvestigation;

  return (
    <header 
      id="main-topbar" 
      className="h-16 bg-[#080D1F]/90 backdrop-blur-md border-b border-blue-900/30 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0"
    >
      {/* Left: Mobile Toggle & Active Investigation Selector */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 hidden sm:inline">
            Target Session:
          </span>
        </div>

        {investigations && investigations.length > 0 ? (
          <select
            id="select-investigation"
            value={currentInvestigation?.id || ''}
            onChange={(e) => onSelectInvestigation && onSelectInvestigation(e.target.value)}
            aria-label="Select Target Investigation Session"
            className="bg-[#050816] text-xs font-mono text-cyan-300 border border-blue-900/50 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 max-w-[200px] sm:max-w-xs truncate cursor-pointer"
          >
            {investigations.map((inv) => (
              <option key={inv.id} value={inv.id} className="bg-[#080D1F] text-slate-200">
                {inv.title} {inv.status === 'anchored' || inv.status === 'verified' ? '✓' : ''}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-slate-500 font-mono">Loading sessions...</span>
        )}

        {currentInvestigation?.isTampered && (
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            TAMPER TEST ACTIVE
          </span>
        )}
      </div>

      {/* Right: Network & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Responsible Use Policy Button */}
        {onOpenPrivacyModal && (
          <button
            onClick={onOpenPrivacyModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050816] hover:bg-slate-900 border border-blue-900/40 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            title="Responsible biometrics & privacy guidelines"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Responsible Use</span>
          </button>
        )}

        {/* Judge Quick Demo Action */}
        {triggerDemo && (
          <button
            id="btn-run-judge-demo"
            onClick={triggerDemo}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600/30 to-cyan-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-medium shadow-sm hover:shadow-cyan-500/20 transition-all cursor-pointer"
            title="Instantly load the end-to-end verified demo investigation for judges"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">Load Genesis Demo</span>
            <span className="sm:hidden">Genesis Demo</span>
          </button>
        )}

        {/* Blockchain Network Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#050816] border border-blue-900/40 text-slate-300 text-xs font-mono">
          <Network className="w-3.5 h-3.5 text-blue-400" />
          <span>EVM Sepolia</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        {/* Search Mode Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#050816] border border-blue-900/40 text-[11px] font-mono">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Search:</span>
          <span className={isDemoMode ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
            {isDemoMode ? 'DEMO' : 'LIVE'}
          </span>
        </div>

        {/* User Identity */}
        <div className="flex items-center gap-2 sm:gap-2.5 pl-2 border-l border-blue-900/40">
          <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-cyan-300">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-slate-200">Investigator Suri</div>
            <div className="text-[10px] font-mono text-cyan-400/80">#FP-AUTH-901</div>
          </div>
        </div>
      </div>
    </header>
  );
};
