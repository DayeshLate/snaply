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
    <section id="features" className="py-24 md:py-32 bg-[#F5F9FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D9E7F5] text-xs font-semibold text-[#1854A3] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>Built for Real Memories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0D1B3E]">
            Everything your memories need.
          </h2>
          <p className="text-base sm:text-lg text-[#536784] leading-relaxed">
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
            className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl border border-[#D9E7F5] shadow-lg"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#D9E7F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#2196F3] text-white flex items-center justify-center font-bold">
                  <FolderLock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0D1B3E]">
                    Summer Coastline 2026
                  </h4>
                  <p className="text-xs text-[#536784]">
                    Album folder in "Pacific Explorers"
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#2196F3] bg-blue-50 px-2.5 py-1 rounded">
                48 Photos
              </span>
            </div>

            {/* 4-Photo Album Grid */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="aspect-4/3 rounded overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
                  alt="Beach sunset"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                  Sunset Wave
                </span>
              </div>
              <div className="aspect-4/3 rounded overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80"
                  alt="Emerald lake"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                  Lake Ridge
                </span>
              </div>
              <div className="aspect-4/3 rounded overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80"
                  alt="High peaks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                  Summit Trail
                </span>
              </div>
              <div className="aspect-4/3 rounded overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80"
                  alt="Campfire night"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                  Campfire
                </span>
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold text-[#2196F3] uppercase tracking-wider">
              Feature 01 • Shared Albums
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3E] leading-tight">
              Every moment, in one shared space.
            </h3>
            <p className="text-base text-[#536784] leading-relaxed">
              Never ask “Can you send me those pictures?” again. Group members
              contribute directly into shared albums, organizing trips, events, and
              holidays into beautiful, accessible collections.
            </p>
            <ul className="space-y-3 pt-2 text-sm text-[#0D1B3E] font-medium">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Create sub-folders for each day or event activity</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Original, full-resolution file preservation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
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
            <span className="text-xs font-bold text-[#2196F3] uppercase tracking-wider">
              Feature 02 • Groups & Access
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3E] leading-tight">
              Bring your people together.
            </h3>
            <p className="text-base text-[#536784] leading-relaxed">
              Create invite-only spaces for close friends, family, or travel
              buddies. Share unique invite codes, review admission requests, and
              assign roles to protect shared memories.
            </p>
            <ul className="space-y-3 pt-2 text-sm text-[#0D1B3E] font-medium">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>One-click group invite links and private codes</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Owner & Admin approval queue for new join requests</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
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
            className="lg:col-span-7 order-1 lg:order-2 bg-white p-6 md:p-8 rounded-xl border border-[#D9E7F5] shadow-lg space-y-6"
          >
            {/* Group Header Card */}
            <div className="p-4 rounded-lg bg-[#F5F9FF] border border-[#D9E7F5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1854A3] text-white flex items-center justify-center font-bold text-sm">
                  PA
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0D1B3E]">
                    Pacific Explorers Club
                  </h4>
                  <p className="text-xs text-[#536784]">
                    Private group • 12 active members
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-[#16A34A]">
                Active Space
              </span>
            </div>

            {/* Invite Link Banner */}
            <div className="p-4 rounded-lg border border-dashed border-[#2196F3] bg-blue-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#1854A3] uppercase tracking-wider">
                  Private Invite Code
                </p>
                <p className="text-sm font-mono font-bold text-[#0D1B3E] mt-0.5">
                  SNAP-SUMMER26
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2196F3] text-white text-xs font-semibold shadow-xs">
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Invite Link</span>
              </div>
            </div>

            {/* Member List Preview */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-[#536784] uppercase tracking-wider">
                Group Members & Roles
              </p>
              <div className="divide-y divide-[#D9E7F5]">
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={SOCIAL_AVATARS[0].src}
                      alt="Elena"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#0D1B3E]">
                        Elena Rostova (You)
                      </p>
                      <p className="text-xs text-[#536784]">Group Creator</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-[#1854A3]">
                    OWNER
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={SOCIAL_AVATARS[1].src}
                      alt="Marcus"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#0D1B3E]">
                        Marcus Vance
                      </p>
                      <p className="text-xs text-[#536784]">Joined Aug 2026</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#536784]">
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
            className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl border border-[#D9E7F5] shadow-lg space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E7F5]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0D1B3E]">
                <HardDrive className="w-5 h-5 text-[#2196F3]" />
                <span>Google Drive Integration</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-[#16A34A] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                Live Cloud Sync
              </span>
            </div>

            <div className="relative aspect-16/9 rounded-lg overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80"
                alt="Southwest highway"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded font-mono">
                CR2_RAW • 24.2 MB • 6000x4000
              </div>
              <div className="absolute bottom-3 right-3 bg-[#2196F3] text-white text-xs font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5">
                <span>View Full-Res Lightbox</span>
              </div>
            </div>

            <p className="text-xs text-[#536784] leading-relaxed pt-1">
              Photos uploaded to Snaply stay in your own personal Google Drive in
              their original, uncompressed quality. You maintain full ownership
              and control of every file.
            </p>
          </motion.div>

          {/* Copy */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold text-[#2196F3] uppercase tracking-wider">
              Feature 03 • Photo Collections
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3E] leading-tight">
              Find the moments that matter.
            </h3>
            <p className="text-base text-[#536784] leading-relaxed">
              Browse across all shared memories with an interactive lightbox viewer,
              keyboard navigation, and instant full-resolution downloads.
            </p>
            <ul className="space-y-3 pt-2 text-sm text-[#0D1B3E] font-medium">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Full-screen lightbox viewer with keyboard arrows</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Zero quality degradation or aggressive social compression</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
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
            <span className="text-xs font-bold text-[#2196F3] uppercase tracking-wider">
              Feature 04 • In-Group Chat
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3E] leading-tight">
              Every photo has a story.
            </h3>
            <p className="text-base text-[#536784] leading-relaxed">
              Don’t let context get lost. Snaply combines group messaging with
              shared albums so you can discuss shots, recall memories, and react
              together in real time.
            </p>
            <ul className="space-y-3 pt-2 text-sm text-[#0D1B3E] font-medium">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Attach group album photos directly into chat threads</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Live conversations for each group space</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center shrink-0">
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
            className="lg:col-span-7 order-1 lg:order-2 bg-white rounded-xl border border-[#D9E7F5] shadow-lg overflow-hidden flex flex-col h-[400px]"
          >
            {/* Chat Header */}
            <div className="p-4 bg-slate-50 border-b border-[#D9E7F5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2196F3] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#0D1B3E]">
                    Pacific Explorers Chat
                  </h5>
                  <span className="text-[11px] text-[#16A34A] flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    Live Channel
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
              <div className="flex items-start gap-2.5">
                <img
                  src={SOCIAL_AVATARS[0].src}
                  alt="Elena"
                  className="w-7 h-7 rounded-full object-cover mt-0.5"
                />
                <div className="bg-[#F5F9FF] border border-[#D9E7F5] rounded-lg p-3 max-w-xs text-xs text-[#0D1B3E]">
                  <p className="font-bold text-[11px] text-[#1854A3] mb-0.5">
                    Elena Rostova
                  </p>
                  <p>Just added the golden hour shots from Cannon Beach! 🌅</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 justify-end">
                <div className="bg-[#2196F3] text-white rounded-lg p-3 max-w-xs text-xs space-y-1.5">
                  <p>These came out unbelievable, the lighting was unreal!</p>
                  <div className="rounded overflow-hidden border border-white/30">
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
                  className="w-7 h-7 rounded-full object-cover mt-0.5"
                />
                <div className="bg-[#F5F9FF] border border-[#D9E7F5] rounded-lg p-3 max-w-xs text-xs text-[#0D1B3E]">
                  <p className="font-bold text-[11px] text-[#1854A3] mb-0.5">
                    Marcus Vance
                  </p>
                  <p>Downloading the full-res version right now for print!</p>
                </div>
              </div>
            </div>

            {/* Composer Bar */}
            <div className="p-3 border-t border-[#D9E7F5] bg-slate-50 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message or attach a memory..."
                disabled
                className="flex-1 px-3 py-1.5 bg-white border border-[#D9E7F5] rounded text-xs text-[#0D1B3E] placeholder-[#536784]"
              />
              <button
                disabled
                className="p-2 rounded bg-[#2196F3] text-white opacity-80"
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
