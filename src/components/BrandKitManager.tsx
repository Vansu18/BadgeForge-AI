import React, { useRef } from 'react';
import { BadgeData } from '../types';
import { DEFAULT_SVNIT_LOGO_URL, DEFAULT_ACM_LOGO_URL } from '../assets/logos';

interface BrandKitManagerProps {
  badge: BadgeData;
  onChange: (updated: Partial<BadgeData>) => void;
}

export const BrandKitManager: React.FC<BrandKitManagerProps> = ({ badge, onChange }) => {
  const svnitInputRef = useRef<HTMLInputElement>(null);
  const acmInputRef = useRef<HTMLInputElement>(null);

  const handleApplySvnitKit = () => {
    onChange({
      companyOrCollege: 'SVNIT Surat · Dept of CSE',
      venue: 'SVNIT Campus, Surat, Gujarat',
      showSvnitLogo: true,
      customSvnitLogoUrl: null, // Reset to official SVNIT.jpg
      accentColor: '#002147'
    });
  };

  const handleApplyAcmKit = () => {
    onChange({
      companyOrCollege: 'SVNIT ACM Student Chapter',
      showAcmLogo: true,
      customAcmLogoUrl: null, // Reset to official ACM.jpg
      accentColor: '#0284c7'
    });
  };

  const handleApplyDualKit = () => {
    onChange({
      companyOrCollege: 'SVNIT ACM Student Chapter · NIT Surat',
      venue: 'SVNIT Campus, Surat, Gujarat',
      showSvnitLogo: true,
      showAcmLogo: true,
      customSvnitLogoUrl: null,
      customAcmLogoUrl: null,
      accentColor: '#0284c7'
    });
  };

  const handleSvnitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange({ customSvnitLogoUrl: event.target?.result as string, showSvnitLogo: true });
    };
    reader.readAsDataURL(file);
  };

  const handleAcmUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange({ customAcmLogoUrl: event.target?.result as string, showAcmLogo: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="brand-kit-panel">
      <div className="widget-header">
        <div>
          <label className="section-subheading">Verified Brand Kits</label>
          <span className="branding-note">Authentic Institutional Assets & Sourced Palettes</span>
        </div>
      </div>

      <p className="batch-intro">
        Select verified institutional branding or upload custom chapter graphics. Colors are sourced from official
        heraldic identity guides and Pantone specifications.
      </p>

      {/* Quick Brand Kit Presets */}
      <div className="brand-kits-grid">
        {/* SVNIT Official Kit */}
        <div className="brand-kit-card">
          <div className="brand-kit-header">
            <div className="brand-kit-avatar">
              <img src={badge.customSvnitLogoUrl || DEFAULT_SVNIT_LOGO_URL} alt="SVNIT Official Crest" />
            </div>
            <div className="brand-kit-info">
              <span className="brand-kit-name">SVNIT Surat</span>
              <span className="brand-kit-meta">NIT Surat Official Institutional Crest</span>
            </div>
          </div>

          <div className="color-palette-strip">
            <span className="palette-chip" style={{ backgroundColor: '#002147' }} title="SVNIT Navy #002147 (Heraldic Frame)" />
            <span className="palette-chip" style={{ backgroundColor: '#b91c1c' }} title="Crest Maroon #B91C1C (Engineering Flame)" />
            <span className="palette-chip" style={{ backgroundColor: '#d97706' }} title="Gold Accent #D97706 (Seal Highlight)" />
            <span className="palette-chip" style={{ backgroundColor: '#ffffff' }} title="Pure White #FFFFFF (Field Contrast)" />
          </div>

          <div className="brand-kit-actions">
            <button type="button" onClick={handleApplySvnitKit} className="btn-brand-kit-apply">
              Apply SVNIT Identity
            </button>
            <input type="file" ref={svnitInputRef} onChange={handleSvnitUpload} accept="image/*" style={{ display: 'none' }} />
            <button type="button" onClick={() => svnitInputRef.current?.click()} className="btn-brand-kit-upload">
              {badge.customSvnitLogoUrl ? 'Replace' : 'Upload SVG/PNG'}
            </button>
            {badge.customSvnitLogoUrl && (
              <button type="button" onClick={() => onChange({ customSvnitLogoUrl: null })} className="btn-brand-kit-reset">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ACM Chapter Kit */}
        <div className="brand-kit-card">
          <div className="brand-kit-header">
            <div className="brand-kit-avatar">
              <img src={badge.customAcmLogoUrl || DEFAULT_ACM_LOGO_URL} alt="ACM Official Emblem" />
            </div>
            <div className="brand-kit-info">
              <span className="brand-kit-name">ACM NIT Surat</span>
              <span className="brand-kit-meta">ACM Student Chapter Brand Standards</span>
            </div>
          </div>

          <div className="color-palette-strip">
            <span className="palette-chip" style={{ backgroundColor: '#0085CA' }} title="Pantone Process Blue C (#0085CA)" />
            <span className="palette-chip" style={{ backgroundColor: '#0284c7' }} title="Digital Process Cyan (#0284c7)" />
            <span className="palette-chip" style={{ backgroundColor: '#0f172a' }} title="Chapter Obsidian (#0F172A)" />
            <span className="palette-chip" style={{ backgroundColor: '#ffffff' }} title="Reverse White (#FFFFFF)" />
          </div>

          <div className="brand-kit-actions">
            <button type="button" onClick={handleApplyAcmKit} className="btn-brand-kit-apply">
              Apply ACM Identity
            </button>
            <input type="file" ref={acmInputRef} onChange={handleAcmUpload} accept="image/*" style={{ display: 'none' }} />
            <button type="button" onClick={() => acmInputRef.current?.click()} className="btn-brand-kit-upload">
              {badge.customAcmLogoUrl ? 'Replace' : 'Upload SVG/PNG'}
            </button>
            {badge.customAcmLogoUrl && (
              <button type="button" onClick={() => onChange({ customAcmLogoUrl: null })} className="btn-brand-kit-reset">
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dual Institute + ACM Chapter Action */}
      <div className="dual-kit-banner">
        <div>
          <span className="dual-kit-title">Co-Sponsored: SVNIT Surat & ACM Student Chapter</span>
          <span className="dual-kit-desc">Sets both official marks with balanced safe-margins on badge header.</span>
        </div>
        <button type="button" onClick={handleApplyDualKit} className="btn-dual-kit-apply">
          Apply Co-Sponsored Kit
        </button>
      </div>

      {/* Logo Slot Visibility Toggles */}
      <div className="logo-visibility-toggles">
        <label className="toggle-row">
          <span>Show SVNIT Logo Slot</span>
          <input
            type="checkbox"
            checked={badge.showSvnitLogo}
            onChange={(e) => onChange({ showSvnitLogo: e.target.checked })}
          />
        </label>
        <label className="toggle-row">
          <span>Show ACM Logo Slot</span>
          <input
            type="checkbox"
            checked={badge.showAcmLogo}
            onChange={(e) => onChange({ showAcmLogo: e.target.checked })}
          />
        </label>
      </div>
    </div>
  );
};
