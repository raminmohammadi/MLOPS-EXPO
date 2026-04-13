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
      className="group cursor-pointer bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-blue-500/60 hover:bg-slate-800/80 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.35)] hover:-translate-y-0.5"
    >
      {/* Full logo area — square, no cropping */}
      <div className="w-full aspect-square bg-slate-800 flex items-center justify-center overflow-hidden border-b border-slate-700/60 group-hover:border-blue-500/30 transition-colors">
        <img
          src={`/logos/${team.logo}`}
          alt={team.name}
          className="w-full h-full object-contain p-4"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = 'none';
          }}
        />
      </div>

      {/* Name + CTA */}
      <div className="px-4 py-3 text-center">
        <h3 className="text-base font-bold leading-snug text-slate-200 group-hover:text-white transition-colors">
          {team.name}
        </h3>
        <span className="text-xs font-medium text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity block mt-1">
          Watch Demo →
        </span>
      </div>
    </div>
  );
}