import { NextRequest, NextResponse } from 'next/server';
import teamsData from '@/lib/teams.json';
import { recordVote } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: { teamId?: string | number; email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { teamId, email } = body;

  if (!teamId || !email) {
    return NextResponse.json(
      { error: 'Both teamId and email are required.' },
      { status: 400 },
    );
  }

  const teamIdStr = String(teamId);
  const team = teamsData.find((t) => String(t.id) === teamIdStr);
  if (!team) {
    return NextResponse.json({ error: 'Unknown team.' }, { status: 400 });
  }

  const result = recordVote(teamIdStr, email);

  if (!result.success) {
    // 409 Conflict — already voted
    return NextResponse.json({ error: result.message }, { status: 409 });
  }

  return NextResponse.json({ success: true, teamName: team.name });
}