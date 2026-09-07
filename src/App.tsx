import React, { useState, useEffect } from 'react';
import { ActiveTab, Investigation, BlockchainRecord, SearchCandidate } from './types';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ResponsibleUseModal } from './components/ResponsibleUseModal';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { NewInvestigationPage } from './pages/NewInvestigationPage';
import { SearchEvidencePage } from './pages/SearchEvidencePage';
import { MatchesComparisonPage } from './pages/MatchesComparisonPage';
import { BlockchainRegistryPage } from './pages/BlockchainRegistryPage';
import { VerificationPage } from './pages/VerificationPage';
import { CertificateView } from './pages/CertificateView';
import { HistoryPage } from './pages/HistoryPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [currentInvestigation, setCurrentInvestigation] = useState<Investigation | null>(null);
  const [blockchainRecords, setBlockchainRecords] = useState<BlockchainRecord[]>([]);
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pipelineStageIndex, setPipelineStageIndex] = useState<number>(0);
  const [isAnchoring, setIsAnchoring] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [invRes, bcRes, netRes] = await Promise.all([
        fetch('/api/investigations'),
        fetch('/api/blockchain/records'),
        fetch('/api/system/network')
      ]);

      const [invData, bcData, netData] = await Promise.all([
        invRes.json().catch(() => ({})),
        bcRes.json().catch(() => ({})),
        netRes.json().catch(() => ({}))
      ]);

      const invList = invData?.investigations || invData?.data || [];
      if (Array.isArray(invList) && invList.length > 0) {
        setInvestigations(invList);
        if (!currentInvestigation) {
          setCurrentInvestigation(invList[0]);
        }
      }

      const records = bcData?.records || bcData?.data?.records || [];
      if (Array.isArray(records)) {
        setBlockchainRecords(records);
      }

      const network = netData?.data || netData || null;
      if (network) {
        setNetworkInfo(network);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  // Load Genesis Demo
  const handleLoadGenesisDemo = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/investigations/genesis');
      const data = await res.json();
      if (data.investigation) {
        setCurrentInvestigation(data.investigation);
        setInvestigations(prev => {
          const exists = prev.some(i => i.id === data.investigation.id);
          return exists ? prev.map(i => i.id === data.investigation.id ? data.investigation : i) : [data.investigation, ...prev];
        });
        setActiveTab('overview');
      }
    } catch (err) {
      console.error('Failed to load genesis demo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start New Investigation
  const handleStartInvestigation = async (fileOrData: File | string, title: string) => {
    setIsLoading(true);
    setPipelineStageIndex(0);

    try {
      let res: Response;
      if (fileOrData instanceof File) {
        const formData = new FormData();
        formData.append('image', fileOrData);
        formData.append('title', title);
        res = await fetch('/api/investigations', {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch('/api/investigations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: fileOrData, title })
        });
      }

      const data = await res.json().catch(() => null);
      setPipelineStageIndex(7);

      if (!res.ok || !data?.success) {
        const msg = data?.error?.message || data?.error || `Investigation failed (HTTP ${res.status})`;
        throw new Error(msg);
      }

      if (data.investigation) {
        setCurrentInvestigation(data.investigation);
        setInvestigations(prev => [data.investigation, ...prev]);
        setActiveTab('search');
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Select Candidate as Evidence
  const handleSelectAsEvidence = async (candidate: SearchCandidate) => {
    if (!currentInvestigation) return;

    try {
      const res = await fetch(`/api/investigations/${currentInvestigation.id}/select-candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: candidate.id })
      });

      const data = await res.json();
      if (data.investigation) {
        setCurrentInvestigation(data.investigation);
        setInvestigations(prev => prev.map(i => i.id === data.investigation.id ? data.investigation : i));
        setActiveTab('blockchain');
      }
    } catch (err) {
      console.error('Failed to select candidate as evidence:', err);
    }
  };

  // Anchor Evidence to Blockchain
  const handleAnchorEvidence = async () => {
    if (!currentInvestigation) return;

    try {
      setIsAnchoring(true);
      const res = await fetch(`/api/investigations/${currentInvestigation.id}/anchor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (data.investigation) {
        setCurrentInvestigation(data.investigation);
        setInvestigations(prev => prev.map(i => i.id === data.investigation.id ? data.investigation : i));
        
        // Refresh blockchain records
        const bcRes = await fetch('/api/blockchain/records');
        const bcData = await bcRes.json();
        if (bcData.records) {
          setBlockchainRecords(bcData.records);
        }

        setActiveTab('verification');
      }
    } catch (err) {
      console.error('Failed to anchor evidence:', err);
    } finally {
      setIsAnchoring(false);
    }
  };

  // Verify Integrity (with or without tamper simulation)
  const handleVerifyIntegrity = async (tamperSimulation: boolean) => {
    if (!currentInvestigation) return null;

    try {
      if (tamperSimulation) {
        await fetch(`/api/investigations/${currentInvestigation.id}/tamper`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const res = await fetch(`/api/investigations/${currentInvestigation.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (data.investigation) {
        setCurrentInvestigation(data.investigation);
        setInvestigations(prev => prev.map(i => i.id === data.investigation.id ? data.investigation : i));
      }
      return data;
    } catch (err) {
      console.error('Verification error:', err);
      return null;
    }
  };

  // Restore Evidence after tamper simulation
  const handleRestoreEvidence = async () => {
    if (!currentInvestigation) return;

    try {
      const res = await fetch(`/api/investigations/${currentInvestigation.id}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (data.investigation) {
        setCurrentInvestigation(data.investigation);
        setInvestigations(prev => prev.map(i => i.id === data.investigation.id ? data.investigation : i));
      }
      return data;
    } catch (err) {
      console.error('Restore error:', err);
    }
  };

  // Run Test Scenario from Evaluation Page
  const handleRunScenario = async (scenarioId: string) => {
    const res = await fetch('/api/system/evaluation/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId })
    });
    return await res.json();
  };

  // Select an investigation from history
  const handleSelectInvestigation = (id: string) => {
    const found = investigations.find(i => i.id === id);
    if (found) {
      setCurrentInvestigation(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Topbar */}
      <Topbar
        currentInvestigation={currentInvestigation}
        investigations={investigations}
        onSelectInvestigation={handleSelectInvestigation}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onRunGenesisDemo={handleLoadGenesisDemo}
        isDemoMode={currentInvestigation?.searchMode === 'DEMO'}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewPage
                currentInvestigation={currentInvestigation}
                setActiveTab={setActiveTab}
                onRunDemoInvestigation={handleLoadGenesisDemo}
              />
            )}

            {activeTab === 'new_investigation' && (
              <NewInvestigationPage
                onStartInvestigation={handleStartInvestigation}
                isLoading={isLoading}
                pipelineStageIndex={pipelineStageIndex}
              />
            )}

            {activeTab === 'search' && (
              <SearchEvidencePage
                currentInvestigation={currentInvestigation}
                onSelectAsEvidence={handleSelectAsEvidence}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'matches' && (
              <MatchesComparisonPage
                currentInvestigation={currentInvestigation}
                onSelectAsEvidence={handleSelectAsEvidence}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'blockchain' && (
              <BlockchainRegistryPage
                currentInvestigation={currentInvestigation}
                blockchainRecords={blockchainRecords}
                networkInfo={networkInfo}
                onAnchorEvidence={handleAnchorEvidence}
                isAnchoring={isAnchoring}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'verification' && (
              <VerificationPage
                currentInvestigation={currentInvestigation}
                onVerifyIntegrity={handleVerifyIntegrity}
                onRestoreEvidence={handleRestoreEvidence}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'certificate' && (
              <CertificateView
                investigation={currentInvestigation}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'history' && (
              <HistoryPage
                investigations={investigations}
                currentInvestigation={currentInvestigation}
                onSelectInvestigation={handleSelectInvestigation}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'evaluation' && (
              <EvaluationPage
                onRunScenario={handleRunScenario}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPage />
            )}
          </div>
        </main>
      </div>

      {/* Responsible Use Modal */}
      <ResponsibleUseModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
