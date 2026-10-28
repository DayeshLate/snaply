import React from 'react';
import { ShieldCheck, Zap, HardDrive, Lock, Sparkles, DownloadCloud, Image as ImageIcon } from 'lucide-react';

export default function SocialProofStrip() {
  const metrics = [
    {
      value: '100%',
      label: 'Original Quality',
      sublabel: 'Zero blur, downscaling, or compression',
      icon: ShieldCheck,
      accent: 'text-[#2DD4BF]',
    },
    {
      value: '100%',
      label: 'Private & Secure',
      sublabel: 'No public links, stranger discovery, or ads',
      icon: Lock,
      accent: 'text-white',
    },
    {
      value: 'Instant',
      label: 'Group Photo Sync',
      sublabel: 'Photos appear for the group immediately',
      icon: Zap,
      accent: 'text-[#5B5BF0]',
    },
    {
      value: 'Full Size',
      label: 'Download Anytime',
      sublabel: 'Export original resolution files with one click',
      icon: DownloadCloud,
      accent: 'text-white',
    },
  ];

  return (
    <section className="py-12 border-y border-white/[0.06] bg-[#0B0C12]" aria-label="Key Benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#12141C] flex flex-col justify-between space-y-4 hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 font-semibold">
                    {m.label}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/70">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${m.accent}`}>
                    {m.value}
                  </div>
                  <p className="text-xs text-white/50 font-sans leading-relaxed">
                    {m.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
