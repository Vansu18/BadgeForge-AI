import React from 'react';
import { BadgeTemplate } from '../types';

interface TemplateSelectorProps {
  currentTemplate: BadgeTemplate;
  onSelect: (template: BadgeTemplate) => void;
}

interface TemplateOption {
  id: BadgeTemplate;
  name: string;
  tag: string;
  description: string;
  accent: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    tag: 'Minimal & Technical',
    description: 'Precision engineering aesthetic with hairline technical borders, monospace coordinates, official SVNIT/ACM marks, and scannable QR verification.',
    accent: '#0284c7'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    tag: 'Formal & Institutional',
    description: 'Prestigious dual-tone university conference layout with crisp white institutional crest band, deep midnight navy body, credential table, and barcode strip.',
    accent: '#38bdf8'
  },
  {
    id: 'creative',
    name: 'Creative',
    tag: 'Colorful & Tasteful',
    description: 'Design-forward editorial layout with architectural role color-blocking, bold display typography, clear photo frame, and high-contrast credential metadata.',
    accent: '#ea580c'
  },
  {
    id: 'swiss-minimal',
    name: 'Swiss Minimalist',
    tag: 'Asymmetric Grid',
    description: 'Crisp white artboard, generous whitespace, high-contrast typography, and bold role designation. Perfect for research symposiums and faculty conclaves.',
    accent: '#090d16'
  },
  {
    id: 'high-security',
    name: 'High-Security Credential',
    tag: 'Clearance Zones',
    description: 'Full-width bold role band for instant distance recognition, large photo with security watermark seal, Zone 1/2/3 access clearances, and fine vector rosette motif.',
    accent: '#059669'
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ currentTemplate, onSelect }) => {
  return (
    <div className="template-selector-widget">
      <div className="widget-header">
        <div>
          <label className="section-subheading">Badge Template Archetypes</label>
          <span className="branding-note">5 Distinct Structural Layouts</span>
        </div>
      </div>

      <p className="batch-intro">
        Each archetype reorganizes the structural layout, type hierarchy, and credential alignment rather than merely
        swapping colors.
      </p>

      <div className="templates-grid">
        {TEMPLATES.map((t) => {
          const isActive = currentTemplate === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`template-card-btn ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? t.accent : undefined
              }}
            >
              <div className="card-top-row">
                <span className="template-name">{t.name}</span>
                <span className="template-tag" style={{ color: t.accent }}>
                  {t.tag}
                </span>
              </div>
              <p className="template-desc">{t.description}</p>
              <div className="template-card-footer">
                <span className="template-select-status">
                  {isActive ? '● Active Archetype' : 'Select Layout'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
