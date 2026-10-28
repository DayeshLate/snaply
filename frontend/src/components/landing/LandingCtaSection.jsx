import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, KeyRound, Check } from 'lucide-react';

export default function LandingCtaSection() {
  return (
    <section className="py-12 sm:py-16 bg-transparent relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#5B5BF0]/10 rounded-full blur-[130px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-3xl border border-white/[0.08] bg-[#12141C] p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-8 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
            <span>Ready in 30 seconds</span>
          </div>

          {/* Heading */}
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.02em] text-white leading-tight max-w-2xl mx-auto">
            Keep every shared memory in one private home.
          </h2>

          <p className="text-[16px] leading-[1.6] text-white/60 max-w-[58ch] mx-auto font-sans">
            Start a private group for your next trip, family gathering, or weekend getaway. Invite friends in seconds, upload in full original resolution, and protect your moments forever.
          </p>

          {/* Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto h-12 px-7 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] active:scale-[0.98] text-white text-[14px] font-medium transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_4px_24px_rgba(91,91,240,0.35)] focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
            >
              <span>Create a Group Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto h-12 px-6 rounded-[10px] border border-white/[0.12] hover:border-white/[0.24] bg-white/[0.03] hover:bg-white/[0.06] text-white/80 hover:text-white text-[14px] font-medium transition-all duration-200 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
            >
              <KeyRound className="w-4 h-4 text-white/60" />
              <span>Join With Code</span>
            </Link>
          </div>

          {/* Reassurance pills */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-white/40">
            <span>✓ 100% Free to start</span>
            <span>•</span>
            <span>✓ Zero ads or tracking</span>
            <span>•</span>
            <span>✓ Full original quality preserved</span>
          </div>
        </div>
      </div>
    </section>
  );
}
