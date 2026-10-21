import React from 'react';
import { BadgeData, BadgeTemplate } from '../types';
import { DEMO_PRESETS } from '../utils/demoPresets';
import { ModernTechTemplate } from './templates/ModernTechTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { SwissMinimalTemplate } from './templates/SwissMinimalTemplate';

interface LandingHeroProps {
  onStartWithPrompt: () => void;
  onSelectPreset: (presetId: string) => void;
  onOpenBlankProject: () => void;
  onOpenBatchImport: () => void;
  onEnterStudio: () => void;
}

const SHOWCASE_BADGES: Array<{ badge: BadgeData; roleColor: string; template: BadgeTemplate; label: string }> = [
  {
    badge: DEMO_PRESETS[0].badge,
    roleColor: '#0284c7',
    template: 'modern-tech',
    label: 'Hackathon Pass · Modern Tech'
  },
  {
    badge: DEMO_PRESETS[1].badge,
    roleColor: '#059669',
    template: 'corporate',
    label: 'Keynote Speaker · Corporate'
  },
  {
    badge: {
      ...DEMO_PRESETS[2].badge,
      eventName: 'RESEARCH SYMPOSIUM 2026',
      tagline: 'Annual Doctoral & Faculty Conclave',
      participantName: 'Dr. Elena Vance',
      role: 'Mentor',
      idNumber: 'SYM-CHAIR-01'
    },
    roleColor: '#ea580c',
    template: 'swiss-minimal',
    label: 'Research Conclave · Swiss Minimal'
  }
];

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartWithPrompt,
  onSelectPreset,
  onOpenBlankProject,
  onOpenBatchImport,
  onEnterStudio
}) => {
  return (
    <div className="landing-page-container">
      {/* Editorial Navigation Header */}
      <header className="landing-nav">
        <div className="brand-logo-container">
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
            <span className="brand-title">BadgeForge AI</span>
            <span className="brand-subtitle">EDITORIAL IDENTITY STUDIO · SVNIT ACM</span>
          </div>
        </div>

        <div className="landing-nav-actions">
          <button type="button" onClick={() => onSelectPreset('svnit-inception')} className="btn-nav-preset">
            Browse Presets
          </button>
          <button type="button" onClick={onEnterStudio} className="btn-nav-studio">
            Enter Studio →
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-text-block">
          <span className="hero-eyebrow">PROFESSIONAL CREDENTIAL & PRINT STUDIO</span>
          <h1 className="hero-headline">Identity for the next wave of events</h1>
          <p className="hero-supporting">
            Design conference-grade credentials, from natural language brief to physical print. Built with vector
            precision, verified SVNIT and ACM chapter assets, and high-volume batch production.
          </p>

          <div className="hero-cta-group">
            <button type="button" onClick={onStartWithPrompt} className="btn-hero-primary">
              <span className="btn-icon">⚡</span>
              Start with a Prompt
            </button>
            <button type="button" onClick={() => onSelectPreset('svnit-inception')} className="btn-hero-secondary">
              Browse Presets
            </button>
          </div>

          <div className="hero-standards-strip">
            <span className="standard-item">✓ 300 DPI Print PDF</span>
            <span className="standard-item">✓ Sharp Vector SVG</span>
            <span className="standard-item">✓ Official SVNIT & ACM Insignia</span>
            <span className="standard-item">✓ CSV Batch Production</span>
          </div>
        </div>

        {/* Hero Badge Showcase: Clean Artwork with Realistic Shadow */}
        <div className="hero-badge-showcase">
          <div className="showcase-cards-fan">
            {SHOWCASE_BADGES.map((item, index) => (
              <div
                key={index}
                className={`showcase-badge-card card-pos-${index}`}
                onClick={onEnterStudio}
                title="Click to open this credential in the studio"
              >
                {/* SVG Card with realistic shadow */}
                <div className="showcase-card-inner">
                  <svg viewBox="0 0 450 700" className="showcase-badge-svg">
                    {item.template === 'corporate' && (
                      <CorporateTemplate badge={item.badge} roleColor={item.roleColor} />
                    )}
                    {item.template === 'swiss-minimal' && (
                      <SwissMinimalTemplate badge={item.badge} roleColor={item.roleColor} />
                    )}
                    {item.template === 'modern-tech' && (
                      <ModernTechTemplate badge={item.badge} roleColor={item.roleColor} />
                    )}
                  </svg>
                </div>
                <span className="showcase-card-caption">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Starting Points Grid */}
      <section className="starting-points-section">
        <div className="section-heading-row">
          <div>
            <span className="section-label">CURATED ENTRY POINTS</span>
            <h2 className="section-title">Select a credential architecture to begin</h2>
          </div>
          <span className="section-meta">All templates are fully customizable</span>
        </div>

        <div className="starting-points-grid">
          {/* Hackathon Pass */}
          <div className="point-card" onClick={() => onSelectPreset('svnit-inception')}>
            <div className="point-icon">⚡</div>
            <h3 className="point-title">Hackathon Pass</h3>
            <p className="point-desc">
              Technical conference accreditation with portrait photo frame, QR check-in, and department routing.
            </p>
            <span className="point-link">Launch Inception 2026 →</span>
          </div>

          {/* Tech Summit */}
          <div className="point-card" onClick={() => onSelectPreset('national-tech-summit')}>
            <div className="point-icon">🏛</div>
            <h3 className="point-title">Tech Summit</h3>
            <p className="point-desc">
              Formal corporate conference layout with clear attendee hierarchy, barcode security strip, and inset framing.
            </p>
            <span className="point-link">Launch Quantum Forward →</span>
          </div>

          {/* College Fest */}
          <div className="point-card" onClick={() => onSelectPreset('creative-design-sprint')}>
            <div className="point-icon">✦</div>
            <h3 className="point-title">College Fest & Sprint</h3>
            <p className="point-desc">
              Architectural asymmetric composition with high-contrast typography and full-width credential panels.
            </p>
            <span className="point-link">Launch DesignForge 2026 →</span>
          </div>

          {/* Research Symposium */}
          <div
            className="point-card"
            onClick={() => {
              onSelectPreset('national-tech-summit');
            }}
          >
            <div className="point-icon">◫</div>
            <h3 className="point-title">Research Symposium</h3>
            <p className="point-desc">
              Swiss minimalist asymmetric layout with generous whitespace, crisp metadata, and balanced institutional marks.
            </p>
            <span className="point-link">Launch Symposium Pass →</span>
          </div>

          {/* Batch Import CSV */}
          <div className="point-card point-card-highlight" onClick={onOpenBatchImport}>
            <div className="point-icon">▤</div>
            <h3 className="point-title">Import CSV / JSON Roster</h3>
            <p className="point-desc">
              Import a multi-attendee roster to validate names, IDs, and export combined multi-badge print sheets.
            </p>
            <span className="point-link">Open Batch Manager →</span>
          </div>

          {/* Blank Project */}
          <div className="point-card" onClick={onOpenBlankProject}>
            <div className="point-icon">＋</div>
            <h3 className="point-title">Blank Canvas</h3>
            <p className="point-desc">
              Start with empty fields to build a bespoke event pass from the ground up.
            </p>
            <span className="point-link">Start Blank Project →</span>
          </div>
        </div>
      </section>

      {/* Editorial Design Systems Statement */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-col">
            <span className="footer-brand">BadgeForge AI Studio</span>
            <p className="footer-text">
              Engineered for academic conferences, national hackathons, and institutional credentials. Preserving
              verified SVNIT Surat and ACM NIT Surat chapter assets.
            </p>
          </div>
          <div className="footer-col">
            <span className="footer-heading">STANDARDS & GUIDELINES</span>
            <span className="footer-link">ACM Visual Identity Guide (Pantone Process Blue C)</span>
            <span className="footer-link">SVNIT Institutional Insignia Protocols</span>
            <span className="footer-link">ISO/IEC Event Credential Sizing (3.5" × 5.5" · 300 DPI)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
