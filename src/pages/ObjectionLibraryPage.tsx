import React, { useState } from 'react';
import { BookOpen, Plus, Search, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { CallStorageService } from '../services/storage/CallStorageService';

export const ObjectionLibraryPage: React.FC = () => {
  const [objections, setObjections] = useState(CallStorageService.getObjectionLibrary());
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = objections.filter(
    (o) =>
      o.objectionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-400" />
            Objection Library & Playbook
          </h1>
          <p className="text-xs text-slate-400">
            Catalog of customer objections, underlying concerns, ideal responses, and follow-up questions.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/20">
          <Plus className="w-4 h-4" /> Add Objection
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search objection or category..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Objection Playbook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/30 uppercase">
                CATEGORY: {item.category}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Objection Statement</span>
              <h3 className="text-base font-extrabold text-white mt-0.5">"{item.objectionText}"</h3>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-indigo-300 block text-[10px] uppercase">Underlying Concern:</span>
              <p>{item.underlyingConcern}</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200 space-y-1">
              <span className="font-bold text-blue-400 block text-[10px] uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Ideal Taglish Response:
              </span>
              <p className="font-semibold">"{item.idealResponse}"</p>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 space-y-1">
              <span className="font-bold text-purple-400 block text-[10px] uppercase flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Recommended Follow-Up Question:
              </span>
              <p>"{item.followUpQuestion}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
