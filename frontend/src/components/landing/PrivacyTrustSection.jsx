import React from 'react';
import { ShieldCheck, Lock, HardDrive, KeyRound, CheckCircle2 } from 'lucide-react';

export default function PrivacyTrustSection() {
  const pillars = [
    {
      icon: Lock,
      title: 'Zero Public Indexing',
      description:
        'No public discoverability, no search engine crawlers, no algorithm feeds. Every vault requires a 10-char invite code.',
      metric: '0 Public URLs',
    },
    {
      icon: HardDrive,
      title: 'Sovereign Cloud Backup',
      description:
        'Connect your own Google Drive account for off-site mirroring. You own your raw assets with complete data portability.',
      metric: 'Byo-Storage',
    },
    {
      icon: ShieldCheck,
      title: 'Granular Role Controls',
      description:
        'Backend-enforced permission barriers on every request. Owners approve every member before access is unlocked.',
      metric: 'Owner Approved',
    },
    {
      icon: KeyRound,
      title: 'Hardened JWT & OAuth',
      description:
        'Strict token expiration, secure HttpOnly cookie persistence, and Google OAuth 2.0 credential isolation.',
      metric: 'AES-256 GCM',
    },
  ];

  return (
    <section id="security" className="py-24 bg-[#0B0C12] border-t border-white/[0.06] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#2DD4BF]">
              Security & Sovereignty
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
          </div>

          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[-0.02em] text-white leading-tight">
            Your memories deserve a space you completely trust.
          </h2>

          <p className="text-[16px] leading-[1.6] text-white/60 mt-3 max-w-[62ch]">
            Engineered for intimate circles, traveling photographers, and families who refuse to feed personal photos into advertising algorithms.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/[0.08] bg-[#12141C] flex flex-col justify-between hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200 shadow-sm space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#5B5BF0]">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-white tracking-[-0.01em]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-white/50 mt-2 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#2DD4BF] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                  <span className="text-white/40">{pillar.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
