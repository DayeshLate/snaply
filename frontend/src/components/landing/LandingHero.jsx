import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Users,
  HardDrive,
  FolderLock,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { HERO_PHOTOS, SOCIAL_AVATARS } from './landingData';
import AntigravityDotsBackground from './AntigravityDotsBackground';

export default function LandingHero() {
  const containerRef = useRef(null);

  // Pointer parallax coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollToFeatures = (e) => {
    e.preventDefault();
    const target = document.querySelector('#features');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Antigravity floating dots */}
      <AntigravityDotsBackground className="opacity-40 pointer-events-none" />



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Text Content */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xs text-xs font-bold text-blue-700 dark:text-blue-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Collaborative Albums & Private Cloud Sharing</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]"
          >
            Your memories.{' '}
            <span className="text-blue-600 dark:text-blue-400 relative inline-block">
              Your people.
            </span>{' '}
            One place.
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Bring your favorite moments together. Create shared albums, collect
            photos with your people, and keep every memory close.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          >
            <Link
              to="/login?tab=register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-xl hover:shadow-blue-500/25 text-white text-sm sm:text-base font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-98"
            >
              <span>Start Sharing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#features"
              onClick={scrollToFeatures}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-bold border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-500 transition-all cursor-pointer"
            >
              Explore Features
            </a>

            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                const target = document.querySelector('#how-it-works');
                if (target) {
                  const topOffset = 85;
                  const elementPosition = target.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - topOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100/90 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm sm:text-base font-bold border border-blue-200/70 dark:border-blue-800/60 shadow-xs transition-all cursor-pointer"
            >
              How It Works
            </a>
          </motion.div>

          {/* Trust Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xs text-slate-500 dark:text-slate-400 font-semibold pt-1"
          >
            Made for the moments worth remembering.
          </motion.p>
        </div>

        {/* Hero Visual Composition — Editorial Layered Gallery */}
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 md:mt-20 max-w-5xl mx-auto relative perspective-1000"
        >
          {/* Main Central Showcase Frame */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl group">
            {/* Window Bar */}
            <div className="h-11 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
                  snaply.app / shared / summer-adventure-2026
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                  <HardDrive className="w-3.5 h-3.5" />
                  Google Drive Synced
                </span>
              </div>
            </div>

            {/* Central Photo */}
            <div className="relative aspect-16/9 md:aspect-21/9 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={HERO_PHOTOS.main.url}
                alt={HERO_PHOTOS.main.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-slate-950/65 flex items-end p-6 md:p-8 text-white">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-xs">
                      Featured Album
                    </span>
                    <span className="text-xs text-slate-300">
                      Added yesterday by Elena
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    {HERO_PHOTOS.main.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300">
                    Cannon Beach sunset shoot with the team • 48 original photos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Overlapping Card: Group Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            className="absolute -bottom-8 -left-2 sm:-left-6 md:-left-12 w-48 sm:w-60 md:w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl hidden sm:block hover:-translate-y-1 transition-transform"
          >
            <div className="aspect-4/3 rounded-xl overflow-hidden relative">
              <img
                src={HERO_PHOTOS.card1.url}
                alt={HERO_PHOTOS.card1.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Campfire
              </span>
            </div>
            <div className="pt-2.5 px-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {HERO_PHOTOS.card1.title}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span>By {HERO_PHOTOS.card1.author}</span>
                <span className="flex items-center gap-1 text-rose-500 font-bold">
                  <Heart className="w-3 h-3 fill-rose-500" />
                  <span>14</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Overlapping Card: Alpine Treks */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
            className="absolute -top-6 -right-2 sm:-right-6 md:-right-10 w-44 sm:w-56 md:w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl hidden sm:block hover:-translate-y-1 transition-transform"
          >
            <div className="aspect-4/3 rounded-xl overflow-hidden relative">
              <img
                src={HERO_PHOTOS.card2.url}
                alt={HERO_PHOTOS.card2.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                Alpine Treks
              </span>
            </div>
            <div className="pt-2.5 px-1 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Cascade Range</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">24 photos shared</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            </div>
          </motion.div>

          {/* Floating Collaborators Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute -bottom-6 right-6 sm:right-12 md:right-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {SOCIAL_AVATARS.slice(0, 3).map((a, i) => (
                <img
                  key={i}
                  src={a.src}
                  alt={a.name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-slate-800"
                />
              ))}
            </div>
            <div className="text-left text-xs leading-tight pr-1">
              <p className="font-bold text-slate-900 dark:text-white">+12 members</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Active album</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
