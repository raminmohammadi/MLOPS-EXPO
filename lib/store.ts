/**
 * In-memory vote store — persists within a single Node.js process instance.
 * For a short-duration expo event with a single Vercel deployment this is
 * perfectly fine: Vercel keeps the lambda warm as long as traffic is steady.
 *
 * To add persistence later, replace recordVote / getVotes with calls to any
 * key-value store (Redis, Postgres, etc.) without touching any other file.
 */

interface VoteStore {
  /** teamId → vote count */
  votes: Record<string, number>;
  /** normalised email → teamId  (prevents double-voting) */
  emailVotes: Record<string, string>;
}

// Module-level singleton — one per Node.js process / lambda instance.
const store: VoteStore = {
  votes: {},
  emailVotes: {},
};

export function getVotes(): Record<string, number> {
  return store.votes;
}

export function recordVote(
  teamId: string,
  email: string,
): { success: boolean; message: string } {
  const normalised = email.toLowerCase().trim();

  if (store.emailVotes[normalised]) {
    return { success: false, message: 'You have already cast a vote.' };
  }

  store.emailVotes[normalised] = teamId;
  store.votes[teamId] = (store.votes[teamId] ?? 0) + 1;

  return { success: true, message: 'Vote recorded.' };
}
