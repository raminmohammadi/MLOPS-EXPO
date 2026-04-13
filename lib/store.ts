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
  /** normalised email → Set of teamIds already voted for */
  emailVotes: Record<string, Set<string>>;
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

  const voted = store.emailVotes[normalised] ?? new Set<string>();

  if (voted.has(teamId)) {
    return { success: false, message: 'You have already voted for this team.' };
  }

  voted.add(teamId);
  store.emailVotes[normalised] = voted;
  store.votes[teamId] = (store.votes[teamId] ?? 0) + 1;

  return { success: true, message: 'Vote recorded.' };
}
