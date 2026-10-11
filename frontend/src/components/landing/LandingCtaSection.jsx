import React from 'react';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LandingCtaSection() {
  return (
    <section className="py-20 md:py-28 bg-[#F5F9FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl bg-[#1854A3] p-10 md:p-16 text-center text-white overflow-hidden shadow-xl"
        >
          {/* Subtle Ambient Orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2196F3]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#64B5F6]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-[#90CAF9] border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Begin Your Shared Album Today</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Start collecting moments together.
            </h2>

            <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
              Create your Snaply space and bring your favorite people closer to
              the memories you share. Free to start, private forever.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?tab=register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-[#2196F3] hover:bg-white hover:text-[#1854A3] text-white text-base font-bold shadow-md transition-all active:translate-y-px"
              >
                <span>Get Started with Snaply</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold text-blue-100 hover:text-white underline underline-offset-4 transition-colors"
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
