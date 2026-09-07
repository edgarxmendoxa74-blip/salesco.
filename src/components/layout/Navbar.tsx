import React from 'react';
import { Menu, Mic, Radio, Bell } from 'lucide-react';
import { PageId } from './Sidebar';

interface NavbarProps {
  activePage: PageId;
  onOpenSidebar: () => void;
  onSelectPage: (page: PageId) => void;
  isListening?: boolean;
  isRecording?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onOpenSidebar,
  onSelectPage,
  isListening = false,
  isRecording = false,
}) => {
  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'dashboard': return 'Dashboard Overview';
      case 'live-copilot': return 'Live Call Copilot';
      case 'calls': return 'Call History & Logs';
      case 'call-analysis': return 'Post-Call Intelligence Analysis';
      case 'ai-training': return 'AI Training Center';
      case 'sales-frameworks': return 'Sales Framework Engine';
      case 'objection-library': return 'Objection Library & Playbook';
      case 'product-knowledge': return 'Product Knowledge Base';
      case 'team': return 'Team Performance & Closers';
      case 'settings': return 'Settings & Audio Setup';
      case 'how-to-use': return 'How to Use SalesCo';
      default: return 'SalesCo';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-100/90 backdrop-blur-md border-b border-slate-300 px-4 lg:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-base lg:text-lg font-black text-slate-900 tracking-tight">
          {getPageTitle(activePage)}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {isRecording ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>RECORDING</span>
          </div>
        ) : isListening ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>LISTENING</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300">
            <Radio className="w-3.5 h-3.5" />
            <span>STANDBY</span>
          </div>
        )}

        {activePage !== 'live-copilot' && (
          <button
            onClick={() => onSelectPage('live-copilot')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-100 font-bold text-xs shadow hover:bg-slate-900 transition-all"
          >
            <Mic className="w-4 h-4 text-slate-100" />
            <span className="hidden sm:inline">Start Copilot</span>
          </button>
        )}

        <button className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-slate-700" />
        </button>
      </div>
    </header>
  );
};
