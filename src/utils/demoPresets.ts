import { BadgeData } from '../types';

export interface DemoPreset {
  id: string;
  name: string;
  subtitle: string;
  badge: BadgeData;
  template: 'modern-tech' | 'corporate' | 'creative';
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'svnit-inception',
    name: '[Demo Data] SVNIT ACM Inception Hackathon',
    subtitle: 'High-tech national hackathon badge (Participant)',
    template: 'modern-tech',
    badge: {
      eventName: 'INCEPTION 2026',
      tagline: 'Annual Flagship Hackathon',
      participantName: 'Aarav Sharma',
      role: 'Participant',
      idNumber: 'ACM-SVNIT-4092',
      date: 'OCT 24 - 26, 2026',
      venue: 'SVNIT Campus, Surat, Gujarat',
      companyOrCollege: 'SVNIT Surat · Dept of CSE',
      photoUrl: null,
      photoScale: 1.0,
      photoOffsetX: 0,
      photoOffsetY: 0,
      showAcmLogo: true,
      showSvnitLogo: true,
      customAcmLogoUrl: null,
      customSvnitLogoUrl: null,
      qrCodeText: 'https://acm.svnit.ac.in/verify/ACM-SVNIT-4092'
    }
  },
  {
    id: 'national-tech-summit',
    name: '[Demo Data] National AI & Quantum Summit',
    subtitle: 'Executive corporate conference pass (Mentor & Keynote)',
    template: 'corporate',
    badge: {
      eventName: 'QUANTUM FORWARD 2026',
      tagline: 'National Tech & Innovation Conclave',
      participantName: 'Dr. Priya Nair',
      role: 'Mentor',
      idNumber: 'QFWD-M-108',
      date: 'NOV 14 - 15, 2026',
      venue: 'Surat International Exhibition & Convention Centre',
      companyOrCollege: 'Institute of Deep Computation',
      photoUrl: null,
      photoScale: 1.0,
      photoOffsetX: 0,
      photoOffsetY: 0,
      showAcmLogo: true,
      showSvnitLogo: false,
      customAcmLogoUrl: null,
      customSvnitLogoUrl: null,
      qrCodeText: 'https://quantumforward.org/speaker/dr-priya-nair'
    }
  },
  {
    id: 'creative-design-sprint',
    name: '[Demo Data] DesignForge Creative Conclave',
    subtitle: 'Vibrant creative designer pass (Organizer)',
    template: 'creative',
    badge: {
      eventName: 'DESIGNFORGE 2026',
      tagline: 'Next-Gen Experience Festival',
      participantName: 'Rohan Mehta',
      role: 'Organizer',
      idNumber: 'DF-ORG-007',
      date: 'DEC 05 - 07, 2026',
      venue: 'Innovation Hub, SVNIT Surat',
      companyOrCollege: 'Design Guild & Creative Labs',
      photoUrl: null,
      photoScale: 1.0,
      photoOffsetX: 0,
      photoOffsetY: 0,
      showAcmLogo: true,
      showSvnitLogo: true,
      customAcmLogoUrl: null,
      customSvnitLogoUrl: null,
      qrCodeText: 'https://badgeforge.studio/verify/DF-ORG-007'
    }
  }
];

export const BLANK_BADGE_DATA: BadgeData = {
  eventName: '',
  tagline: '',
  participantName: '',
  role: 'Participant',
  idNumber: '',
  date: '',
  venue: '',
  companyOrCollege: '',
  photoUrl: null,
  photoScale: 1.0,
  photoOffsetX: 0,
  photoOffsetY: 0,
  showAcmLogo: true,
  showSvnitLogo: true,
  customAcmLogoUrl: null,
  customSvnitLogoUrl: null,
  qrCodeText: ''
};
