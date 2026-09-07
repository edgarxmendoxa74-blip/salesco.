import React from 'react';
import {
  Mic,
  BrainCircuit,
  PhoneCall,
  HelpCircle,
  BarChart3,
  Workflow,
  BookOpen,
  PackageCheck,
  Users,
  Settings,
  X,
  Sparkles
} from 'lucide-react';
import { BlueBirdLogo } from '../common/BlueBirdLogo';

export type PageId =
  | 'live-copilot'
  | 'how-to-use'
  | 'dashboard'
  | 'calls'
  | 'call-analysis'
  | 'ai-training'
  | 'sales-frameworks'
  | 'objection-library'
  | 'product-knowledge'
  | 'team'
  | 'settings';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  isOpen,
  onClose,
}) => {
  const mainItems: Array<{ id: PageId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
    { id: 'live-copilot', label: '1. Live Call Copilot', icon: Mic, badge: 'START HERE' },
    { id: 'how-to-use', label: '2. How to Use Guide', icon: HelpCircle },
    { id: 'dashboard', label: '3. Dashboard Overview', icon: BarChart3 },
    { id: 'calls', label: '4. Call History & Logs', icon: PhoneCall },
  ];

  const setupItems: Array<{ id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'product-knowledge', label: 'Product Knowledge', icon: PackageCheck },
    { id: 'objection-library', label: 'Objection Playbook', icon: BookOpen },
    { id: 'sales-frameworks', label: 'Sales Stage Rules', icon: Workflow },
    { id: 'ai-training', label: 'AI Training Hub', icon: BrainCircuit },
    { id: 'team', label: 'Team & Closers', icon: Users },
    { id: 'settings', label: 'App Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
                  <BlueBirdLogo size={22} />
                </div>
              </div>
              <div>
                <h1 className="font-black text-lg text-slate-900 tracking-tight leading-none">
                  SalesCo
                </h1>
                <p className="text-[11px] text-blue-600 font-bold tracking-wide mt-0.5">
                  AI Call Copilot
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN NAV SECTION */}
          <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div>
              <span className="px-3 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                MAIN APP
              </span>
              <div className="mt-1.5 space-y-1">
                {mainItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  const isCopilot = item.id === 'live-copilot';

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectPage(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                        isActive
                          ? isCopilot
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/50'
                            : 'bg-blue-50 text-blue-700 border border-blue-200/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive && isCopilot ? 'text-white' : isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                          isActive && isCopilot
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SETUP & KNOWLEDGE BASE */}
            <div>
              <span className="px-3 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                TRAIN AI & SETUP
              </span>
              <div className="mt-1.5 space-y-1">
                {setupItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectPage(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/70'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer User Info */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow">
            SC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">SalesCo Closer</p>
            <p className="text-[10px] text-slate-400 truncate">Ready for Live Calls</p>
          </div>
        </div>
      </aside>
    </>
  );
};
