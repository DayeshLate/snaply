import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolledRef = useRef(false);
  const visibleRef = useRef(true);
  const ticking = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isScrolled = currentScrollY > 20;

          if (isScrolled !== scrolledRef.current) {
            scrolledRef.current = isScrolled;
            setScrolled(isScrolled);
          }

          if (currentScrollY <= 30) {
            if (!visibleRef.current) {
              visibleRef.current = true;
              setVisible(true);
            }
          } else {
            const delta = currentScrollY - lastScrollY.current;
            if (delta > 10 && visibleRef.current) {
              visibleRef.current = false;
              setVisible(false);
              setMobileOpen(false);
            } else if (delta < -14 && !visibleRef.current) {
              visibleRef.current = true;
              setVisible(true);
            }
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'For Groups', href: '#collaboration' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Trust & Privacy', href: '#privacy' },
  ];

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const topOffset = 95;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
      className={`fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300 ease-in-out ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-28 opacity-0'
      }`}
    >
      <div className={`max-w-7xl mx-auto w-full ${visible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Continuous Glassy Row from Logo to Get Started */}
        <div
          style={{ transform: 'translateZ(0)' }}
          className={`flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-2xl transition-all duration-200 ${
            scrolled
              ? 'bg-white/85 dark:bg-[#070D16]/90 backdrop-blur-md border border-white/85 dark:border-white/15 shadow-[0_8px_30px_rgba(33,150,243,0.12),0_2px_10px_rgba(0,0,0,0.04)]'
              : 'bg-white/75 dark:bg-[#070D16]/75 backdrop-blur-md border border-white/80 dark:border-white/12 shadow-[0_4px_24px_rgba(15,23,42,0.06)]'
          }`}
        >
          {/* Logo on Left */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-all duration-200">
              <Camera className="w-5 h-5 transition-transform group-hover:rotate-6 duration-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Snaply
              </span>
              <span className="text-[10px] tracking-wider uppercase font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                Shared Albums
              </span>
            </div>
          </Link>

          {/* Desktop Center Links Styled as Buttons with Background */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 p-1 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="px-3.5 lg:px-4 py-1.5 rounded-xl text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-white/10 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-2 lg:gap-2.5 shrink-0">
            <Link
              to="/login"
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/60 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Sign In
            </Link>
            <Link
              to="/login?tab=register"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-bold hover:shadow-lg hover:shadow-blue-500/25 active:scale-98 transition-all cursor-pointer whitespace-nowrap shadow-md shadow-blue-500/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer Menu (Floating Glass Island) */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden mt-2.5 p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden space-y-2 pointer-events-auto"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="block w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-center transition-all active:scale-98"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?tab=register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-sm font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
