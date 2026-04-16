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
  hideVoting = false,
}: {
  team: Team;
  votingOpen: boolean;
  onClose: () => void;
  hideVoting?: boolean;
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
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${team.youtubeId}?autoplay=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Vote button — hidden in browse-only mode */}
        {!hideVoting && (
          <div className="my-5">
            {votingOpen ? (
              <a
                href={voteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-base transition-colors shadow-lg shadow-blue-900/30"
              >
                🗳️ Vote for {team.name}
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 font-semibold text-base cursor-not-allowed">
                🔒 Voting closed
              </div>
            )}
          </div>
        )}

        {/* Team info + QR */}
        <div className={`flex flex-col md:flex-row items-center gap-8 ${!hideVoting ? 'justify-between' : ''} ${hideVoting ? 'mt-6' : ''}`}>
          <div className="flex items-center gap-4">
            <img
              src={`/logos/${team.logo}`}
              alt={team.name}
              className="w-14 h-14 rounded-full object-contain border border-slate-700 bg-slate-800"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <div>
              <h2 className="text-3xl font-bold leading-tight">{team.name}</h2>
              {!hideVoting && (
                <p className="text-slate-400 mt-1 text-sm">
                  {votingOpen
                    ? 'Scan the QR code with your phone to cast a vote.'
                    : 'Voting for this section has closed.'}
                </p>
              )}
            </div>
          </div>

          {/* QR — only shown when voting is enabled */}
          {!hideVoting && (
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className={`relative bg-white p-3 rounded-xl shadow-lg transition-opacity ${votingOpen ? '' : 'opacity-25'}`}>
                <QRCodeSVG value={voteUrl} size={140} />
              </div>
              <span className={`text-xs font-medium ${votingOpen ? 'text-slate-500' : 'text-red-400'}`}>
                {votingOpen ? 'Vote via QR' : 'Voting closed'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}