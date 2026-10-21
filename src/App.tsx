import React, { useState, useRef, useEffect } from 'react';
import { AttendeeRecord, BadgeData, BadgeRole, BadgeTemplate, PrintSettings } from './types';
import { DEMO_PRESETS, BLANK_BADGE_DATA } from './utils/demoPresets';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { EventBriefAssistant } from './components/EventBriefAssistant';
import { BadgeEditor } from './components/BadgeEditor';
import { TemplateSelector } from './components/TemplateSelector';
import { BrandKitManager } from './components/BrandKitManager';
import { BatchAttendeeManager } from './components/BatchAttendeeManager';
import { BadgePreview } from './components/BadgePreview';
import { ContextualInspector } from './components/ContextualInspector';
import { ExportPanel } from './components/ExportPanel';
import { CommandBar } from './components/CommandBar';
import { exportBadgeAsSvg, exportBadgeAsPng, exportBadgeAsPdf, exportBatchPdf } from './utils/exportUtils';
import confetti from 'canvas-confetti';

const ROLE_COLORS: Record<BadgeRole, string> = {
  Participant: '#0284c7', // Professional Royal Blue / Process Cyan
  Organizer: '#ea580c',   // High-Contrast Flame Orange
  Mentor: '#059669',      // Deep Emerald Green
  Volunteer: '#7c3aed'    // Refined Violet
};

