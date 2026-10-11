import React from 'react';
import { ShieldCheck, Lock, HardDrive, KeyRound, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyTrustSection() {
  const pillars = [
    {
      icon: Lock,
      title: 'Invite-Only Spaces',
      description:
        'No public discoverability, algorithm feeds, or strangers viewing your albums. Every group requires a private invite code or owner approval.',
    },
    {
      icon: HardDrive,
      title: 'Direct Personal Cloud Sync',
      description:
        'Snaply stores your media directly in your own Google Drive application folder. You maintain full sovereignty over your raw photographs.',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Permissions',
      description:
        'Control who can contribute, delete, and invite with clear Owner, Admin, and Viewer roles enforced by the backend on every request.',
    },
    {
      icon: KeyRound,
      title: 'Protected Authentication',
      description:
        'Built with secure JWT token sessions, verified email workflows, and Google OAuth 2.0 integration to ensure account safety.',
    },
  ];

  return (
    <section id="privacy" className="py-24 md:py-32 bg-[#F5F9FF] border-t border-[#D9E7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D9E7F5] text-xs font-semibold text-[#1854A3] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>Privacy & Ownership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0D1B3E]">
            Your memories deserve a space you trust.
          </h2>
          <p className="text-base text-[#536784] leading-relaxed">
            Designed for intimate circles of friends, families, and creative teams
            who value control over their personal photography.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                className="bg-white p-7 rounded-xl border border-[#D9E7F5] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-lg bg-blue-50 text-[#2196F3] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0D1B3E] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#536784] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
