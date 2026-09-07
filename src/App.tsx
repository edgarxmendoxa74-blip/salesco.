import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { PageId } from './components/layout/Sidebar';

import { Dashboard } from './pages/Dashboard';
import { LiveCopilot } from './pages/LiveCopilot';
import { CallsHistory } from './pages/CallsHistory';
import { CallAnalysisDetail } from './pages/CallAnalysisDetail';
import { AITrainingCenter } from './pages/AITrainingCenter';
import { SalesFrameworksPage } from './pages/SalesFrameworksPage';
import { ObjectionLibraryPage } from './pages/ObjectionLibraryPage';
import { ProductKnowledgePage } from './pages/ProductKnowledgePage';
import { TeamManagementPage } from './pages/TeamManagementPage';
import { SettingsPage } from './pages/SettingsPage';

import { CallStorageService } from './services/storage/CallStorageService';
import { CallRecord } from './types';

export function App() {
  const [activePage, setActivePage] = useState<PageId>('live-copilot');
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>(() => CallStorageService.getCalls());

  const handleSelectCall = (callId: string) => {
    setSelectedCallId(callId);
    setActivePage('call-analysis');
  };

  const handleEndCall = (newCallId: string) => {
    const updatedCalls = CallStorageService.getCalls();
    setCalls(updatedCalls);
    setSelectedCallId(newCallId);
    setActivePage('call-analysis');
  };

  const selectedCall = selectedCallId
    ? calls.find((c) => c.id === selectedCallId) || calls[0]
    : calls[0];

  return (
    <AppLayout
      activePage={activePage}
      onSelectPage={(page) => {
        setActivePage(page);
      }}
      isListening={activePage === 'live-copilot'}
      isRecording={activePage === 'live-copilot'}
    >
      {activePage === 'dashboard' && (
        <Dashboard
          calls={calls}
          onStartCopilot={() => setActivePage('live-copilot')}
          onSelectCall={handleSelectCall}
        />
      )}

      {activePage === 'live-copilot' && (
        <LiveCopilot onEndCall={handleEndCall} />
      )}

      {activePage === 'calls' && (
        <CallsHistory calls={calls} onSelectCall={handleSelectCall} />
      )}

      {activePage === 'call-analysis' && selectedCall && (
        <CallAnalysisDetail
          call={selectedCall}
          onBack={() => setActivePage('calls')}
        />
      )}

      {activePage === 'ai-training' && (
        <AITrainingCenter onSelectPage={setActivePage} />
      )}

      {activePage === 'sales-frameworks' && <SalesFrameworksPage />}

      {activePage === 'objection-library' && <ObjectionLibraryPage />}

      {activePage === 'product-knowledge' && <ProductKnowledgePage />}

      {activePage === 'team' && <TeamManagementPage />}

      {activePage === 'settings' && <SettingsPage />}
    </AppLayout>
  );
}
