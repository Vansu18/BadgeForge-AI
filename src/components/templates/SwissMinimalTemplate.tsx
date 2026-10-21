import React from 'react';
import { BadgeData } from '../../types';
import { DEFAULT_SVNIT_LOGO_URL, DEFAULT_ACM_LOGO_URL, CLEAN_LOGO_PLACEHOLDER, TYPOGRAPHIC_PHOTO_PLACEHOLDER } from '../../assets/logos';

interface TemplateProps {
  badge: BadgeData;
  roleColor: string;
}

export const SwissMinimalTemplate: React.FC<TemplateProps> = ({ badge, roleColor }) => {
  const getInitials = (name: string) => {
    if (!name) return 'BF';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const nameLength = badge.participantName.length;
  let nameFontSize = 26;
  if (nameLength > 24) nameFontSize = 18;
  else if (nameLength > 18) nameFontSize = 21;

  const eventLength = badge.eventName.length;
  let eventFontSize = 18;
  if (eventLength > 24) eventFontSize = 15;
  else if (eventLength > 18) eventFontSize = 16;

  const svnitLogoSrc = badge.customSvnitLogoUrl || DEFAULT_SVNIT_LOGO_URL;
  const acmLogoSrc = badge.customAcmLogoUrl || DEFAULT_ACM_LOGO_URL;

  const photoWidth = 120;
  const photoHeight = 160;

  return (
    <g id="swiss-minimal-template">
      <defs>
        <clipPath id="swiss-photo-clip">
          <rect x="36" y="160" width={photoWidth} height={photoHeight} rx="4" />
        </clipPath>
        <clipPath id="swiss-logo-clip-l">
          <rect x="36" y="28" width="46" height="46" rx="4" />
        </clipPath>
        <clipPath id="swiss-logo-clip-r">
          <rect x="368" y="28" width="46" height="46" rx="4" />
        </clipPath>
      </defs>

      {/* Crisp White Card Base - True Swiss Precision */}
      <rect x="0" y="0" width="450" height="700" rx="16" fill="#ffffff" />
      <rect x="1" y="1" width="448" height="698" rx="15" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
      <rect x="8" y="8" width="434" height="684" rx="12" fill="none" stroke="#f1f5f9" strokeWidth="1" />

      {/* Lanyard Punch Slot */}
      <rect x="185" y="12" width="80" height="7" rx="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

      {/* Top Header Grid */}
      <g id="swiss-header">
        {/* Left Logo: SVNIT */}
        {badge.showSvnitLogo ? (
          <g>
            <rect x="36" y="28" width="46" height="46" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <g clipPath="url(#swiss-logo-clip-l)">
              <image
                href={svnitLogoSrc}
                x="36"
                y="28"
                width="46"
                height="46"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        ) : (
          <g transform="translate(36, 28)">
            <g dangerouslySetInnerHTML={{ __html: CLEAN_LOGO_PLACEHOLDER('SVNIT') }} />
          </g>
        )}

        {/* Center Event Title */}
        <g transform="translate(225, 42)">
          <text
            textAnchor="middle"
            fontSize="8"
            fontWeight="800"
            fill="#64748b"
            letterSpacing="2"
            fontFamily="'JetBrains Mono', monospace"
          >
            SYMPOSIUM ACCREDITATION
          </text>
          <text
            y="18"
            textAnchor="middle"
            fontSize={eventFontSize}
            fontWeight="900"
            fill="#090d16"
            letterSpacing="-0.02em"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {badge.eventName.toUpperCase() || 'RESEARCH CONCLAVE'}
          </text>
          <text
            y="32"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="600"
            fill="#64748b"
            letterSpacing="0.8"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {badge.tagline || 'Sardar Vallabhbhai National Institute of Tech'}
          </text>
        </g>

        {/* Right Logo: ACM */}
        {badge.showAcmLogo ? (
          <g>
            <rect x="368" y="28" width="46" height="46" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <g clipPath="url(#swiss-logo-clip-r)">
              <image
                href={acmLogoSrc}
                x="368"
                y="28"
                width="46"
                height="46"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        ) : (
          <g transform="translate(368, 28)">
            <g dangerouslySetInnerHTML={{ __html: CLEAN_LOGO_PLACEHOLDER('ACM') }} />
          </g>
        )}
      </g>

      {/* Swiss Horizontal Grid Rule */}
      <line x1="36" y1="88" x2="414" y2="88" stroke="#090d16" strokeWidth="2.5" />

      {/* Middle Asymmetric Layout: Photo Left, Name & Details Right */}
      <g id="swiss-content">
        {/* Photo Container */}
        <rect x="34" y="158" width={photoWidth + 4} height={photoHeight + 4} rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        {badge.photoUrl ? (
          <g clipPath="url(#swiss-photo-clip)">
            <image
              href={badge.photoUrl}
              x={36 - (photoWidth / 2) * (badge.photoScale - 1) + badge.photoOffsetX}
              y={160 - (photoHeight / 2) * (badge.photoScale - 1) + badge.photoOffsetY}
              width={photoWidth * badge.photoScale}
              height={photoHeight * badge.photoScale}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        ) : (
          <g transform="translate(36, 160)">
            <g dangerouslySetInnerHTML={{ __html: TYPOGRAPHIC_PHOTO_PLACEHOLDER(getInitials(badge.participantName), photoWidth, photoHeight) }} />
          </g>
        )}

        {/* Right Column: Participant Name, Role Pill, and Affiliation */}
        <g transform="translate(178, 168)">
          <text
            fontSize="8"
            fontWeight="800"
            fill="#64748b"
            letterSpacing="2"
            fontFamily="'JetBrains Mono', monospace"
          >
            CREDENTIAL HOLDER
          </text>
          <text
            y="26"
            fontSize={nameFontSize}
            fontWeight="900"
            fill="#090d16"
            letterSpacing="-0.02em"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {badge.participantName || 'Participant Name'}
          </text>
          <text
            y="50"
            fontSize="11"
            fontWeight="600"
            fill="#475569"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {badge.companyOrCollege || 'SVNIT Surat · Dept of CSE'}
          </text>

          {/* Role Pill */}
          <g transform="translate(0, 78)">
            <rect x="0" y="0" width="140" height="26" rx="3" fill={roleColor} />
            <text
              x="70"
              y="17"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="800"
              fill="#ffffff"
              letterSpacing="2"
              fontFamily="'JetBrains Mono', monospace"
            >
              {badge.role.toUpperCase()}
            </text>
          </g>

          <g transform="translate(0, 134)">
            <text fontSize="7.5" fontWeight="700" fill="#64748b" letterSpacing="1" fontFamily="'JetBrains Mono', monospace">
              PASS ID: <tspan fill="#090d16" fontWeight="800">{badge.idNumber || 'ACM-2026'}</tspan>
            </text>
          </g>
        </g>
      </g>

      {/* Swiss Metadata Grid at bottom */}
      <g transform="translate(36, 360)">
        <rect x="0" y="0" width="378" height="96" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

        {/* Column 1: Date */}
        <g transform="translate(20, 28)">
          <text fontSize="8" fontWeight="800" fill="#64748b" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
            CONFERENCE DATES
          </text>
          <text y="18" fontSize="12" fontWeight="800" fill="#090d16" fontFamily="'JetBrains Mono', monospace">
            {badge.date || 'OCT 24 - 26, 2026'}
          </text>
        </g>

        {/* Column 2: Venue */}
        <g transform="translate(200, 28)">
          <text fontSize="8" fontWeight="800" fill="#64748b" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
            SANCTIONED VENUE
          </text>
          <text y="18" fontSize="10.5" fontWeight="700" fill="#090d16" fontFamily="'Plus Jakarta Sans', sans-serif">
            {badge.venue ? (badge.venue.length > 22 ? badge.venue.slice(0, 20) + '...' : badge.venue) : 'SVNIT Campus, Surat'}
          </text>
        </g>

        <line x1="16" y1="58" x2="362" y2="58" stroke="#e2e8f0" strokeWidth="1" />

        <g transform="translate(20, 78)">
          <text fontSize="7.5" fontWeight="600" fill="#64748b" fontFamily="'Plus Jakarta Sans', sans-serif">
            Official Academic Credential · Authorized by SVNIT ACM Secretariat
          </text>
        </g>
      </g>

      {/* Scannable Verification Footer Block */}
      <g transform="translate(36, 480)">
        <rect x="0" y="0" width="378" height="180" rx="4" fill="#090d16" />

        {/* High-Contrast QR Code */}
        <g transform="translate(24, 25)">
          <rect x="0" y="0" width="130" height="130" fill="#ffffff" rx="3" />
          <rect x="12" y="12" width="36" height="36" fill="#090d16" />
          <rect x="18" y="18" width="24" height="24" fill="#ffffff" />
          <rect x="24" y="24" width="12" height="12" fill="#090d16" />

          <rect x="82" y="12" width="36" height="36" fill="#090d16" />
          <rect x="88" y="18" width="24" height="24" fill="#ffffff" />
          <rect x="94" y="24" width="12" height="12" fill="#090d16" />

          <rect x="12" y="82" width="36" height="36" fill="#090d16" />
          <rect x="18" y="88" width="24" height="24" fill="#ffffff" />
          <rect x="24" y="94" width="12" height="12" fill="#090d16" />

          <rect x="58" y="18" width="14" height="14" fill="#090d16" />
          <rect x="58" y="58" width="16" height="16" fill="#090d16" />
          <rect x="94" y="94" width="16" height="16" fill="#090d16" />
        </g>

        {/* Verification Text */}
        <g transform="translate(178, 54)">
          <text fontSize="12" fontWeight="800" fill="#ffffff" letterSpacing="1" fontFamily="'JetBrains Mono', monospace">
            SECURITY VERIFICATION
          </text>
          <text y="22" fontSize="9" fontWeight="500" fill="#94a3b8" fontFamily="'Plus Jakarta Sans', sans-serif">
            Digital Identity Hash Active
          </text>
          <text y="42" fontSize="9" fontWeight="600" fill="#38bdf8" fontFamily="'JetBrains Mono', monospace">
            UID: {badge.idNumber || 'ACM-2026-VAL'}
          </text>
          <text y="62" fontSize="8" fontWeight="500" fill="#64748b" fontFamily="'Plus Jakarta Sans', sans-serif">
            Scan with official gate reader
          </text>
        </g>
      </g>
    </g>
  );
};
