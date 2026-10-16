import React from 'react';
import { UserPlus, FolderSync, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create your space.',
      description:
        'Create a free account in seconds and start a private group for your family, travel friends, or creative project team.',
      detail: 'Instant setup with private invite links',
    },
    {
      number: '02',
      icon: FolderSync,
      title: 'Bring the memories together.',
      description:
        'Connect your Google Drive storage and organize your photos into albums and structured collections with full-resolution quality.',
      detail: 'Personal cloud ownership & zero compression',
    },
    {
      number: '03',
      icon: Share2,
      title: 'Share and relive.',
      description:
        'Invite group members, explore full-screen galleries, download original files, and carry on conversations in live group chat.',
      detail: 'Collaborative photo viewing & group chat',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Effortless Collaboration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Your memories, together in three simple steps.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            No complicated workflows or confusing social feeds. Just pure shared albums designed around your circle.
          </p>
        </div>

        {/* 3 Connected Steps */}
        <div className="relative">
          {/* Desktop Animated Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 -translate-y-12 h-0.5 bg-linear-to-r from-blue-500/10 via-blue-500/50 to-blue-500/10 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: 'easeOut' }}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 relative flex flex-col justify-between"
                >
                  <div>
                    {/* Top Step Pill & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black font-mono text-slate-200 dark:text-slate-800">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{step.detail}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
