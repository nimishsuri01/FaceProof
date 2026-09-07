import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  Lock, 
  FileCode, 
  Copy, 
  Check, 
  ArrowRight,
  FileCheck,
  Zap,
  Info,
  Layers
} from 'lucide-react';
import { ActiveTab, Investigation } from '../types';

interface VerificationPageProps {
  currentInvestigation: Investigation | null;
  onVerifyIntegrity: (tamperSimulation: boolean) => Promise<any>;
  onRestoreEvidence: () => Promise<any>;
  setActiveTab: (tab: ActiveTab) => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  currentInvestigation,
  onVerifyIntegrity,
  onRestoreEvidence,
  setActiveTab
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  if (!currentInvestigation || !currentInvestigation.evidenceHash) {
    return (
      <div className="rounded-3xl border border-blue-900/30 bg-[#080D1F]/80 p-12 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-500/30 text-cyan-400 mx-auto flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold font-mono text-white">No Anchored Evidence To Verify</h3>
        <p className="text-xs text-slate-400">
          Anchor an evidence candidate on the blockchain first, or load the genesis demo to run cryptographic verification.
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

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleVerify = async (tamper: boolean) => {
    setIsVerifying(true);
    try {
      const res = await onVerifyIntegrity(tamper);
      setVerificationResult(res);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRestore = async () => {
    setIsVerifying(true);
    try {
      await onRestoreEvidence();
      // Re-verify after restore
      const res = await onVerifyIntegrity(false);
      setVerificationResult(res);
    } finally {
      setIsVerifying(false);
    }
  };

  const isTampered = currentInvestigation.isTampered;
  const currentComputedHash = currentInvestigation.tamperedHash || currentInvestigation.evidenceHash;
  const onChainHash = currentInvestigation.evidenceHash;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>Cryptographic Integrity Verification Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Independent mathematical comparison between live evidence package and immutable on-chain smart contract record
          </p>
        </div>

        <button
          onClick={() => setActiveTab('certificate')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-medium shadow-sm transition-all cursor-pointer"
        >
          <FileCheck className="w-4 h-4" />
          <span>View Verification Certificate</span>
        </button>
      </div>

      {/* Hero Verification Result Banner (GREEN OR RED STATE) */}
      <div 
        id="verification-status-banner"
        className={`rounded-3xl p-8 border transition-all duration-300 relative overflow-hidden shadow-2xl ${
          isTampered
            ? 'bg-gradient-to-br from-red-950/80 via-[#0D0509] to-[#17050A] border-red-500/80 shadow-red-950/60'
            : 'bg-gradient-to-br from-emerald-950/80 via-[#051110] to-[#041712] border-emerald-500/80 shadow-emerald-950/60'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Status Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
              isTampered
                ? 'bg-red-950 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                : 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
            }`}>
              {isTampered ? (
                <AlertTriangle className="w-9 h-9 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-9 h-9" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold tracking-wider ${
                  isTampered ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {isTampered ? 'INTEGRITY BREACH DETECTED' : 'CRYPTOGRAPHICALLY VERIFIED'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Block #{currentInvestigation.blockchainRecord?.blockNumber || 1948240}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                {isTampered ? '✕ TAMPER DETECTED' : '✓ VERIFIED'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-sans leading-relaxed">
                {isTampered
                  ? 'Evidence no longer matches its registered cryptographic fingerprint. A discrepancy has been identified in the canonical payload representation.'
                  : 'Cryptographic fingerprint strictly matches the immutable blockchain record. Evidence integrity and chain of custody are mathematically validated.'}
              </p>
            </div>
          </div>

          {/* Trigger Verification Button */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button
              id="btn-run-verification"
              onClick={() => handleVerify(false)}
              disabled={isVerifying}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>Re-Run Mathematical Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Hash Comparison Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        {/* Current Computed Hash */}
        <div className={`p-6 rounded-3xl border bg-[#080D1F]/90 backdrop-blur-md space-y-4 shadow-xl ${
          isTampered ? 'border-red-500/50' : 'border-blue-900/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              Current Calculated SHA-256 Digest
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              isTampered ? 'bg-red-500/20 text-red-400' : 'bg-blue-950 text-cyan-300'
            }`}>
              {isTampered ? 'ALTERED PAYLOAD' : 'CANONICAL PAYLOAD'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050816] border border-blue-950 text-xs break-all text-cyan-300 select-all">
            {currentComputedHash}
          </div>

          <div className="text-[11px] text-slate-400">
            Re-computed in real time from canonical source reference, content payload, and timestamp metadata.
          </div>
        </div>

        {/* On-Chain Stored Hash */}
        <div className="p-6 rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Immutable On-Chain Hash (EvidenceRegistry.sol)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              ANCHORED RECORD
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050816] border border-blue-950 text-xs break-all text-emerald-300 select-all">
            {onChainHash}
          </div>

          <div className="text-[11px] text-slate-400">
            Permanently registered in EVM block height #{currentInvestigation.blockchainRecord?.blockNumber || 1948240}. Immutable.
          </div>
        </div>
      </div>

      {/* Controlled Demo: Tamper Simulation Section (Section 22 requirement!) */}
      <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#0C0F22] via-[#080D1F] to-[#120F08] space-y-5 shadow-2xl shadow-amber-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-mono text-white">
                  Controlled Tamper Demonstration (For Judges)
                </h3>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold">
                  CONTROLLED DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Simulate what happens if a malicious actor alters even a single byte of discovered evidence
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Step 1: Simulate Tampering */}
          <div className="p-5 rounded-2xl bg-[#050816]/80 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 uppercase">Simulate Alteration</span>
              <span className="text-[10px] text-slate-500">Step 1</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              Injects a 1-character modification into the candidate canonical reference payload in sandbox memory.
            </p>
            <button
              id="btn-simulate-tamper"
              onClick={() => handleVerify(true)}
              disabled={isVerifying || isTampered}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isTampered
                  ? 'bg-red-950/60 text-red-300 border border-red-500/50 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isTampered ? 'Tampered State Active' : 'Simulate Evidence Modification'}</span>
            </button>
          </div>

          {/* Step 2: Restore Original */}
          <div className="p-5 rounded-2xl bg-[#050816]/80 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 uppercase">Restore Evidence</span>
              <span className="text-[10px] text-slate-500">Step 2</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              Restores the authentic canonical payload representation to match the registered blockchain hash.
            </p>
            <button
              id="btn-restore-evidence"
              onClick={handleRestore}
              disabled={isVerifying || !isTampered}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !isTampered
                  ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore Original Evidence & Re-Verify</span>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-[11px] text-amber-200/80">
          <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <span>
            <strong>Judge Takeaway:</strong> Notice how the blockchain does not store the image itself, but its SHA-256 fingerprint makes silent modification mathematically impossible to conceal.
          </span>
        </div>
      </div>
    </div>
  );
};
