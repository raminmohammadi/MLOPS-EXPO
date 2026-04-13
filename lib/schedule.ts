/**
 * MLOps Expo Season 6 — April 15, 2026
 * All session windows are in EDT (UTC−4).
 */

const EVENT_DATE = '2026-04-15';

/** Convert an EDT wall-clock time on the event day to a UTC Date. */
function edt(hour: number, minute: number): Date {
  // EDT = UTC − 4  →  UTC = EDT + 4
  const utcHour = hour + 4;
  return new Date(
    `${EVENT_DATE}T${String(utcHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`,
  );
}

export const SCHEDULE = {
  section1: { start: edt(9, 30),  end: edt(11, 30), label: '9:30 AM – 11:30 AM EDT' },
  section2: { start: edt(12, 0),  end: edt(14, 0),  label: '12:00 PM – 2:00 PM EDT' },
  leaderboardAt: edt(14, 30),
} as const;

// ── Phase ─────────────────────────────────────────────────────────────────────

export type Phase =
  | { kind: 'before_event' }
  | { kind: 'section_1' }
  | { kind: 'between_sections' }
  | { kind: 'section_2' }
  | { kind: 'post_voting'; leaderboardReady: boolean };

export function getPhase(now = new Date()): Phase {
  const { section1, section2, leaderboardAt } = SCHEDULE;
  if (now < section1.start)  return { kind: 'before_event' };
  if (now < section1.end)    return { kind: 'section_1' };
  if (now < section2.start)  return { kind: 'between_sections' };
  if (now < section2.end)    return { kind: 'section_2' };
  return { kind: 'post_voting', leaderboardReady: now >= leaderboardAt };
}

// ── Voting window ─────────────────────────────────────────────────────────────

/**
 * Returns true only while the given section's voting window is open.
 * Used both client-side (UI gating) and server-side (API gating).
 */
export function isSectionVotingOpen(section: number, now = new Date()): boolean {
  const { section1, section2 } = SCHEDULE;
  if (section === 1) return now >= section1.start && now < section1.end;
  if (section === 2) return now >= section2.start && now < section2.end;
  return false;
}
