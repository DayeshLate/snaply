import React from 'react';
import {
  Users,
  FolderLock,
  Image as ImageIcon,
  MessageSquare,
  HardDrive,
  Copy,
  ArrowRight,
  Sparkles,
  Heart,
  Share2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SOCIAL_AVATARS } from './landingData';

export default function CollaborationShowcase() {
  return (
    <section id="collaboration" className="py-24 md:py-32 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-xs">
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Group Workspace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Memories are better when everyone is part of them.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Create a dedicated space for your favorite people, bring photos
            together, and keep the conversation going around the moments that
            matter.
          </p>
        </div>

        {/* Realistic Group Workspace Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden max-w-5xl mx-auto"
        >
          {/* Workspace Browser Chrome */}
          <div className="h-11 bg-slate-100/70 dark:bg-slate-800/70 border-b border-slate-200/80 dark:border-slate-800 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">
                snaply.app / groups / 1?tab=albums
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                Snaply Workspace
              </span>
            </div>
          </div>

          {/* Group Banner & Details Header */}
          <div className="relative h-44 sm:h-56 bg-slate-800 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&auto=format&fit=crop&q=85"
              alt="Group Cover"
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent p-6 md:p-8 flex flex-col justify-end text-white">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Private Shared Group
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                    Summer Adventure 2026
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-lg">
                    Memories from our coastal road trips, campsite nights, and mountain hikes.
                  </p>
                </div>

                {/* Member Avatars & Invite code */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {SOCIAL_AVATARS.slice(0, 4).map((a, i) => (
                      <img
                        key={i}
                        src={a.src}
                        alt={a.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-xs"
                      />
                    ))}
                  </div>
                  <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold">
                    +12 members
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Group Workspace Navigation Bar */}
          <div className="px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-6 text-sm font-bold text-slate-500 dark:text-slate-400">
              <span className="py-3.5 border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <FolderLock className="w-4 h-4" />
                Albums (4)
              </span>
              <span className="py-3.5 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 cursor-pointer transition-colors">
                <ImageIcon className="w-4 h-4" />
                All Photos (72)
              </span>
              <span className="py-3.5 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 cursor-pointer transition-colors">
                <Users className="w-4 h-4" />
                Members (12)
              </span>
              <span className="py-3.5 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 cursor-pointer transition-colors">
                <MessageSquare className="w-4 h-4" />
                Group Chat
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 py-2">
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                Invite: SNAP-SUMMER26
              </span>
            </div>
          </div>

          {/* Group Workspace Body Content */}
          <div className="p-6 md:p-8 bg-slate-50/70 dark:bg-slate-950/70 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Album Card 1 */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80"
                  alt="Coastline album"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 right-2.5 bg-slate-950/70 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-md">
                  28 Photos
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Coastline & Hidden Beaches
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Updated yesterday by Elena Rostova
                </p>
              </div>
            </div>

            {/* Album Card 2 */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80"
                  alt="Alpine Treks album"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 right-2.5 bg-slate-950/70 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-md">
                  24 Photos
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Alpine Ridge Treks
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Updated 3 days ago by Marcus Vance
                </p>
              </div>
            </div>

            {/* Compact Chat Side-Card */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Recent Group Chat
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="py-3 space-y-2.5 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Elena:</span>{' '}
                    <span className="text-slate-600 dark:text-slate-300">
                      Added high-res shots from the sunset hike!
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Marcus:</span>{' '}
                    <span className="text-slate-600 dark:text-slate-300">
                      Love the reflection photo on the lake.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">12 total replies</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Open Chat →</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
