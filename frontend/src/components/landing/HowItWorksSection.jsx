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
    <section id="how-it-works" className="py-24 md:py-32 bg-[#F5F9FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D9E7F5] text-xs font-semibold text-[#1854A3] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>Effortless Collaboration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0D1B3E]">
            Your memories, together in three simple steps.
          </h2>
          <p className="text-base text-[#536784] leading-relaxed">
            No complicated workflows or confusing social feeds. Just pure shared albums designed around your circle.
          </p>
        </div>

        {/* 3 Connected Steps */}
        <div className="relative">
          {/* Desktop Animated Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 -translate-y-12 h-0.5 bg-linear-to-r from-[#2196F3]/20 via-[#2196F3] to-[#2196F3]/20 z-0" />

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
                  className="bg-white rounded-xl p-8 border border-[#D9E7F5] shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                >
                  <div>
                    {/* Top Step Pill & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-lg bg-[#2196F3] text-white flex items-center justify-center shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black font-mono text-[#D9E7F5]">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0D1B3E] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#536784] leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#D9E7F5] flex items-center gap-2 text-xs font-semibold text-[#1854A3]">
                    <CheckCircle2 className="w-4 h-4 text-[#2196F3]" />
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
