import React from 'react';
import { BadgeData } from '../../types';
import { DEFAULT_SVNIT_LOGO_URL, DEFAULT_ACM_LOGO_URL, DEFAULT_AVATAR_SVG, CLEAN_LOGO_PLACEHOLDER } from '../../assets/logos';

interface TemplateProps {
  badge: BadgeData;
  roleColor: string;
}

export const HighSecurityTemplate: React.FC<TemplateProps> = ({ badge, roleColor }) => {
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

  const svnitLogoSrc = badge.customSvnitLogoUrl || DEFAULT_SVNIT_LOGO_URL;
  const acmLogoSrc = badge.customAcmLogoUrl || DEFAULT_ACM_LOGO_URL;

  return (
    <g id="high-security-template">
      <defs>
        <clipPath id="sec-photo-clip">
          <rect x="145" y="165" width="160" height="175" rx="10" />
        </clipPath>
        <clipPath id="sec-logo-clip-l">
          <rect x="24" y="24" width="48" height="48" rx="6" />
        </clipPath>
        <clipPath id="sec-logo-clip-r">
          <rect x="378" y="24" width="48" height="48" rx="6" />
        </clipPath>
      </defs>

      {/* Main Base Card - Matte Midnight Blue */}
      <rect x="0" y="0" width="450" height="700" rx="18" fill="#090f1d" />

      {/* Security Guilloche Pattern Background in center */}
      <g opacity="0.06" stroke={roleColor} strokeWidth="1">
        <circle cx="225" cy="450" r="120" fill="none" />
        <circle cx="225" cy="450" r="100" fill="none" />
        <circle cx="225" cy="450" r="80" fill="none" />
        <circle cx="225" cy="450" r="60" fill="none" />
        <polygon points="225,350 325,500 125,500" fill="none" />
        <polygon points="225,550 325,400 125,400" fill="none" />
      </g>

      {/* Full-Width Role Header Banner (Instant Distance Recognition) */}
      <path
        d="M 0 18 C 0 8 8 0 18 0 L 432 0 C 442 0 450 8 450 18 L 450 90 L 0 90 Z"
        fill={roleColor}
      />

      {/* Lanyard Cutout Slot */}
      <rect x="185" y="12" width="80" height="7" rx="3.5" fill="#090f1d" stroke="#1e293b" strokeWidth="1" />

      {/* Official Logos on Header Banner */}
      <g id="sec-header">
        {badge.showSvnitLogo ? (
          <g>
            <rect x="24" y="24" width="48" height="48" rx="6" fill="#ffffff" />
            <g clipPath="url(#sec-logo-clip-l)">
              <image
                href={svnitLogoSrc}
                x="24"
                y="24"
                width="48"
                height="48"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        ) : (
          <g transform="translate(24, 24)">
            <g dangerouslySetInnerHTML={{ __html: CLEAN_LOGO_PLACEHOLDER('SVNIT') }} />
          </g>
        )}

        {/* Center Role Designation in White */}
        <g transform="translate(225, 45)">
          <text
            textAnchor="middle"
            fontSize="18"
            fontWeight="900"
            fill="#ffffff"
            letterSpacing="2"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {badge.role.toUpperCase()}
          </text>
          <text
            y="18"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="2"
            opacity="0.9"
            fontFamily="'JetBrains Mono', monospace"
          >
            NATIONAL EVENT ACCREDITATION
          </text>
        </g>

        {badge.showAcmLogo ? (
          <g>
            <rect x="378" y="24" width="48" height="48" rx="6" fill="#ffffff" />
            <g clipPath="url(#sec-logo-clip-r)">
              <image
                href={acmLogoSrc}
                x="378"
                y="24"
                width="48"
                height="48"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        ) : (
          <g transform="translate(378, 24)">
            <g dangerouslySetInnerHTML={{ __html: CLEAN_LOGO_PLACEHOLDER('ACM') }} />
          </g>
        )}
      </g>

      {/* Event Title Strip */}
      <g transform="translate(225, 125)">
        <text
          textAnchor="middle"
          fontSize="17"
          fontWeight="900"
          fill="#f8fafc"
          letterSpacing="1"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {badge.eventName.toUpperCase() || 'HIGH-SECURITY EVENT'}
        </text>
        <text
          y="18"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="#94a3b8"
          letterSpacing="1"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {badge.tagline || 'Sardar Vallabhbhai National Institute of Tech'}
        </text>
      </g>

      {/* Photo Frame Section: Large Prominent Photo with Security Border */}
      <g id="photo-section">
        <rect
          x="142"
          y="162"
          width="166"
          height="181"
          rx="12"
          fill="#060a14"
          stroke={roleColor}
          strokeWidth="2.5"
        />

        {badge.photoUrl ? (
          <g clipPath="url(#sec-photo-clip)">
            <image
              href={badge.photoUrl}
              x={145 - 80 * (badge.photoScale - 1) + badge.photoOffsetX}
              y={165 - 87.5 * (badge.photoScale - 1) + badge.photoOffsetY}
              width={160 * badge.photoScale}
              height={175 * badge.photoScale}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        ) : (
          <g transform="translate(175, 195)">
            <g dangerouslySetInnerHTML={{ __html: DEFAULT_AVATAR_SVG(getInitials(badge.participantName)) }} />
          </g>
        )}

        {/* Security Holographic-style Stamp in bottom-right corner of photo */}
        <g transform="translate(285, 325)">
          <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
          <circle cx="0" cy="0" r="13" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 1" />
          <text y="3" textAnchor="middle" fontSize="6" fontWeight="900" fill="#38bdf8" fontFamily="'JetBrains Mono', monospace">
            SVNIT
          </text>
        </g>
      </g>

      {/* Participant Name & Security ID */}
      <g transform="translate(225, 385)">
        <text
          textAnchor="middle"
          fontSize={nameFontSize}
          fontWeight="900"
          fill="#ffffff"
          letterSpacing="0.25"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {badge.participantName || 'Participant Name'}
        </text>
        <text
          y="24"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#cbd5e1"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {badge.companyOrCollege || 'SVNIT Surat · Accredited Delegate'}
        </text>
      </g>

      {/* Security Access Clearance Bar: Zones 1, 2, 3 */}
      <g transform="translate(24, 435)">
        <rect x="0" y="0" width="402" height="42" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />

        {/* Zone 1 */}
        <g transform="translate(30, 26)">
          <rect x="-16" y="-14" width="32" height="20" rx="3" fill={badge.role === 'Organizer' || badge.role === 'Mentor' ? roleColor : '#1e293b'} />
          <text textAnchor="middle" fontSize="9" fontWeight="800" fill="#ffffff" fontFamily="'JetBrains Mono', monospace">Z1</text>
          <text x="24" y="-1" fontSize="8" fontWeight="700" fill="#94a3b8" fontFamily="'Plus Jakarta Sans', sans-serif">VIP/MAIN</text>
        </g>

        {/* Zone 2 */}
        <g transform="translate(170, 26)">
          <rect x="-16" y="-14" width="32" height="20" rx="3" fill={badge.role !== 'Participant' ? roleColor : '#1e293b'} />
          <text textAnchor="middle" fontSize="9" fontWeight="800" fill="#ffffff" fontFamily="'JetBrains Mono', monospace">Z2</text>
          <text x="24" y="-1" fontSize="8" fontWeight="700" fill="#94a3b8" fontFamily="'Plus Jakarta Sans', sans-serif">STAGE</text>
        </g>

        {/* Zone 3 */}
        <g transform="translate(300, 26)">
          <rect x="-16" y="-14" width="32" height="20" rx="3" fill={roleColor} />
          <text textAnchor="middle" fontSize="9" fontWeight="800" fill="#ffffff" fontFamily="'JetBrains Mono', monospace">Z3</text>
          <text x="24" y="-1" fontSize="8" fontWeight="700" fill="#94a3b8" fontFamily="'Plus Jakarta Sans', sans-serif">EXPO</text>
        </g>
      </g>

      {/* Structured Credential Grid */}
      <g transform="translate(24, 492)">
        <rect x="0" y="0" width="402" height="78" rx="6" fill="#0d1424" stroke="#1e293b" strokeWidth="1" />

        <g transform="translate(20, 26)">
          <text fontSize="8" fontWeight="700" fill="#64748b" letterSpacing="1" fontFamily="'JetBrains Mono', monospace">
            REGISTRATION IDENTIFIER
          </text>
          <text y="16" fontSize="13" fontWeight="800" fill="#38bdf8" fontFamily="'JetBrains Mono', monospace">
            {badge.idNumber || 'SEC-2026-PENDING'}
          </text>
        </g>

        <g transform="translate(220, 26)">
          <text fontSize="8" fontWeight="700" fill="#64748b" letterSpacing="1" fontFamily="'JetBrains Mono', monospace">
            DATES VALID
          </text>
          <text y="16" fontSize="11" fontWeight="700" fill="#e2e8f0" fontFamily="'JetBrains Mono', monospace">
            {badge.date || 'OCT 24 - 26, 2026'}
          </text>
        </g>

        <line x1="16" y1="50" x2="386" y2="50" stroke="#1e293b" strokeWidth="1" />

        <g transform="translate(20, 68)">
          <text fontSize="8" fontWeight="700" fill="#64748b" letterSpacing="1" fontFamily="'JetBrains Mono', monospace">
            VENUE: <tspan fill="#f8fafc" fontWeight="600">{badge.venue ? (badge.venue.length > 25 ? badge.venue.slice(0, 23) + '...' : badge.venue) : 'SVNIT Campus, Surat'}</tspan>
          </text>
        </g>
      </g>

      {/* Bottom Barcode Security Strip */}
      <g transform="translate(24, 584)">
        <rect x="0" y="0" width="402" height="92" rx="6" fill="#050811" stroke="#1e293b" strokeWidth="1" />

        {/* Vector Barcode */}
        <g transform="translate(20, 16)">
          <rect x="0" y="0" width="2" height="34" fill="#ffffff" />
          <rect x="4" y="0" width="4" height="34" fill="#ffffff" />
          <rect x="11" y="0" width="1" height="34" fill="#ffffff" />
          <rect x="15" y="0" width="3" height="34" fill="#ffffff" />
          <rect x="22" y="0" width="2" height="34" fill="#ffffff" />
          <rect x="28" y="0" width="5" height="34" fill="#ffffff" />
          <rect x="36" y="0" width="1" height="34" fill="#ffffff" />
          <rect x="40" y="0" width="3" height="34" fill="#ffffff" />
          <rect x="46" y="0" width="4" height="34" fill="#ffffff" />
          <rect x="53" y="0" width="2" height="34" fill="#ffffff" />
          <rect x="58" y="0" width="6" height="34" fill="#ffffff" />
          <rect x="67" y="0" width="1" height="34" fill="#ffffff" />
          <rect x="71" y="0" width="4" height="34" fill="#ffffff" />
          <rect x="78" y="0" width="2" height="34" fill="#ffffff" />
          <rect x="83" y="0" width="5" height="34" fill="#ffffff" />
          <rect x="91" y="0" width="2" height="34" fill="#ffffff" />
          <rect x="96" y="0" width="4" height="34" fill="#ffffff" />
          <rect x="103" y="0" width="2" height="34" fill="#ffffff" />
          <rect x="108" y="0" width="3" height="34" fill="#ffffff" />
          <text x="55" y="46" textAnchor="middle" fontSize="7" fill="#64748b" letterSpacing="2" fontFamily="'JetBrains Mono', monospace">
            *{badge.idNumber || 'SEC-2026'}*
          </text>
        </g>

        <g transform="translate(160, 28)">
          <text fontSize="9" fontWeight="800" fill="#ffffff" letterSpacing="1" fontFamily="'Plus Jakarta Sans', sans-serif">
            HIGH-SECURITY CREDENTIAL
          </text>
          <text y="15" fontSize="8" fontWeight="500" fill="#64748b" fontFamily="'Plus Jakarta Sans', sans-serif">
            Tampering voids pass · Return upon event conclusion
          </text>
        </g>

        {/* Security seal */}
        <g transform="translate(370, 46)">
          <circle cx="0" cy="0" r="16" fill="#0f172a" stroke={roleColor} strokeWidth="1.5" />
          <text y="3" textAnchor="middle" fontSize="7" fontWeight="900" fill={roleColor} fontFamily="'JetBrains Mono', monospace">
            AUTH
          </text>
        </g>
      </g>
    </g>
  );
};
