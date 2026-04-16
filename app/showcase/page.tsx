'use client';
import { useState } from 'react';
import teamsData from '@/lib/teams.json';
import TeamCard from '@/components/TeamCard';
import VideoModal from '@/components/VideoModal';

interface Team {
  id: number;
  name: string;
  logo: string;
  youtubeId: string;
  section: number;
}

const section1 = (teamsData as Team[]).filter((t) => t.section === 1);
const section2 = (teamsData as Team[]).filter((t) => t.section === 2);

export default function ShowcasePage() {
  const [activeSection, setActiveSection] = useState<1 | 2>(1);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const teams = activeSection === 1 ? section1 : section2;

  return (
    <main className="text-white px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Team Showcase</h1>
        <p className="text-slate-500 text-sm mt-1">Browse all teams and watch their demos.</p>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveSection(1)}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
            activeSection === 1
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Section 1
          <span className="ml-2 text-xs opacity-70">9:30 AM – 11:30 AM EDT</span>
        </button>
        <button
          onClick={() => setActiveSection(2)}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
            activeSection === 2
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Section 2
          <span className="ml-2 text-xs opacity-70">12:00 PM – 2:00 PM EDT</span>
        </button>
      </div>

      {/* Team count */}
      <p className="text-slate-500 text-sm mb-6">{teams.length} teams</p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onSelect={() => setSelectedTeam(team)}
          />
        ))}
      </div>

      {/* Browse-only modal — no voting, no QR */}
      {selectedTeam && (
        <VideoModal
          team={selectedTeam}
          votingOpen={false}
          hideVoting={true}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </main>
  );
}
