'use client';
import { useEffect, useState } from 'react';

interface TeamWithVotes {
  id: string;
  name: string;
  logo: string;
  voteCount: number;
}

export default function Leaderboard() {
  const [topTeams, setTopTeams] = useState<TeamWithVotes[]>([]);

  const fetchRankings = async () => {
    const res = await fetch('/api/teams');
    const data = await res.json();
    setTopTeams(data.slice(0, 5));
  };

  useEffect(() => {
    fetchRankings();
    const interval = setInterval(fetchRankings, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center mb-8 text-slate-400 uppercase tracking-widest">Live Top 5</h2>
      {topTeams.map((team, index) => (
        <div key={team.id} className="flex items-center bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <span className="text-3xl font-black text-slate-800 w-12">{index + 1}</span>
          <img src={team.logo} className="w-10 h-10 rounded-full mr-4 border border-slate-700" alt="" />
          <div className="flex-1">
            <div className="font-bold">{team.name}</div>
            <div className="text-xs text-slate-500">{team.voteCount} Votes</div>
          </div>
          <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500" 
              style={{ width: `${(team.voteCount / (topTeams[0]?.voteCount || 1)) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}