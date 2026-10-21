import React from 'react';
import { BadgeData, BadgeRole, PrintSettings } from '../types';

interface ContextualInspectorProps {
  badge: BadgeData;
  onChange: (updated: Partial<BadgeData>) => void;
  roleColors: Record<BadgeRole, string>;
  printSettings: PrintSettings;
  onUpdatePrintSettings: (settings: Partial<PrintSettings>) => void;
  activeSide: 'front' | 'back';
  onToggleSide: () => void;
}

const ROLES: Array<{ role: BadgeRole; label: string; desc: string }> = [
  { role: 'Participant', label: 'Participant', desc: 'Standard delegate pass' },
  { role: 'Organizer', label: 'Organizer', desc: 'Executive / Core team clearance' },
  { role: 'Mentor', label: 'Mentor', desc: 'Jury & speaker access' },
  { role: 'Volunteer', label: 'Volunteer', desc: 'Crew & operations access' }
];

export const ContextualInspector: React.FC<ContextualInspectorProps> = ({
  badge,
  onChange,
  roleColors,
  printSettings,
  onUpdatePrintSettings,
  activeSide,
  onToggleSide
}) => {
  const isNameLong = badge.participantName.length > 22;

  return (
    <div className="contextual-inspector-panel">
      {/* Side Switcher at Top */}
      <div className="inspector-card-side-toggle">
        <span className="side-label">Active Artboard:</span>
        <div className="side-segmented-group">
          <button
            type="button"
            className={`side-btn ${activeSide === 'front' ? 'active' : ''}`}
            onClick={() => activeSide !== 'front' && onToggleSide()}
          >
            Front Side (Identity)
          </button>
          <button
            type="button"
            className={`side-btn ${activeSide === 'back' ? 'active' : ''}`}
            onClick={() => activeSide !== 'back' && onToggleSide()}
          >
            Back Side (Guide & Security)
          </button>
        </div>
      </div>

      {activeSide === 'front' ? (
        <>
          {/* Section 1: Role & Access Level */}
          <div className="inspector-group">
            <div className="inspector-group-header">
              <label className="section-subheading">Event Role & Access Level</label>
              <span className="color-swatch-tag" style={{ color: roleColors[badge.role] }}>
                ● {badge.role}
              </span>
            </div>

            <div className="role-selector-grid">
              {ROLES.map(({ role, label }) => {
                const isSelected = badge.role === role;
                const color = roleColors[role];
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onChange({ role })}
                    className={`role-btn ${isSelected ? 'selected' : ''}`}
                    style={{
                      borderColor: isSelected ? color : 'var(--border-subtle)',
                      backgroundColor: isSelected ? '#162238' : undefined
                    }}
                  >
                    <span className="role-bullet" style={{ backgroundColor: color }} />
                    <span className="role-btn-label" style={{ color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Credential Typography & Content */}
          <div className="inspector-group">
            <div className="inspector-group-header">
              <label className="section-subheading">Attendee & Event Credentials</label>
              <span className="char-count-meta">{badge.participantName.length} chars</span>
            </div>

            {isNameLong && (
              <div className="validation-warning-banner">
                <span className="warn-icon">ℹ</span>
                <span>
                  <strong>Long Name ({badge.participantName.length} chars):</strong> Dynamic SVG typography scaling is
                  active to guarantee zero text clipping.
                </span>
              </div>
            )}

            <div className="form-fields-grid">
              <div className="form-group full-width">
                <label className="field-label">
                  Participant Full Name <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  value={badge.participantName}
                  onChange={(e) => onChange({ participantName: e.target.value })}
                  placeholder="e.g. Dr. Elena Vance"
                  className={`studio-input ${!badge.participantName.trim() ? 'field-missing' : ''}`}
                />
              </div>

              <div className="form-group full-width">
                <label className="field-label">
                  Event Name <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  value={badge.eventName}
                  onChange={(e) => onChange({ eventName: e.target.value })}
                  placeholder="e.g. INCEPTION 2026"
                  className={`studio-input ${!badge.eventName.trim() ? 'field-missing' : ''}`}
                />
              </div>

              <div className="form-group">
                <label className="field-label">Badge / ID Number <span className="req-star">*</span></label>
                <input
                  type="text"
                  value={badge.idNumber}
                  onChange={(e) => onChange({ idNumber: e.target.value })}
                  placeholder="e.g. ACM-SVNIT-4092"
                  className="studio-input"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Event Dates <span className="req-star">*</span></label>
                <input
                  type="text"
                  value={badge.date}
                  onChange={(e) => onChange({ date: e.target.value })}
                  placeholder="e.g. OCT 24 - 26, 2026"
                  className="studio-input"
                />
              </div>

              <div className="form-group full-width">
                <label className="field-label">Sanctioned Venue <span className="req-star">*</span></label>
                <input
                  type="text"
                  value={badge.venue}
                  onChange={(e) => onChange({ venue: e.target.value })}
                  placeholder="e.g. SVNIT Campus, Surat"
                  className="studio-input"
                />
              </div>

              <div className="form-group full-width">
                <label className="field-label">Affiliation / Department</label>
                <input
                  type="text"
                  value={badge.companyOrCollege}
                  onChange={(e) => onChange({ companyOrCollege: e.target.value })}
                  placeholder="e.g. SVNIT Surat · Dept of CSE"
                  className="studio-input"
                />
              </div>

              <div className="form-group full-width">
                <label className="field-label">Sub-Tagline / Descriptor</label>
                <input
                  type="text"
                  value={badge.tagline}
                  onChange={(e) => onChange({ tagline: e.target.value })}
                  placeholder="e.g. Annual Flagship National Conclave"
                  className="studio-input"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Back Side Credentials Editor */
        <div className="inspector-group">
          <div className="inspector-group-header">
            <label className="section-subheading">Back-Side Guide & Connectivity</label>
            <span className="branding-note">Optional Details</span>
          </div>

          <p className="inspector-note-text">
            Sections will only be rendered on the back side if provided. Leave blank to omit.
          </p>

          <div className="form-fields-grid">
            <div className="form-group">
              <label className="field-label">WiFi Network (SSID)</label>
              <input
                type="text"
                value={badge.wifiNetwork ?? ''}
                placeholder="Leave blank to omit"
                onChange={(e) => onChange({ wifiNetwork: e.target.value })}
                className="studio-input"
              />
            </div>

            <div className="form-group">
              <label className="field-label">WiFi Password</label>
              <input
                type="text"
                value={badge.wifiPassword ?? ''}
                placeholder="Leave blank to omit"
                onChange={(e) => onChange({ wifiPassword: e.target.value })}
                className="studio-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="field-label">Emergency Helpline / Desk</label>
              <input
                type="text"
                value={badge.emergencyContact ?? ''}
                placeholder="Optional helpline (e.g. +91 261 220 1500)"
                onChange={(e) => onChange({ emergencyContact: e.target.value })}
                className="studio-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Accordion for Print Production & Safe Guides */}
      <details className="print-accordion" open={false}>
        <summary className="print-accordion-summary">
          <div className="summary-title-row">
            <span className="summary-title">Print & Production Settings</span>
            <span className="summary-tag">300 DPI Geometry</span>
          </div>
          <span className="summary-chevron">▾</span>
        </summary>

        <div className="print-accordion-content">
          <div className="print-guides-checklist">
            <label className="guide-checkbox-row">
              <span>Punch-Hole Exclusion Zone (Top 14mm)</span>
              <input
                type="checkbox"
                checked={printSettings.showPunchHoleZone}
                onChange={(e) => onUpdatePrintSettings({ showPunchHoleZone: e.target.checked })}
              />
            </label>

            <label className="guide-checkbox-row">
              <span>Safe Margin Line (12mm Inset)</span>
              <input
                type="checkbox"
                checked={printSettings.showSafeMargin}
                onChange={(e) => onUpdatePrintSettings({ showSafeMargin: e.target.checked })}
              />
            </label>

            <label className="guide-checkbox-row">
              <span>Bleed Area (+3mm Boundary)</span>
              <input
                type="checkbox"
                checked={printSettings.showBleed}
                onChange={(e) => onUpdatePrintSettings({ showBleed: e.target.checked })}
              />
            </label>

            <label className="guide-checkbox-row">
              <span>Printer Corner Crop Marks</span>
              <input
                type="checkbox"
                checked={printSettings.showCropMarks}
                onChange={(e) => onUpdatePrintSettings({ showCropMarks: e.target.checked })}
              />
            </label>
          </div>

          <div className="print-mode-note">
            <span className="note-icon">ℹ</span>
            <span>
              <strong>Print Standard:</strong> Flat vector artboard is sized to 90 × 140 mm (3.5" × 5.5"). Hardware
              lanyard elements are excluded during production exports.
            </span>
          </div>
        </div>
      </details>
    </div>
  );
};
