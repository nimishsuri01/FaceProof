import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { ActiveTab, Investigation } from '../types';
import { TimelineView } from '../components/TimelineView';

interface HistoryPageProps {
  investigations: Investigation[];
  currentInvestigation: Investigation | null;
  onSelectInvestigation: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  investigations,
  currentInvestigation,
  onSelectInvestigation,
  setActiveTab
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = investigations.filter(inv => {
    // Search query match
    const matchesSearch = 
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'VERIFIED') return inv.status === 'verified' || inv.status === 'anchored';
    if (filterStatus === 'TAMPERED') return inv.status === 'tamper_detected';
    if (filterStatus === 'HIGH_CONFIDENCE') {
      const top = inv.candidates?.[0];
      return top && top.confidenceLabel === 'HIGH';
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Investigation Audit History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Permanent forensic records of all subject inquiries, candidate matches, and blockchain anchoring events
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Filter:</span>
          {['ALL', 'VERIFIED', 'TAMPERED', 'HIGH_CONFIDENCE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or Subject Title..."
            className="w-full bg-[#050816] text-xs font-mono text-slate-200 pl-9 pr-3 py-1.5 rounded-xl border border-blue-900/50 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-3xl border border-blue-900/40 bg-[#080D1F]/90 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#050816] border-b border-blue-900/30 text-slate-400 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Investigation ID</th>
                <th className="py-3 px-4">Subject Reference</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4">Candidates</th>
                <th className="py-3 px-4">Top Similarity</th>
                <th className="py-3 px-4">Blockchain Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {filtered.map((inv) => {
                const isSelected = currentInvestigation?.id === inv.id;
                const topCandidate = inv.candidates?.[0];

                return (
                  <tr 
                    key={inv.id} 
                    onClick={() => onSelectInvestigation(inv.id)}
                    className={`hover:bg-blue-950/20 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-950/30 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-cyan-300 whitespace-nowrap">
                      {inv.id}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-white">
                      <div className="flex items-center gap-2">
                        <img
                          src={inv.inputImage}
                          alt="Face"
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover border border-blue-900 shrink-0"
                        />
                        <span className="truncate">{inv.title}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(inv.createdAt).toLocaleDateString()}{' '}
                      {new Date(inv.createdAt).toLocaleTimeString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                      {inv.candidates?.length || 0} discovered
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {topCandidate ? (
                        <span className="text-emerald-400 font-bold">
                          {topCandidate.faceSimilarity === null ? 'Not available' : `${(topCandidate.faceSimilarity * 100).toFixed(1)}%`} ({topCandidate.confidenceLabel})
                        </span>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {inv.blockchainRecord ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          ANCHORED #{inv.blockchainRecord.blockNumber}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Pending</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectInvestigation(inv.id);
                            setActiveTab('verification');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-900/30 hover:bg-blue-800/50 text-cyan-300 border border-blue-700/40 text-[11px] cursor-pointer"
                        >
                          Verify
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectInvestigation(inv.id);
                            setActiveTab('certificate');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] cursor-pointer"
                        >
                          Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Investigation Audit Timeline (Section 23) */}
      {currentInvestigation && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Selected Session Audit Timeline ({currentInvestigation.title})
            </span>
          </div>
          <TimelineView events={currentInvestigation.timeline || []} />
        </div>
      )}
    </div>
  );
};
