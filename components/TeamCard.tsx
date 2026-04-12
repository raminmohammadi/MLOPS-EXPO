'use client';

interface Team {
  id: string;
  name: string;
  logo: string;
}

export default function TeamCard({ team, onSelect }: { team: Team; onSelect: () => void }) {
  return (
    <div 
      onClick={onSelect}
      className="group cursor-pointer bg-slate-900/50 border border-slate-800 rounded-xl p-6 transition-all hover:border-blue-500/50 hover:bg-slate-800/80 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 group-hover:border-blue-500/50 transition-colors">
          <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-200 group-hover:text-white">
          {team.name}
        </h3>
        <div className="text-xs font-medium text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          View Demo →
        </div>
      </div>
    </div>
  );
}