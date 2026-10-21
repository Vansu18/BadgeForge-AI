import React, { useState } from 'react';
import { BadgeData } from '../types';
import { exportBadgeAsSvg, exportBadgeAsPng, exportBadgeAsPdf } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface ExportPanelProps {
  svgRef: React.RefObject<SVGSVGElement>;
  badge: BadgeData;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ svgRef, badge }) => {
  const [isExporting, setIsExporting] = useState<'svg' | 'png' | 'pdf' | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Field Completeness Validation
  const missingFields: string[] = [];
  if (!badge.eventName.trim()) missingFields.push('Event Name');
  if (!badge.participantName.trim()) missingFields.push('Participant Name');
  if (!badge.idNumber.trim()) missingFields.push('Badge ID');
  if (!badge.date.trim()) missingFields.push('Event Date');
  if (!badge.venue.trim()) missingFields.push('Venue');

  const baseFilename = `${(badge.eventName || 'BadgeForge').replace(/[^a-zA-Z0-9_-]/g, '_')}_${(
    badge.participantName || 'Delegate'
  ).replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  const triggerNotice = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => {
      setExportNotice(null);
    }, 4000);
  };

  const handleExportPdf = async () => {
    if (!svgRef.current) return;
    setIsExporting('pdf');
    try {
      await exportBadgeAsPdf(
        svgRef.current,
        `${baseFilename}_PrintPass`,
        badge.eventName,
        badge.participantName
      );
      triggerNotice('Print-ready PDF with printer crop marks generated!');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.85 } });
    } catch (err) {
      console.error(err);
      triggerNotice('Error creating print-ready PDF.');
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPng = async () => {
    if (!svgRef.current) return;
    setIsExporting('png');
    try {
      await exportBadgeAsPng(svgRef.current, `${baseFilename}_HighRes_300DPI`, 3);
      triggerNotice('High-Res PNG (300 DPI equivalent) downloaded!');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.85 } });
    } catch (err) {
      console.error(err);
      triggerNotice('Error rendering high-resolution PNG.');
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportSvg = () => {
    if (!svgRef.current) return;
    setIsExporting('svg');
    try {
      exportBadgeAsSvg(svgRef.current, `${baseFilename}_Vector`);
      triggerNotice('Vector SVG exported successfully!');
    } catch (err) {
      console.error(err);
      triggerNotice('Failed to export SVG.');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="export-panel-card">
      <div className="export-header-row">
        <div className="export-title-group">
          <label className="section-subheading">Production Export</label>
          <span className="export-subtitle">Vector & Print-Ready Specifications</span>
        </div>
      </div>

      {/* Missing Details Warning Banner */}
      {missingFields.length > 0 && (
        <div className="export-validation-banner">
          <span className="warn-badge-dot">!</span>
          <div className="export-val-text">
            <strong>Incomplete Credentials:</strong>
            <span className="missing-fields-tags">
              {missingFields.map((f) => (
                <span key={f} className="missing-tag">
                  {f}
                </span>
              ))}
            </span>
          </div>
        </div>
      )}

      {/* Consolidated Primary & Secondary Actions */}
      <div className="export-actions-stack">
        {/* Primary Action: Print-Ready PDF */}
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={isExporting !== null}
          className="btn-export-primary"
          title="Download 300 DPI Print-Ready PDF credential with crop marks"
        >
          <div className="export-primary-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="export-primary-content">
            <span className="export-primary-label">
              {isExporting === 'pdf' ? 'Generating Print PDF...' : 'Export Print PDF (300 DPI)'}
            </span>
            <span className="export-primary-meta">ISO Standard 90 × 140 mm · Trim Crop Marks Included</span>
          </div>
        </button>

        {/* Secondary Actions Row: PNG and SVG */}
        <div className="export-secondary-row">
          <button
            type="button"
            onClick={handleExportPng}
            disabled={isExporting !== null}
            className="btn-export-secondary"
            title="Download high-resolution raster PNG at 300 DPI equivalent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>{isExporting === 'png' ? 'Rendering...' : 'High-Res PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportSvg}
            disabled={isExporting !== null}
            className="btn-export-secondary"
            title="Download vector SVG file with infinite scalability"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isExporting === 'svg' ? 'Exporting...' : 'Vector SVG'}</span>
          </button>
        </div>
      </div>

      {/* Export Feedback Notification */}
      {exportNotice && (
        <div className="export-notice-toast">
          <span className="toast-icon">✓</span>
          <span>{exportNotice}</span>
        </div>
      )}
    </div>
  );
};
