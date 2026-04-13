import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MLOps Expo Season 6",
  description: "Season 6 MLOps Expo — watch team demos and cast your vote.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950">
        {/* Global top bar — appears on every page */}
        <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60 px-8 py-4 flex items-center gap-4">
          <img
            src="/logos/MLOPS_Logo.png"
            alt="MLOps Expo"
            className="h-16 w-auto object-contain"
          />
          <div className="h-8 w-px bg-slate-700 mx-1" />
          <div>
            <p className="text-white font-bold text-2xl tracking-tight leading-none">
              MLOps Expo <span className="text-blue-400">Season 6</span>
            </p>
            <p className="text-slate-500 text-xs mt-0.5 tracking-wide">April 15, 2026</p>
          </div>
        </div>

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
