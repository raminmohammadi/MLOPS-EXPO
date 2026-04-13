'use client';
import { useState, useEffect } from 'react';
import teamsData from '@/lib/teams.json';
import TeamCard from '@/components/TeamCard';
import VideoModal from '@/components/VideoModal';
import Leaderboard from '@/components/Leaderboard';
import { getPhase, isSectionVotingOpen, SCHEDULE, type Phase } from '@/lib/schedule';

interface Team {
  id: number;
  name: string;
  logo: string;
  youtubeId: string;
  section: number;
}

type View = 'grid' | 'top5';

export default function ExpoPage() {
  const [phase, setPhase] = useState<Phase>(() => getPhase());
  const [view, setView] = useState<View>('grid');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Re-evaluate every 30 s so the page auto-transitions between sections.
  useEffect(() => {
    const tick = () => {
      const p = getPhase();
      setPhase(p);
      if (p.kind === 'post_voting' && p.leaderboardReady) {
        setView((v) => (v === 'grid' ? 'top5' : v));
      }
    };
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const activeSection: 1 | 2 | null =
    phase.kind === 'section_1' ? 1 :
    phase.kind === 'section_2' ? 2 : null;

  const leaderboardVisible = phase.kind === 'post_voting' && phase.leaderboardReady;
  const votingOpen = activeSection ? isSectionVotingOpen(activeSection) : false;

  const visibleTeams = activeSection
    ? (teamsData as Team[]).filter((t) => t.section === activeSection)
    : [];

  return (
    <main className="text-white px-8 py-6">
      {/* ── Top nav ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        {/* Section status badge */}
        {activeSection ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
            <div>
              <p className="text-white font-bold text-lg leading-none">Section {activeSection}</p>
              <p className="text-slate-500 text-xs mt-0.5">
                {activeSection === 1 ? SCHEDULE.section1.label : SCHEDULE.section2.label}
              </p>
            </div>
          </div>
        ) : (
          <div />
        )}

        {/* Nav buttons */}
        <nav className="flex gap-2">
          {activeSection && (
            <button
              onClick={() => setView('grid')}
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                view === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Teams
            </button>
          )}
          {leaderboardVisible && (
            <button
              onClick={() => setView('top5')}
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                view === 'top5' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              🏆 Top 5
            </button>
          )}
        </nav>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      {view === 'top5' && leaderboardVisible ? (
        <Leaderboard />
      ) : activeSection ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {visibleTeams.map((team) => (
            <TeamCard key={team.id} team={team} onSelect={() => setSelectedTeam(team)} />
          ))}
        </div>
      ) : (
        <ScheduleCard phase={phase} />
      )}

      {selectedTeam && (
        <VideoModal
          team={selectedTeam}
          votingOpen={votingOpen}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </main>
  );
}

// ── Schedule card shown outside active windows ───────────────────────────────

function ScheduleCard({ phase }: { phase: Phase }) {
  const emoji =
    phase.kind === 'before_event'      ? '⏳' :
    phase.kind === 'between_sections'  ? '☕' : '🏁';

  const headline =
    phase.kind === 'before_event'     ? "Event hasn't started yet" :
    phase.kind === 'between_sections' ? 'Break — Section 2 starts soon' :
    phase.kind === 'post_voting' && !(phase as { leaderboardReady: boolean }).leaderboardReady
                                      ? 'Voting has ended' : 'MLOps Expo Season 6';

  const rows = [
    { label: 'Section 1',    time: '9:30 AM – 11:30 AM EDT' },
    { label: 'Break',        time: '11:30 AM – 12:00 PM EDT' },
    { label: 'Section 2',    time: '17:00 PM – 20:00 PM EDT'  },
    { label: 'Leaderboard',  time: '2:30 PM EDT'              },
  ];

  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-6">
      <div className="text-6xl">{emoji}</div>
      <h2 className="text-2xl font-bold text-white">{headline}</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-3">
        <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-4">
          April 13, 2026 — Schedule
        </p>
        {rows.map(({ label, time }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-slate-300 font-medium">{label}</span>
            <span className="text-slate-500 text-sm">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}