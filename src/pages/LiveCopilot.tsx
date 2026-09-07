import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  ChevronRight,
  Flame,
  Copy,
  Check,
  Send,
  Zap,
  Play,
  Volume2,
  PhoneOff,
  ShieldCheck,
  HelpCircle,
  Scissors,
  MessageSquarePlus
} from 'lucide-react';
import {
  AIAnalysisResult,
  CallRecord,
  SalesStage,
  TranscriptItem,
} from '../types';
import { DemoTranscriptionProvider } from '../services/transcription/TranscriptionService';
import { SmartRulesAIProvider } from '../services/ai/AIProviderService';
import { CallStorageService } from '../services/storage/CallStorageService';
import { ConsentNoticeModal } from '../components/copilot/ConsentNoticeModal';
import { BlueBirdLogo } from '../components/common/BlueBirdLogo';

interface LiveCopilotProps {
  onEndCall: (callId: string) => void;
}

const STAGES: Array<{ key: SalesStage; label: string }> = [
  { key: 'rapport', label: 'RAPPORT' },
  { key: 'discovery', label: 'DISCOVERY' },
  { key: 'pain_discovery', label: 'PAIN' },
  { key: 'qualification', label: 'QUALIFY' },
  { key: 'solution', label: 'SOLUTION' },
  { key: 'objection_handling', label: 'OBJECTION' },
  { key: 'closing', label: 'CLOSE' },
];

