import { NextResponse } from 'next/server';
import teamsData from '@/lib/teams.json';
import { getVotes } from '@/lib/store';

// Always run fresh — never serve a cached response for vote counts.
export const dynamic = 'force-dynamic';

export async function GET() {
  const votes = getVotes();

  const sortedTeams = teamsData
    .map((team) => ({ ...team, voteCount: votes[team.id] ?? 0 }))
    .sort((a, b) => b.voteCount - a.voteCount);

  return NextResponse.json(sortedTeams);
}