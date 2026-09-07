import React, { useState } from 'react';
import { PackageCheck, Plus, ShieldCheck, CheckCircle2, Search } from 'lucide-react';
import { CallStorageService } from '../services/storage/CallStorageService';

export const ProductKnowledgePage: React.FC = () => {
  const [items, setItems] = useState(CallStorageService.getProductKnowledge());
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filtered = items.filter(
    (item) => filterCategory === 'ALL' || item.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-blue-400" />
            Product Knowledge Base
          </h1>
          <p className="text-xs text-slate-400">
            Source of truth for Smart Menu features, pricing, guarantees, policies, and FAQs.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" /> Add Knowledge Item
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
        <div className="text-xs">
          <span className="font-bold text-emerald-300">Strict AI Knowledge Boundaries Active:</span>
          <p className="text-slate-300 mt-0.5">
            The AI Copilot strictly uses configured product knowledge. It will never invent unlisted features, prices, or policies.
          </p>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'feature', 'pricing', 'faq', 'policy', 'competitor'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors ${
              filterCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Knowledge Base Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/30 uppercase">
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400">{item.productName}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
            </div>

            {item.benefits && item.benefits.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Key Benefits</span>
                {item.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
