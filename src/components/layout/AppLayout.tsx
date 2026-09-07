import React, { useState } from 'react';
import { Sidebar, PageId } from './Sidebar';
import { Navbar } from './Navbar';
import { Mic, HelpCircle, PackageCheck, PhoneCall, LayoutDashboard } from 'lucide-react';

interface AppLayoutProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  children: React.ReactNode;
  isListening?: boolean;
  isRecording?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activePage,
  onSelectPage,
  children,
  isListening,
  isRecording,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mobileNavItems: Array<{ id: PageId; label: string; icon: React.ComponentType<{ className?: string }>; isPrimary?: boolean }> = [
    { id: 'live-copilot', label: 'Copilot', icon: Mic, isPrimary: true },
    { id: 'how-to-use', label: 'Guide', icon: HelpCircle },
    { id: 'product-knowledge', label: 'Train AI', icon: PackageCheck },
    { id: 'calls', label: 'History', icon: PhoneCall },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col pb-16 lg:pb-0">
      <Sidebar
        activePage={activePage}
        onSelectPage={onSelectPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <Navbar
          activePage={activePage}
          onOpenSidebar={() => setSidebarOpen(true)}
          onSelectPage={onSelectPage}
          isListening={isListening}
          isRecording={isRecording}
        />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around lg:hidden shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-bold scale-105'
                    : 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
