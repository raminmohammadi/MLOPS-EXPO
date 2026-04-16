/**
 * File-based vote store — persists to /tmp/mlops-votes.json.
 *
 * /tmp is on the real filesystem and is visible to every Node.js worker
 * thread in the same OS process, so this works correctly with Next.js 16
 * Turbopack which runs each API route in an isolated worker thread (breaking
 * both module-level variables and the `global` singleton approach).
 *
 * On Vercel production a single warm lambda handles the expo traffic, so
 * /tmp is effectively durable for the lifetime of the event.
 */

import fs from 'fs';
import path from 'path';

const STORE_PATH = path.join('/tmp', 'mlops-votes.json');

interface StoreData {
  /** teamId → vote count */
  votes: Record<string, number>;
  /** normalised email → array of teamIds already voted for */
  emailVotes: Record<string, string[]>;
}

function read(): StoreData {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8')) as StoreData;
  } catch {
    return { votes: {}, emailVotes: {} };
  }
}

function write(data: StoreData): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(data), 'utf-8');
}

export function getVotes(): Record<string, number> {
  return read().votes;
}

export function recordVote(
  teamId: string,
  email: string,
): { success: boolean; message: string } {
  const data = read();
  const normalised = email.toLowerCase().trim();
  const alreadyVoted = data.emailVotes[normalised] ?? [];

  if (alreadyVoted.includes(teamId)) {
    return { success: false, message: 'You have already voted for this team.' };
  }

  data.emailVotes[normalised] = [...alreadyVoted, teamId];
  data.votes[teamId] = (data.votes[teamId] ?? 0) + 1;
  write(data);

  return { success: true, message: 'Vote recorded.' };
}
