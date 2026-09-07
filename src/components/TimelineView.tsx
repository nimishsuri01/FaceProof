import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Cpu, 
  Layers, 
  ArrowDown
} from 'lucide-react';
import { TimelineEvent } from '../types';

interface TimelineViewProps {
  events?: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events = [] }) => {
  const safeEvents = events || [];
  return (
    <div className="w-full rounded-2xl border border-blue-900/30 bg-[#080D1F]/80 backdrop-blur-md p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-blue-900/30">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Forensic Investigation Audit Trail
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {safeEvents.length} Execution Checkpoints Recorded
        </span>
      </div>

      {/* Timeline entries */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-950">
        {safeEvents.map((ev, index) => {
          const isCompleted = ev.status === 'completed';
          const isFailed = ev.status === 'failed';

          return (
            <div key={ev.id || index} className="relative group">
              {/* Dot Icon */}
              <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                isCompleted
                  ? 'bg-[#050816] border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : isFailed
                  ? 'bg-[#050816] border-red-500 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  : 'bg-[#050816] border-cyan-500 text-cyan-400 animate-pulse'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : isFailed ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </div>

              {/* Event Content */}
              <div className="p-3.5 rounded-xl bg-[#050816]/70 border border-blue-900/30 group-hover:border-blue-700/50 transition-all space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-white tracking-wide">
                    {ev.stage}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-900/40 text-cyan-300">
                      {ev.timeLabel}
                    </span>
                    <span>+{ev.durationMs}ms</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {ev.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
