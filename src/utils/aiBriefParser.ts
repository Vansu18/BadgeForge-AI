import type { BadgeData, BadgeRole, BriefAnalysisResult, ParsedFieldItem } from '../types';

/**
 * Transparent Heuristic Brief Parser.
 * Deterministic client-side NLP pattern matching.
 * Does NOT claim to be a cloud LLM, ensuring zero hallucinated facts and complete data privacy.
 */

const NON_NAME_WORDS = new Set([
  'event', 'conference', 'summit', 'hackathon', 'conclave', 'symposium', 'fest', 'festival',
  'expo', 'forum', 'sprint', 'meetup', 'innovation', 'aurora', 'quantum', 'national', 'international',
  'annual', 'flagship', 'institute', 'department', 'college', 'university', 'campus', 'auditorium',
  'hall', 'centre', 'center', 'svnit', 'acm', 'chapter', 'participant', 'attendee', 'organizer',
  'organiser', 'mentor', 'volunteer', 'crew', 'lead', 'speaker', 'delegate', 'student', 'security'
]);

export function analyzeEventBrief(briefText: string): BriefAnalysisResult {
  const text = briefText.trim();
  const extracted: Partial<BadgeData> = {};
  const fieldItems: ParsedFieldItem[] = [];

  if (!text) {
    return {
      extracted: {},
      fieldItems: [],
      missingFields: getStandardMissingFields({}),
      originalBrief: '',
      hasAmbiguity: false
    };
  }

  // 1. Role Parsing
  let detectedRole: BadgeRole | null = null;
  let roleStatus: 'provided' | 'inferred' = 'provided';
  let roleReason = 'Explicitly stated in brief';

  if (/\b(role\s*(?:is|:)|as\s+(?:an?|the))\s*(organizer|organiser|core\s*team|lead|convenor)\b/i.test(text)) {
    detectedRole = 'Organizer';
  } else if (/\b(role\s*(?:is|:)|as\s+(?:an?|the))\s*(mentor|judge|jury|speaker|keynote|advisor|panelist)\b/i.test(text)) {
    detectedRole = 'Mentor';
  } else if (/\b(role\s*(?:is|:)|as\s+(?:an?|the))\s*(volunteer|crew|support|coordinator)\b/i.test(text)) {
    detectedRole = 'Volunteer';
  } else if (/\b(role\s*(?:is|:)|as\s+(?:an?|the))\s*(participant|attendee|hacker|delegate|student)\b/i.test(text)) {
    detectedRole = 'Participant';
  } else if (/\b(organizer|organiser|core\s*team|lead\s*organizer|convenor)\b/i.test(text)) {
    detectedRole = 'Organizer';
    roleStatus = 'inferred';
    roleReason = 'Inferred from organizational keywords';
  } else if (/\b(mentor|judge|jury|speaker|keynote\s*speaker|advisor|panelist)\b/i.test(text)) {
    detectedRole = 'Mentor';
    roleStatus = 'inferred';
    roleReason = 'Inferred from speaker/mentor terminology';
  } else if (/\b(volunteer|crew|event\s*crew|support\s*staff)\b/i.test(text)) {
    detectedRole = 'Volunteer';
    roleStatus = 'inferred';
    roleReason = 'Inferred from support/volunteer context';
  } else if (/\b(participant|attendee|hacker|delegate|student)\b/i.test(text)) {
    detectedRole = 'Participant';
    roleStatus = 'inferred';
    roleReason = 'Inferred general attendee role';
  }

  if (detectedRole) {
    extracted.role = detectedRole;
    fieldItems.push({
      field: 'role',
      label: 'Role',
      value: detectedRole,
      status: roleStatus,
      reason: roleReason
    });
  }

  // 2. Event Name Parsing
  // Check for quoted strings first e.g. "Inception 2026" or 'National AI & Quantum Summit'
  const quotedMatch = text.match(/["']([^"']{3,50})["']/);
  const eventRegex =
    /(?:event(?:\s*name)?(?:\s*is|:)?|hosting\s+(?:the)?|organizing\s+(?:the)?|annual|attending(?:\s+the)?)\s+([A-Z0-9][A-Za-z0-9\s&'-]{2,45}(?:Hackathon|Summit|Conference|Sprint|Conclave|Symposium|Fest|Expo|Meetup|Innovation|Con|202\d|203\d)?)/i;
  const eventMatch = text.match(eventRegex);

  let eventNameCandidate: string | null = null;
  let eventStatus: 'provided' | 'inferred' = 'provided';

  if (quotedMatch && quotedMatch[1].length > 3) {
    eventNameCandidate = quotedMatch[1].trim();
  } else if (eventMatch && eventMatch[1].trim().length > 3) {
    let raw = eventMatch[1].trim();
    // Stop event title at prepositions like 'at', 'on', 'in', 'dated', 'held'
    raw = raw.split(/\s+(?:at|on|in|from|as|with|dated|held)\s+/i)[0].trim();
    eventNameCandidate = raw;
  } else {
    // Look for recognizable titles like "Aurora Innovation 2026" or "National AI & Quantum Summit"
    const standaloneEvent = text.match(
      /\b([A-Z][a-zA-Z0-9&'-]+(?:\s+[A-Z0-9][a-zA-Z0-9&'-]+){1,5}(?:\s+(?:Summit|Conference|Conclave|Hackathon|Symposium|Sprint|Fest|202\d|203\d)))\b/
    );
    if (standaloneEvent) {
      eventNameCandidate = standaloneEvent[1].trim();
      eventStatus = 'inferred';
    }
  }

  // Ensure event candidate doesn't match common stop phrases
  if (eventNameCandidate && !/^participant|attendee|name|badge|id$/i.test(eventNameCandidate)) {
    extracted.eventName = eventNameCandidate;
    fieldItems.push({
      field: 'eventName',
      label: 'Event Name',
      value: eventNameCandidate,
      status: eventStatus,
      reason: eventStatus === 'provided' ? 'Directly identified event title' : 'Inferred from capitalized title syntax'
    });
  }

  // 3. Participant Name Parsing
  // Must avoid confusing "attending Aurora Innovation" or "for Inception 2026" with person names
  let participantCandidate: string | null = null;
  let participantStatus: 'provided' | 'inferred' = 'provided';

  // Explicit patterns: "name is Elena Vance", "participant: Sameer Patel", "badge for Dr. Priya Nair", "attendee Elena"
  const explicitNameMatch = text.match(
    /(?:participant(?:\s*name)?(?:\s*is|:)?|attendee(?:\s*name)?(?:\s*is|:)?|name(?:\s*is|:)?|badge\s+for|pass\s+for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i
  );

  const honorificMatch = text.match(
    /\b((?:Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/
  );

  const personBeforeActionMatch = text.match(
    /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:is\s+attending|will\s+attend|is\s+participating|is\s+a\s+(?:mentor|speaker|judge|volunteer|organizer|participant))\b/i
  );

  if (explicitNameMatch && isValidPersonName(explicitNameMatch[1])) {
    participantCandidate = explicitNameMatch[1].trim();
  } else if (honorificMatch && isValidPersonName(honorificMatch[1])) {
    participantCandidate = honorificMatch[1].trim();
  } else if (personBeforeActionMatch && isValidPersonName(personBeforeActionMatch[1])) {
    participantCandidate = personBeforeActionMatch[1].trim();
  } else {
    // If text has pattern "for [Person Name] attending [Event]"
    const forMatch = text.match(/\bfor\s+([A-Z][a-z]+\s+[A-Z][a-z]+)(?!\s+(?:Summit|Conference|Hackathon|Fest))\b/i);
    if (forMatch && isValidPersonName(forMatch[1])) {
      participantCandidate = forMatch[1].trim();
      participantStatus = 'inferred';
    }
  }

  if (participantCandidate) {
    extracted.participantName = participantCandidate;
    fieldItems.push({
      field: 'participantName',
      label: 'Participant Name',
      value: participantCandidate,
      status: participantStatus,
      reason: participantStatus === 'provided' ? 'Extracted from attendee identity phrasing' : 'Inferred person name'
    });
  }

  // 4. Date Parsing
  const dateRegex =
    /\b((?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:\s*(?:-|to|–)\s*\d{1,2})?(?:st|nd|rd|th)?(?:,?\s+202\d)?)|(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?(?:,?\s+202\d)?)|(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}))\b/i;
  const dateMatch = text.match(dateRegex);

  if (dateMatch) {
    const rawDate = dateMatch[1].trim();
    extracted.date = rawDate;
    fieldItems.push({
      field: 'date',
      label: 'Event Dates',
      value: rawDate,
      status: 'provided',
      reason: 'Standard calendar date pattern identified'
    });
  }

  // 5. Venue Parsing
  const venueRegex =
    /\b(?:venue(?:\s*is|:)?\s*|\bat\s+(?:the\s+)?|\blocation(?:\s*is|:)?\s*|\bheld\s+at\s+|\bin\s+(?:the\s+)?)([A-Z0-9][A-Za-z0-9\s&,.-]{1,50}?(?:Campus|Hall|Auditorium|Center|Centre|Lab|Hub|Building|Grounds|Surat|Complex|Room))\b/i;
  const venueMatch = text.match(venueRegex);

  if (venueMatch) {
    let venueStr = venueMatch[1].trim();
    venueStr = venueStr.split(/\s+(?:on|dated|for|with)\s+/i)[0].trim();
    extracted.venue = venueStr;
    fieldItems.push({
      field: 'venue',
      label: 'Venue',
      value: venueStr,
      status: 'provided',
      reason: 'Physical venue entity identified'
    });
  } else if (/svnit/i.test(text) && !extracted.venue) {
    extracted.venue = 'SVNIT Campus, Surat';
    fieldItems.push({
      field: 'venue',
      label: 'Venue',
      value: 'SVNIT Campus, Surat',
      status: 'inferred',
      reason: 'Inferred from SVNIT institution mention'
    });
  }

  // 6. ID Number Parsing
  const idRegex =
    /\b(?:registration\s*(?:id|#|number|no\.?)?|badge\s*(?:id|#|no\.?)?|id(?:\s*number|#)?)\s*(?:is|:|=|#)?\s*([A-Za-z0-9]+(?:-[A-Za-z0-9]+)+|[A-Z]{2,}\d+|\b[A-Z0-9]{4,}\b)/i;
  const idMatch = text.match(idRegex);

  if (idMatch && idMatch[1].length >= 2) {
    const idVal = idMatch[1].trim().toUpperCase();
    // Verify it's not a stop word
    if (!/^(?:NAME|ROLE|VENUE|DATE|BADGE|THE|FOR|CREW|PASS)$/i.test(idVal)) {
      extracted.idNumber = idVal;
      fieldItems.push({
        field: 'idNumber',
        label: 'Badge ID',
        value: idVal,
        status: 'provided',
        reason: 'Explicit registration / badge code detected'
      });
    }
  }

  // 7. Organization / Affiliation Parsing
  const affilMatch = text.match(/(?:affiliated\s+with|representing|from\s+(?:the)?|dept(?:\.|artment)?\s+of)\s+([A-Z][a-zA-Z0-9\s&,.-]{3,35})/i);
  if (affilMatch) {
    const affilVal = affilMatch[1].trim();
    extracted.companyOrCollege = affilVal;
    fieldItems.push({
      field: 'companyOrCollege',
      label: 'Affiliation',
      value: affilVal,
      status: 'provided',
      reason: 'Affiliation/department phrase matched'
    });
  } else if (/svnit\s*(?:acm|surat)?/i.test(text)) {
    extracted.companyOrCollege = 'SVNIT Surat';
    fieldItems.push({
      field: 'companyOrCollege',
      label: 'Affiliation',
      value: 'SVNIT Surat',
      status: 'inferred',
      reason: 'SVNIT context detected in brief'
    });
  }

  // Determine Missing Fields
  const missing = getStandardMissingFields(extracted);

  // Check if any critical field needs confirmation
  const hasAmbiguity = missing.length > 0 || fieldItems.some((f) => f.status === 'inferred');

  return {
    extracted,
    fieldItems,
    missingFields: missing,
    originalBrief: briefText,
    hasAmbiguity
  };
}

function isValidPersonName(str: string): boolean {
  if (!str) return false;
  const words = str.trim().split(/\s+/);
  if (words.length < 1 || words.length > 4) return false;

  for (const w of words) {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (NON_NAME_WORDS.has(clean)) {
      return false;
    }
  }
  return true;
}

function getStandardMissingFields(extracted: Partial<BadgeData>) {
  const missing: Array<{
    field: keyof BadgeData;
    label: string;
    question: string;
    placeholder: string;
  }> = [];

  if (!extracted.eventName) {
    missing.push({
      field: 'eventName',
      label: 'Event Title',
      question: 'What is the official title of this event or conference?',
      placeholder: 'e.g. INCEPTION 2026, Aurora Innovation Summit'
    });
  }

  if (!extracted.participantName) {
    missing.push({
      field: 'participantName',
      label: 'Participant Name',
      question: 'Who is the credential holder for this badge?',
      placeholder: 'e.g. Dr. Elena Vance, Aarav Sharma'
    });
  }

  if (!extracted.role) {
    missing.push({
      field: 'role',
      label: 'Attendee Role',
      question: 'What access or event role should be granted?',
      placeholder: 'Participant, Organizer, Mentor, or Volunteer'
    });
  }

  if (!extracted.idNumber) {
    missing.push({
      field: 'idNumber',
      label: 'Badge / Registration ID',
      question: 'What registration code or ID number should be displayed?',
      placeholder: 'e.g. SVNIT-2026-084, ACM-4092'
    });
  }

  if (!extracted.date) {
    missing.push({
      field: 'date',
      label: 'Event Dates',
      question: 'When is this event scheduled?',
      placeholder: 'e.g. OCT 24 - 26, 2026'
    });
  }

  if (!extracted.venue) {
    missing.push({
      field: 'venue',
      label: 'Sanctioned Venue',
      question: 'Where will the event take place?',
      placeholder: 'e.g. SVNIT Campus, Central Auditorium'
    });
  }

  return missing;
}
