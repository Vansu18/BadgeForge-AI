import React, { useState } from 'react';
import { BadgeData, BadgeRole, BadgeTemplate, PrintSettings } from '../types';
import { ModernTechTemplate } from './templates/ModernTechTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { SwissMinimalTemplate } from './templates/SwissMinimalTemplate';
import { HighSecurityTemplate } from './templates/HighSecurityTemplate';
import { BadgeBackSide } from './templates/BadgeBackSide';

interface BadgePreviewProps {
  badge: BadgeData;
  template: BadgeTemplate;
  roleColors: Record<BadgeRole, string>;
  svgRef: React.RefObject<SVGSVGElement>;
  printSettings: PrintSettings;
  activeSide: 'front' | 'back';
  onToggleSide: () => void;
  isMockupView: boolean;
  onToggleMockupView: () => void;
}

export const BadgePreview: React.FC<BadgePreviewProps> = ({
  badge,
  template,
  roleColors,
  svgRef,
  printSettings,
  activeSide,
  onToggleSide,
  isMockupView,
  onToggleMockupView
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const roleColor = roleColors[badge.role] || '#0284c7';

  const renderTemplateContent = () => {
    if (activeSide === 'back') {
      return <BadgeBackSide badge={badge} roleColor={roleColor} />;
    }

    switch (template) {
      case 'corporate':
        return <CorporateTemplate badge={badge} roleColor={roleColor} />;
      case 'creative':
        return <CreativeTemplate badge={badge} roleColor={roleColor} />;
      case 'swiss-minimal':
        return <SwissMinimalTemplate badge={badge} roleColor={roleColor} />;
      case 'high-security':
        return <HighSecurityTemplate badge={badge} roleColor={roleColor} />;
      case 'modern-tech':
      default:
        return <ModernTechTemplate badge={badge} roleColor={roleColor} />;
    }
  };

  return (
    <div className="preview-container">
      {/* Studio Preview Controls Bar */}
      <div className="preview-toolbar">
        <div className="toolbar-left">
          <span className="live-dot">●</span>
          <span className="toolbar-title">
            {isMockupView ? 'Physical Mockup' : 'Flat Print Artboard'}
          </span>
          <span className="badge-ratio-tag">90 × 140 mm · 300 DPI</span>
        </div>

        <div className="toolbar-right">
          {/* Flip Front / Back Button */}
          <button
            type="button"
            onClick={onToggleSide}
            className="tool-toggle-btn active-side-btn"
            title="Flip to view front or back side of badge"
          >
            Artboard: <strong>{activeSide === 'front' ? 'Front Side' : 'Back Side'}</strong> ⇄
          </button>

          {/* Toggle Physical Mockup vs Flat Artboard */}
          <button
            type="button"
            onClick={onToggleMockupView}
            className={`tool-toggle-btn ${isMockupView ? 'active' : ''}`}
            title="Switch between physical 3D badge mockup and production flat print artboard"
          >
            {isMockupView ? 'Mockup: ON' : 'Flat Print: ON'}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="preview-stage">
        {/* Restrained Hardware Mockup Clip (Does NOT obscure any badge text or logos) */}
        {isMockupView && (
          <div className="physical-lanyard-overlay" aria-hidden="true">
            <svg
              width="44"
              height="32"
              viewBox="0 0 44 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="lanyard-hardware-svg"
            >
              {/* Dark Woven Ribbon Strap */}
              <rect x="12" y="0" width="20" height="16" fill="#141416" />
              <line x1="14" y1="0" x2="14" y2="16" stroke={roleColor} strokeWidth="1.5" strokeOpacity="0.9" />
              <line x1="30" y1="0" x2="30" y2="16" stroke={roleColor} strokeWidth="1.5" strokeOpacity="0.9" />

              {/* Brushed Steel Ferrule Clamp */}
              <rect x="10" y="15" width="24" height="6" rx="1.5" fill="#a1a1aa" />
              <line x1="10" y1="18" x2="34" y2="18" stroke="#3f3f46" strokeWidth="0.75" />

              {/* Steel Clip Hook entering strictly inside punch slot (terminates at y=15) */}
              <path d="M19 21 H25 V28 C25 30, 19 30, 19 28 Z" fill="#71717a" stroke="#d4d4d8" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* Scaled SVG Canvas Container */}
        <div
          className={`svg-scale-wrapper ${isMockupView ? 'mockup-view-mode' : 'flat-print-view-mode'}`}
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center'
          }}
        >
          <div className="badge-card-shadow-box">
            <svg
              ref={svgRef}
              viewBox="0 0 450 700"
              width="450"
              height="700"
              className="live-badge-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              {renderTemplateContent()}

              {/* Print Guides Overlay (Active strictly in flat print mode when toggled) */}
              {!isMockupView && (
                <g id="print-guides-overlay" pointerEvents="none">
                  {/* Bleed Guide */}
                  {printSettings.showBleed && (
                    <rect
                      x="0"
                      y="0"
                      width="450"
                      height="700"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  )}

                  {/* Safe Margin Guide (Inset 18px) */}
                  {printSettings.showSafeMargin && (
                    <rect
                      x="18"
                      y="18"
                      width="414"
                      height="664"
                      rx="10"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Punch Hole Exclusion Zone */}
                  {printSettings.showPunchHoleZone && (
                    <g opacity="0.6">
                      <rect x="175" y="6" width="100" height="26" rx="4" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="0.75" />
                      <text x="225" y="22" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fca5a5" fontFamily="'JetBrains Mono', monospace">
                        HOLE EXCLUSION ZONE
                      </text>
                    </g>
                  )}

                  {/* Crop marks in corners */}
                  {printSettings.showCropMarks && (
                    <g stroke="#94a3b8" strokeWidth="1">
                      <line x1="0" y1="20" x2="12" y2="20" />
                      <line x1="20" y1="0" x2="20" y2="12" />
                      <line x1="438" y1="20" x2="450" y2="20" />
                      <line x1="430" y1="0" x2="430" y2="12" />
                      <line x1="0" y1="680" x2="12" y2="680" />
                      <line x1="20" y1="688" x2="20" y2="700" />
                      <line x1="438" y1="680" x2="450" y2="680" />
                      <line x1="430" y1="688" x2="430" y2="700" />
                    </g>
                  )}
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Floating Zoom Dock in Bottom-Right of Stage */}
        <div className="stage-zoom-dock">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.5, parseFloat((z - 0.1).toFixed(2))))}
            className="zoom-btn"
            title="Zoom out"
          >
            −
          </button>
          <span className="zoom-indicator">{Math.round(zoomLevel * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.4, parseFloat((z + 0.1).toFixed(2))))}
            className="zoom-btn"
            title="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(0.85)}
            className="zoom-reset-btn"
            title="Fit to Screen"
          >
            Fit
          </button>
        </div>
      </div>
    </div>
  );
};
