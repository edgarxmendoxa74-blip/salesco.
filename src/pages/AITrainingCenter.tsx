import React from 'react';
import {
  BrainCircuit,
  Workflow,
  BookOpen,
  PackageCheck,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PageId } from '../components/layout/Sidebar';
import { CallStorageService } from '../services/storage/CallStorageService';

interface AITrainingCenterProps {
  onSelectPage: (page: PageId) => void;
}

export const AITrainingCenter: React.FC<AITrainingCenterProps> = ({ onSelectPage }) => {
  const trainingExamples = CallStorageService.getTrainingExamples();
  const objections = CallStorageService.getObjectionLibrary();
  const knowledge = CallStorageService.getProductKnowledge();
  const framework = CallStorageService.getFramework();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">AI Training Center</h1>
            <p className="text-xs text-slate-300">
              Configure knowledge sources, framework rules, objection responses, and verified successful sales examples.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Main Training Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Product Knowledge */}
        <div
          onClick={() => onSelectPage('product-knowledge')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all duration-200 group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <PackageCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-400">{knowledge.length} items</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-blue-300 flex items-center justify-between">
              Product Knowledge <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">Smart Menu features, pricing tiers, FAQs, and policies.</p>
          </div>
        </div>

        {/* Sales Frameworks */}
        <div
          onClick={() => onSelectPage('sales-frameworks')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all duration-200 group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Workflow className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400">8 stages</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 flex items-center justify-between">
              Sales Frameworks <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">{framework.name} rules & stage objectives.</p>
          </div>
        </div>

        {/* Objection Library */}
        <div
          onClick={() => onSelectPage('objection-library')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-red-500/50 cursor-pointer transition-all duration-200 group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-red-400">{objections.length} objections</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-red-300 flex items-center justify-between">
              Objection Library <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-400 mt-1">Pre-approved objection responses and follow-ups.</p>
          </div>
        </div>

        {/* Training Examples */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-400">{trainingExamples.length} examples</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Training Examples</h3>
            <p className="text-xs text-slate-400 mt-1">Real winning transcript examples used by the AI.</p>
          </div>
        </div>
      </div>

      {/* TRAINING EXAMPLES LIST */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified Successful Conversation Examples
          </h3>
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Example
          </button>
        </div>

        <div className="space-y-3">
          {trainingExamples.map((ex) => (
            <div key={ex.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span className="font-mono uppercase font-bold text-blue-400">STAGE: {ex.stage}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">OBJECTION: {ex.objectionType}</span>
              </div>
              <p><span className="font-bold text-slate-300">Prospect: </span>"{ex.prospectStatement}"</p>
              <p><span className="font-bold text-emerald-400">Winning Closer Response: </span>"{ex.closerResponse}"</p>
              <p className="text-slate-400 text-[11px] italic bg-slate-950/60 p-2 rounded border border-slate-800">
                <span className="font-bold text-indigo-300">Why it worked: </span>{ex.whyItWorked}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
