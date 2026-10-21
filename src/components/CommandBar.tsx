import React, { useState, useEffect } from 'react';
import { BadgeTemplate } from '../types';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onParseBrief: (text: string) => void;
  onSelectTemplate: (t: BadgeTemplate) => void;
  onLoadPreset: (id: string) => void;
  onExport: (type: 'svg' | 'png' | 'pdf') => void;
  onToggleSide: () => void;
  onToggleMockup: () => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  isOpen,
  onClose,
  onParseBrief,
  onSelectTemplate,
  onLoadPreset,
  onExport,
  onToggleSide,
  onToggleMockup
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExecuteBrief = () => {
    if (query.trim()) {
      onParseBrief(query.trim());
      onClose();
    }
  };

  return (
    <div className="command-bar-overlay" onClick={onClose}>
      <div className="command-bar-modal" onClick={(e) => e.stopPropagation()}>
        <div className="command-input-row">
          <span className="command-search-icon">⌘</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecuteBrief();
            }}
            placeholder="Type a natural language brief, action, or template (e.g. 'Modern Tech', 'SVNIT Hackathon')..."
            className="command-search-input"
          />
          <button type="button" onClick={onClose} className="btn-close-command">
            ESC
          </button>
        </div>

        {/* Quick Suggestions / Commands */}
        <div className="command-results-list">
          {query.trim().length > 3 && (
            <div className="command-group">
              <span className="command-group-title">Natural Language Prompt Action</span>
              <button type="button" onClick={handleExecuteBrief} className="command-item-btn highlight-item">
                <span className="item-icon">⚡</span>
                <div className="item-text">
                  <strong>Inspect as Event Brief:</strong> "{query}"
                </div>
                <span className="item-badge">Press Enter ↵</span>
              </button>
            </div>
          )}

          <div className="command-group">
            <span className="command-group-title">Templates & Archetypes</span>
            <button
              type="button"
              onClick={() => {
                onSelectTemplate('modern-tech');
                onClose();
              }}
              className="command-item-btn"
            >
              <span className="item-icon">1</span>
              <span>Modern Tech (Minimal & Technical)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTemplate('corporate');
                onClose();
              }}
              className="command-item-btn"
            >
              <span className="item-icon">2</span>
              <span>Corporate (Formal & Institutional)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTemplate('creative');
                onClose();
              }}
              className="command-item-btn"
            >
              <span className="item-icon">3</span>
              <span>Creative (Architectural Color-Block)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTemplate('swiss-minimal');
                onClose();
              }}
              className="command-item-btn"
            >
              <span className="item-icon">4</span>
              <span>Swiss Minimalist (Asymmetric Grid)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectTemplate('high-security');
                onClose();
              }}
              className="command-item-btn"
            >
              <span className="item-icon">5</span>
              <span>High-Security Credential (Zone Clearances)</span>
            </button>
          </div>

          <div className="command-group">
            <span className="command-group-title">Workspace View & Actions</span>
            <button
              type="button"
              onClick={() => {
                onToggleSide();
                onClose();
              }}
              className="command-item-btn"
            >
              <span className="item-icon">⇄</span>
              <span>Flip Badge: Toggle Front / Back Artwork</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleMockup();
                onClose();
              }}
              className="command-item-btn"
            >
              <span className="item-icon">◈</span>
              <span>Toggle Physical Lanyard Presentation vs Flat Print</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onLoadPreset('svnit-inception');
                onClose();
              }}
              className="command-item-btn"
            >
              <span className="item-icon">✦</span>
              <span>Load Preset: SVNIT Inception Hackathon</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onExport('pdf');
                onClose();
              }}
              className="command-item-btn"
            >
              <span className="item-icon">⤓</span>
              <span>Production Export: Print-Ready PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
