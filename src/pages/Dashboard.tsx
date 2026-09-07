import React from 'react';
import {
  PhoneCall,
  CalendarCheck,
  TrendingUp,
  Award,
  Flame,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Mic,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CallRecord } from '../types';

interface DashboardProps {
  calls: CallRecord[];
  onStartCopilot: () => void;
  onSelectCall: (callId: string) => void;
}

const callVolumeData = [
  { day: 'Mon', calls: 14, closed: 5 },
  { day: 'Tue', calls: 18, closed: 7 },
  { day: 'Wed', calls: 22, closed: 11 },
  { day: 'Thu', calls: 19, closed: 9 },
  { day: 'Fri', calls: 25, closed: 14 },
  { day: 'Sat', calls: 12, closed: 6 },
  { day: 'Sun', calls: 8, closed: 3 },
];

const stageProgressData = [
  { stage: 'Rapport', count: 118 },
  { stage: 'Discovery', count: 104 },
  { stage: 'Pain', count: 88 },
  { stage: 'Qualify', count: 76 },
  { stage: 'Solution', count: 62 },
  { stage: 'Objection', count: 48 },
  { stage: 'Close', count: 35 },
];

const objectionDistribution = [
  { name: 'Price ("Medyo mahal")', value: 42, color: '#ef4444' },
  { name: 'Existing System', value: 28, color: '#3b82f6' },
  { name: 'Authority / Partner', value: 16, color: '#f59e0b' },
  { name: 'Timing / Later', value: 14, color: '#10b981' },
];

export const Dashboard: React.FC<DashboardProps> = ({
  calls,
  onStartCopilot,
  onSelectCall,
}) => {
  const totalCalls = calls.length + 117;
  const callsToday = 8;
  const avgScore = 92;
  const conversionRate = '34.8%';
  const highIntentLeads = 12;
  const pendingFollowups = 5;

  const topClosers = [
    { name: 'Juan Dela Cruz', calls: 45, winRate: '42%', score: 94, avatar: 'JD' },
    { name: 'Maria Santos', calls: 38, winRate: '37%', score: 91, avatar: 'MS' },
    { name: 'Angelo Reyes', calls: 34, winRate: '31%', score: 88, avatar: 'AR' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/80 via-slate-900 to-slate-900 border border-blue-500/20 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-Time Sales Intelligence Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready for your next customer call?
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              AI Sales Copilot is listening to your conversation audio, guiding your stage progression, and giving you natural Taglish suggested responses.
            </p>
          </div>
          <button
            onClick={onStartCopilot}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center gap-2.5 transform hover:scale-[1.02] transition-all"
          >
            <Mic className="w-5 h-5 text-emerald-200 animate-pulse" />
            <span>Launch Live Call Copilot</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Total Calls</span>
            <PhoneCall className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalCalls}</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-0.5 mt-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> +12% this week
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Calls Today</span>
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{callsToday}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">3 active sessions</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Avg Call Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{avgScore}/100</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-0.5 mt-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> Top 5% rank
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{conversionRate}</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-0.5 mt-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> +4.2% vs target
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>High Intent Leads</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-300">{highIntentLeads}</div>
          <span className="text-[11px] text-orange-400 mt-1 font-medium block">Ready to close</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Follow-ups</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300">{pendingFollowups}</div>
          <span className="text-[11px] text-purple-400 mt-1 font-medium block">Scheduled today</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Call Performance Area Chart */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-2 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Call Volume & Closed Deals</h3>
              <p className="text-xs text-slate-400">Weekly breakdown of copilot calls vs closed won deals</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium">This Week</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callVolumeData}>
                <defs>
                  <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#callsGrad)" name="Total Calls" />
                <Area type="monotone" dataKey="closed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#closedGrad)" name="Closed Won" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Objection Distribution Donut */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Common Objections
            </h3>
            <p className="text-xs text-slate-400 mb-2">Most frequent prospect hesitation reasons</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={objectionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {objectionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {objectionDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="text-slate-400 font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Funnel & Top Closers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Stage Progress Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-2 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">Average Sales Stage Progress</h3>
          <p className="text-xs text-slate-400 mb-4">Prospect progression across Smart Menu framework stages</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageProgressData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Closers */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-emerald-400" />
              Top Performing Closers
            </h3>
            <p className="text-xs text-slate-400 mb-4">Rankings by score and win rate</p>
            <div className="space-y-3">
              {topClosers.map((closer, idx) => (
                <div
                  key={closer.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center text-white font-bold text-xs">
                      {closer.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{closer.name}</p>
                      <p className="text-[11px] text-slate-400">{closer.calls} calls handled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      {closer.score} pts
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{closer.winRate} win rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
