import React from 'react';
import { motion } from 'framer-motion';
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

  // Sample or real images for the hero collage
  const defaultImages = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80',
  ];

  const heroPhotos = samplePhotos.length >= 3
    ? samplePhotos.slice(0, 3).map((p) => p.fileUrl || defaultImages[0])
    : defaultImages;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-[#0E1724] border border-[#E2E8F0] dark:border-[#1F2D40] p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-300">
      {/* Ambient background glow inside hero */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#2196F3]/15 via-[#38BDF8]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-tr from-[#1E3A8A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Decorative top-right technical label */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#64748B] dark:text-[#64748B] uppercase tracking-widest border border-[#E2E8F0] dark:border-[#1F2D40] px-2.5 py-1 rounded-sm bg-slate-50 dark:bg-[#121D2C]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
        <span>System // Live Workspace</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#EFF6FF] dark:bg-[#152338] border border-[#BFDBFE] dark:border-[#1E3A5F] text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
            <span>Curated Shared Memories</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="space-y-2"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-tight">
              {greeting},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2196F3] via-[#2563EB] to-[#38BDF8]">
                {userName}
              </span>
              .
            </h1>
            <p className="text-base sm:text-lg text-[#536784] dark:text-[#94A3B8] font-normal leading-relaxed max-w-xl">
              Bring your favorite moments together. Create shared albums, collect high-definition memories with your circle, and keep every story close.
            </p>
          </motion.div>

          {/* Sharp-edged CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            <button
              onClick={onExploreMemories}
              className="px-5 py-2.5 rounded-sm bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-medium text-sm flex items-center gap-2.5 transition-all shadow-sm hover:shadow hover:shadow-[#2563EB]/25 cursor-pointer border border-[#1D4ED8]"
            >
              <span>Explore Memories</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onCreateAlbum}
              className="px-5 py-2.5 rounded-sm bg-white dark:bg-[#121D2C] hover:bg-slate-50 dark:hover:bg-[#182638] text-[#0F172A] dark:text-[#E2E8F0] font-medium text-sm flex items-center gap-2.5 transition-all border border-[#CBD5E1] dark:border-[#2F4158] hover:border-[#2563EB] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8]" />
              <span>Create Album</span>
            </button>
          </motion.div>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-[#64748B] dark:text-[#94A3B8] font-medium"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Full-res Google Drive storage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
              <span>Role-based group sharing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>{driveConnected ? 'Drive Connected' : 'Google Drive Ready'}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Layered Editorial Memory Collage */}
        <div className="lg:col-span-5 relative flex justify-center items-center py-4 lg:py-0">
          <div className="relative w-full max-w-[380px] h-[300px] sm:h-[340px]">
            {/* Background decorative card (tilted) */}
            <motion.div
              initial={{ opacity: 0, rotate: -6, scale: 0.9 }}
              animate={{ opacity: 1, rotate: -6, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              whileHover={{ rotate: -3, scale: 1.02 }}
              className="absolute top-3 left-0 w-64 sm:w-72 aspect-4/3 rounded-sm overflow-hidden border border-[#CBD5E1] dark:border-[#2F4158] shadow-md bg-slate-900 group cursor-pointer"
            >
              <img
                src={heroPhotos[1]}
                alt="Memory preview"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-300">Coastal Trail</span>
                <p className="text-xs font-semibold truncate">Summer Retreat 2026</p>
              </div>
            </motion.div>

            {/* Main foreground card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="absolute top-12 right-0 sm:right-2 w-64 sm:w-72 aspect-4/3 rounded-sm overflow-hidden border-2 border-white dark:border-[#38BDF8]/40 shadow-xl bg-slate-900 group z-20 cursor-pointer"
            >
              <img
                src={heroPhotos[0]}
                alt="Main memory highlight"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-sm flex items-center gap-1 border border-white/20">
                <ImageIcon className="w-3 h-3 text-[#38BDF8]" />
                <span>48 MEMORIES</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Shared with Trip Circle
                </span>
                <p className="text-sm font-bold truncate">Golden Hour at Vagator</p>
              </div>
            </motion.div>

            {/* Floating mini badge widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="absolute -bottom-2 left-6 z-30 bg-white dark:bg-[#121D2C] border border-[#CBD5E1] dark:border-[#2F4158] p-3 rounded-sm shadow-lg flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-sm bg-[#EFF6FF] dark:bg-[#152338] text-[#2563EB] dark:text-[#38BDF8] flex items-center justify-center border border-[#BFDBFE] dark:border-[#1E3A5F]">
                <FolderLock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F172A] dark:text-white">Active Albums</p>
                <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">Synced to Drive</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

