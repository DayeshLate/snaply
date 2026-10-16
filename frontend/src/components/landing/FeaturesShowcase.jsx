import React from 'react';
import {
  FolderLock,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Check,
  HardDrive,
  Copy,
  ArrowRight,
  Shield,
  Send,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SOCIAL_AVATARS } from './landingData';

export default function FeaturesShowcase() {
  return (
    <section id="features" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Built for Real Memories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Everything your memories need.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            One place to organize, share, and relive moments together without the
            clutter of public social feeds or compressed messaging apps.
          </p>
        </div>

        {/* Feature 1: Shared Albums (Image Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
          {/* Visual: Album Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25">
                  <FolderLock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Summer Coastline 2026
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Album folder in "Pacific Explorers"
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-3 py-1 rounded-full shadow-2xs">
                48 Photos
              </span>
            </div>

            {/* 4-Photo Album Grid */}
            <div className="grid grid-cols-2 gap-3.5 mt-6">
              <div className="aspect-4/3 rounded-2xl overflow-hidden relative group shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
                  alt="Beach sunset"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold bg-slate-950/70 text-white px-2.5 py-1 rounded-lg backdrop-blur-md">
                  Sunset Wave
                </span>
              </div>
              <div className="aspect-4/3 rounded-2xl overflow-hidden relative group shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80"
                  alt="Emerald lake"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold bg-slate-950/70 text-white px-2.5 py-1 rounded-lg backdrop-blur-md">
                  Lake Ridge
                </span>
              </div>
              <div className="aspect-4/3 rounded-2xl overflow-hidden relative group shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80"
                  alt="High peaks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold bg-slate-950/70 text-white px-2.5 py-1 rounded-lg backdrop-blur-md">
                  Summit Trail
                </span>
              </div>
              <div className="aspect-4/3 rounded-2xl overflow-hidden relative group shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80"
                  alt="Campfire night"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold bg-slate-950/70 text-white px-2.5 py-1 rounded-lg backdrop-blur-md">
                  Campfire
                </span>
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Feature 01 • Shared Albums
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              Every moment, in one shared space.
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Never ask “Can you send me those pictures?” again. Group members
              contribute directly into shared albums, organizing trips, events, and
              holidays into beautiful, accessible collections.
            </p>
            <ul className="space-y-3.5 pt-2 text-sm text-slate-800 dark:text-slate-200 font-semibold">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Create sub-folders for each day or event activity</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Original, full-resolution file preservation</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Collaborative contributions with owner controls</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 2: Groups and Invitations (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
          {/* Copy */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Feature 02 • Groups & Access
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              Bring your people together.
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Create invite-only spaces for close friends, family, or travel
              buddies. Share unique invite codes, review admission requests, and
              assign roles to protect shared memories.
            </p>
            <ul className="space-y-3.5 pt-2 text-sm text-slate-800 dark:text-slate-200 font-semibold">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>One-click group invite links and private codes</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Owner & Admin approval queue for new join requests</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Role-based access: Owner, Admin, and Viewer roles</span>
              </li>
            </ul>
          </div>

          {/* Visual: Group Invite Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-6"
          >
            {/* Group Header Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/25">
                  PA
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Pacific Explorers Club
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Private group • 12 active members
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                Active Space
              </span>
            </div>

            {/* Invite Link Banner */}
            <div className="p-4 rounded-2xl border border-dashed border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Private Invite Code
                </p>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  SNAP-SUMMER26
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25">
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Invite Link</span>
              </div>
            </div>

            {/* Member List Preview */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Group Members & Roles
              </p>
              <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={SOCIAL_AVATARS[0].src}
                      alt="Elena"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-800"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Elena Rostova (You)
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Group Creator</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                    OWNER
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={SOCIAL_AVATARS[1].src}
                      alt="Marcus"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-800"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Marcus Vance
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Joined Aug 2026</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    ADMIN
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature 3: Photo Collections & Cloud Storage (Image Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
          {/* Visual: Cloud Sync & Lightbox Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-white">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <HardDrive className="w-4 h-4" />
                </div>
                <span>Google Drive Integration</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Cloud Sync
              </span>
            </div>

            <div className="relative aspect-16/9 rounded-2xl overflow-hidden group shadow-md">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80"
                alt="Southwest highway"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-lg font-mono">
                CR2_RAW • 24.2 MB • 6000x4000
              </div>
              <div className="absolute bottom-3 right-3 bg-blue-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-1.5">
                <span>View Full-Res Lightbox</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              Photos uploaded to Snaply stay in your own personal Google Drive in
              their original, uncompressed quality. You maintain full ownership
              and control of every file.
            </p>
          </motion.div>

          {/* Copy */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Feature 03 • Photo Collections
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              Find the moments that matter.
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Browse across all shared memories with an interactive lightbox viewer,
              keyboard navigation, and instant full-resolution downloads.
            </p>
            <ul className="space-y-3.5 pt-2 text-sm text-slate-800 dark:text-slate-200 font-semibold">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Full-screen lightbox viewer with keyboard arrows</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Zero quality degradation or aggressive social compression</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Unified library browsing with group and album filters</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 4: Conversations Around Memories (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Feature 04 • In-Group Chat
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              Every photo has a story.
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Don’t let context get lost. Snaply combines group messaging with
              shared albums so you can discuss shots, recall memories, and react
              together in real time.
            </p>
            <ul className="space-y-3.5 pt-2 text-sm text-slate-800 dark:text-slate-200 font-semibold">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Attach group album photos directly into chat threads</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Live conversations for each group space</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Full privacy: only accepted group members can read or chat</span>
              </li>
            </ul>
          </div>

          {/* Visual: Chat Interface Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col h-[400px]"
          >
            {/* Chat Header */}
            <div className="p-4 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pacific Explorers Chat
                  </h5>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Live Channel
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3.5 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-start gap-2.5">
                <img
                  src={SOCIAL_AVATARS[0].src}
                  alt="Elena"
                  className="w-7 h-7 rounded-full object-cover mt-0.5 border border-white dark:border-slate-800"
                />
                <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl rounded-tl-sm p-3 max-w-xs text-xs text-slate-800 dark:text-slate-200 shadow-2xs">
                  <p className="font-bold text-[11px] text-blue-600 dark:text-blue-400 mb-0.5">
                    Elena Rostova
                  </p>
                  <p>Just added the golden hour shots from Cannon Beach! 🌅</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 justify-end">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-sm p-3 max-w-xs text-xs space-y-2 shadow-md shadow-blue-500/20">
                  <p>These came out unbelievable, the lighting was unreal!</p>
                  <div className="rounded-xl overflow-hidden border border-white/30">
                    <img
                      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80"
                      alt="Sunset thumbnail"
                      className="w-full h-24 object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <img
                  src={SOCIAL_AVATARS[1].src}
                  alt="Marcus"
                  className="w-7 h-7 rounded-full object-cover mt-0.5 border border-white dark:border-slate-800"
                />
                <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl rounded-tl-sm p-3 max-w-xs text-xs text-slate-800 dark:text-slate-200 shadow-2xs">
                  <p className="font-bold text-[11px] text-blue-600 dark:text-blue-400 mb-0.5">
                    Marcus Vance
                  </p>
                  <p>Downloading the full-res version right now for print!</p>
                </div>
              </div>
            </div>

            {/* Composer Bar */}
            <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message or attach a memory..."
                disabled
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
              />
              <button
                disabled
                className="p-2.5 rounded-xl bg-blue-600 text-white opacity-80"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
