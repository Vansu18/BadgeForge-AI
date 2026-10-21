import React, { useState } from 'react';
import { AttendeeRecord, BadgeData, BadgeRole } from '../types';

interface BatchAttendeeManagerProps {
  currentBadge: BadgeData;
  onSelectAttendee: (attendee: AttendeeRecord) => void;
  onBatchExportPdf: (attendees: AttendeeRecord[]) => Promise<void>;
  isExportingBatch: boolean;
}

const SAMPLE_CSV_CONTENT = `Name,Role,BadgeID,Affiliation,Email
Aarav Sharma,Participant,ACM-SVNIT-4092,SVNIT Surat · Dept of CSE,aarav@svnit.ac.in
Dr. Priya Nair,Mentor,QFWD-M-108,Institute of Deep Computation,priya.nair@idc.edu
Rohan Mehta,Organizer,DF-ORG-007,SVNIT Design Guild,rohan@svnit.ac.in
Ananya Sen,Volunteer,VOL-CREW-12,Dept of Electronics SVNIT,ananya@svnit.ac.in
Vikram Malhotra,Participant,ACM-SVNIT-4093,IIT Bombay · Dept of EE,vikram@ee.iitb.ac.in
Sameer Patel,Participant,ACM-SVNIT-4092,SVNIT Surat,sameer@svnit.ac.in`; // Note: Intentional duplicate ID for validation testing

