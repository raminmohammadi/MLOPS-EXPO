'use client';
import { useState } from 'react';

interface Team {
  id: string;
  name: string;
  logo: string;
}

type Status = 'idle' | 'loading' | 'success' | 'already_voted' | 'error';

export default function VoteForm({ team }: { team: Team }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const submitVote = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: team.id, email }),
      });

      if (res.ok) {
        setStatus('success');
      } else if (res.status === 409) {
        setStatus('already_voted');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <Screen>
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h1 className="text-3xl font-bold">Vote Recorded!</h1>
          <p className="text-slate-400">
            Thanks for voting for <span className="text-white font-semibold">{team.name}</span>.
          </p>
          <p className="text-slate-500 text-sm">MLOps Expo S6</p>
        </div>
      </Screen>
    );
  }

  if (status === 'already_voted') {
    return (
      <Screen>
        <div className="text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-3xl font-bold">Already Voted</h1>
          <p className="text-slate-400">Each email address can only cast one vote.</p>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="flex flex-col items-center gap-2 mb-6">
        <img
          src={team.logo}
          alt={team.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-slate-700"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <h1 className="text-2xl font-bold text-white">{team.name}</h1>
        <p className="text-slate-400 text-sm text-center">
          Enter your email to cast your vote. One vote per person.
        </p>
      </div>

      <form onSubmit={submitVote} className="space-y-4">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@university.edu"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
        >
          {status === 'loading' ? 'Submitting…' : 'Cast My Vote'}
        </button>
        {status === 'error' && (
          <p className="text-red-400 text-center text-sm">Something went wrong. Please try again.</p>
        )}
      </form>
    </Screen>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
