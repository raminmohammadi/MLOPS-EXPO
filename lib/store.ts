/**
 * In-memory vote store.
 *
 * Attached to the Node.js `global` object so it is shared across all
 * Next.js Turbopack worker processes (which each get their own module
 * instance, breaking a plain module-level variable).  This is the standard
 * Next.js pattern for singletons in development and single-instance deploys.
 *
 * To add persistence later, replace recordVote / getVotes with calls to any
 * key-value store (Redis, Postgres, etc.) without touching any other file.
 */

interface VoteStore {
  /** teamId → vote count */
  votes: Record<string, number>;
  /** normalised email → Set of teamIds already voted for */
  emailVotes: Record<string, Set<string>>;
}

// Extend the global type so TypeScript accepts the property.
declare global {
  // eslint-disable-next-line no-var
  var __mlopsVoteStore: VoteStore | undefined;
}

// Reuse the existing store if one already lives on global (hot-reload safe).
const store: VoteStore =
  global.__mlopsVoteStore ??
  (global.__mlopsVoteStore = { votes: {}, emailVotes: {} });

export function getVotes(): Record<string, number> {
  return store.votes;
}

export function recordVote(
  teamId: string,
  email: string,
): { success: boolean; message: string } {
  const normalised = email.toLowerCase().trim();

  const voted = store.emailVotes[normalised] ?? new Set<string>();

  if (voted.has(teamId)) {
    return { success: false, message: 'You have already voted for this team.' };
  }

  voted.add(teamId);
  store.emailVotes[normalised] = voted;
  store.votes[teamId] = (store.votes[teamId] ?? 0) + 1;

  return { success: true, message: 'Vote recorded.' };
}
