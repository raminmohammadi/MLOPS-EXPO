'use client';
import { useState } from 'react';
import teamsData from '@/lib/teams.json';
import TeamCard from '@/components/TeamCard';
import VideoModal from '@/components/VideoModal';
import Leaderboard from '@/components/Leaderboard';

interface Team {
  id: string;
  name: string;
  logo: string;
  youtubeId: string;
}

type View = 'grid' | 'top5';

export default function ExpoPage() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [view, setView] = useState<View>('grid');

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-12 border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">
            MLOps Expo <span className="text-blue-500">S6</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Select a team to watch their demo and vote.</p>
        </div>
        <nav className="flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              view === 'grid'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            All Teams
          </button>
          <button
            onClick={() => setView('top5')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              view === 'top5'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            🏆 Top 5
          </button>
        </nav>
      </header>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {(teamsData as Team[]).map((team) => (
            <TeamCard key={team.id} team={team} onSelect={() => setSelectedTeam(team)} />
          ))}
        </div>
      ) : (
        <Leaderboard />
      )}

      {selectedTeam && (
        <VideoModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      )}
    </main>
  );
}