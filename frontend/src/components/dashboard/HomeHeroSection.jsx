import React from 'react';
import { Users, Image as ImageIcon, UserCheck, Plus, ArrowRight } from 'lucide-react';
import MemoryStack3D from '../3d/MemoryStack3D';
import StatCounter from './StatCounter';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeHeroSection({
  user,
  groupCount = 0,
  photoCount = 0,
  pendingRequestCount = 0,
  samplePhotos = [],
  onCreateAlbum,
  scrollerRef,
}) {
  const greeting = getGreeting();
  const userName = user?.name ? user.name.split(' ')[0] : 'Creator';

  return (
    <section className="space-y-8 pt-2">
      {/* Top Greeting & Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/50">
              Personal Vault
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
          </div>

          <h1 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold tracking-[-0.02em] leading-[1.05] text-white">
            {greeting}, {userName}.
          </h1>

          <p className="text-[14.5px] leading-[1.6] text-white/60 max-w-[62ch]">
            Your private group vaults and collaborative albums. Preserving RAW memories with end-to-end membership access.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onCreateAlbum}
            className="px-4 py-2.5 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white text-xs font-medium transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create album</span>
          </button>
        </div>
      </div>

      {/* 3D Hero Memory Stack */}
      <div className="relative">
        <MemoryStack3D
          photos={samplePhotos}
          scrollerRef={scrollerRef}
        />
      </div>

      {/* Three Stat Cards (Counting up once on entering viewport) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Stat 1: Circles */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#12141C] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/50">
              Circles
            </span>
            <span className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/60">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold tracking-[-0.02em] text-white">
              <StatCounter targetValue={groupCount} />
            </p>
            <span className="text-xs text-white/40 block mt-1">
              Active collaborative circles
            </span>
          </div>
        </div>

        {/* Stat 2: Photos */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#12141C] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/50">
              Photos & Videos
            </span>
            <span className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/60">
              <ImageIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold tracking-[-0.02em] text-white">
              <StatCounter targetValue={photoCount} />
            </p>
            <span className="text-xs text-white/40 block mt-1">
              Original full-res media assets
            </span>
          </div>
        </div>

        {/* Stat 3: Pending Requests */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#12141C] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/50">
              Pending Requests
            </span>
            <span className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/60">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-semibold tracking-[-0.02em] text-white">
              <StatCounter targetValue={pendingRequestCount} />
            </p>
            <span className="text-xs text-white/40 block mt-1">
              {pendingRequestCount === 0 ? 'All memberships reviewed' : 'Requires owner review'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

