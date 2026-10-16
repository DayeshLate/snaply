import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AntigravityDotsBackground from './AntigravityDotsBackground';

export default function LandingCtaSection() {
  return (
    <section className="py-20 md:py-28 bg-[#F5F9FF] dark:bg-[#070D16] relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl bg-gradient-to-br from-[#071733] via-[#0B254E] to-[#0A1A33] border border-[#1E3A66] dark:border-[#1E3A5F] p-10 md:p-16 lg:p-20 text-center text-white overflow-hidden shadow-2xl"
        >
          {/* Subtle Ambient Radial Lighting Pools (Hardware accelerated with zero GPU blur shader cost) */}
          <div
            className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(33, 150, 243, 0.22) 0%, transparent 70%)',
              transform: 'translateZ(0)',
            }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)',
              transform: 'translateZ(0)',
            }}
          />

          {/* Antigravity Floating Dots & Constellation Canvas */}
          <AntigravityDotsBackground className="opacity-90" />

          {/* Subtle overlay grid for added technical depth */}
          <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

          {/* Main Content */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-mono uppercase tracking-wider text-[#38BDF8] border border-[#38BDF8]/40 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Begin Your Shared Album Today</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
              Start collecting moments{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#38BDF8] to-white">
                together.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
              Create your Snaply space and bring your favorite people closer to
              the memories you share. Free to start, private forever.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?tab=register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-sm bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-base font-semibold shadow-lg hover:shadow-[#2563EB]/40 transition-all border border-[#38BDF8]/60 cursor-pointer active:translate-y-px"
              >
                <span>Get Started with Snaply</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold text-blue-200 hover:text-white underline underline-offset-4 transition-colors font-medium cursor-pointer"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
