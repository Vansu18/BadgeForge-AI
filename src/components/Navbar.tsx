import React from 'react';
import { DEMO_PRESETS } from '../utils/demoPresets';
import { BadgeData, BadgeTemplate } from '../types';

interface NavbarProps {
  onLoadPreset: (presetId: string) => void;
  onReset: () => void;
  activeTemplate: BadgeTemplate;
  badge: BadgeData;
  onOpenCommandBar: () => void;
  onToggleViewMode: () => void;
  isLandingView: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadPreset,
  onReset,
  onOpenCommandBar,
  onToggleViewMode,
  isLandingView,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  return (
    <header className="studio-navbar">
      <div className="navbar-left">
        <div className="brand-logo-container" onClick={onToggleViewMode} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 6V12C4 17.5 7.5 22.5 12 24C16.5 22.5 20 17.5 20 12V6L12 2Z"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <path d="M12 7V17M7 12H17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="brand-titles">
            <h1 className="brand-title">
              BadgeForge <span className="brand-highlight">AI</span>
            </h1>
            <span className="brand-subtitle">EDITORIAL IDENTITY STUDIO · SVNIT ACM</span>
          </div>
        </div>

        {/* View Mode Switcher: Showcase vs Studio */}
        <button
          type="button"
          onClick={onToggleViewMode}
          className="btn-view-mode-toggle"
          title="Switch between Showcase Landing and Studio Workspace"
        >
          {isLandingView ? 'Switch to Studio Mode →' : '← Back to Showcase'}
        </button>
      </div>

      <div className="navbar-center">
        {/* Command Bar Trigger Button with visible shortcut hint */}
        <button
          type="button"
          onClick={onOpenCommandBar}
          className="btn-command-trigger"
          title="Open Command Bar (Ctrl+K or ⌘K)"
        >
          <span className="cmd-text">Type event brief or search actions...</span>
          <span className="cmd-icon">⌘K</span>
        </button>

        {/* Undo / Redo controls */}
        {onUndo && onRedo && (
          <div className="undo-redo-group">
            <button
              type="button"
              disabled={!canUndo}
              onClick={onUndo}
              className="btn-history"
              title="Undo (Ctrl+Z)"
            >
              ↩
            </button>
            <button
              type="button"
              disabled={!canRedo}
              onClick={onRedo}
              className="btn-history"
              title="Redo (Ctrl+Y)"
            >
              ↪
            </button>
          </div>
        )}
      </div>

      <div className="navbar-right">
        {/* Single Presets ▾ dropdown replacing individual buttons */}
        <div className="preset-selector-group">
          <select
            id="preset-select"
            className="preset-select-dropdown"
            onChange={(e) => {
              if (e.target.value) {
                onLoadPreset(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            aria-label="Presets dropdown"
          >
            <option value="" disabled>Presets ▾</option>
            {DEMO_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name.replace('[Demo Data] ', '')}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onReset}
            className="btn-canvas-reset"
            title="Clear all fields to blank canvas"
          >
            Clear
          </button>
        </div>
      </div>
    </header>
  );
};
