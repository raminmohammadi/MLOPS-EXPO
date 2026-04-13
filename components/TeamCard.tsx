'use client';

interface Team {
  id: number;
  name: string;
  logo: string;
}

export default function TeamCard({ team, onSelect }: { team: Team; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer bg-slate-900/50 border border-slate-800 rounded-2xl p-8 transition-all duration-200 hover:border-blue-500/60 hover:bg-slate-800/80 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.35)] hover:-translate-y-0.5"
    >
      <div className="flex flex-col items-center text-center gap-5">
        {/* Logo circle */}
        <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-700 group-hover:border-blue-500/60 transition-colors shrink-0">
          <img
            src={`/${team.logo}`}
            alt={team.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = 'none';
            }}
          />
        </div>

        {/* Name */}
        <h3 className="text-base font-semibold leading-snug text-slate-200 group-hover:text-white transition-colors">
          {team.name}
        </h3>

        {/* CTA */}
        <span className="text-xs font-medium text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Watch Demo →
        </span>
      </div>
    </div>
  );
}