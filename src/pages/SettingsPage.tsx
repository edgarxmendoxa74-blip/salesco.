import React, { useState } from 'react';
import { Settings, Mic, Cpu, ShieldCheck, Key, Database, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [audioSource, setAudioSource] = useState('demo');
  const [aiProvider, setAiProvider] = useState('smart_rules');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(
      'ai_copilot_settings_v1',
      JSON.stringify({
        audioSource,
        aiProvider,
        geminiApiKey,
        supabaseUrl,
        supabaseKey,
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Settings & Provider Abstraction Setup
          </h1>
          <p className="text-xs text-slate-400">
            Configure audio hardware abstractions, AI API keys, and Supabase database connections.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Successfully!' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* AUDIO CAPTURE ABSTRACTION */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Mic className="w-4 h-4 text-emerald-400" />
          Audio Input Capture Abstraction Layer
        </h3>
        <p className="text-xs text-slate-400">
          Selected provider determines where call audio speech stream originates. Respects mobile OS permissions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => setAudioSource('demo')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              audioSource === 'demo'
                ? 'bg-blue-950/40 border-blue-500/50 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-xs font-bold block text-blue-300">Demo Call Simulator (Default)</span>
            <span className="text-[11px] text-slate-400 block mt-1">Pre-scripted sales call flow matching acceptance test.</span>
          </div>

          <div
            onClick={() => setAudioSource('microphone')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              audioSource === 'microphone'
                ? 'bg-blue-950/40 border-blue-500/50 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-xs font-bold block text-emerald-300">WebRTC Browser Microphone</span>
            <span className="text-[11px] text-slate-400 block mt-1">Captures device microphone input via getUserMedia.</span>
          </div>

          <div
            onClick={() => setAudioSource('voip')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              audioSource === 'voip'
                ? 'bg-blue-950/40 border-blue-500/50 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-xs font-bold block text-purple-300">VoIP / Webhook Audio Stream</span>
            <span className="text-[11px] text-slate-400 block mt-1">Direct integration for VoIP phone system streams.</span>
          </div>
        </div>
      </div>

      {/* AI PROVIDER CONFIGURATION */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Cpu className="w-4 h-4 text-blue-400" />
          AI Provider Engine Abstraction
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
              <input
                type="radio"
                name="aiProvider"
                checked={aiProvider === 'smart_rules'}
                onChange={() => setAiProvider('smart_rules')}
                className="text-blue-500 focus:ring-0"
              />
              <span>Smart Sales Framework Engine (Local Rule Engine - Offline Ready)</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
              <input
                type="radio"
                name="aiProvider"
                checked={aiProvider === 'gemini'}
                onChange={() => setAiProvider('gemini')}
                className="text-blue-500 focus:ring-0"
              />
              <span>Google Gemini 1.5/2.0 API (Structured JSON Responses)</span>
            </label>
          </div>

          {aiProvider === 'gemini' && (
            <div className="pt-2 pl-6">
              <label className="text-xs font-bold text-slate-400 block mb-1">Google Gemini API Key</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUPABASE CONNECTION */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Database className="w-4 h-4 text-indigo-400" />
          Supabase PostgreSQL Database Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Supabase Project URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Supabase Anon Key</label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOi..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
