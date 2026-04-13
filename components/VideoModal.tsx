'use client';
import { QRCodeSVG } from 'qrcode.react';

interface Team {
  id: number;
  name: string;
  logo: string;
  youtubeId: string;
}

export default function VideoModal({
  team,
  votingOpen,
  onClose,
}: {
  team: Team;
  votingOpen: boolean;
  onClose: () => void;
}) {
  const voteUrl = `${window.location.origin}/vote?teamId=${team.id}`;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* YouTube embed */}
        <div className="aspect-video w-full mb-8 rounded-xl overflow-hidden bg-slate-950">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${team.youtubeId}?autoplay=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Team info + QR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img
              src={`/logos/${team.logo}`}
              alt={team.name}
              className="w-14 h-14 rounded-full object-cover border border-slate-700"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <div>
              <h2 className="text-3xl font-bold leading-tight">{team.name}</h2>
              <p className="text-slate-400 mt-1 text-sm">
                {votingOpen
                  ? 'Scan the QR code with your phone to cast a vote.'
                  : 'Voting for this section has closed.'}
              </p>
            </div>
          </div>

          {/* QR — greyed out with overlay when voting is closed */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className={`relative bg-white p-3 rounded-xl shadow-lg transition-opacity ${votingOpen ? '' : 'opacity-25'}`}>
              <QRCodeSVG value={voteUrl} size={140} />
            </div>
            <span className={`text-xs font-medium ${votingOpen ? 'text-slate-500' : 'text-red-400'}`}>
              {votingOpen ? 'Vote via QR' : 'Voting closed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}