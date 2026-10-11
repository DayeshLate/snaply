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
    <section id="collaboration" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F9FF] border border-[#D9E7F5] text-xs font-semibold text-[#1854A3]">
            <Users className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>Group Workspace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0D1B3E]">
            Memories are better when everyone is part of them.
          </h2>
          <p className="text-base text-[#536784] leading-relaxed">
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
          className="rounded-xl border border-[#D9E7F5] shadow-2xl bg-white overflow-hidden max-w-5xl mx-auto"
        >
          {/* Workspace Browser Chrome */}
          <div className="h-11 bg-slate-100 border-b border-[#D9E7F5] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="text-xs font-mono text-[#536784] ml-2">
                snaply.app / groups / 1?tab=albums
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#1854A3] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
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
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent p-6 md:p-8 flex flex-col justify-end text-white">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#90CAF9]">
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
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                      />
                    ))}
                  </div>
                  <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded font-medium">
                    +12 members
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Group Workspace Navigation Bar */}
          <div className="px-6 border-b border-[#D9E7F5] bg-white flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-6 text-sm font-semibold text-[#536784]">
              <span className="py-3.5 border-b-2 border-[#2196F3] text-[#2196F3] flex items-center gap-2">
                <FolderLock className="w-4 h-4" />
                Albums (4)
              </span>
              <span className="py-3.5 hover:text-[#0D1B3E] flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                All Photos (72)
              </span>
              <span className="py-3.5 hover:text-[#0D1B3E] flex items-center gap-2">
                <Users className="w-4 h-4" />
                Members (12)
              </span>
              <span className="py-3.5 hover:text-[#0D1B3E] flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Group Chat
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 py-2">
              <span className="text-xs font-mono text-[#536784] bg-slate-100 px-2.5 py-1 rounded border border-[#D9E7F5]">
                Invite: SNAP-SUMMER26
              </span>
            </div>
          </div>

          {/* Group Workspace Body Content */}
          <div className="p-6 md:p-8 bg-[#F5F9FF] grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Album Card 1 */}
            <div className="bg-white rounded-lg border border-[#D9E7F5] shadow-xs overflow-hidden group hover:border-[#2196F3] transition-colors">
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80"
                  alt="Coastline album"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  28 Photos
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-[#0D1B3E]">
                  Coastline & Hidden Beaches
                </h4>
                <p className="text-xs text-[#536784] mt-1">
                  Updated yesterday by Elena Rostova
                </p>
              </div>
            </div>

            {/* Album Card 2 */}
            <div className="bg-white rounded-lg border border-[#D9E7F5] shadow-xs overflow-hidden group hover:border-[#2196F3] transition-colors">
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80"
                  alt="Alpine Treks album"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  24 Photos
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-[#0D1B3E]">
                  Alpine Ridge Treks
                </h4>
                <p className="text-xs text-[#536784] mt-1">
                  Updated 3 days ago by Marcus Vance
                </p>
              </div>
            </div>

            {/* Compact Chat Side-Card */}
            <div className="bg-white rounded-lg border border-[#D9E7F5] shadow-xs p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#D9E7F5]">
                  <span className="text-xs font-bold text-[#0D1B3E] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#2196F3]" />
                    Recent Group Chat
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                </div>
                <div className="py-3 space-y-2.5 text-xs">
                  <div>
                    <span className="font-bold text-[#0D1B3E]">Elena:</span>{' '}
                    <span className="text-[#536784]">
                      Added high-res shots from the sunset hike!
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-[#0D1B3E]">Marcus:</span>{' '}
                    <span className="text-[#536784]">
                      Love the reflection photo on the lake.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D9E7F5] flex items-center justify-between">
                <span className="text-[11px] text-[#536784]">12 total replies</span>
                <span className="text-xs font-semibold text-[#2196F3]">Open Chat →</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
