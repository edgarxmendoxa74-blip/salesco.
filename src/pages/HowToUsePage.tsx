import React from 'react';
import {
  Phone,
  Mic,
  BrainCircuit,
  MessageSquareText,
  ArrowDown,
  Smartphone,
  Volume2,
  ShieldCheck,
  Wifi,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Headphones,
  Radio,
} from 'lucide-react';
import { BlueBirdLogo } from '../components/common/BlueBirdLogo';

interface HowToUseProps {
  onStartCopilot: () => void;
}

export const HowToUsePage: React.FC<HowToUseProps> = ({ onStartCopilot }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg p-3">
            <BlueBirdLogo size={36} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How to Use SalesCo
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl leading-relaxed">
            SalesCo is your AI-powered sales coach that <strong className="text-white">listens to your phone call</strong> and tells you exactly what to say next — in real time.
          </p>
          <button
            onClick={onStartCopilot}
            className="mt-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2"
          >
            <Mic className="w-5 h-5" />
            Try Live Copilot Now
          </button>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
      </div>

      {/* THE CONCEPT */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          The Concept
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Imagine you're on a <strong>live sales call</strong> with a potential customer. While you're talking, SalesCo listens through your phone's microphone,
          analyzes the conversation in real time, and shows you the <strong>best response to say next</strong> — like having a world-class sales coach whispering in your ear.
        </p>
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
          <strong>Key Principle:</strong> The AI does NOT talk to the customer. <strong>YOU</strong> remain in full control.
          The AI only provides intelligent suggestions that you can choose to use.
        </div>
      </div>

      {/* STEP BY STEP FLOW */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
          Step-by-Step: How It Works
        </h2>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="glass-panel p-5 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Start Your Phone Call
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Call your prospect using your regular phone dialer, Viber, WhatsApp, Messenger, or any calling app. SalesCo does not make the call — you do.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-300" />
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-5 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                Open SalesCo During the Call
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                While your call is active, switch to the SalesCo app and tap <strong>"Start Session"</strong>. The app will start listening through your device's microphone.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-300" />
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-5 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-lg">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                Put the Call on Speaker (Recommended)
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                For best results, put your phone call on <strong>speakerphone</strong> so SalesCo's microphone can hear both you and the prospect clearly.
                Alternatively, use <strong>Bluetooth earbuds</strong> with the phone nearby.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-300" />
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-5 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-lg">
              4
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-amber-600" />
                AI Listens, Analyzes & Suggests
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                SalesCo transcribes the conversation in real time, detects <strong>pain points</strong>, <strong>objections</strong>, and <strong>buying signals</strong>,
                identifies the current sales stage, and generates a natural Taglish suggested response for you.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-300" />
          </div>

          {/* Step 5 */}
          <div className="glass-panel p-5 rounded-2xl flex items-start gap-4 border-2 border-blue-200 bg-blue-50/50">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg">
              5
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-blue-600" />
                Read the AI Suggestion & Respond
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                The AI shows you exactly <strong>what to say next</strong> in large, easy-to-read text. Simply <strong>read the response aloud</strong> to the customer —
                or tap quick action buttons like <em>Shorter</em>, <em>More Natural</em>, or <em>Handle Objection</em> to refine it.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-300" />
          </div>

          {/* Step 6 */}
          <div className="glass-panel p-5 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-lg">
              6
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                End Call → Get AI Score Report
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                After the call ends, tap <strong>"End Call"</strong>. SalesCo automatically generates a <strong>post-call intelligence report</strong> with
                scoring across 7 sales dimensions, missed opportunities, and recommended follow-up actions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BEST AUDIO SETUP METHODS */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Headphones className="w-5 h-5 text-indigo-600" />
          Best Ways to Connect Your Call Audio
        </h2>
        <p className="text-sm text-slate-500 mb-5">
          Since most phones don't allow third-party apps to directly capture phone call audio, here are the recommended methods:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Method A */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">RECOMMENDED</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">📱 Speakerphone + Device Microphone</h4>
            <p className="text-xs text-slate-500">
              Put your phone call on speaker. Open SalesCo on the <strong>same phone</strong> or a <strong>second device</strong> (tablet/laptop) nearby.
              The app's microphone picks up both your voice and the prospect's voice.
            </p>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Easiest setup — works immediately
            </div>
          </div>

          {/* Method B */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-800">💻 Call on Laptop + SalesCo on Same Laptop</h4>
            <p className="text-xs text-slate-500">
              If you're calling via <strong>Viber Desktop, WhatsApp Web, Zoom, Google Meet</strong> or any VoIP app on your computer,
              open SalesCo in a browser tab on the same machine. The microphone captures the call audio directly.
            </p>
            <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Best audio quality
            </div>
          </div>

          {/* Method C */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-800">🎧 Bluetooth Earbuds + Phone Nearby</h4>
            <p className="text-xs text-slate-500">
              Use Bluetooth earbuds for the phone call. Place the phone (with SalesCo open) on the table nearby.
              The phone microphone picks up your voice; prospect audio leaks through the earbuds for the mic.
            </p>
            <div className="flex items-center gap-1 text-xs text-purple-600 font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Private — prospect can't hear SalesCo
            </div>
          </div>

          {/* Method D */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-800">🖥️ Two Devices (Phone + Tablet/Laptop)</h4>
            <p className="text-xs text-slate-500">
              Call the prospect on your phone. Open SalesCo on a <strong>second device</strong> (tablet or laptop) placed next to you on speakerphone.
              This way you can see the AI suggestions on a bigger screen while talking.
            </p>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Best for office/desk setups
            </div>
          </div>
        </div>
      </div>

      {/* DEMO MODE INFO */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50/30">
        <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Radio className="w-5 h-5 text-indigo-600" />
          Try Demo Mode First (No Call Needed!)
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Want to see SalesCo in action before a real call? Use the built-in <strong>Demo Mode</strong>:
        </p>
        <ol className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>Open <strong>Live Call Copilot</strong> from the sidebar.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>Click <strong>"Start Session"</strong> and accept the consent notice.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>Click <strong>"Simulate Next Prospect Statement"</strong> to walk through a sample sales conversation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
            <span>Watch as SalesCo detects pain points, objections, and generates suggested responses in real time!</span>
          </li>
        </ol>
      </div>

      {/* PRIVACY / LEGAL */}
      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Privacy & Legal Reminder
        </h2>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Recording & analyzing calls may be subject to local privacy laws.</p>
            <p className="text-amber-700">
              Always ensure the other party is properly informed when you are recording or transcribing a call.
              SalesCo shows a consent reminder before every session. We do not bypass any operating system audio restrictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
