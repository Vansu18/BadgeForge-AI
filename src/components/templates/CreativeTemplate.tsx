import React from 'react';
import { BadgeData } from '../../types';
import { DEFAULT_SVNIT_LOGO_URL, DEFAULT_ACM_LOGO_URL, CLEAN_LOGO_PLACEHOLDER, TYPOGRAPHIC_PHOTO_PLACEHOLDER } from '../../assets/logos';

interface TemplateProps {
  badge: BadgeData;
  roleColor: string;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ badge, roleColor }) => {
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
  const photoHeight = 160;

  return (
    <g id="creative-template">
      <defs>
        <clipPath id="cr-photo-clip">
          <rect x="165" y="150" width={photoWidth} height={photoHeight} rx="4" />
        </clipPath>
        <clipPath id="cr-logo-clip-l">
          <rect x="28" y="28" width="46" height="46" rx="4" />
        </clipPath>
        <clipPath id="cr-logo-clip-r">
          <rect x="376" y="28" width="46" height="46" rx="4" />
        </clipPath>
      </defs>

      {/* Card Base - Deep Charcoal Slate */}
      <rect x="0" y="0" width="450" height="700" rx="16" fill="#0d0e12" />
      <rect x="1" y="1" width="448" height="698" rx="15" fill="none" stroke="#22242a" strokeWidth="1.5" />
      <rect x="8" y="8" width="434" height="684" rx="12" fill="none" stroke="#16171d" strokeWidth="1" />

      {/* Lanyard Cutout Slot */}
      <rect x="185" y="12" width="80" height="7" rx="3.5" fill="#06070a" stroke="#2c2e36" strokeWidth="1" />

      {/* Header Institution Row */}
      <g id="cr-header">
        {/* SVNIT Official Logo Slot */}
        {badge.showSvnitLogo ? (
          <g>
            <rect x="28" y="28" width="46" height="46" rx="4" fill="#ffffff" stroke="#22242a" strokeWidth="1" />
            <g clipPath="url(#cr-logo-clip-l)">
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

        {/* Center Event Title */}
        <g transform="translate(225, 42)">
          <text
            textAnchor="middle"
            fontSize="8"
            fontWeight="800"
            fill={roleColor}
            letterSpacing="2"
            fontFamily="'JetBrains Mono', monospace"
          >
            DESIGN & CREATIVE SPRINT
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
            {badge.eventName.toUpperCase() || 'DESIGNFORGE 2026'}
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
            {badge.tagline || 'Experience Design & Creative Conclave'}
          </text>
        </g>

        {/* ACM Official Logo Slot */}
        {badge.showAcmLogo ? (
          <g>
            <rect x="376" y="28" width="46" height="46" rx="4" fill="#ffffff" stroke="#22242a" strokeWidth="1" />
            <g clipPath="url(#cr-logo-clip-r)">
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

      {/* Role Indicator Bar (Sophisticated Full-Width Hairline Strip) */}
      <rect x="28" y="96" width="394" height="28" rx="4" fill="#14151b" stroke="#22242a" strokeWidth="1" />
      <circle cx="48" cy="110" r="4" fill={roleColor} />
      <text
        x="60"
        y="114"
        fontSize="9.5"
        fontWeight="800"
        fill="#ffffff"
        letterSpacing="2"
        fontFamily="'JetBrains Mono', monospace"
      >
        {badge.role.toUpperCase()} CLEARANCE
      </text>
      <text
        x="406"
        y="114"
        textAnchor="end"
        fontSize="9"
        fontWeight="700"
        fill="#71717a"
        fontFamily="'JetBrains Mono', monospace"
      >
        ID: {badge.idNumber || 'DF-2026-07'}
      </text>

      {/* Portrait Photo Frame - Centered and Proportioned */}
      <g transform="translate(0, 0)">
        <rect
          x="163"
          y="148"
          width={photoWidth + 4}
          height={photoHeight + 4}
          rx="5"
          fill="#08090b"
          stroke="#27272a"
          strokeWidth="1"
        />

        {badge.photoUrl ? (
          <g clipPath="url(#cr-photo-clip)">
            <image
              href={badge.photoUrl}
              x={165 - (photoWidth / 2) * (badge.photoScale - 1) + badge.photoOffsetX}
              y={150 - (photoHeight / 2) * (badge.photoScale - 1) + badge.photoOffsetY}
              width={photoWidth * badge.photoScale}
              height={photoHeight * badge.photoScale}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        ) : (
          <g transform="translate(165, 150)">
            <g dangerouslySetInnerHTML={{ __html: TYPOGRAPHIC_PHOTO_PLACEHOLDER(getInitials(badge.participantName), photoWidth, photoHeight) }} />
          </g>
        )}
      </g>

      {/* Attendee Name & Affiliation (Clear Visual Prominence) */}
      <g transform="translate(225, 345)">
        <text
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="700"
          fill="#71717a"
          letterSpacing="2"
          fontFamily="'JetBrains Mono', monospace"
        >
          ACCREDITED DELEGATE
        </text>
        <text
          y="26"
          textAnchor="middle"
          fontSize={nameFontSize}
          fontWeight="900"
          fill="#ffffff"
          letterSpacing="-0.02em"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {badge.participantName || 'Participant Name'}
        </text>
        <text
          y="48"
          textAnchor="middle"
          fontSize="11"
          fontWeight="500"
          fill="#a1a1aa"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {badge.companyOrCollege || 'Design Guild & Innovation Studio'}
        </text>
      </g>

      {/* Architectural Event Coordinates Grid */}
      <g transform="translate(28, 428)">
        <rect x="0" y="0" width="394" height="96" rx="6" fill="#121419" stroke="#1f2127" strokeWidth="1" />

        <g transform="translate(20, 26)">
          <text fontSize="7.5" fontWeight="700" fill="#71717a" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
            SCHEDULED DATES
          </text>
          <text y="18" fontSize="12" fontWeight="800" fill="#f8fafc" fontFamily="'JetBrains Mono', monospace">
            {badge.date || 'DEC 05 - 07, 2026'}
          </text>
        </g>

        <g transform="translate(220, 26)">
          <text fontSize="7.5" fontWeight="700" fill="#71717a" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
            CONCLAVE VENUE
          </text>
          <text y="18" fontSize="10.5" fontWeight="700" fill="#f8fafc" fontFamily="'Plus Jakarta Sans', sans-serif">
            {badge.venue ? (badge.venue.length > 22 ? badge.venue.slice(0, 20) + '...' : badge.venue) : 'SVNIT Campus, Surat'}
          </text>
        </g>

        <line x1="16" y1="56" x2="378" y2="56" stroke="#1f2127" strokeWidth="1" />

        <g transform="translate(20, 78)">
          <text fontSize="7.5" fontWeight="600" fill="#71717a" fontFamily="'Plus Jakarta Sans', sans-serif">
            Access: <tspan fill="#e4e4e7" fontWeight="700">Zone 1 & Design Labs · SVNIT Surat</tspan>
          </text>
        </g>
      </g>

      {/* Verification Scannable Strip */}
      <g transform="translate(28, 545)">
        <rect x="0" y="0" width="394" height="120" rx="6" fill="#08090c" stroke="#1f2127" strokeWidth="1" />

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

        <g transform="translate(120, 42)">
          <text fontSize="10" fontWeight="800" fill="#f8fafc" letterSpacing="0.8" fontFamily="'JetBrains Mono', monospace">
            SCAN FOR ACCREDITATION
          </text>
          <text y="18" fontSize="8" fontWeight="500" fill="#71717a" fontFamily="'Plus Jakarta Sans', sans-serif">
            Creative Pass · Authorized SVNIT ACM Chapter
          </text>
          <text y="34" fontSize="7.5" fontWeight="600" fill={roleColor} fontFamily="'JetBrains Mono', monospace">
            CODE: {badge.idNumber || 'DF-2026-07'}
          </text>
        </g>
      </g>
    </g>
  );
};
