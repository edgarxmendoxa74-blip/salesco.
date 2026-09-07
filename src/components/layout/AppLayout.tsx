import React, { useState } from 'react';
import { Sidebar, PageId } from './Sidebar';
import { Navbar } from './Navbar';
import { Mic, HelpCircle, PackageCheck, PhoneCall } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-200 text-slate-900 flex flex-col pb-16 lg:pb-0">
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
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-100/95 backdrop-blur-md border-t border-slate-300 px-2 py-1.5 flex items-center justify-around lg:hidden shadow-lg">
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
                    ? 'bg-slate-800 text-slate-100 shadow-md font-bold scale-105'
                    : 'bg-slate-300 text-slate-800 font-semibold border border-slate-400'
                }`}
              >
                <Icon className="w-5 h-5 text-slate-100" />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                isActive ? 'text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
