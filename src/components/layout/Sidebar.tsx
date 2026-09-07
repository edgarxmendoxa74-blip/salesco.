import React from 'react';
import {
  LayoutDashboard,
  Mic,
  PhoneCall,
  BarChart3,
  BrainCircuit,
  Workflow,
  BookOpen,
  PackageCheck,
  Users,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { BlueBirdLogo } from '../common/BlueBirdLogo';

export type PageId =
  | 'dashboard'
  | 'live-copilot'
  | 'calls'
  | 'call-analysis'
  | 'ai-training'
  | 'sales-frameworks'
  | 'objection-library'
  | 'product-knowledge'
  | 'team'
  | 'settings'
  | 'how-to-use';

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
  const menuItems: Array<{ id: PageId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; isPrimary?: boolean }> = [
    { id: 'live-copilot', label: 'Live Call Copilot', icon: Mic, badge: 'LIVE', isPrimary: true },
    { id: 'how-to-use', label: 'How to Use', icon: HelpCircle },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calls', label: 'Call History', icon: PhoneCall },
    { id: 'call-analysis', label: 'Post-Call Analysis', icon: BarChart3 },
    { id: 'ai-training', label: 'AI Training Center', icon: BrainCircuit },
    { id: 'sales-frameworks', label: 'Sales Frameworks', icon: Workflow },
    { id: 'objection-library', label: 'Objection Library', icon: BookOpen },
    { id: 'product-knowledge', label: 'Product Knowledge', icon: PackageCheck },
    { id: 'team', label: 'Team & Closers', icon: Users },
    { id: 'settings', label: 'Settings & Audio', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-xl lg:shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/25">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
                  <BlueBirdLogo size={24} />
                </div>
              </div>
              <div>
                <h1 className="font-black text-lg tracking-tight text-slate-900">
                  SalesCo
                </h1>
                <p className="text-[11px] text-blue-500 font-semibold tracking-wide">
                  AI Sales Closer Copilot
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              if (item.isPrimary) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectPage(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 mb-3 shadow-md ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 ring-2 ring-blue-400/50'
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-blue-100'}`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                      </div>
                      <span className="tracking-tight">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      } animate-pulse`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPage(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/60'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Juan Dela Cruz</p>
            <p className="text-[11px] text-slate-400 truncate">Senior Closer • Smart Menu</p>
          </div>
        </div>
      </aside>
    </>
  );
};
