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
    <section id="privacy" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Privacy & Ownership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Your memories deserve a space you trust.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
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
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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
