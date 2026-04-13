// Server Component — searchParams is a Promise in Next.js 16.
import teamsData from '@/lib/teams.json';
import VoteForm from '@/components/VoteForm';

export default async function VotePage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string }>;
}) {
  const { teamId } = await searchParams;
  // t.id is a number in JSON; teamId from the URL is always a string — normalise both.
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

  return <VoteForm team={team} />;
}
