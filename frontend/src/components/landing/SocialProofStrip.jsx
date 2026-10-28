import React from 'react';
import { ShieldCheck, Zap, HardDrive, Lock } from 'lucide-react';

export default function SocialProofStrip() {
  const metrics = [
    {
      value: '100%',
      label: 'Lossless Fidelity',
      sublabel: 'Zero compression or downsampling',
      icon: ShieldCheck,
      accent: 'text-[#2DD4BF]',
    },
    {
      value: '0',
      label: 'Public URLs',
      sublabel: 'Only authenticated circle members',
      icon: Lock,
      accent: 'text-white',
    },
    {
      value: '<24ms',
      label: 'Sync Latency',
      sublabel: 'Real-time STOMP group event bus',
      icon: Zap,
      accent: 'text-[#5B5BF0]',
    },
    {
      value: '100MB',
      label: 'Single File Cap',
      sublabel: 'Direct chunked RAW buffer streaming',
      icon: HardDrive,
      accent: 'text-white',
    },
  ];

  return (
    <section className="py-12 border-y border-white/[0.06] bg-[#0B0C12]" aria-label="Key Performance Metrics">
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
                  <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50">
                    {m.label}
                  </span>
                  <div className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/60">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className={`text-3xl sm:text-4xl font-semibold tracking-[-0.03em] font-mono ${m.accent}`}>
                    {m.value}
                  </div>
                  <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
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
