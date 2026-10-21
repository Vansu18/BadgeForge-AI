// Automated test runner for BadgeForge AI brief parser and validation heuristics
import { analyzeEventBrief } from './src/utils/aiBriefParser.ts';

console.log('--- Running BadgeForge AI Automated Heuristics & Parser Tests ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// Test Case 1: Aurora Innovation (Critique test: Name vs Event Confusion)
const auroraBrief = "Elena Vance is attending Aurora Innovation 2026 at Central Convention Centre on Nov 14 - 15, 2026 as a keynote speaker. Registration ID is AURORA-SPK-08.";
const r1 = analyzeEventBrief(auroraBrief);

assert(r1.extracted.participantName === 'Elena Vance', `Participant name correctly identified as 'Elena Vance' (got '${r1.extracted.participantName}')`);
assert(r1.extracted.eventName?.includes('Aurora Innovation'), `Event name correctly identified as containing 'Aurora Innovation' (got '${r1.extracted.eventName}')`);
assert(r1.extracted.role === 'Mentor', `Keynote speaker correctly mapped to role 'Mentor' (got '${r1.extracted.role}')`);
assert(r1.extracted.idNumber === 'AURORA-SPK-08', `Badge ID correctly extracted as 'AURORA-SPK-08' (got '${r1.extracted.idNumber}')`);
assert(r1.extracted.venue?.includes('Central Convention Centre'), `Venue correctly identified (got '${r1.extracted.venue}')`);
assert(r1.extracted.date?.includes('Nov 14'), `Date correctly identified (got '${r1.extracted.date}')`);

// Test Case 2: Inception 2026 Hackathon
const hackathonBrief = "Hosting the annual 'Inception 2026' hackathon at SVNIT Campus, Surat on Oct 24 - 26, 2026. Participant is Aarav Sharma, affiliated with SVNIT Surat CSE, badge ID SVNIT-ACM-4092.";
const r2 = analyzeEventBrief(hackathonBrief);

assert(r2.extracted.eventName === 'Inception 2026', `Quoted event name extracted as 'Inception 2026' (got '${r2.extracted.eventName}')`);
assert(r2.extracted.participantName === 'Aarav Sharma', `Participant name is 'Aarav Sharma' (got '${r2.extracted.participantName}')`);
assert(r2.extracted.role === 'Participant', `Role is 'Participant' (got '${r2.extracted.role}')`);
assert(r2.extracted.idNumber === 'SVNIT-ACM-4092', `Badge ID is 'SVNIT-ACM-4092' (got '${r2.extracted.idNumber}')`);
assert(r2.extracted.venue?.includes('SVNIT'), `Venue contains SVNIT (got '${r2.extracted.venue}')`);

// Test Case 3: Incomplete brief
const incompleteBrief = "Need a badge for volunteer crew member Rohan at the annual DesignFest 2026.";
const r3 = analyzeEventBrief(incompleteBrief);

assert(r3.extracted.role === 'Volunteer', `Role identified as 'Volunteer' (got '${r3.extracted.role}')`);
assert(r3.missingFields.some(f => f.field === 'venue'), 'Flags missing venue correctly');
assert(r3.missingFields.some(f => f.field === 'idNumber'), 'Flags missing badge ID correctly');
assert(r3.hasAmbiguity === true, 'Correctly flags that brief has ambiguity requiring confirmation');

console.log(`\nTests finished: ${passed} Passed, ${failed} Failed.`);
if (failed > 0) process.exit(1);
