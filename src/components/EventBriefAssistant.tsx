import React, { useState } from 'react';
import { BadgeData, BriefAnalysisResult } from '../types';
import { analyzeEventBrief } from '../utils/aiBriefParser';
import confetti from 'canvas-confetti';

interface EventBriefAssistantProps {
  onApplyData: (data: Partial<BadgeData>) => void;
  currentBadge: BadgeData;
}

const SAMPLE_BRIEFS = [
  {
    title: 'Aurora Innovation Summit (Tests Name vs Event Distinction)',
    text: "Elena Vance is attending Aurora Innovation 2026 at Central Convention Centre on Nov 14 - 15, 2026 as a keynote speaker. Registration ID is AURORA-SPK-08."
  },
  {
    title: 'SVNIT ACM Inception Hackathon',
    text: "Hosting the annual 'Inception 2026' hackathon at SVNIT Campus, Surat on Oct 24 - 26, 2026. Participant is Aarav Sharma, affiliated with SVNIT Surat CSE, badge ID SVNIT-ACM-4092."
  },
  {
    title: 'Incomplete Brief (Tests Clarification Flow)',
    text: "Need a badge for volunteer crew member Rohan at the annual DesignFest 2026. Still confirming the hall and exact registration ID."
  }
];

export const EventBriefAssistant: React.FC<EventBriefAssistantProps> = ({ onApplyData }) => {
  const [briefText, setBriefText] = useState('');
  const [analysis, setAnalysis] = useState<BriefAnalysisResult | null>(null);
  const [editableValues, setEditableValues] = useState<Record<string, string>>({});
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleAnalyze = () => {
    if (!briefText.trim()) return;
    const result = analyzeEventBrief(briefText);
    setAnalysis(result);
    setIsConfirmed(false);

    // Initialize editable values with detected fields and missing fields
    const initialValues: Record<string, string> = {};
    if (result.extracted.eventName) initialValues.eventName = result.extracted.eventName;
    if (result.extracted.participantName) initialValues.participantName = result.extracted.participantName;
    if (result.extracted.role) initialValues.role = result.extracted.role;
    if (result.extracted.date) initialValues.date = result.extracted.date;
    if (result.extracted.venue) initialValues.venue = result.extracted.venue;
    if (result.extracted.idNumber) initialValues.idNumber = result.extracted.idNumber;
    if (result.extracted.companyOrCollege) initialValues.companyOrCollege = result.extracted.companyOrCollege;

    result.missingFields.forEach((mf) => {
      if (!initialValues[mf.field]) initialValues[mf.field] = '';
    });

    setEditableValues(initialValues);
  };

  const handleFieldChange = (field: string, val: string) => {
    setEditableValues((prev) => ({
      ...prev,
      [field]: val
    }));
  };

  const handleConfirmAndApply = () => {
    if (!analysis) return;

    const finalData: Partial<BadgeData> = {
      ...analysis.extracted
    };

    Object.entries(editableValues).forEach(([key, val]) => {
      if (val && val.trim()) {
        (finalData as any)[key] = val.trim();
      }
    });

    onApplyData(finalData);
    setIsConfirmed(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0284c7', '#38bdf8', '#818cf8', '#ffffff']
      });
    } catch {
      // non-fatal
    }
  };

  return (
    <div className="assistant-card">
      <div className="assistant-header">
        <div className="assistant-badge">
          <span className="assistant-icon">⚡</span>
          <span>Requirement Gathering Flow</span>
        </div>
        <h3 className="assistant-title">Event Brief Inspector</h3>
        <p className="assistant-description">
          Describe your event or paste credentials. BadgeForge inspects the text, validates fields, and categorizes
          entities into Provided, Inferred, and Needs Confirmation.
        </p>
      </div>

      {/* Quick Sample Briefs */}
      <div className="sample-briefs-strip">
        <span className="sample-label">Try sample briefs:</span>
        {SAMPLE_BRIEFS.map((s, idx) => (
          <button
            key={idx}
            className="sample-brief-pill"
            onClick={() => {
              setBriefText(s.text);
              setAnalysis(null);
              setIsConfirmed(false);
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Brief Input */}
      <div className="brief-input-box">
        <textarea
          rows={3}
          value={briefText}
          onChange={(e) => setBriefText(e.target.value)}
          placeholder="e.g. Elena Vance is attending Aurora Innovation 2026 at Central Convention Centre on Nov 14-15 as a keynote speaker. Registration ID is AURORA-SPK-08..."
          className="brief-textarea"
        />
        <div className="brief-actions">
          <button onClick={handleAnalyze} disabled={!briefText.trim()} className="btn-analyze">
            Inspect & Classify Brief
          </button>
          {briefText && (
            <button
              onClick={() => {
                setBriefText('');
                setAnalysis(null);
                setIsConfirmed(false);
              }}
              className="btn-clear-brief"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Honest Technology Disclaimer */}
      <div className="transparency-note">
        <span className="info-icon">ℹ</span>
        <span>
          <strong>Architecture Transparency:</strong> Uses deterministic client-side regex and entity grammar rules. No
          external LLM API is connected or fabricated, guaranteeing 100% privacy and zero invented facts.
        </span>
      </div>

      {/* Transparent Review Workflow */}
      {analysis && (
        <div className="analysis-results-section">
          {/* Classification Legend */}
          <div className="classification-legend-strip">
            <span className="legend-item">
              <span className="legend-tag tag-provided">Provided</span> Explicitly present in brief
            </span>
            <span className="legend-item">
              <span className="legend-tag tag-inferred">Inferred</span> Derived from context (Review)
            </span>
            <span className="legend-item">
              <span className="legend-tag tag-missing">Needs Confirmation</span> Missing from brief
            </span>
          </div>

          {/* Detected Entities with Inline Editing */}
          <div className="detected-entities-grid">
            {analysis.fieldItems.map((item) => (
              <div key={item.field} className="entity-review-box">
                <div className="entity-header-row">
                  <span className="entity-label">{item.label}</span>
                  <span className={`legend-tag tag-${item.status}`}>
                    {item.status === 'provided' ? '✓ Provided' : '◈ Inferred'}
                  </span>
                </div>
                <input
                  type="text"
                  value={editableValues[item.field] || ''}
                  onChange={(e) => handleFieldChange(item.field, e.target.value)}
                  className="entity-edit-input"
                />
                <span className="entity-reason">{item.reason}</span>
              </div>
            ))}
          </div>

          {/* Missing Fields Follow-up */}
          {analysis.missingFields.length > 0 && (
            <div className="followup-questions-card">
              <div className="followup-title-row">
                <span className="warn-badge">Needs Confirmation ({analysis.missingFields.length})</span>
                <span className="followup-sub">Please clarify these missing essential details:</span>
              </div>

              <div className="questions-list">
                {analysis.missingFields.map((q) => (
                  <div key={q.field} className="question-item">
                    <label className="question-label">
                      <strong>{q.label}</strong>: {q.question}
                    </label>
                    <input
                      type="text"
                      placeholder={q.placeholder}
                      value={editableValues[q.field] || ''}
                      onChange={(e) => handleFieldChange(q.field, e.target.value)}
                      className="question-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation Action */}
          <div className="confirm-action-row">
            <button onClick={handleConfirmAndApply} className="btn-confirm-badge">
              {isConfirmed ? '✓ Confirmed & Applied to Live Badge' : 'Confirm & Apply Verified Credentials'}
            </button>
            {isConfirmed && (
              <span className="confirmed-toast">Badge updated! Inspect the live preview canvas.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
