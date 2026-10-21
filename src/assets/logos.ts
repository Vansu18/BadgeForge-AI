import { OFFICIAL_SVNIT_LOGO, OFFICIAL_ACM_LOGO } from './officialLogosData';

/**
 * Official institutional logos for SVNIT and ACM Student Chapter NIT Surat.
 * Directly sourced from the official asset files in the project.
 */
export const DEFAULT_SVNIT_LOGO_URL = OFFICIAL_SVNIT_LOGO;
export const DEFAULT_ACM_LOGO_URL = OFFICIAL_ACM_LOGO;

/**
 * Clean, honest placeholder used strictly when an official asset is not provided.
 * Does not attempt to invent or fake institutional marks.
 */
export const CLEAN_LOGO_PLACEHOLDER = (label: string) => `
<g>
  <rect x="0" y="0" width="48" height="48" rx="4" fill="#18181b" stroke="#27272a" stroke-width="1" stroke-dasharray="2 2" />
  <text x="24" y="22" text-anchor="middle" font-size="7" font-weight="700" fill="#71717a" font-family="'JetBrains Mono', monospace">${label}</text>
  <text x="24" y="32" text-anchor="middle" font-size="6" font-weight="500" fill="#52525b" font-family="'JetBrains Mono', monospace">SLOT</text>
</g>
`;

/**
 * Dignified typographic photo placeholder (3:4 aspect ratio).
 * Replaces generic initials circles with an intentional, conference-grade portrait frame.
 */
export const TYPOGRAPHIC_PHOTO_PLACEHOLDER = (
  initials: string,
  width: number = 120,
  height: number = 160
) => `
<g>
  <rect width="${width}" height="${height}" rx="4" fill="#141416" stroke="#27272a" stroke-width="1" />
  <rect x="6" y="6" width="${width - 12}" height="${height - 12}" fill="none" stroke="#202124" stroke-width="0.75" stroke-dasharray="3 3" />
  
  <!-- Subtle Corner Guides -->
  <path d="M 12 20 L 12 12 L 20 12" fill="none" stroke="#52525b" stroke-width="1" />
  <path d="M ${width - 20} 12 L ${width - 12} 12 L ${width - 12} 20" fill="none" stroke="#52525b" stroke-width="1" />
  <path d="M 12 ${height - 20} L 12 ${height - 12} L 20 ${height - 12}" fill="none" stroke="#52525b" stroke-width="1" />
  <path d="M ${width - 20} ${height - 12} L ${width - 12} ${height - 12} L ${width - 12} ${height - 20}" fill="none" stroke="#52525b" stroke-width="1" />

  <!-- Center Monogram Box -->
  <rect x="${width / 2 - 20}" y="${height / 2 - 22}" width="40" height="28" rx="3" fill="#1c1d22" stroke="#3f3f46" stroke-width="0.75" />
  <text x="${width / 2}" y="${height / 2 - 4}" text-anchor="middle" font-size="14" font-weight="800" fill="#e4e4e7" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="1">
    ${initials || 'ID'}
  </text>

  <!-- Descriptor Label -->
  <text x="${width / 2}" y="${height / 2 + 24}" text-anchor="middle" font-size="7" font-weight="700" fill="#71717a" letter-spacing="1.5" font-family="'JetBrains Mono', monospace">
    ATTENDEE PHOTO
  </text>
  <text x="${width / 2}" y="${height / 2 + 34}" text-anchor="middle" font-size="6" font-weight="500" fill="#52525b" font-family="'JetBrains Mono', monospace">
    CREDENTIAL PASS
  </text>
</g>
`;

/**
 * Backward compatibility avatar SVG.
 */
export const DEFAULT_AVATAR_SVG = (initials: string) => TYPOGRAPHIC_PHOTO_PLACEHOLDER(initials, 120, 160);
