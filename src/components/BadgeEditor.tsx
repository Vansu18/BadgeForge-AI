import React from 'react';
import { BadgeData, BadgeRole } from '../types';
import { PhotoUploader } from './PhotoUploader';
import { LogoSettings } from './LogoSettings';

interface BadgeEditorProps {
  badge: BadgeData;
  onChange: (updated: Partial<BadgeData>) => void;
  roleColors: Record<BadgeRole, string>;
}

const ROLES: Array<{ role: BadgeRole; label: string; desc: string }> = [
  { role: 'Participant', label: 'Participant', desc: 'Standard delegate pass with neon cyan highlights' },
  { role: 'Organizer', label: 'Organizer', desc: 'Executive / Core team pass with vibrant amber/crimson accent' },
  { role: 'Mentor', label: 'Mentor', desc: 'Jury & speaker credential with emerald mint highlights' },
  { role: 'Volunteer', label: 'Volunteer', desc: 'Crew & operations credential with amethyst purple highlights' }
];

export const BadgeEditor: React.FC<BadgeEditorProps> = ({ badge, onChange, roleColors }) => {
  const isNameLong = badge.participantName.length > 22;
  const isEventLong = badge.eventName.length > 25;

  return (
    <div className="badge-editor-container">
      {/* Role Selection Segmented Controls */}
      <div className="editor-section">
        <label className="section-subheading">Event Role & Clearance Level</label>
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
                  borderColor: isSelected ? color : 'transparent',
                  backgroundColor: isSelected ? `${color}18` : undefined
                }}
              >
                <span
                  className="role-bullet"
                  style={{ backgroundColor: color }}
                />
                <span className="role-btn-label" style={{ color: isSelected ? color : '#e2e8f0' }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Details Form */}
      <div className="editor-section">
        <div className="section-title-row">
          <label className="section-subheading">Core Event Credentials</label>
          <span className="validation-counter">
            {[badge.eventName, badge.participantName, badge.idNumber, badge.date, badge.venue].filter(Boolean).length}/5 Complete
          </span>
        </div>

        {/* Validation Warnings */}
        {isNameLong && (
          <div className="validation-warning-banner">
            <span className="warn-icon">⚠</span>
            <span>
              <strong>Long Name Detected ({badge.participantName.length} chars):</strong> Dynamic SVG font scaling is
              active to fit within the badge boundaries without clipping.
            </span>
          </div>
        )}

        {isEventLong && (
          <div className="validation-warning-banner">
            <span className="warn-icon">ℹ</span>
            <span>
              <strong>Long Event Title:</strong> Sub-header font size adjusted to preserve visual hierarchy.
            </span>
          </div>
        )}

        <div className="form-fields-grid">
          {/* Event Name */}
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
            {!badge.eventName.trim() && (
              <span className="field-error-hint">Event Name is required</span>
            )}
          </div>

          {/* Tagline / Subtitle */}
          <div className="form-group full-width">
            <label className="field-label">Tagline / Sub-title</label>
            <input
              type="text"
              value={badge.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
              placeholder="e.g. Flagship National Hackathon"
              className="studio-input"
            />
          </div>

          {/* Participant Name */}
          <div className="form-group">
            <label className="field-label">
              Participant Name <span className="req-star">*</span>
            </label>
            <input
              type="text"
              value={badge.participantName}
              onChange={(e) => onChange({ participantName: e.target.value })}
              placeholder="e.g. Aarav Sharma"
              className={`studio-input ${!badge.participantName.trim() ? 'field-missing' : ''}`}
            />
            {!badge.participantName.trim() && (
              <span className="field-error-hint">Participant Name is required</span>
            )}
          </div>

          {/* Badge / ID Number */}
          <div className="form-group">
            <label className="field-label">
              Badge / ID Number <span className="req-star">*</span>
            </label>
            <input
              type="text"
              value={badge.idNumber}
              onChange={(e) => onChange({ idNumber: e.target.value })}
              placeholder="e.g. ACM-SVNIT-4092"
              className={`studio-input ${!badge.idNumber.trim() ? 'field-missing' : ''}`}
            />
            {!badge.idNumber.trim() && (
              <span className="field-error-hint">Badge ID is required</span>
            )}
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="field-label">
              Event Date <span className="req-star">*</span>
            </label>
            <input
              type="text"
              value={badge.date}
              onChange={(e) => onChange({ date: e.target.value })}
              placeholder="e.g. OCT 24 - 26, 2026"
              className={`studio-input ${!badge.date.trim() ? 'field-missing' : ''}`}
            />
            {!badge.date.trim() && (
              <span className="field-error-hint">Date is required</span>
            )}
          </div>

          {/* Venue */}
          <div className="form-group">
            <label className="field-label">
              Venue / Location <span className="req-star">*</span>
            </label>
            <input
              type="text"
              value={badge.venue}
              onChange={(e) => onChange({ venue: e.target.value })}
              placeholder="e.g. SVNIT Campus, Surat"
              className={`studio-input ${!badge.venue.trim() ? 'field-missing' : ''}`}
            />
            {!badge.venue.trim() && (
              <span className="field-error-hint">Venue is required</span>
            )}
          </div>

          {/* College or Company Affiliation */}
          <div className="form-group full-width">
            <label className="field-label">Organization / College Affiliation</label>
            <input
              type="text"
              value={badge.companyOrCollege}
              onChange={(e) => onChange({ companyOrCollege: e.target.value })}
              placeholder="e.g. SVNIT Surat · Dept of CSE"
              className="studio-input"
            />
          </div>
        </div>
      </div>

      {/* Photo Upload and Framing */}
      <div className="editor-section">
        <PhotoUploader badge={badge} onChange={onChange} />
      </div>

      {/* Institutional Branding Slots */}
      <div className="editor-section">
        <LogoSettings badge={badge} onChange={onChange} />
      </div>
    </div>
  );
};
