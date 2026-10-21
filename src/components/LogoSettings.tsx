import React, { useRef } from 'react';
import { BadgeData } from '../types';
import { DEFAULT_SVNIT_LOGO_URL, DEFAULT_ACM_LOGO_URL } from '../assets/logos';

interface LogoSettingsProps {
  badge: BadgeData;
  onChange: (updated: Partial<BadgeData>) => void;
}

export const LogoSettings: React.FC<LogoSettingsProps> = ({ badge, onChange }) => {
  const svnitInputRef = useRef<HTMLInputElement>(null);
  const acmInputRef = useRef<HTMLInputElement>(null);

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

  const currentSvnitImg = badge.customSvnitLogoUrl || DEFAULT_SVNIT_LOGO_URL;
  const currentAcmImg = badge.customAcmLogoUrl || DEFAULT_ACM_LOGO_URL;

  return (
    <div className="logo-settings-component">
      <div className="widget-header">
        <label className="section-subheading">Institutional Logo Slots</label>
        <span className="branding-note">Official SVNIT & ACM Marks</span>
      </div>

      <div className="logo-slots-grid">
        {/* SVNIT Official Slot */}
        <div className="logo-slot-card">
          <div className="slot-title-row">
            <div className="slot-title-with-thumb">
              <div className="logo-thumb-wrapper">
                <img src={currentSvnitImg} alt="SVNIT Official Logo" className="logo-thumb-img" />
              </div>
              <div>
                <span className="slot-name">SVNIT Surat</span>
                <span className="slot-badge-tag">
                  {badge.customSvnitLogoUrl ? 'Custom File' : 'Official Crest'}
                </span>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={badge.showSvnitLogo}
                onChange={(e) => onChange({ showSvnitLogo: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <p className="slot-description">
            Sardar Vallabhbhai National Institute of Technology official institutional crest.
          </p>

          <div className="slot-actions">
            <input
              type="file"
              ref={svnitInputRef}
              onChange={handleSvnitUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="slot-btn"
              onClick={() => svnitInputRef.current?.click()}
            >
              Upload Replacement
            </button>
            {badge.customSvnitLogoUrl && (
              <button
                type="button"
                className="slot-btn-clear"
                onClick={() => onChange({ customSvnitLogoUrl: null })}
              >
                Reset to Official Crest
              </button>
            )}
          </div>
        </div>

        {/* ACM Official Slot */}
        <div className="logo-slot-card">
          <div className="slot-title-row">
            <div className="slot-title-with-thumb">
              <div className="logo-thumb-wrapper">
                <img src={currentAcmImg} alt="ACM NIT Surat Logo" className="logo-thumb-img" />
              </div>
              <div>
                <span className="slot-name">ACM NIT Surat</span>
                <span className="slot-badge-tag">
                  {badge.customAcmLogoUrl ? 'Custom File' : 'Official Chapter'}
                </span>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={badge.showAcmLogo}
                onChange={(e) => onChange({ showAcmLogo: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <p className="slot-description">
            Association for Computing Machinery student chapter emblem for NIT Surat.
          </p>

          <div className="slot-actions">
            <input
              type="file"
              ref={acmInputRef}
              onChange={handleAcmUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="slot-btn"
              onClick={() => acmInputRef.current?.click()}
            >
              Upload Replacement
            </button>
            {badge.customAcmLogoUrl && (
              <button
                type="button"
                className="slot-btn-clear"
                onClick={() => onChange({ customAcmLogoUrl: null })}
              >
                Reset to Official Emblem
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
