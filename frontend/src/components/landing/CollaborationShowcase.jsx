import React from 'react';
import {
  Users,
  FolderLock,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { SOCIAL_AVATARS } from './landingData';

export default function CollaborationShowcase() {
  const roles = [
    {
      role: 'Group Organizer',
      desc: 'Creates the group, approves or declines join requests, and organizes albums.',
      badge: 'Full Control',
      color: 'text-[#5B5BF0] border-[#5B5BF0]/30 bg-[#5B5BF0]/10',
      benefit: 'You have the final say on who joins',
    },
    {
      role: 'Contributing Member',
      desc: 'Can upload photos, create new trip albums, and chat with everyone in the circle.',
      badge: 'Can Add Photos',
      color: 'text-[#2DD4BF] border-[#2DD4BF]/30 bg-[#2DD4BF]/10',
      benefit: 'Everyone helps build the shared album',
    },
    {
      role: 'Family & Guest Viewer',
      desc: 'Can browse the entire album in full quality and download photos to their phone or computer.',
      badge: 'View & Download',
      color: 'text-white/60 border-white/10 bg-white/5',
      benefit: 'Perfect for grandparents & casual guests',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#5B5BF0] font-semibold">
              Group Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BF0]" />
            <span className="text-xs font-mono text-white/40">
              Clear & Simple Roles
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] font-bold tracking-[-0.02em] text-white leading-tight">
            Easy group sharing with total peace of mind.
          </h2>

          <p className="text-[15px] sm:text-[16px] leading-[1.6] text-white/60 mt-3 max-w-[62ch]">
            Every group is a private space. You decide who can upload, organize photos into separate albums, and approve join requests with complete transparency.
          </p>
        </div>

        {/* Floating Workspace Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 sm:p-8 shadow-xl max-w-5xl mx-auto space-y-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.06] gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#2DD4BF]">
                  Active Group
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-[-0.02em]">
                Summer Road Trip 2026
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                {SOCIAL_AVATARS.slice(0, 4).map((a, i) => (
                  <img
                    key={i}
                    src={a.src}
                    alt={a.name}
                    className="w-8 h-8 rounded-full border-2 border-[#12141C] object-cover"
                    title={a.name}
                  />
                ))}
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70">
                8 friends contributing
              </span>
            </div>
          </div>

          {/* Three Role Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roles.map((r, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-white/[0.08] bg-[#090A0F] space-y-3 flex flex-col justify-between hover:border-white/[0.16] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white tracking-[-0.01em]">
                      {r.role}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[4px] border ${r.color}`}>
                      {r.badge}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    {r.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] font-mono text-[#2DD4BF]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{r.benefit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Group Safety Reassurance Bar */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-white/70">
              <Lock className="w-4 h-4 text-[#5B5BF0]" />
              <span>Private Group Code:</span>
              <span className="text-white font-semibold">ALP-94K2-10</span>
            </div>

            <div className="flex items-center gap-4 text-white/50">
              <span>Zero Public Links</span>
              <span>•</span>
              <span className="text-[#2DD4BF]">Organizer Approves Every Member</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
