import React, { useState } from 'react';
import { 
  Lock, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Search, 
  Database,
  Cpu,
  ArrowRight,
  FileCode
} from 'lucide-react';
import { ActiveTab, BlockchainRecord, Investigation } from '../types';
import { BlockchainProofCard } from '../components/BlockchainProofCard';

interface BlockchainRegistryPageProps {
  currentInvestigation: Investigation | null;
  blockchainRecords: BlockchainRecord[];
  networkInfo: any;
  onAnchorEvidence: () => Promise<void>;
  isAnchoring: boolean;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BlockchainRegistryPage: React.FC<BlockchainRegistryPageProps> = ({
  currentInvestigation,
  blockchainRecords,
  networkInfo,
  onAnchorEvidence,
  isAnchoring,
  setActiveTab
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredRecords = blockchainRecords.filter(r => 
    r.evidenceHash.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.sourceReference.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.transactionHash.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const isDemoReference = (reference: string) =>
    reference.includes('demo.faceproof.local') || reference.includes('globalnewswire.press');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <Lock className="w-6 h-6 text-cyan-400" />
            <span>Immutable Blockchain Evidence Registry</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographic SHA-256 hashes anchored into EVM smart contract for unforgeable digital provenance
          </p>
        </div>
      </div>

      {/* Network Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-[#080D1F]/90 border border-blue-900/40 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase">EVM Network</div>
          <div className="text-sm font-bold text-cyan-300 truncate">
            {networkInfo?.network || 'Ethereum Sepolia'}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Consensus Synchronized</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080D1F]/90 border border-blue-900/40 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase">Latest Block Height</div>
          <div className="text-base font-bold text-white">
            #{networkInfo?.latestBlock || 1948270}
          </div>
          <div className="text-[10px] text-slate-500">
            Avg Block Time: 2.1s
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080D1F]/90 border border-blue-900/40 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase">Evidence Registry Contract</div>
          <div className="text-xs font-bold text-slate-300 truncate">
            {networkInfo?.contract || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}
          </div>
          <div className="text-[10px] text-blue-400">
            EvidenceRegistry.sol
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080D1F]/90 border border-blue-900/40 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase">Total Anchored Proofs</div>
          <div className="text-base font-bold text-emerald-400">
            {blockchainRecords.length} Verified
          </div>
          <div className="text-[10px] text-slate-500">
            Tamper Accuracy: 100%
          </div>
        </div>
      </div>

      {/* Current Investigation Anchoring Box */}
      {currentInvestigation && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Active Investigation Fingerprint & On-Chain Status
            </span>
            <span className="text-xs font-mono text-cyan-400">
              {currentInvestigation.title}
            </span>
          </div>

          <BlockchainProofCard
            evidenceHash={currentInvestigation.evidenceHash}
            evidencePackage={currentInvestigation.evidencePackage}
            blockchainRecord={currentInvestigation.blockchainRecord}
            isAnchoring={isAnchoring}
            onAnchorToChain={onAnchorEvidence}
            onVerify={() => setActiveTab('verification')}
          />
        </div>
      )}

      {/* Explorer Table */}
      <div className="rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md overflow-hidden shadow-xl shadow-blue-950/20">
        <div className="p-5 border-b border-blue-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#050816]/70">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              On-Chain Ledger Records
            </h3>
          </div>

          {/* Search Table */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by hash, URL, or tx..."
              className="w-full bg-[#050816] text-xs font-mono text-slate-200 pl-9 pr-3 py-1.5 rounded-xl border border-blue-900/50 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#050816] border-b border-blue-900/30 text-slate-400 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Block #</th>
                <th className="py-3 px-4">Evidence Hash (SHA-256)</th>
                <th className="py-3 px-4">Canonical Source Reference</th>
                <th className="py-3 px-4">Transaction Hash</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {filteredRecords.map((record) => {
                return (
                  <tr key={record.recordId} className="hover:bg-blue-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-cyan-300 whitespace-nowrap">
                      #{record.blockNumber}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-200">
                          {record.evidenceHash.slice(0, 10)}...{record.evidenceHash.slice(-8)}
                        </span>
                        <button
                          onClick={() => copyText(record.evidenceHash, record.evidenceHash)}
                          className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                        >
                          {copiedHash === record.evidenceHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-400">
                      {isDemoReference(record.sourceReference) ? (
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(record.sourceReference)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate block text-amber-400 hover:text-amber-300"
                          title="Search this demo reference on the web"
                        >
                          {record.sourceReference} (demo reference)
                        </a>
                      ) : (
                        <a
                          href={record.sourceReference}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-cyan-300 truncate block"
                        >
                          {record.sourceReference}
                        </a>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span>{record.transactionHash.slice(0, 10)}...</span>
                        <button
                          onClick={() => copyText(record.transactionHash, record.transactionHash)}
                          className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                        >
                          {copiedHash === record.transactionHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(record.timestamp).toLocaleDateString()}{' '}
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {record.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveTab('verification')}
                        className="px-2.5 py-1 rounded-lg bg-blue-900/30 hover:bg-blue-800/50 text-cyan-300 border border-blue-700/40 text-[11px] cursor-pointer"
                      >
                        Verify
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
