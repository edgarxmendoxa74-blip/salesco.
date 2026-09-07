import React, { useState } from 'react';
import { Workflow, Plus, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { CallStorageService } from '../services/storage/CallStorageService';

export const SalesFrameworksPage: React.FC = () => {
  const [framework, setFramework] = useState(CallStorageService.getFramework());
  const [activeStageKey, setActiveStageKey] = useState(framework.stages[0]?.key || 'rapport');

  const selectedStage = framework.stages.find((s) => s.key === activeStageKey);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-emerald-400" />
            Sales Framework Engine
          </h1>
          <p className="text-xs text-slate-400">
            Define sales stages, objectives, discovery questions, and forbidden AI behaviors.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20">
          <Plus className="w-4 h-4" /> Create Framework
        </button>
      </div>

      {/* Framework Summary Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              ACTIVE FRAMEWORK
            </span>
            <h2 className="text-base font-bold text-white">{framework.name}</h2>
          </div>
        </div>
        <p className="text-xs text-slate-300">{framework.description}</p>
      </div>

      {/* STAGE EXPLORER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Stage Selector Column */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            FRAMEWORK STAGES ({framework.stages.length})
          </h3>
          {framework.stages.map((stage) => (
            <div
              key={stage.key}
              onClick={() => setActiveStageKey(stage.key)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                activeStageKey === stage.key
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold flex items-center justify-center">
                  {stage.order}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{stage.displayName}</h4>
                  <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{stage.objective}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          ))}
        </div>

        {/* Right Stage Detail Column */}
        <div className="lg:col-span-2 space-y-4">
          {selectedStage && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">
                    STAGE {selectedStage.order} DETAILS
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedStage.displayName} Stage</h3>
                </div>
              </div>

              {/* Objective */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Stage Objective</label>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-medium">
                  {selectedStage.objective}
                </div>
              </div>

              {/* Suggested Questions */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Suggested Questions</label>
                <div className="space-y-2">
                  {selectedStage.suggestedQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FORBIDDEN BEHAVIORS CARD */}
          <div className="glass-panel p-5 rounded-2xl border border-red-500/20 bg-red-950/10 space-y-3">
            <h3 className="text-xs font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              FORBIDDEN AI BEHAVIORS
            </h3>
            <div className="space-y-1.5">
              {framework.forbiddenBehaviors.map((b, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
