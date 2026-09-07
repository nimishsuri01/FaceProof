import React, { useState } from 'react';
import { 
  Lock, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  AlertCircle,
  FileCode,
  Link as LinkIcon
} from 'lucide-react';
import { BlockchainRecord, CanonicalEvidencePackage } from '../types';

interface BlockchainProofCardProps {
  evidenceHash?: string;
  evidencePackage?: CanonicalEvidencePackage;
  blockchainRecord?: BlockchainRecord;
  isAnchoring?: boolean;
  onAnchorToChain?: () => void;
  onVerify?: () => void;
}

export const BlockchainProofCard: React.FC<BlockchainProofCardProps> = ({
  evidenceHash,
  evidencePackage,
  blockchainRecord,
  isAnchoring = false,
  onAnchorToChain,
  onVerify
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div 
      id="blockchain-proof-card"
      className="w-full rounded-2xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md overflow-hidden shadow-xl shadow-blue-950/30"
    >
      {/* Header */}
      <div className="p-5 border-b border-blue-900/30 bg-[#050816]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono tracking-tight">
                Cryptographic Evidence Provenance
              </h3>
              {blockchainRecord && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ANCHORED ON-CHAIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evidence integrity protected via immutable EVM smart contract (EvidenceRegistry.sol)
            </p>
          </div>
        </div>

        {/* Quick Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onVerify && blockchainRecord && (
            <button
              onClick={onVerify}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Integrity</span>
            </button>
          )}

          {!blockchainRecord && onAnchorToChain && evidenceHash && (
            <button
              onClick={onAnchorToChain}
              disabled={isAnchoring}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              {isAnchoring ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Block...</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Anchor on Blockchain</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Evidence Fingerprint Box */}
        {evidenceHash ? (
          <div className="p-4 rounded-xl bg-[#050816] border border-blue-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                Deterministic SHA-256 Evidence Fingerprint (bytes32)
              </span>
              <button
                onClick={() => copyToClipboard(evidenceHash, 'hash')}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {copied === 'hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied === 'hash' ? 'Copied' : 'Copy Hash'}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-cyan-300 break-all select-all border border-blue-950">
              {evidenceHash}
            </div>

            <div className="text-[11px] text-slate-500 leading-normal flex items-start gap-1.5 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0 text-cyan-500 mt-0.5" />
              <span>
                Computed from canonical source reference, discovery timestamp, and content digest. Biometric face images and embeddings are strictly excluded from on-chain storage.
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-[#050816]/50 border border-dashed border-blue-900/40 text-xs font-mono text-slate-500">
            Select a discovered candidate to generate a deterministic cryptographic fingerprint.
          </div>
        )}

        {/* Blockchain Proof Metadata Grid */}
        {blockchainRecord && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            {/* Block Number */}
            <div className="p-3 rounded-xl bg-[#050816] border border-blue-900/30">
              <div className="text-[10px] text-slate-400 uppercase">Block Height</div>
              <div className="text-base font-bold text-white mt-1 flex items-center gap-1">
                <span>#{blockchainRecord.blockNumber}</span>
              </div>
            </div>

            {/* Network */}
            <div className="p-3 rounded-xl bg-[#050816] border border-blue-900/30">
              <div className="text-[10px] text-slate-400 uppercase">Network</div>
              <div className="text-sm font-bold text-cyan-300 mt-1 truncate">
                {blockchainRecord.network}
              </div>
            </div>

            {/* Gas Used */}
            <div className="p-3 rounded-xl bg-[#050816] border border-blue-900/30">
              <div className="text-[10px] text-slate-400 uppercase">Gas Used</div>
              <div className="text-sm font-bold text-slate-200 mt-1">
                {blockchainRecord.gasUsed.toLocaleString()} units
              </div>
            </div>

            {/* Status */}
            <div className="p-3 rounded-xl bg-[#050816] border border-blue-900/30">
              <div className="text-[10px] text-slate-400 uppercase">Integrity Status</div>
              <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {blockchainRecord.status}
              </div>
            </div>
          </div>
        )}

        {/* Transaction & Registrant Details */}
        {blockchainRecord && (
          <div className="p-4 rounded-xl bg-[#050816] border border-blue-900/30 space-y-3 font-mono text-xs">
            {/* Transaction Hash */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-400 text-[11px]">Transaction Hash:</span>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-semibold break-all text-[11px]">
                  {blockchainRecord.transactionHash}
                </span>
                <button
                  onClick={() => copyToClipboard(blockchainRecord.transactionHash, 'tx')}
                  className="text-slate-500 hover:text-white cursor-pointer"
                  title="Copy Transaction Hash"
                >
                  {copied === 'tx' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Smart Contract */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2 border-t border-blue-900/20">
              <span className="text-slate-400 text-[11px]">Smart Contract (EvidenceRegistry):</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-300 text-[11px] break-all">
                  {blockchainRecord.contractAddress}
                </span>
                <button
                  onClick={() => copyToClipboard(blockchainRecord.contractAddress, 'contract')}
                  className="text-slate-500 hover:text-white cursor-pointer"
                  title="Copy Contract Address"
                >
                  {copied === 'contract' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Registrant Wallet */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2 border-t border-blue-900/20">
              <span className="text-slate-400 text-[11px]">Authorized Signer / Investigator:</span>
              <span className="text-slate-300 text-[11px] break-all">
                {blockchainRecord.registeredBy}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
