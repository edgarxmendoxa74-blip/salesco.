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
  const [activeTab, setActiveTab] = useState<'copilot' | 'transcript'>('copilot');

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
    <div className="space-y-3 sm:space-y-4 max-w-5xl mx-auto pb-16 px-1 sm:px-0">
      <ConsentNoticeModal isOpen={showConsentModal} onConfirm={handleConfirmConsent} onCancel={() => setShowConsentModal(false)} />

      {/* TOP COPILOT HEADER */}
      <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-300 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-sky-600 to-indigo-700 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-slate-100 rounded-[9px] flex items-center justify-center p-1">
                <BlueBirdLogo size={22} />
              </div>
            </div>
            <div>
              <h1 className="font-black text-base sm:text-lg text-slate-800 tracking-tight leading-none">SalesCo</h1>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <span className="text-slate-600 font-medium">Prospect:</span>
                <input type="text" value={prospectName} onChange={(e) => setProspectName(e.target.value)}
                  className="bg-slate-200 border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-slate-500 max-w-[130px] sm:max-w-none" />
              </div>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-200 border border-slate-300 text-xs font-mono font-bold text-slate-800 sm:hidden">
            {formatDuration(seconds)}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t border-slate-200 sm:border-0">
          <div className="flex items-center gap-2">
            {isRecording ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-extrabold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600" /><span>REC</span>
              </div>
            ) : isListening ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-600" /><span>LIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300">
                <MicOff className="w-3.5 h-3.5" /><span>PAUSED</span>
              </div>
            )}
            <div className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-200 border border-slate-300 text-xs font-mono font-bold text-slate-800 items-center gap-1.5">
              <span className="text-slate-500 text-[10px]">TIME</span>
              <span className="text-slate-800">{formatDuration(seconds)}</span>
            </div>
          </div>

          {!isSessionActive ? (
            <button onClick={handleStartSession}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-slate-100 font-extrabold text-xs shadow-lg flex items-center gap-1.5 transition-all">
              <Mic className="w-4 h-4 text-slate-100" /><span>Start Call</span>
            </button>
          ) : (
            <button onClick={handleFinishCall}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-slate-100 font-extrabold text-xs shadow-lg flex items-center gap-1.5 transition-all">
              <PhoneOff className="w-4 h-4 text-slate-100" /><span>End Call</span>
            </button>
          )}
        </div>
      </div>

      {/* SALES STAGE BAR */}
      <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-300 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between text-xs mb-2 min-w-[300px]">
          <span className="font-extrabold text-slate-600 uppercase tracking-wider text-xs">Sales Stage</span>
          <span className="font-extrabold text-slate-800 flex items-center gap-1 text-xs bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
            <Zap className="w-3.5 h-3.5 text-slate-700" />{aiAnalysis.current_stage.toUpperCase().replace('_', ' ')}
          </span>
        </div>
        <div className="flex sm:grid sm:grid-cols-7 gap-1.5 sm:gap-2 min-w-[520px] sm:min-w-0">
          {STAGES.map((s, idx) => {
            const isActive = aiAnalysis.current_stage === s.key;
            const currentIdx = STAGES.findIndex((st) => st.key === aiAnalysis.current_stage);
            const isPast = idx < currentIdx;
            return (
              <div key={s.key}
                className={`py-2 px-2 sm:py-2.5 sm:px-1 text-center rounded-xl transition-all duration-200 shrink-0 sm:shrink ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 font-black ring-2 ring-slate-600 shadow-md'
                    : isPast
                    ? 'bg-slate-300 text-slate-800 font-bold border border-slate-400'
                    : 'bg-slate-200 text-slate-600 font-bold border border-slate-300'
                }`}
              >
                <div className="text-xs font-black tracking-tight whitespace-nowrap">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE TABS TOGGLE */}
      <div className="flex lg:hidden rounded-xl bg-slate-200 p-1 font-bold text-xs border border-slate-300">
        <button
          onClick={() => setActiveTab('copilot')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'copilot' ? 'bg-slate-700 text-slate-100 shadow font-black' : 'text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-slate-200" />
          <span>AI Suggestions</span>
        </button>
        <button
          onClick={() => setActiveTab('transcript')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'transcript' ? 'bg-slate-700 text-slate-100 shadow font-black' : 'text-slate-700'
          }`}
        >
          <Volume2 className="w-4 h-4 text-slate-200" />
          <span>Live Transcript ({transcripts.length})</span>
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT COLUMN */}
        <div className={`lg:col-span-2 space-y-4 ${activeTab === 'transcript' ? 'hidden lg:block' : 'block'}`}>
          {/* LATEST PROSPECT STATEMENT */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 shadow-sm">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">PROSPECT SAID (LATEST)</span>
            <p className="text-base sm:text-lg font-bold text-slate-800 italic leading-snug">"{latestProspectMsg || 'Listening to prospect speech...'}"</p>
          </div>

          {/* AI SUGGESTED RESPONSE CARD - GRAY CONTRAST */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border-2 border-slate-400 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-md bg-slate-200 text-slate-800 text-xs font-black border border-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-slate-700" /> AI SUGGESTED RESPONSE
              </span>
              <button onClick={handleCopyResponse}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold border border-slate-300">
                {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-slate-700" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-200 border border-slate-300 shadow-inner mb-4">
              <p className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-relaxed tracking-tight">"{aiAnalysis.suggested_response}"</p>
            </div>

            {aiAnalysis.next_question && (
              <div className="mb-4 p-3 rounded-xl bg-slate-200 border border-slate-300 flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-slate-700 mt-0.5 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <span className="font-extrabold text-slate-800">Recommended Follow-up Question:</span>
                  <p className="text-slate-900 font-bold mt-0.5">"{aiAnalysis.next_question}"</p>
                </div>
              </div>
            )}

            {/* QUICK ACTIONS */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-slate-300">
              {([
                { action: 'SHORTER' as const, icon: Scissors, label: 'Shorter', color: 'text-slate-700' },
                { action: 'MORE_NATURAL' as const, icon: Sparkles, label: 'Natural', color: 'text-slate-700' },
                { action: 'MORE_PERSUASIVE' as const, icon: Flame, label: 'Persuasive', color: 'text-slate-700' },
                { action: 'NEXT_QUESTION' as const, icon: MessageSquarePlus, label: 'Next Question', color: 'text-slate-700' },
                { action: 'HANDLE_OBJECTION' as const, icon: ShieldCheck, label: 'Objection', color: 'text-slate-700' },
              ]).map(({ action, icon: Icon, label, color }) => (
                <button key={action} onClick={() => handleQuickAction(action)}
                  className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-300 shadow-sm shrink-0 whitespace-nowrap">
                  <Icon className={`w-4 h-4 ${color}`} /><span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI ANALYSIS CARD */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-slate-700" /> REAL-TIME AI ANALYSIS
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-200 border border-slate-300">
                <span className="text-[10px] text-slate-600 uppercase block font-extrabold">Detected</span>
                <span className="text-xs sm:text-sm font-black text-slate-800 truncate block mt-0.5">{aiAnalysis.detected_label || 'EXISTING SOLUTION'}</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-200 border border-slate-300">
                <span className="text-[10px] text-slate-600 uppercase block font-extrabold">Pain Point</span>
                <span className="text-xs sm:text-sm font-black text-slate-800 truncate block mt-0.5">{aiAnalysis.pain_points[0]?.name || 'STATIC MENU'}</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-200 border border-slate-300">
                <span className="text-[10px] text-slate-600 uppercase block font-extrabold">Buying Intent</span>
                <span className="text-xs sm:text-sm font-black uppercase text-slate-800 truncate block mt-0.5">{aiAnalysis.intent}</span>
              </div>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed bg-slate-200 p-3 rounded-xl border border-slate-300 font-semibold">
              <span className="font-black text-slate-900">AI Logic: </span>{aiAnalysis.reason}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={`space-y-4 flex flex-col ${activeTab === 'copilot' ? 'hidden lg:flex' : 'flex'}`}>
          {/* DEMO CONTROLS */}
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Play className="w-4 h-4 text-slate-700 fill-slate-700" /> DEMO SIMULATION
              </span>
            </div>
            <button onClick={handleNextDemoStep}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-slate-100 font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 mb-2 transition-all">
              <ChevronRight className="w-4 h-4 text-slate-100" /><span>Simulate Next Prospect Voice</span>
            </button>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-300">
              <input type="text" value={customInputText} onChange={(e) => setCustomInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCustomText('prospect')}
                placeholder="Or type prospect text..."
                className="flex-1 bg-slate-200 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-semibold placeholder-slate-500 focus:outline-none focus:border-slate-500" />
              <button onClick={() => handleSendCustomText('prospect')} className="p-1.5 rounded-lg bg-slate-800 text-slate-100 font-extrabold text-xs px-3">
                Send
              </button>
            </div>
          </div>

          {/* LIVE TRANSCRIPT */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 shadow-sm flex-1 flex flex-col justify-between min-h-[340px]">
            <div className="flex items-center justify-between mb-3 border-b border-slate-300 pb-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-slate-700" /> LIVE TRANSCRIPT
              </span>
              <span className="text-[10px] text-slate-800 font-mono font-black bg-slate-200 px-2 py-0.5 rounded border border-slate-300">REALTIME</span>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 flex-1">
              {transcripts.map((t) => (
                <div key={t.id} className={`p-3 rounded-xl text-xs space-y-1 ${
                  t.speaker === 'prospect'
                    ? 'bg-slate-200 border border-slate-300 text-slate-900 mr-2'
                    : 'bg-slate-300 border border-slate-400 text-slate-900 ml-2'
                }`}>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-black uppercase text-slate-700">
                      {t.speaker === 'prospect' ? 'PROSPECT' : 'CLOSER'}
                    </span>
                    <span className="text-slate-600 font-mono font-bold">{t.timestamp}</span>
                  </div>
                  <p className="font-bold text-xs">{t.text}</p>
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
