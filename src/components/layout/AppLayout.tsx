import React, { useState } from 'react';
import { Sidebar, PageId } from './Sidebar';
import { Navbar } from './Navbar';

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
