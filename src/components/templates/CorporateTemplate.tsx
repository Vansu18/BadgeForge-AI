import React from 'react';
import { BadgeData } from '../../types';
import { DEFAULT_SVNIT_LOGO_URL, DEFAULT_ACM_LOGO_URL, CLEAN_LOGO_PLACEHOLDER, TYPOGRAPHIC_PHOTO_PLACEHOLDER } from '../../assets/logos';

interface TemplateProps {
  badge: BadgeData;
  roleColor: string;
}

export const CorporateTemplate: React.FC<TemplateProps> = ({ badge, roleColor }) => {
  const getInitials = (name: string) => {
    if (!name) return 'ID';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const nameLength = badge.participantName.length;
  let nameFontSize = 26;
  if (nameLength > 24) nameFontSize = 18;
  else if (nameLength > 18) nameFontSize = 22;

  const eventLength = badge.eventName.length;
  let eventFontSize = 19;
  if (eventLength > 24) eventFontSize = 15;
  else if (eventLength > 18) eventFontSize = 17;

  const svnitLogoSrc = badge.customSvnitLogoUrl || DEFAULT_SVNIT_LOGO_URL;
  const acmLogoSrc = badge.customAcmLogoUrl || DEFAULT_ACM_LOGO_URL;

  const photoWidth = 120;
  const photoHeight = 160; // 3:4 Aspect Ratio

  return (
    <g id="corporate-template">
      <defs>
        <clipPath id="corp-3x4-photo-clip">
          <rect x="165" y="196" width={photoWidth} height={photoHeight} rx="4" />
        </clipPath>
        <clipPath id="corp-logo-clip-l">
          <rect x="28" y="28" width="46" height="46" rx="4" />
        </clipPath>
        <clipPath id="corp-logo-clip-r">
          <rect x="376" y="28" width="46" height="46" rx="4" />
        </clipPath>
      </defs>

      {/* Main Base Card - Deep Obsidian Slate */}
      <rect x="0" y="0" width="450" height="700" rx="16" fill="#0d0e12" />

      {/* Continuous Outer Hairline Border */}
      <rect x="1" y="1" width="448" height="698" rx="15" fill="none" stroke="#23252b" strokeWidth="1.5" />
      <rect x="8" y="8" width="434" height="684" rx="11" fill="none" stroke="#181a20" strokeWidth="1" />

      {/* Lanyard Punch Slot */}
      <rect x="185" y="12" width="80" height="7" rx="3.5" fill="#07080a" stroke="#2c2e36" strokeWidth="1" />

      {/* Institutional Top Header */}
      <g id="corp-header">
        {/* SVNIT Official Logo Slot */}
        {badge.showSvnitLogo ? (
          <g>
            <rect x="28" y="28" width="46" height="46" rx="4" fill="#ffffff" stroke="#27272a" strokeWidth="1" />
            <g clipPath="url(#corp-logo-clip-l)">
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

        {/* Center Institutional Typography */}
        <g transform="translate(225, 42)">
          <text
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="700"
            fill="#a1a1aa"
            letterSpacing="0.8"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            Sardar Vallabhbhai National Institute of Technology
          </text>
          <text
            y="16"
            textAnchor="middle"
            fontSize="7"
            fontWeight="600"
            fill="#71717a"
            letterSpacing="1.2"
            fontFamily="'JetBrains Mono', monospace"
          >
            SURAT, GUJARAT · EVENT CREDENTIAL PASS
          </text>
        </g>

        {/* ACM Official Logo Slot */}
        {badge.showAcmLogo ? (
          <g>
            <rect x="376" y="28" width="46" height="46" rx="4" fill="#ffffff" stroke="#27272a" strokeWidth="1" />
            <g clipPath="url(#corp-logo-clip-r)">
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

      {/* Horizontal Divider */}
      <line x1="28" y1="84" x2="422" y2="84" stroke="#22242a" strokeWidth="1" />

      {/* Main Inset Card Body */}
      <g transform="translate(24, 94)">
        <rect x="0" y="0" width="402" height="468" rx="8" fill="#13151a" stroke="#22242a" strokeWidth="1" />

        {/* 1. Attendee Name First (Dominant Visual Anchor) */}
        <g transform="translate(201, 38)">
          <text
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="700"
            fill="#71717a"
            letterSpacing="2"
            fontFamily="'JetBrains Mono', monospace"
          >
            CREDENTIAL HOLDER
          </text>
          <text
            y="28"
            textAnchor="middle"
            fontSize={nameFontSize}
            fontWeight="800"
            fill="#f8fafc"
            letterSpacing="-0.01em"
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
            {badge.companyOrCollege || 'Institutional Delegate'}
          </text>
        </g>

        {/* 2. Proper 3:4 Rectangular Portrait Frame */}
        <g transform="translate(0, 102)">
          <rect
            x="139"
            y="0"
            width={photoWidth + 4}
            height={photoHeight + 4}
            rx="5"
            fill="#090a0d"
            stroke="#27272a"
            strokeWidth="1"
          />

          {badge.photoUrl ? (
            <g clipPath="url(#corp-3x4-photo-clip)" transform="translate(-24, -94)">
              <image
                href={badge.photoUrl}
                x={165 - (photoWidth / 2) * (badge.photoScale - 1) + badge.photoOffsetX}
                y={196 - (photoHeight / 2) * (badge.photoScale - 1) + badge.photoOffsetY}
                width={photoWidth * badge.photoScale}
                height={photoHeight * badge.photoScale}
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          ) : (
            <g transform="translate(141, 2)">
              <g dangerouslySetInnerHTML={{ __html: TYPOGRAPHIC_PHOTO_PLACEHOLDER(getInitials(badge.participantName), photoWidth, photoHeight) }} />
            </g>
          )}
        </g>

        {/* 3. Elegant Role Marker (Integrated Strip) */}
        <g transform="translate(201, 285)">
          <rect
            x="-75"
            y="-13"
            width="150"
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

        {/* 4. Event Identity */}
        <g transform="translate(201, 335)">
          <text
            textAnchor="middle"
            fontSize={eventFontSize}
            fontWeight="900"
            fill="#f8fafc"
            letterSpacing="0.5"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {badge.eventName.toUpperCase() || 'EXECUTIVE CONCLAVE'}
          </text>
          <text
            y="18"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="600"
            fill="#71717a"
            letterSpacing="1"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {badge.tagline || 'Official Annual Technical Conference'}
          </text>
        </g>

        {/* 5. Structured Schedule & Venue Line */}
        <line x1="20" y1="385" x2="382" y2="385" stroke="#22242a" strokeWidth="1" />
        <g transform="translate(20, 412)">
          <text fontSize="7.5" fontWeight="700" fill="#71717a" letterSpacing="1" fontFamily="'JetBrains Mono', monospace">
            DATES: <tspan fill="#e4e4e7" fontWeight="600">{badge.date || 'OCT 24 - 26, 2026'}</tspan>
          </text>
          <text x="362" y="0" textAnchor="end" fontSize="7.5" fontWeight="700" fill="#71717a" letterSpacing="1" fontFamily="'JetBrains Mono', monospace">
            VENUE: <tspan fill="#e4e4e7" fontWeight="600">{badge.venue ? (badge.venue.length > 22 ? badge.venue.slice(0, 20) + '...' : badge.venue) : 'SVNIT Campus'}</tspan>
          </text>
        </g>

        <g transform="translate(20, 442)">
          <text fontSize="7.5" fontWeight="700" fill="#71717a" letterSpacing="1" fontFamily="'JetBrains Mono', monospace">
            BADGE ID: <tspan fill="#38bdf8" fontWeight="700">{badge.idNumber || 'ACM-SVNIT-2026'}</tspan>
          </text>
          <text x="362" y="0" textAnchor="end" fontSize="7.5" fontWeight="700" fill="#71717a" letterSpacing="1" fontFamily="'JetBrains Mono', monospace">
            STATUS: <tspan fill="#34d399" fontWeight="700">VERIFIED ATTENDEE</tspan>
          </text>
        </g>
      </g>

      {/* 6. High-Contrast Check-in / Security Footer (Clean & Functional) */}
      <g transform="translate(24, 578)">
        <rect x="0" y="0" width="402" height="96" rx="6" fill="#08090c" stroke="#22242a" strokeWidth="1" />

        {/* Clean Vector Barcode */}
        <g transform="translate(22, 18)">
          <rect x="0" y="0" width="2" height="38" fill="#ffffff" />
          <rect x="4" y="0" width="3.5" height="38" fill="#ffffff" />
          <rect x="10" y="0" width="1.5" height="38" fill="#ffffff" />
          <rect x="14" y="0" width="4" height="38" fill="#ffffff" />
          <rect x="21" y="0" width="2" height="38" fill="#ffffff" />
          <rect x="26" y="0" width="5" height="38" fill="#ffffff" />
          <rect x="34" y="0" width="1.5" height="38" fill="#ffffff" />
          <rect x="38" y="0" width="3" height="38" fill="#ffffff" />
          <rect x="44" y="0" width="4" height="38" fill="#ffffff" />
          <rect x="51" y="0" width="2" height="38" fill="#ffffff" />
          <rect x="56" y="0" width="5.5" height="38" fill="#ffffff" />
          <rect x="64" y="0" width="1.5" height="38" fill="#ffffff" />
          <rect x="68" y="0" width="3" height="38" fill="#ffffff" />
          <rect x="74" y="0" width="2" height="38" fill="#ffffff" />
          <rect x="79" y="0" width="4.5" height="38" fill="#ffffff" />
          <rect x="86" y="0" width="2" height="38" fill="#ffffff" />
          <rect x="91" y="0" width="4" height="38" fill="#ffffff" />
          <rect x="98" y="0" width="2" height="38" fill="#ffffff" />
          <rect x="103" y="0" width="3" height="38" fill="#ffffff" />
          <text x="54" y="52" textAnchor="middle" fontSize="7.5" fill="#71717a" letterSpacing="2" fontFamily="'JetBrains Mono', monospace">
            *{badge.idNumber || 'ACM-2026'}*
          </text>
        </g>

        {/* Center Security Label */}
        <g transform="translate(155, 36)">
          <text fontSize="8.5" fontWeight="700" fill="#f8fafc" letterSpacing="0.5" fontFamily="'Plus Jakarta Sans', sans-serif">
            OFFICIAL SECURITY BADGE
          </text>
          <text y="14" fontSize="7" fontWeight="500" fill="#71717a" fontFamily="'Plus Jakarta Sans', sans-serif">
            Non-transferable · Present for hall entry
          </text>
        </g>

        {/* Clean Scannable Check-in QR */}
        <g transform="translate(328, 16)">
          <rect x="0" y="0" width="56" height="56" rx="3" fill="#ffffff" />
          <rect x="5" y="5" width="14" height="14" fill="#08090c" />
          <rect x="7" y="7" width="10" height="10" fill="#ffffff" />
          <rect x="9" y="9" width="6" height="6" fill="#08090c" />

          <rect x="37" y="5" width="14" height="14" fill="#08090c" />
          <rect x="39" y="7" width="10" height="10" fill="#ffffff" />
          <rect x="41" y="9" width="6" height="6" fill="#08090c" />

          <rect x="5" y="37" width="14" height="14" fill="#08090c" />
          <rect x="7" y="39" width="10" height="10" fill="#ffffff" />
          <rect x="9" y="41" width="6" height="6" fill="#08090c" />

          <rect x="23" y="8" width="5" height="5" fill="#08090c" />
          <rect x="23" y="23" width="10" height="10" fill="#08090c" />
          <rect x="39" y="23" width="8" height="8" fill="#08090c" />
          <rect x="23" y="39" width="6" height="6" fill="#08090c" />
          <rect x="39" y="39" width="8" height="8" fill="#08090c" />
          <text x="28" y="68" textAnchor="middle" fontSize="6" fontWeight="700" fill="#71717a" fontFamily="'JetBrains Mono', monospace">
            SCAN UID
          </text>
        </g>
      </g>
    </g>
  );
};
