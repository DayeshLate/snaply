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
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#F5F9FF]">
      {/* Antigravity floating dots */}
      <AntigravityDotsBackground className="opacity-40 pointer-events-none" />

      {/* Background Subtle Ambience */}
      <div className="absolute top-0 inset-x-0 h-96 bg-linear-to-b from-blue-100/60 to-transparent pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Text Content */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D9E7F5] shadow-2xs text-xs font-semibold text-[#1854A3]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" />
            <span>Collaborative Albums & Private Cloud Sharing</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#0D1B3E] leading-[1.08]"
          >
            Your memories.{' '}
            <span className="text-[#2196F3] relative inline-block">
              Your people.
              <svg
                className="absolute -bottom-2 left-0 w-full h-2.5 text-[#64B5F6]/40"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,6 Q50,12 100,6"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </span>{' '}
            One place.
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#536784] max-w-2xl mx-auto leading-relaxed"
          >
            Bring your favorite moments together. Create shared albums, collect
            photos with your people, and keep every memory close.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Link
              to="/login?tab=register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#2196F3] hover:bg-[#1854A3] text-white text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-all active:translate-y-px"
            >
              <span>Start Sharing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#features"
              onClick={scrollToFeatures}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-md bg-white hover:bg-slate-50 text-[#0D1B3E] text-sm sm:text-base font-semibold border border-[#D9E7F5] shadow-2xs hover:border-[#2196F3] hover:text-[#2196F3] transition-all cursor-pointer"
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
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-md bg-blue-50/80 hover:bg-blue-100/90 text-[#1854A3] text-sm sm:text-base font-semibold border border-[#BFDBFE] shadow-2xs hover:border-[#2196F3] transition-all cursor-pointer"
            >
              How It Works
            </a>
          </motion.div>

          {/* Trust Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xs text-[#536784] font-medium pt-1"
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
          <div className="relative rounded-xl overflow-hidden border border-[#D9E7F5] bg-white shadow-xl group">
            {/* Window Bar */}
            <div className="h-10 bg-slate-50 border-b border-[#D9E7F5] px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-xs font-mono text-[#536784] ml-2 hidden sm:inline">
                  snaply.app / shared / summer-adventure-2026
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#536784] font-medium">
                <span className="flex items-center gap-1 text-[#2196F3]">
                  <HardDrive className="w-3.5 h-3.5" />
                  Google Drive Synced
                </span>
              </div>
            </div>

            {/* Central Photo */}
            <div className="relative aspect-16/9 md:aspect-21/9 overflow-hidden bg-slate-100">
              <img
                src={HERO_PHOTOS.main.url}
                alt={HERO_PHOTOS.main.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6 md:p-8 text-white">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2196F3] text-white">
                      Featured Album
                    </span>
                    <span className="text-xs text-slate-200">
                      Added yesterday by Elena
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    {HERO_PHOTOS.main.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-200">
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
            className="absolute -bottom-8 -left-2 sm:-left-6 md:-left-12 w-48 sm:w-60 md:w-64 bg-white p-2.5 rounded-lg border border-[#D9E7F5] shadow-lg hidden sm:block hover:-translate-y-1 transition-transform"
          >
            <div className="aspect-4/3 rounded overflow-hidden relative">
              <img
                src={HERO_PHOTOS.card1.url}
                alt={HERO_PHOTOS.card1.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                Campfire
              </span>
            </div>
            <div className="pt-2 px-1">
              <p className="text-xs font-bold text-[#0D1B3E] truncate">
                {HERO_PHOTOS.card1.title}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#536784] mt-1">
                <span>By {HERO_PHOTOS.card1.author}</span>
                <span className="flex items-center gap-1 text-[#2196F3]">
                  <Heart className="w-3 h-3 fill-[#2196F3]" />
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
            className="absolute -top-6 -right-2 sm:-right-6 md:-right-10 w-44 sm:w-56 md:w-60 bg-white p-2.5 rounded-lg border border-[#D9E7F5] shadow-lg hidden sm:block hover:-translate-y-1 transition-transform"
          >
            <div className="aspect-4/3 rounded overflow-hidden relative">
              <img
                src={HERO_PHOTOS.card2.url}
                alt={HERO_PHOTOS.card2.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-[#2196F3] text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                Alpine Treks
              </span>
            </div>
            <div className="pt-2 px-1 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#0D1B3E]">Cascade Range</p>
                <p className="text-[10px] text-[#536784]">24 photos shared</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-50 text-[#2196F3] flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            </div>
          </motion.div>

          {/* Floating Collaborators Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute -bottom-6 right-6 sm:right-12 md:right-16 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#D9E7F5] shadow-md flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {SOCIAL_AVATARS.slice(0, 3).map((a, i) => (
                <img
                  key={i}
                  src={a.src}
                  alt={a.name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-white"
                />
              ))}
            </div>
            <div className="text-left text-xs leading-tight pr-1">
              <p className="font-bold text-[#0D1B3E]">+12 members</p>
              <p className="text-[10px] text-[#536784]">Active album</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
