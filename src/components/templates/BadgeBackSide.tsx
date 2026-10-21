import React from 'react';
import { BadgeData } from '../../types';
import { DEFAULT_SVNIT_LOGO_URL, DEFAULT_ACM_LOGO_URL } from '../../assets/logos';

interface BadgeBackSideProps {
  badge: BadgeData;
  roleColor: string;
}

export const BadgeBackSide: React.FC<BadgeBackSideProps> = ({ badge, roleColor }) => {
  const svnitLogoSrc = badge.customSvnitLogoUrl || DEFAULT_SVNIT_LOGO_URL;
  const acmLogoSrc = badge.customAcmLogoUrl || DEFAULT_ACM_LOGO_URL;

  const hasWifi = Boolean(badge.wifiNetwork?.trim() || badge.wifiPassword?.trim());
  const hasEmergency = Boolean(badge.emergencyContact?.trim());

  return (
    <g id="badge-back-side">
      <defs>
        <clipPath id="back-logo-clip-l">
          <rect x="28" y="28" width="46" height="46" rx="4" />
        </clipPath>
        <clipPath id="back-logo-clip-r">
          <rect x="376" y="28" width="46" height="46" rx="4" />
        </clipPath>
      </defs>

      {/* Card Base - Deep Matte Charcoal */}
      <rect x="0" y="0" width="450" height="700" rx="16" fill="#0d0e12" />
      <rect x="1" y="1" width="448" height="698" rx="15" fill="none" stroke="#22242a" strokeWidth="1.5" />
      <rect x="8" y="8" width="434" height="684" rx="12" fill="none" stroke="#16171d" strokeWidth="1" />

      {/* Lanyard Cutout Slot */}
      <rect x="185" y="12" width="80" height="7" rx="3.5" fill="#06070a" stroke="#2c2e36" strokeWidth="1" />

      {/* Header Institution Row */}
      <g id="back-header">
        {badge.showSvnitLogo && (
          <g>
            <rect x="28" y="28" width="46" height="46" rx="4" fill="#ffffff" stroke="#22242a" strokeWidth="1" />
            <g clipPath="url(#back-logo-clip-l)">
              <image href={svnitLogoSrc} x="28" y="28" width="46" height="46" preserveAspectRatio="xMidYMid meet" />
            </g>
          </g>
        )}

        <g transform="translate(225, 42)">
          <text textAnchor="middle" fontSize="10" fontWeight="800" fill="#f8fafc" letterSpacing="0.8" fontFamily="'Plus Jakarta Sans', sans-serif">
            {badge.eventName.toUpperCase() || 'EVENT CREDENTIAL'}
          </text>
          <text y="16" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#71717a" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
            ATTENDEE CREDENTIAL DIRECTIVE · REVERSE SIDE
          </text>
        </g>

        {badge.showAcmLogo && (
          <g>
            <rect x="376" y="28" width="46" height="46" rx="4" fill="#ffffff" stroke="#22242a" strokeWidth="1" />
            <g clipPath="url(#back-logo-clip-r)">
              <image href={acmLogoSrc} x="376" y="28" width="46" height="46" preserveAspectRatio="xMidYMid meet" />
            </g>
          </g>
        )}
      </g>

      <line x1="28" y1="88" x2="422" y2="88" stroke="#1f2127" strokeWidth="1" />

      {/* Dynamic Content Stack: Rendered strictly when provided, with zero instructional placeholder text */}
      {/* 1. Emergency Contact (Rendered strictly when actual data has been provided) */}
      {hasEmergency && (
        <g transform="translate(28, 104)">
          <rect x="0" y="0" width="394" height="66" rx="6" fill="#13151b" stroke="#27272a" strokeWidth="1" />
          <g transform="translate(20, 24)">
            <text fontSize="7.5" fontWeight="800" fill="#f87171" letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
              EMERGENCY ASSISTANCE & HELPDESK
            </text>
            <text y="20" fontSize="12" fontWeight="800" fill="#f8fafc" fontFamily="'Plus Jakarta Sans', sans-serif">
              {badge.emergencyContact}
            </text>
          </g>
        </g>
      )}

      {/* 2. Wi-Fi Access Information (Rendered strictly when actual credentials provided) */}
      {hasWifi && (
        <g transform={`translate(28, ${hasEmergency ? 180 : 104})`}>
          <rect x="0" y="0" width="394" height="68" rx="6" fill="#111318" stroke="#1f2127" strokeWidth="1" />
          <g transform="translate(20, 24)">
            <text fontSize="7.5" fontWeight="800" fill={roleColor} letterSpacing="1.5" fontFamily="'JetBrains Mono', monospace">
              CONFERENCE WI-FI ACCESS
            </text>
            <text y="18" fontSize="11" fontWeight="800" fill="#f8fafc" fontFamily="'JetBrains Mono', monospace">
              SSID: {badge.wifiNetwork || 'DEFAULT'}
            </text>
            {badge.wifiPassword && (
              <text y="32" fontSize="9.5" fontWeight="600" fill="#a1a1aa" fontFamily="'JetBrains Mono', monospace">
                KEY: {badge.wifiPassword}
              </text>
            )}
          </g>
        </g>
      )}

      {/* 3. Essential Credential Directives (Clean, compact, institutional conditions) */}
      <g transform={`translate(28, ${hasEmergency && hasWifi ? 260 : hasEmergency || hasWifi ? 184 : 104})`}>
        <rect
          x="0"
          y="0"
          width="394"
          height={hasEmergency && hasWifi ? 230 : hasEmergency || hasWifi ? 290 : 360}
          rx="6"
          fill="#111317"
          stroke="#1f2127"
          strokeWidth="1"
        />
        <g transform="translate(24, 30)">
          <text fontSize="8.5" fontWeight="800" fill="#e4e4e7" letterSpacing="1.2" fontFamily="'Plus Jakarta Sans', sans-serif">
            CREDENTIAL TERMS & PROTOCOLS
          </text>

          <g transform="translate(0, 26)">
            <circle cx="2" cy="2" r="2" fill={roleColor} />
            <text x="14" y="5" fontSize="8.5" fontWeight="500" fill="#a1a1aa" fontFamily="'Plus Jakarta Sans', sans-serif">
              This credential must remain visibly displayed during all sanctioned events.
            </text>
          </g>

          <g transform="translate(0, 52)">
            <circle cx="2" cy="2" r="2" fill={roleColor} />
            <text x="14" y="5" fontSize="8.5" fontWeight="500" fill="#a1a1aa" fontFamily="'Plus Jakarta Sans', sans-serif">
              Issued exclusively to the named delegate; strictly non-transferable.
            </text>
          </g>

          <g transform="translate(0, 78)">
            <circle cx="2" cy="2" r="2" fill={roleColor} />
            <text x="14" y="5" fontSize="8.5" fontWeight="500" fill="#a1a1aa" fontFamily="'Plus Jakarta Sans', sans-serif">
              Valid at {badge.venue ? badge.venue : 'SVNIT Campus, Surat'} for scheduled dates.
            </text>
          </g>

          <g transform="translate(0, 104)">
            <circle cx="2" cy="2" r="2" fill={roleColor} />
            <text x="14" y="5" fontSize="8.5" fontWeight="500" fill="#a1a1aa" fontFamily="'Plus Jakarta Sans', sans-serif">
              Report lost or damaged badges to the registration desk immediately.
            </text>
          </g>

          {(!hasEmergency || !hasWifi) && (
            <g transform="translate(0, 130)">
              <circle cx="2" cy="2" r="2" fill={roleColor} />
              <text x="14" y="5" fontSize="8.5" fontWeight="500" fill="#a1a1aa" fontFamily="'Plus Jakarta Sans', sans-serif">
                Access subject to safety regulations of SVNIT and organizing committee.
              </text>
            </g>
          )}
        </g>
      </g>

      {/* 4. Scannable Verification Matrix Strip */}
      <g transform="translate(28, 550)">
        <rect x="0" y="0" width="394" height="120" rx="6" fill="#08090c" stroke="#1f2127" strokeWidth="1" />

        {/* High-Contrast QR Code */}
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
            AUTHENTICATED CREDENTIAL
          </text>
          <text y="18" fontSize="8" fontWeight="500" fill="#71717a" fontFamily="'Plus Jakarta Sans', sans-serif">
            Digital Identity · SVNIT ACM Student Chapter
          </text>
          <text y="34" fontSize="7.5" fontWeight="600" fill="#38bdf8" fontFamily="'JetBrains Mono', monospace">
            HASH: {badge.idNumber || 'ACM-SVNIT-VERIFIED'}
          </text>
        </g>
      </g>
    </g>
  );
};