export const App: React.FC = () => {
  // Navigation State
  const [viewMode, setViewMode] = useState<'landing' | 'studio'>('landing');
  const [activeTab, setActiveTab] = useState<'assistant' | 'editor' | 'brandkit' | 'templates' | 'batch'>('assistant');
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [isMockupView, setIsMockupView] = useState<boolean>(true);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState<boolean>(false);
  const [isBatchExporting, setIsBatchExporting] = useState<boolean>(false);

  // Badge State & History for Undo/Redo
  const [badge, setBadge] = useState<BadgeData>(DEMO_PRESETS[0].badge);
  const [activeTemplate, setActiveTemplate] = useState<BadgeTemplate>(DEMO_PRESETS[0].template);
  const [history, setHistory] = useState<BadgeData[]>([DEMO_PRESETS[0].badge]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Print Settings
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    format: '3.5x5.5',
    showBleed: false,
    showSafeMargin: true,
    showCropMarks: false,
    showPunchHoleZone: true,
    resolutionDpi: 300
  });

  const svgRef = useRef<SVGSVGElement>(null);

  // Keyboard shortcut listener for Command Bar (Cmd/Ctrl+K) and Undo/Redo (Cmd/Ctrl+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandBarOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (!e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else {
          e.preventDefault();
          handleRedo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const handleUpdateBadge = (updated: Partial<BadgeData>) => {
    setBadge((prev) => {
      const next = { ...prev, ...updated };
      // Push to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      return next;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setBadge(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setBadge(history[nextIdx]);
    }
  };

  const handleLoadPreset = (presetId: string) => {
    const found = DEMO_PRESETS.find((p) => p.id === presetId);
    if (found) {
      handleUpdateBadge({ ...found.badge });
      setActiveTemplate(found.template);
      setViewMode('studio');
    }
  };

  const handleReset = () => {
    handleUpdateBadge({ ...BLANK_BADGE_DATA });
  };

  const handleApplyAssistantData = (data: Partial<BadgeData>) => {
    handleUpdateBadge(data);
    setActiveTab('editor');
  };

  const handleSelectAttendeeFromBatch = (attendee: AttendeeRecord) => {
    handleUpdateBadge({
      participantName: attendee.participantName,
      role: attendee.role,
      idNumber: attendee.idNumber,
      companyOrCollege: attendee.companyOrCollege
    });
  };

  const handleBatchExportPdf = async (attendees: AttendeeRecord[]) => {
    if (!svgRef.current || attendees.length === 0) return;
    setIsBatchExporting(true);
    try {
      await exportBatchPdf(svgRef.current, attendees, badge.eventName);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Batch PDF generation failed:', err);
      alert('Failed to generate combined batch PDF pass sheet.');
    } finally {
      setIsBatchExporting(false);
    }
  };

  const handleQuickExport = (type: 'svg' | 'png' | 'pdf') => {
    if (!svgRef.current) return;
    const filename = `${(badge.eventName || 'BadgeForge').replace(/[^a-zA-Z0-9_-]/g, '_')}_${badge.participantName || 'Pass'}`;
    if (type === 'svg') exportBadgeAsSvg(svgRef.current, filename);
    else if (type === 'png') exportBadgeAsPng(svgRef.current, filename, 3);
    else if (type === 'pdf') exportBadgeAsPdf(svgRef.current, filename, badge.eventName, badge.participantName);
  };

  return (
    <div className="badgeforge-app">
      {/* Studio Header */}
      <Navbar
        onLoadPreset={handleLoadPreset}
        onReset={handleReset}
        activeTemplate={activeTemplate}
        badge={badge}
        onOpenCommandBar={() => setIsCommandBarOpen(true)}
        onToggleViewMode={() => setViewMode((m) => (m === 'landing' ? 'studio' : 'landing'))}
        isLandingView={viewMode === 'landing'}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Command Bar Overlay (Cmd/Ctrl+K) */}
      <CommandBar
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
        onParseBrief={(text) => {
          handleUpdateBadge({ eventName: text });
          setViewMode('studio');
          setActiveTab('assistant');
        }}
        onSelectTemplate={(t) => {
          setActiveTemplate(t);
          setViewMode('studio');
        }}
        onLoadPreset={(id) => handleLoadPreset(id)}
        onExport={handleQuickExport}
        onToggleSide={() => setActiveSide((s) => (s === 'front' ? 'back' : 'front'))}
        onToggleMockup={() => setIsMockupView((m) => !m)}
      />

      {/* View Mode Router: Showcase Landing Page vs Studio Workspace */}
      {viewMode === 'landing' ? (
        <LandingHero
          onStartWithPrompt={() => {
            setViewMode('studio');
            setActiveTab('assistant');
          }}
          onSelectPreset={(presetId) => handleLoadPreset(presetId)}
          onOpenBlankProject={() => {
            handleReset();
            setViewMode('studio');
            setActiveTab('editor');
          }}
          onOpenBatchImport={() => {
            setViewMode('studio');
            setActiveTab('batch');
          }}
          onEnterStudio={() => setViewMode('studio')}
        />
      ) : (
        /* Three-Pane Creative Studio */
        <main className="studio-three-pane-layout">
          {/* Left Rail: Assets & Navigation Dock */}
          <section className="studio-left-rail">
            <div className="studio-tabs-row">
              <button
                type="button"
                className={`studio-tab-btn ${activeTab === 'assistant' ? 'active' : ''}`}
                onClick={() => setActiveTab('assistant')}
                title="Natural Language Brief Inspector"
              >
                <span className="tab-icon">⚡</span>
                <span>1. Brief</span>
              </button>
              <button
                type="button"
                className={`studio-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
                onClick={() => setActiveTab('editor')}
                title="Credential Details & Photo"
              >
                <span className="tab-icon">✎</span>
                <span>2. Details</span>
              </button>
              <button
                type="button"
                className={`studio-tab-btn ${activeTab === 'brandkit' ? 'active' : ''}`}
                onClick={() => setActiveTab('brandkit')}
                title="Verified SVNIT & ACM Brand Kits"
              >
                <span className="tab-icon">◈</span>
                <span>3. Brand Kit</span>
              </button>
              <button
                type="button"
                className={`studio-tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
                onClick={() => setActiveTab('templates')}
                title="Badge Archetypes"
              >
                <span className="tab-icon">◫</span>
                <span>4. Archetypes</span>
              </button>
              <button
                type="button"
                className={`studio-tab-btn ${activeTab === 'batch' ? 'active' : ''}`}
                onClick={() => setActiveTab('batch')}
                title="CSV Multi-Attendee Batch Roster"
              >
                <span className="tab-icon">▤</span>
                <span>5. Batch CSV</span>
              </button>
            </div>

            <div className="studio-tab-content">
              {activeTab === 'assistant' && (
                <EventBriefAssistant currentBadge={badge} onApplyData={handleApplyAssistantData} />
              )}

              {activeTab === 'editor' && (
                <BadgeEditor badge={badge} onChange={handleUpdateBadge} roleColors={ROLE_COLORS} />
              )}

              {activeTab === 'brandkit' && (
                <BrandKitManager badge={badge} onChange={handleUpdateBadge} />
              )}

              {activeTab === 'templates' && (
                <TemplateSelector currentTemplate={activeTemplate} onSelect={(tpl) => setActiveTemplate(tpl)} />
              )}

              {activeTab === 'batch' && (
                <BatchAttendeeManager
                  currentBadge={badge}
                  onSelectAttendee={handleSelectAttendeeFromBatch}
                  onBatchExportPdf={handleBatchExportPdf}
                  isExportingBatch={isBatchExporting}
                />
              )}
            </div>

            {/* Production Export Panel */}
            <div className="studio-export-wrapper">
              <ExportPanel svgRef={svgRef} badge={badge} />
            </div>
          </section>

          {/* Center Stage: Interactive Live Canvas */}
          <section className="studio-center-stage">
            <BadgePreview
              badge={badge}
              template={activeTemplate}
              roleColors={ROLE_COLORS}
              svgRef={svgRef}
              printSettings={printSettings}
              activeSide={activeSide}
              onToggleSide={() => setActiveSide((s) => (s === 'front' ? 'back' : 'front'))}
              isMockupView={isMockupView}
              onToggleMockupView={() => setIsMockupView((m) => !m)}
            />
          </section>

          {/* Right Rail: Contextual Inspector */}
          <section className="studio-right-rail">
            <ContextualInspector
              badge={badge}
              onChange={handleUpdateBadge}
              roleColors={ROLE_COLORS}
              printSettings={printSettings}
              onUpdatePrintSettings={(st) => setPrintSettings((prev) => ({ ...prev, ...st }))}
              activeSide={activeSide}
              onToggleSide={() => setActiveSide((s) => (s === 'front' ? 'back' : 'front'))}
            />
          </section>
        </main>
      )}
    </div>
  );
};

export default App;
