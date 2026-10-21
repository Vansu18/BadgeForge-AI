export type BadgeRole = 'Participant' | 'Organizer' | 'Mentor' | 'Volunteer';

export type BadgeTemplate =
  | 'modern-tech'
  | 'corporate'
  | 'creative'
  | 'swiss-minimal'
  | 'high-security';

export interface BadgeData {
  eventName: string;
  tagline: string;
  participantName: string;
  role: BadgeRole;
  idNumber: string;
  date: string;
  venue: string;
  companyOrCollege: string;
  photoUrl: string | null;
  photoScale: number; // 1.0 to 2.5
  photoOffsetX: number; // -60 to 60
  photoOffsetY: number; // -60 to 60
  photoBorderRadius?: number; // 0 for square, 50 for circle, etc.
  showAcmLogo: boolean;
  showSvnitLogo: boolean;
  customAcmLogoUrl: string | null;
  customSvnitLogoUrl: string | null;
  qrCodeText: string;
  accentColor?: string;
  // Back-side content
  wifiNetwork?: string;
  wifiPassword?: string;
  emergencyContact?: string;
  scheduleSummary?: string;
}

export type ParsedFieldStatus = 'provided' | 'inferred' | 'needs_confirmation';

export interface ParsedFieldItem {
  field: keyof BadgeData;
  label: string;
  value: string;
  status: ParsedFieldStatus;
  question?: string;
  reason?: string;
}

export interface BriefAnalysisResult {
  extracted: Partial<BadgeData>;
  fieldItems: ParsedFieldItem[];
  missingFields: Array<{
    field: keyof BadgeData;
    label: string;
    question: string;
    placeholder: string;
  }>;
  originalBrief: string;
  hasAmbiguity: boolean;
}

export interface AttendeeRecord {
  id: string;
  participantName: string;
  role: BadgeRole;
  idNumber: string;
  companyOrCollege: string;
  email?: string;
  photoUrl?: string;
  valid: boolean;
  validationError?: string;
}

export interface PrintSettings {
  format: '3.5x5.5' | '4x6' | '90x140mm' | 'A6';
  showBleed: boolean;
  showSafeMargin: boolean;
  showCropMarks: boolean;
  showPunchHoleZone: boolean;
  resolutionDpi: 300 | 600;
}
