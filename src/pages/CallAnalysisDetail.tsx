import React from 'react';
import {
  Award,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Calendar,
  PhoneCall,
  UserCheck,
  DollarSign,
  Briefcase,
  Flame,
  Volume2
} from 'lucide-react';
import { CallRecord } from '../types';

interface CallAnalysisDetailProps {
  call: CallRecord;
  onBack: () => void;
}

export const CallAnalysisDetail: React.FC<CallAnalysisDetailProps> = ({ call, onBack }) => {
  const breakdown = call.scoreBreakdown || {
    overallScore: call.score || 92,
    rapportScore: 95,
    discoveryScore: 92,
    painDiscoveryScore: 90,
    qualificationScore: 88,
    solutionScore: 94,
    objectionHandlingScore: 86,
    closingScore: 90,
    whatWentWell: [
      'Excellent discovery questioning regarding current QR menu setup.',
      'Maintained high empathy and natural Taglish conversational rhythm.',
      'Promptly identified static menu pain point.',
    ],
    missedOpportunities: [
      'Could have quantified the financial loss of missed orders earlier during pain clarification.',
    ],
    improvements: [
      'Ask deeper follow-up questions when the prospect mentions price before giving full quotes.',
    ],
  };

  const scores = [
    { label: 'Rapport', score: breakdown.rapportScore },
    { label: 'Discovery', score: breakdown.discoveryScore },
    { label: 'Pain Discovery', score: breakdown.painDiscoveryScore },
    { label: 'Qualification', score: breakdown.qualificationScore },
    { label: 'Solution', score: breakdown.solutionScore },
    { label: 'Objection Handling', score: breakdown.objectionHandlingScore },
    { label: 'Closing', score: breakdown.closingScore },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Calls</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
            COMPLETED REPORT
          </span>
        </div>
      </div>

      {/* OVERALL SCORE & SUMMARY HERO CARD */}
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-400" /> Post-Call AI Intelligence Analysis
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {call.prospectName} ({call.businessName || 'Restaurant Prospect'})
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Call Date: {new Date(call.date).toLocaleString()} • Duration: {Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s
            </p>
          </div>

          {/* Large Overall Score Badge */}
          <div className="flex items-center gap-4 bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 shadow-xl">
            <Award className="w-10 h-10 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Overall Score</span>
              <span className="text-3xl font-extrabold text-amber-300">{breakdown.overallScore}/100</span>
            </div>
          </div>
        </div>

        {/* 7 SALES DIMENSION SCORES SLIDERS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 pt-6 border-t border-slate-800">
          {scores.map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-medium block truncate">{s.label}</span>
              <span className="text-base font-extrabold text-white block mt-1">{s.score}/100</span>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full"
                  style={{ width: `${s.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CALL SUMMARY METRICS GRID */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          STRUCTURED CALL SUMMARY
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Current System</span>
            <span className="text-xs font-bold text-blue-300 block mt-0.5">Static QR Menu (View-only)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Main Pain</span>
            <span className="text-xs font-bold text-amber-400 block mt-0.5">Slow customer ordering</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Decision Maker</span>
            <span className="text-xs font-bold text-emerald-400 block mt-0.5">YES (Juan - Owner)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Buying Intent</span>
            <span className="text-xs font-bold text-emerald-400 block mt-0.5">HIGH INTENT</span>
          </div>
        </div>
      </div>

      {/* OBJECTIONS EVALUATION BREAKDOWN */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          OBJECTIONS & AI EVALUATION
        </h3>
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-red-400">Objection: "Medyo mahal naman."</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">Category: PRICE</span>
          </div>
          <div className="text-xs text-slate-300 space-y-1">
            <p><span className="font-bold text-slate-400">Closer Response: </span>"Gets ko po Sir. Para makita natin kung worth it, magkano po lost revenue during peak hours?"</p>
            <p><span className="font-bold text-emerald-400">AI Evaluation: </span>Good value-anchoring technique. Re-directed focus from cost to lost revenue.</p>
            <p><span className="font-bold text-blue-400">Better Response: </span>"Gets ko po Sir. Para macompute natin ang return, ask ko lang po — ilang orders usually ang na-didelay or hindi nauulit kapag peak hours?"</p>
          </div>
        </div>
      </div>

      {/* STRENGTHS, MISSED OPPORTUNITIES & IMPROVEMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* What Closer Did Well */}
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> What You Did Well
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {breakdown.whatWentWell.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missed Opportunities */}
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 bg-amber-950/10 space-y-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Missed Opportunities
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {breakdown.missedOpportunities.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Improvements */}
        <div className="glass-panel p-4 rounded-2xl border border-blue-500/20 bg-blue-950/10 space-y-2">
          <h4 className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Recommended Improvements
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {breakdown.improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-blue-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RECOMMENDED FOLLOW-UP ACTION */}
      <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 to-slate-900 space-y-2">
        <h3 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          RECOMMENDED FOLLOW-UP ACTION
        </h3>
        <p className="text-sm font-bold text-white">
          {call.followUp?.recommendedAction || 'Send onboarding agreement and table QR template pack.'}
        </p>
        <p className="text-xs text-slate-400">
          Scheduled Target: {new Date(call.followUp?.scheduledFor || Date.now() + 86400000).toLocaleDateString()}
        </p>
      </div>

      {/* FULL CALL TRANSCRIPT LOG */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-blue-400" />
          FULL CALL TRANSCRIPT
        </h3>
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2">
          {call.transcripts.map((t) => (
            <div key={t.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className={`font-bold uppercase ${t.speaker === 'prospect' ? 'text-blue-400' : 'text-emerald-400'}`}>
                  {t.speaker === 'prospect' ? 'PROSPECT' : 'CLOSER'}
                </span>
                <span className="text-slate-500 font-mono">{t.timestamp}</span>
              </div>
              <p className="text-slate-200 font-medium">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