export const BatchAttendeeManager: React.FC<BatchAttendeeManagerProps> = ({
  onSelectAttendee,
  onBatchExportPdf,
  isExportingBatch
}) => {
  const [records, setRecords] = useState<AttendeeRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const parseAndValidateCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      alert('CSV must contain a header row and at least one data record.');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const nameIdx = headers.findIndex((h) => h.includes('name'));
    const roleIdx = headers.findIndex((h) => h.includes('role'));
    const idIdx = headers.findIndex((h) => h.includes('id') || h.includes('badge'));
    const affilIdx = headers.findIndex((h) => h.includes('affil') || h.includes('college') || h.includes('org'));
    const emailIdx = headers.findIndex((h) => h.includes('email') || h.includes('mail'));

    const seenIds = new Set<string>();
    const parsedRecords: AttendeeRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      const name = nameIdx !== -1 ? parts[nameIdx] || '' : parts[0] || '';
      let roleRaw = roleIdx !== -1 ? parts[roleIdx] || 'Participant' : 'Participant';
      const badgeId = idIdx !== -1 ? parts[idIdx] || '' : `BF-2026-${i}`;
      const affiliation = affilIdx !== -1 ? parts[affilIdx] || '' : 'SVNIT Surat';
      const email = emailIdx !== -1 ? parts[emailIdx] || '' : '';

      // Normalize Role
      let role: BadgeRole = 'Participant';
      if (/organizer/i.test(roleRaw)) role = 'Organizer';
      else if (/mentor/i.test(roleRaw)) role = 'Mentor';
      else if (/volunteer/i.test(roleRaw)) role = 'Volunteer';

      let valid = true;
      let errorMsg = '';

      if (!name) {
        valid = false;
        errorMsg = 'Missing participant name';
      } else if (!badgeId) {
        valid = false;
        errorMsg = 'Missing badge ID';
      } else if (seenIds.has(badgeId.toUpperCase())) {
        valid = false;
        errorMsg = `Duplicate badge ID: ${badgeId}`;
      } else {
        seenIds.add(badgeId.toUpperCase());
      }

      parsedRecords.push({
        id: `rec-${i}`,
        participantName: name,
        role,
        idNumber: badgeId,
        companyOrCollege: affiliation,
        email,
        valid,
        validationError: errorMsg
      });
    }

    setRecords(parsedRecords);
    if (parsedRecords.length > 0 && parsedRecords[0].valid) {
      setSelectedIndex(0);
      onSelectAttendee(parsedRecords[0]);
    }
  };

  const handleLoadSample = () => {
    parseAndValidateCsv(SAMPLE_CSV_CONTENT);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseAndValidateCsv(text);
    };
    reader.readAsText(file);
  };

  const handleSelect = (rec: AttendeeRecord, idx: number) => {
    if (!rec.valid) {
      alert(`Cannot preview invalid attendee: ${rec.validationError}`);
      return;
    }
    setSelectedIndex(idx);
    onSelectAttendee(rec);
  };

  const validRecords = records.filter((r) => r.valid);
  const invalidRecords = records.filter((r) => !r.valid);

  return (
    <div className="batch-manager-card">
      <div className="widget-header">
        <div>
          <label className="section-subheading">Attendee Data & Batch Production</label>
          <span className="branding-note">Multi-Badge CSV / JSON Workflow</span>
        </div>
        <button type="button" onClick={handleLoadSample} className="btn-load-sample-csv">
          Load Sample CSV (6 Attendees)
        </button>
      </div>

      <p className="batch-intro">
        Import a conference delegate roster to preview badges across attendees and export multi-page print sheets.
      </p>

      {/* CSV File Upload or Text Area */}
      <div className="csv-input-row">
        <label className="btn-upload-csv-label">
          <span>Choose .CSV File</span>
          <input type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>
        {records.length > 0 && (
          <button
            type="button"
            className="btn-clear-csv"
            onClick={() => {
              setRecords([]);
              setSelectedIndex(null);
            }}
          >
            Clear Roster
          </button>
        )}
      </div>

      {/* Records Validation Bar */}
      {records.length > 0 && (
        <div className="batch-stats-strip">
          <div className="stat-pill">
            <span className="stat-num">{records.length}</span> Total Records
          </div>
          <div className="stat-pill valid-stat">
            <span className="stat-num">{validRecords.length}</span> Valid & Ready
          </div>
          {invalidRecords.length > 0 && (
            <div className="stat-pill invalid-stat">
              <span className="stat-num">{invalidRecords.length}</span> Flags (Duplicate/Missing)
            </div>
          )}
        </div>
      )}

      {/* Roster Table */}
      {records.length > 0 && (
        <div className="roster-table-container">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Participant Name</th>
                <th>Role</th>
                <th>Badge ID</th>
                <th>Affiliation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr
                  key={rec.id}
                  className={`roster-row ${selectedIndex === idx ? 'selected-row' : ''} ${
                    !rec.valid ? 'invalid-row' : ''
                  }`}
                  onClick={() => rec.valid && handleSelect(rec, idx)}
                >
                  <td>
                    {rec.valid ? (
                      <span className="status-badge-ok">✓ Ready</span>
                    ) : (
                      <span className="status-badge-err" title={rec.validationError}>
                        ⚠ Flagged
                      </span>
                    )}
                  </td>
                  <td className="roster-name">{rec.participantName || '[Missing Name]'}</td>
                  <td>
                    <span className="roster-role-pill">{rec.role}</span>
                  </td>
                  <td className="roster-id">{rec.idNumber}</td>
                  <td className="roster-affil">{rec.companyOrCollege}</td>
                  <td>
                    <button
                      type="button"
                      disabled={!rec.valid}
                      className="btn-row-preview"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(rec, idx);
                      }}
                    >
                      {selectedIndex === idx ? '● On Canvas' : 'Preview'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Batch Export Button */}
      {validRecords.length > 0 && (
        <div className="batch-export-section">
          <button
            type="button"
            disabled={isExportingBatch}
            onClick={() => onBatchExportPdf(validRecords)}
            className="btn-batch-export-pdf"
          >
            {isExportingBatch
              ? 'Generating Multi-Badge Print Document...'
              : `Export All ${validRecords.length} Badges to Combined PDF Sheet`}
          </button>
          <span className="batch-export-note">
            Generates high-resolution vector print sheets (300 DPI equivalent) with individual attendee credentials.
          </span>
        </div>
      )}
    </div>
  );
};
