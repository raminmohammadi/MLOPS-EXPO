# MLOps Expo Season 6

Elegant expo website for showcasing 30 team demos and collecting live audience votes via QR code. Built with Next.js 16, Tailwind CSS, and deployed on Vercel.

## Features

- **Team grid** — 30 teams displayed as cards with logo and name
- **Video modal** — click any team to watch their YouTube demo with autoplay; close by clicking the backdrop or ✕
- **QR voting** — each modal shows a unique QR code linking to `/vote?teamId=…`; attendees scan it on their phone
- **One vote per email** — the voting page accepts an email address and rejects duplicates (409 Conflict)
- **Live leaderboard** — "Top 5" tab polls `/api/teams` every 5 seconds and renders a live-updating bar chart sorted by vote count

## Getting Started

```bash
cd mlops-expo-site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Before the Expo — Checklist

### 1. Fill in team data

Edit `lib/teams.json`. Each entry follows this shape:

```json
{ "id": "1", "name": "Your Real Team Name", "logo": "/logos/team-01.png", "youtubeId": "YOUTUBE_VIDEO_ID" }
```

The `youtubeId` is the part after `v=` in a YouTube URL (e.g. `dQw4w9WgXcQ` for `youtube.com/watch?v=dQw4w9WgXcQ`).

### 2. Add team logos

Drop PNG or JPG files into `public/logos/` named `team-01.png` … `team-30.png`. Any resolution works — they are cropped to a circle. If a file is missing the image hides itself gracefully.

### 3. Deploy to Vercel

```bash
npx vercel --prod
```

The `/vote` URL is built automatically from `window.location.origin`, so QR codes point to the correct production domain with no extra configuration.

## Project Structure

| Path | Purpose |
|---|---|
| `lib/teams.json` | All 30 team entries (name, logo path, YouTube ID) |
| `lib/store.ts` | In-memory vote counter + per-email deduplication singleton |
| `app/page.tsx` | Main page — team grid and Top 5 tab |
| `app/vote/page.tsx` | Server-rendered voting page (reads `teamId` from query string) |
| `app/api/teams/route.ts` | `GET` — returns all teams sorted by vote count |
| `app/api/vote/route.ts` | `POST` — records a vote; returns 409 if email already voted |
| `components/TeamCard.tsx` | Individual team card with hover effect |
| `components/VideoModal.tsx` | Full-screen modal with YouTube embed and QR code |
| `components/VoteForm.tsx` | Client-side email form with success / already-voted states |
| `components/Leaderboard.tsx` | Live Top 5 leaderboard with polling |

## A Note on Vote Persistence

Votes are stored **in-memory** within the running Node.js process. For a single-day expo with steady traffic (Vercel keeps the lambda warm) this works perfectly — no database setup required.

If you ever need votes to survive server restarts or scale across multiple instances, only `lib/store.ts` needs to change. Replace `recordVote` and `getVotes` with calls to any key-value store (Redis, Postgres, etc.) — no other file needs to be touched.

## Deploy on Vercel

```bash
npx vercel --prod
```
