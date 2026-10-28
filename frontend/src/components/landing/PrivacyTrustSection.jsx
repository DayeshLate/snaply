import React from 'react';
import { ShieldCheck, Lock, HardDrive, KeyRound, CheckCircle2, UserCheck, EyeOff } from 'lucide-react';

export default function PrivacyTrustSection() {
  const pillars = [
    {
      icon: EyeOff,
      title: 'No Ads & No Tracking',
      description:
        'We never sell your personal data, show ads, or scan your faces for advertising. Your private moments stay completely private.',
      metric: '100% Ad-Free',
    },
    {
      icon: HardDrive,
      title: 'You Own Your Photos',
      description:
        'Your photos belong to you, not an algorithm. Connect Google Drive for automatic backup, or download full-size originals anytime.',
      metric: 'Full Ownership',
    },
    {
      icon: UserCheck,
      title: 'Invite-Only Access',
      description:
        'No public web searches and no random followers. Only people you personally give your group code to can ask to join.',
      metric: 'You Control Access',
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Protected',
      description:
        'Enterprise-grade encryption keeps your files safe during upload and storage, so your family memories remain protected.',
      metric: 'Bank-Grade Security',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#2DD4BF] font-semibold">
              Privacy First
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
            <span className="text-xs font-mono text-white/40">
              Zero Ads & Zero Tracking
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] font-bold tracking-[-0.02em] text-white leading-tight">
            Your memories deserve a space you completely trust.
          </h2>

          <p className="text-[15px] sm:text-[16px] leading-[1.6] text-white/60 mt-3 max-w-[62ch]">
            Engineered for families, close friends, and travelers who want to share photos without feeding social media algorithms or dealing with public search engines.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/[0.08] bg-[#12141C] flex flex-col justify-between space-y-4 hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#2DD4BF]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/60">
                      {pillar.metric}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white tracking-[-0.01em]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 mt-2 leading-relaxed font-sans">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-xs text-[#2DD4BF] font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified & Private</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
