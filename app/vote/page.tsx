// Server Component — runs on the server, so Date.now() is authoritative.
import teamsData from '@/lib/teams.json';
import VoteForm from '@/components/VoteForm';
import { isSectionVotingOpen } from '@/lib/schedule';

export default async function VotePage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string }>;
}) {
  const { teamId } = await searchParams;
  const team = teamsData.find((t) => String(t.id) === teamId);

  if (!team) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="text-5xl">❌</div>
          <h1 className="text-2xl font-bold">Invalid Voting Link</h1>
          <p className="text-slate-400">This QR code does not match any team.</p>
        </div>
      </div>
    );
  }

  // Server-side check — this is the authoritative gate.
  const votingOpen = isSectionVotingOpen(team.section);

  return <VoteForm team={team} votingOpen={votingOpen} />;
}
