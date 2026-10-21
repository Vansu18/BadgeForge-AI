import React from 'react';
import { BadgeData } from '../../types';
import { DEFAULT_SVNIT_LOGO_URL, DEFAULT_ACM_LOGO_URL, CLEAN_LOGO_PLACEHOLDER, TYPOGRAPHIC_PHOTO_PLACEHOLDER } from '../../assets/logos';

interface TemplateProps {
  badge: BadgeData;
  roleColor: string;
}

export const ModernTechTemplate: React.FC<TemplateProps> = ({ badge, roleColor }) => {
  const getInitials = (name: string) => {
    if (!name) return 'ID';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const nameLength = badge.participantName.length;
  let nameFontSize = 26;
  if (nameLength > 24) nameFontSize = 18;
  else if (nameLength > 18) nameFontSize = 21;

  const eventLength = badge.eventName.length;
  let eventFontSize = 19;
  if (eventLength > 24) eventFontSize = 15;
  else if (eventLength > 18) eventFontSize = 17;

  const svnitLogoSrc = badge.customSvnitLogoUrl || DEFAULT_SVNIT_LOGO_URL;
  const acmLogoSrc = badge.customAcmLogoUrl || DEFAULT_ACM_LOGO_URL;

  const photoWidth = 120;
  const photoHeight = 150;

  return (
    <g id="modern-tech-template">
      <defs>
        <clipPath id="mt-3x4-photo-clip">
          <rect x="165" y="165" width={photoWidth} height={photoHeight} rx="4" />
        </clipPath>
        <clipPath id="mt-logo-clip-l">
          <rect x="28" y="28" width="46" height="46" rx="4" />
        </clipPath>
        <clipPath id="mt-logo-clip-r">
          <rect x="376" y="28" width="46" height="46" rx="4" />
        </clipPath>
      </defs>

      {/* Card Base - Deep Matte Obsidian */}
      <rect x="0" y="0" width="450" height="700" rx="16" fill="#0c0d10" />

      {/* Structural Hairline Perimeter */}
      <rect x="1" y="1" width="448" height="698" rx="15" fill="none" stroke="#22242a" strokeWidth="1.5" />
      <rect x="8" y="8" width="434" height="684" rx="12" fill="none" stroke="#16171d" strokeWidth="1" />

      {/* Lanyard Cutout Slot */}
      <rect x="185" y="12" width="80" height="7" rx="3.5" fill="#060709" stroke="#2c2e36" strokeWidth="1" />

      {/* Header Bar Area */}
      <g id="mt-header">
        {/* Left Official Logo Slot: SVNIT */}
        {badge.showSvnitLogo ? (
          <g>
            <rect x="28" y="28" width="46" height="46" rx="4" fill="#ffffff" stroke="#22242a" strokeWidth="1" />
            <g clipPath="url(#mt-logo-clip-l)">
              <image
                href={svnitLogoSrc}
                x="28"
                y="28"
                width="46"
                height="46"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        ) : (
          <g transform="translate(28, 28)">
            <g dangerouslySetInnerHTML={{ __html: CLEAN_LOGO_PLACEHOLDER('SVNIT') }} />
          </g>
        )}

        {/* Center Event Header */}
        <g transform="translate(225, 42)">
          <text
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="#71717a"
            letterSpacing="2"
            fontFamily="'JetBrains Mono', monospace"
          >
            TECHNICAL PASS · SVNIT SURAT
          </text>
          <text
            y="18"
            textAnchor="middle"
            fontSize={eventFontSize}
            fontWeight="900"
            fill="#f8fafc"
            letterSpacing="0.8"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {badge.eventName.toUpperCase() || 'INCEPTION 2026'}
          </text>
          <text
            y="32"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="600"
            fill="#a1a1aa"
            letterSpacing="1"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {badge.tagline || 'Annual Flagship Hackathon'}
          </text>
        </g>

        {/* Right Official Logo Slot: ACM */}
        {badge.showAcmLogo ? (
          <g>
            <rect x="376" y="28" width="46" height="46" rx="4" fill="#ffffff" stroke="#22242a" strokeWidth="1" />
            <g clipPath="url(#mt-logo-clip-r)">
              <image
                href={acmLogoSrc}
                x="376"
                y="28"
                width="46"
                height="46"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        ) : (
          <g transform="translate(376, 28)">
            <g dangerouslySetInnerHTML={{ __html: CLEAN_LOGO_PLACEHOLDER('ACM') }} />
          </g>
        )}
      </g>

      <line x1="28" y1="88" x2="422" y2="88" stroke="#1f2127" strokeWidth="1" />
      <line x1="180" y1="88" x2="270" y2="88" stroke={roleColor} strokeWidth="2" />

      {/* Participant Identity Section */}
      <g transform="translate(225, 120)">
        <text
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="700"
          fill="#71717a"
          letterSpacing="2"
          fontFamily="'JetBrains Mono', monospace"
        >
          ACCREDITED ATTENDEE
        </text>
        <text
          y="24"
          textAnchor="middle"
          fontSize={nameFontSize}
          fontWeight="900"
          fill="#f8fafc"
          letterSpacing="-0.01em"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {badge.participantName || 'Participant Name'}
        </text>
      </g>

      {/* 3:4 Rectangular Portrait Photo Frame or Deliberate Monogram */}
      <g transform="translate(0, 0)">
        <rect
          x="163"
          y="163"
          width={photoWidth + 4}
          height={photoHeight + 4}
          rx="5"
          fill="#08090b"
          stroke="#27272a"
          strokeWidth="1"
        />

        {badge.photoUrl ? (
          <g clipPath="url(#mt-3x4-photo-clip)">
            <image
              href={badge.photoUrl}
              x={165 - (photoWidth / 2) * (badge.photoScale - 1) + badge.photoOffsetX}
              y={165 - (photoHeight / 2) * (badge.photoScale - 1) + badge.photoOffsetY}
              width={photoWidth * badge.photoScale}
              height={photoHeight * badge.photoScale}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        ) : (
          <g transform="translate(165, 165)">
            <g dangerouslySetInnerHTML={{ __html: TYPOGRAPHIC_PHOTO_PLACEHOLDER(getInitials(badge.participantName), photoWidth, photoHeight) }} />
          </g>
        )}
      </g>

      {/* Role Pill */}
      <g transform="translate(225, 342)">
        <rect
          x="-80"
          y="-13"
          width="160"
          height="26"
          rx="3"
          fill={roleColor}
        />
        <text
          y="4"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fill="#ffffff"
          letterSpacing="2"
          fontFamily="'JetBrains Mono', monospace"
        >
          {badge.role.toUpperCase()}
        </text>
      </g>

      {/* Affiliation */}
      <g transform="translate(225, 386)">
        <text
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#a1a1aa"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {badge.companyOrCollege || 'SVNIT Surat · Dept of CSE'}
        </text>
      </g>

      {/* Technical Data Table / Credential Grid */}
      <g transform="translate(28, 416)">
        <rect x="0" y="0" width="394" height="108" rx="6" fill="#111317" stroke="#1f2127" strokeWidth="1" />

        {/* Row 1 */}
        <g transform="translate(20, 26)">
          <text fontSize="7.5" fontWeight="700" fill="#71717a" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
            BADGE IDENTIFIER
          </text>
          <text y="18" fontSize="13" fontWeight="800" fill="#38bdf8" fontFamily="'JetBrains Mono', monospace">
            {badge.idNumber || 'ACM-SVNIT-4092'}
          </text>
        </g>

        <g transform="translate(220, 26)">
          <text fontSize="7.5" fontWeight="700" fill="#71717a" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
            ACCESS CLEARANCE
          </text>
          <text y="18" fontSize="10.5" fontWeight="700" fill="#e4e4e7" fontFamily="'JetBrains Mono', monospace">
            {badge.role === 'Organizer' ? 'FULL ACCESS · ALL ZONES' : badge.role === 'Mentor' ? 'SPEAKER · JURY HALL' : 'GENERAL ENTRY · MAIN HALL'}
          </text>
        </g>

        <line x1="16" y1="56" x2="378" y2="56" stroke="#1f2127" strokeWidth="1" />

        {/* Row 2 */}
        <g transform="translate(20, 80)">
          <text fontSize="7.5" fontWeight="700" fill="#71717a" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
            DATES: <tspan fill="#e4e4e7" fontWeight="600">{badge.date || 'OCT 24 - 26, 2026'}</tspan>
          </text>
        </g>

        <g transform="translate(220, 80)">
          <text fontSize="7.5" fontWeight="700" fill="#71717a" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
            VENUE: <tspan fill="#e4e4e7" fontWeight="600">{badge.venue ? (badge.venue.length > 22 ? badge.venue.slice(0, 20) + '...' : badge.venue) : 'SVNIT Campus'}</tspan>
          </text>
        </g>
      </g>

      {/* Footer Scannable / Verification Strip */}
      <g transform="translate(28, 542)">
        <rect x="0" y="0" width="394" height="120" rx="6" fill="#08090c" stroke="#1f2127" strokeWidth="1" />

        {/* High-Contrast Scannable QR Matrix */}
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="80" height="80" fill="#ffffff" rx="3" />
          <rect x="8" y="8" width="22" height="22" fill="#0c0d10" />
          <rect x="11" y="11" width="16" height="16" fill="#ffffff" />
          <rect x="14" y="14" width="10" height="10" fill="#0c0d10" />

          <rect x="50" y="8" width="22" height="22" fill="#0c0d10" />
          <rect x="53" y="11" width="16" height="16" fill="#ffffff" />
          <rect x="56" y="14" width="10" height="10" fill="#0c0d10" />

          <rect x="8" y="50" width="22" height="22" fill="#0c0d10" />
          <rect x="11" y="53" width="16" height="16" fill="#ffffff" />
          <rect x="14" y="56" width="10" height="10" fill="#0c0d10" />

          <rect x="34" y="12" width="10" height="10" fill="#0c0d10" />
          <rect x="34" y="34" width="12" height="12" fill="#0c0d10" />
          <rect x="54" y="54" width="12" height="12" fill="#0c0d10" />
        </g>

        {/* Verification Info Text */}
        <g transform="translate(120, 42)">
          <text fontSize="10" fontWeight="800" fill="#f8fafc" letterSpacing="0.8" fontFamily="'JetBrains Mono', monospace">
            SCAN FOR EVENT ENTRY
          </text>
          <text y="18" fontSize="8" fontWeight="500" fill="#71717a" fontFamily="'Plus Jakarta Sans', sans-serif">
            Issued by ACM SVNIT Student Chapter · Non-Transferable
          </text>
          <text y="34" fontSize="7.5" fontWeight="600" fill="#38bdf8" fontFamily="'JetBrains Mono', monospace">
            AUTH CODE: {badge.idNumber || 'ACM-SVNIT-4092'}
          </text>
        </g>
      </g>
    </g>
  );
};
