import React from 'react';
import { Users, Plus, Award, TrendingUp, PhoneCall } from 'lucide-react';
import { CloserUser } from '../types';

export const TeamManagementPage: React.FC = () => {
  const team: CloserUser[] = [
    {
      id: 'c_1',
      fullName: 'Juan Dela Cruz',
      email: 'juan@smartmenu.ph',
      role: 'closer',
      quotaTarget: 500000,
      conversionRate: 42.5,
      totalCalls: 45,
      averageScore: 94,
      avatarUrl: 'JD',
    },
    {
      id: 'c_2',
      fullName: 'Maria Santos',
      email: 'maria@smartmenu.ph',
      role: 'closer',
      quotaTarget: 450000,
      conversionRate: 37.0,
      totalCalls: 38,
      averageScore: 91,
      avatarUrl: 'MS',
    },
    {
      id: 'c_3',
      fullName: 'Angelo Reyes',
      email: 'angelo@smartmenu.ph',
      role: 'closer',
      quotaTarget: 400000,
      conversionRate: 31.2,
      totalCalls: 34,
      averageScore: 88,
      avatarUrl: 'AR',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Team & Sales Closers
          </h1>
          <p className="text-xs text-slate-400">
            Monitor sales closer performance, call volume, conversion rates, and AI scores.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20">
          <Plus className="w-4 h-4" /> Invite Closer
        </button>
      </div>

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {team.map((closer) => (
          <div key={closer.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {closer.avatarUrl}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{closer.fullName}</h3>
                <p className="text-xs text-slate-400">{closer.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-blue-300 uppercase">
                  {closer.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Avg AI Score</span>
                <span className="text-sm font-extrabold text-amber-400 flex items-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5" /> {closer.averageScore}/100
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Win Rate</span>
                <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> {closer.conversionRate}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
