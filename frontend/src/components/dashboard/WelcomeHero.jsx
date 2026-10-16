import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Plus,
  FolderLock,
  HardDrive,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function WelcomeHero({
  user,
  onCreateAlbum,
  onExploreMemories,
  samplePhotos = [],
  driveConnected = false,
}) {
  const greeting = getGreeting();
  const userName = user?.name ? user.name.split(' ')[0] : 'Explorer';

  const defaultImages = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80',
  ];

  const heroPhotos = samplePhotos.length >= 3
    ? samplePhotos.slice(0, 3).map((p) => p.fileUrl || defaultImages[0])
    : defaultImages;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-200/40 dark:shadow-black/40 transition-all duration-300">
      {/* Vibrant Ambient Gradient Glows inside hero */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(124, 58, 237, 0.12) 40%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, transparent 65%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Decorative top-right status pill */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-7 hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 shadow-xs backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
        <span className="tracking-wide">Live Workspace</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shared Photo Vault</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              {greeting},{' '}
              <span className="gradient-text">
                {userName}
              </span>
              .
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
              Bring your favorite moments together. Create shared albums, collect high-definition memories with your circle, and search photos with AI.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onExploreMemories}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 active:scale-[0.98] text-white font-bold text-sm flex items-center gap-2.5 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 cursor-pointer"
            >
              <span>Explore Memories</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onCreateAlbum}
              className="px-6 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center gap-2.5 transition-all border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Create Album</span>
            </button>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Full-res Google Drive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
              <span>Collaborative Circles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-purple-500" />
              <span>{driveConnected ? 'Cloud Synced' : 'Drive Ready'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Layered Memory Collage */}
        <div className="lg:col-span-5 relative flex justify-center items-center py-4 lg:py-0">
          <div className="relative w-full max-w-[380px] h-[300px] sm:h-[340px]">
            {/* Background decorative card (tilted) */}
            <div
              className="absolute top-3 left-0 w-64 sm:w-72 aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl bg-slate-900 group cursor-pointer -rotate-6 hover:-rotate-3 hover:scale-102 transition-all duration-300"
            >
              <img
                src={heroPhotos[1]}
                alt="Memory preview"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Coastal Trail</span>
                <p className="text-xs font-bold truncate">Summer Retreat 2026</p>
              </div>
            </div>

            {/* Main foreground card */}
            <div
              className="absolute top-10 right-0 sm:right-2 w-64 sm:w-72 aspect-4/3 rounded-2xl overflow-hidden border-2 border-white dark:border-cyan-500/40 shadow-2xl bg-slate-900 group z-20 cursor-pointer hover:-translate-y-1 hover:scale-102 transition-all duration-300"
            >
              <img
                src={heroPhotos[0]}
                alt="Main memory highlight"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>MEMORIES</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Shared with Trip Circle
                </span>
                <p className="text-sm font-black truncate mt-0.5">Golden Hour Highlights</p>
              </div>
            </div>

            {/* Floating mini badge widget */}
            <div
              className="absolute -bottom-2 left-6 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-2xl shadow-xl flex items-center gap-3.5"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                <FolderLock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Active Albums</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Synced to Cloud</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