export const LiveCopilot: React.FC<LiveCopilotProps> = ({ onEndCall }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(512);
  const [prospectName, setProspectName] = useState("Juan's Restaurant");
  const [copied, setCopied] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  const [showConsentModal, setShowConsentModal] = useState(false);

  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    { id: 't_init_1', speaker: 'prospect', text: 'May QR menu na kami ngayon.', timestamp: '00:08:10', confidence: 0.98 },
    { id: 't_init_2', speaker: 'closer', text: 'Ah okay po, Sir.', timestamp: '00:08:18', confidence: 0.99 },
    { id: 't_init_3', speaker: 'prospect', text: 'Pero static lang siya.', timestamp: '00:08:30', confidence: 0.97 },
  ]);

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult>({
    current_stage: 'discovery',
    intent: 'medium',
    pain_points: [{ name: 'STATIC MENU', severity: 'medium' }],
    objections: [],
    buying_signals: [],
    suggested_response: 'Ah okay po, Sir. Ask ko lang po, yung QR menu niyo currently pang-view lang ba ng menu or nakakapag-order na rin directly yung customers?',
    next_question: 'Nakakareceive din ba ng realtime order notifications ang kitchen niyo?',
    reason: 'Prospect confirmed existing QR menu is static only. Probed for direct ordering capability.',
    confidence: 0.95,
    detected_label: 'EXISTING SOLUTION',
  });

  const demoTranscriberRef = useRef<DemoTranscriptionProvider | null>(null);
  const aiProviderRef = useRef<SmartRulesAIProvider>(new SmartRulesAIProvider());
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { demoTranscriberRef.current = new DemoTranscriptionProvider(); }, []);

  useEffect(() => {
    let interval: number | null = null;
    if (isSessionActive && isListening) {
      interval = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => { if (interval !== null) clearInterval(interval); };
  }, [isSessionActive, isListening]);

  useEffect(() => { transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [transcripts]);

  const formatDuration = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const processLatestUtterance = async (newTranscripts: TranscriptItem[], latestMessage: string) => {
    const framework = CallStorageService.getFramework();
    const knowledge = CallStorageService.getProductKnowledge();
    const result = await aiProviderRef.current.analyzeConversation({
      currentStage: aiAnalysis.current_stage, transcripts: newTranscripts, latestMessage, framework, productKnowledge: knowledge,
    });
    setAiAnalysis(result);
  };

  const handleStartSession = () => setShowConsentModal(true);
  const handleConfirmConsent = () => { setShowConsentModal(false); setIsSessionActive(true); setIsListening(true); setIsRecording(true); };

  const handleNextDemoStep = async () => {
    if (!demoTranscriberRef.current) return;
    const item = demoTranscriberRef.current.emitNextStep();
    if (item) { const updated = [...transcripts, item]; setTranscripts(updated); await processLatestUtterance(updated, item.text); }
  };

  const handleSendCustomText = async (speaker: 'prospect' | 'closer') => {
    if (!customInputText.trim() || !demoTranscriberRef.current) return;
    const item = demoTranscriberRef.current.emitCustomText(speaker, customInputText.trim());
    setCustomInputText('');
    const updated = [...transcripts, item]; setTranscripts(updated); await processLatestUtterance(updated, item.text);
  };

  const handleQuickAction = async (action: 'SHORTER' | 'MORE_NATURAL' | 'MORE_PERSUASIVE' | 'NEXT_QUESTION' | 'HANDLE_OBJECTION' | 'SKIP') => {
    const newText = await aiProviderRef.current.quickAction(action, aiAnalysis.suggested_response, {
      currentStage: aiAnalysis.current_stage, latestMessage: transcripts[transcripts.length - 1]?.text || '', objections: aiAnalysis.objections,
    });
    setAiAnalysis((prev) => ({ ...prev, suggested_response: newText }));
  };

  const handleCopyResponse = () => { navigator.clipboard.writeText(aiAnalysis.suggested_response); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleFinishCall = async () => {
    setIsListening(false); setIsSessionActive(false);
    const newCall: CallRecord = {
      id: `call_${Date.now()}`, prospectName, businessName: prospectName, date: new Date().toISOString(),
      durationSeconds: seconds, currentStage: aiAnalysis.current_stage, buyingIntent: aiAnalysis.intent,
      outcome: 'closed_won', score: 92, audioSourceType: 'demo', transcripts, analysis: aiAnalysis,
    };
    const report = await aiProviderRef.current.generatePostCallReport(newCall);
    newCall.scoreBreakdown = report.scoreBreakdown; newCall.followUp = report.followUp;
    CallStorageService.saveCall(newCall); onEndCall(newCall.id);
  };

  const latestProspectMsg = [...transcripts].reverse().find((t) => t.speaker === 'prospect')?.text;

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-12">
      <ConsentNoticeModal isOpen={showConsentModal} onConfirm={handleConfirmConsent} onCancel={() => setShowConsentModal(false)} />

      {/* TOP COPILOT HEADER */}
      <div className="glass-panel p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
              <BlueBirdLogo size={22} />
            </div>
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-800 tracking-tight">SalesCo Copilot</h1>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Prospect:</span>
              <input type="text" value={prospectName} onChange={(e) => setProspectName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs text-blue-700 font-semibold focus:outline-none focus:border-blue-400" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isRecording ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /><span>🔴 RECORDING</span>
            </div>
          ) : isListening ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span>🟢 LISTENING</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-400 text-xs font-medium border border-slate-200">
              <MicOff className="w-3.5 h-3.5" /><span>PAUSED</span>
            </div>
          )}
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
            <span className="text-slate-400 text-[10px]">DURATION</span>
            <span className="text-blue-600">{formatDuration(seconds)}</span>
          </div>
          {!isSessionActive ? (
            <button onClick={handleStartSession}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:scale-[1.02] transition-all">
              <Mic className="w-4 h-4" /><span>Start Session</span>
            </button>
          ) : (
            <button onClick={handleFinishCall}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all">
              <PhoneOff className="w-4 h-4" /><span>End Call</span>
            </button>
          )}
        </div>
      </div>

      {/* SALES STAGE PROGRESS */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-400 uppercase tracking-wider">Current Sales Stage</span>
          <span className="font-bold text-blue-600 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />{aiAnalysis.current_stage.toUpperCase().replace('_', ' ')}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {STAGES.map((s, idx) => {
            const isActive = aiAnalysis.current_stage === s.key;
            const currentIdx = STAGES.findIndex((st) => st.key === aiAnalysis.current_stage);
            const isPast = idx < currentIdx;
            return (
              <div key={s.key}
                className={`py-2 px-1 text-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white font-extrabold ring-2 ring-blue-400 shadow-lg shadow-blue-500/30 scale-105'
                    : isPast
                    ? 'bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200'
                    : 'bg-slate-50 text-slate-400 font-medium border border-slate-200'
                }`}
              >
                <div className="text-[10px] sm:text-xs truncate">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN COPILOT UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* LATEST PROSPECT STATEMENT */}
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">PROSPECT SAID (LATEST)</span>
            <p className="text-sm sm:text-base font-semibold text-slate-700 italic">"{latestProspectMsg || 'Listening to prospect speech...'}"</p>
          </div>

          {/* AI SUGGESTED RESPONSE */}
          <div className="glass-panel-glow p-5 sm:p-6 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" /> AI SUGGESTED RESPONSE
                </span>
              </div>
              <button onClick={handleCopyResponse}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-semibold border border-slate-200 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 shadow-inner mb-4">
              <p className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed tracking-tight">"{aiAnalysis.suggested_response}"</p>
            </div>
            {aiAnalysis.next_question && (
              <div className="mb-4 p-3 rounded-lg bg-indigo-50 border border-indigo-200 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-indigo-600">Recommended Follow-up:</span>
                  <p className="text-slate-600 mt-0.5">"{aiAnalysis.next_question}"</p>
                </div>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
              {([
                { action: 'SHORTER' as const, icon: Scissors, label: 'SHORTER', color: 'text-blue-500' },
                { action: 'MORE_NATURAL' as const, icon: Sparkles, label: 'MORE NATURAL', color: 'text-emerald-500' },
                { action: 'MORE_PERSUASIVE' as const, icon: Flame, label: 'MORE PERSUASIVE', color: 'text-orange-500' },
                { action: 'NEXT_QUESTION' as const, icon: MessageSquarePlus, label: 'NEXT QUESTION', color: 'text-purple-500' },
                { action: 'HANDLE_OBJECTION' as const, icon: ShieldCheck, label: 'HANDLE OBJECTION', color: 'text-red-500' },
              ]).map(({ action, icon: Icon, label, color }) => (
                <button key={action} onClick={() => handleQuickAction(action)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shadow-sm transition-colors">
                  <Icon className={`w-3.5 h-3.5 ${color}`} /><span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI ANALYSIS CARD */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> REAL-TIME AI ANALYSIS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Detected</span>
                <span className="text-xs font-extrabold text-blue-600 truncate block mt-0.5">{aiAnalysis.detected_label || 'EXISTING SOLUTION'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Pain Point</span>
                <span className="text-xs font-extrabold text-amber-600 truncate block mt-0.5">{aiAnalysis.pain_points[0]?.name || 'STATIC MENU'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Buying Intent</span>
                <span className={`text-xs font-extrabold uppercase truncate block mt-0.5 ${
                  aiAnalysis.intent === 'high' ? 'text-emerald-600' : aiAnalysis.intent === 'medium' ? 'text-blue-600' : 'text-slate-400'
                }`}>{aiAnalysis.intent} INTENT</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-600">AI Logic: </span>{aiAnalysis.reason}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4 flex flex-col">
          {/* DEMO CONTROLS */}
          <div className="glass-panel p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" /> DEMO MODE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Click to simulate prospect statements.</p>
            <button onClick={handleNextDemoStep}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mb-2 transition-all">
              <ChevronRight className="w-4 h-4" /><span>Simulate Next Prospect Statement</span>
            </button>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
              <input type="text" value={customInputText} onChange={(e) => setCustomInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCustomText('prospect')}
                placeholder="Or type prospect speech..."
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400" />
              <button onClick={() => handleSendCustomText('prospect')} className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* LIVE TRANSCRIPT */}
          <div className="glass-panel p-4 rounded-2xl flex-1 flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-500" /> LIVE TRANSCRIPT
              </span>
              <span className="text-[10px] text-emerald-500 font-mono font-bold">REALTIME</span>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 flex-1">
              {transcripts.map((t) => (
                <div key={t.id} className={`p-3 rounded-xl text-xs space-y-1 ${
                  t.speaker === 'prospect'
                    ? 'bg-slate-50 border border-slate-200 text-slate-700 mr-4'
                    : 'bg-blue-50 border border-blue-200 text-blue-800 ml-4'
                }`}>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`font-bold uppercase ${t.speaker === 'prospect' ? 'text-blue-600' : 'text-emerald-600'}`}>
                      {t.speaker === 'prospect' ? 'PROSPECT' : 'CLOSER'}
                    </span>
                    <span className="text-slate-400 font-mono">{t.timestamp}</span>
                  </div>
                  <p className="font-medium">{t.text}</p>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
