import React, { useState } from 'react';
import {
  PhoneCall,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { CallOutcome, CallRecord } from '../types';

interface CallsHistoryProps {
  calls: CallRecord[];
  onSelectCall: (callId: string) => void;
}

export const CallsHistory: React.FC<CallsHistoryProps> = ({ calls, onSelectCall }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('ALL');

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.prospectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.businessName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOutcome = outcomeFilter === 'ALL' || call.outcome === outcomeFilter;
    return matchesSearch && matchesOutcome;
  });

  const getOutcomeBadge = (outcome: CallOutcome) => {
    switch (outcome) {
      case 'closed_won':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Closed Won
          </span>
        );
      case 'closed_lost':
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/30 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Closed Lost
          </span>
        );
      case 'follow_up':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Follow Up
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
            {outcome.replace('_', ' ').toUpperCase()}
          </span>
        );
    }
  };

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-blue-400" />
            Call History & Recording Logs
          </h1>
          <p className="text-xs text-slate-400">
            Review past sales calls, transcripts, AI evaluations, and post-call reports.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prospect or business..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="bg-transparent text-slate-300 font-medium px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Outcomes</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
              <option value="follow_up">Follow Up</option>
              <option value="not_qualified">Not Qualified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calls Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Prospect</th>
                <th className="p-4">Business</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Final Stage</th>
                <th className="p-4">Buying Intent</th>
                <th className="p-4">AI Score</th>
                <th className="p-4">Outcome</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCalls.map((call) => (
                <tr
                  key={call.id}
                  onClick={() => onSelectCall(call.id)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="p-4 text-slate-400 font-mono">
                    {new Date(call.date).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="p-4 font-bold text-white">{call.prospectName}</td>
                  <td className="p-4 text-slate-300">{call.businessName || 'N/A'}</td>
                  <td className="p-4 text-slate-400 font-mono">{formatDuration(call.durationSeconds)}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-semibold border border-slate-700 uppercase text-[10px]">
                      {call.currentStage}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        call.buyingIntent === 'high'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : call.buyingIntent === 'medium'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {call.buyingIntent}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-amber-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {call.score || 90}/100
                    </span>
                  </td>
                  <td className="p-4">{getOutcomeBadge(call.outcome)}</td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
