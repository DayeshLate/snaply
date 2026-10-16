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
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3] rounded-lg shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2196F3] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1854A3] transition-colors border border-[#64B5F6]/40">
              <Camera className="w-5 h-5 transition-transform group-hover:scale-105 duration-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#0D1B3E] dark:text-[#F1F5F9] leading-none">
                Snaply
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#536784] dark:text-[#94A3B8] mt-0.5">
                Shared Albums
              </span>
            </div>
          </Link>

          {/* Desktop Center Links Styled as Buttons with Background */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 p-1 rounded-xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="px-3 lg:px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-semibold text-[#0D1B3E] dark:text-[#E2E8F0] bg-white/80 dark:bg-white/10 hover:bg-[#2196F3] hover:text-white dark:hover:bg-[#2196F3] dark:hover:text-white border border-white/80 dark:border-white/10 shadow-2xs hover:shadow-xs hover:border-[#2196F3] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-2 lg:gap-2.5 shrink-0">
            <Link
              to="/login"
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#0D1B3E] dark:text-[#E2E8F0] bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-xl border border-white/80 dark:border-white/15 shadow-2xs hover:border-[#2196F3] hover:text-[#2196F3] dark:hover:text-[#38BDF8] transition-all cursor-pointer whitespace-nowrap"
            >
              Sign In
            </Link>
            <Link
              to="/login?tab=register"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-xl bg-[#2196F3] text-white text-xs sm:text-sm font-bold hover:bg-[#1854A3] active:translate-y-px transition-all shadow-sm hover:shadow hover:shadow-[#2196F3]/30 border border-[#64B5F6]/40 cursor-pointer whitespace-nowrap"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#536784] dark:text-[#94A3B8] hover:text-[#0D1B3E] dark:hover:text-white bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 rounded-xl transition-colors cursor-pointer"
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
              className="md:hidden mt-2.5 p-4 rounded-2xl bg-white/90 dark:bg-[#0E1724]/95 backdrop-blur-2xl border border-white/80 dark:border-white/15 shadow-2xl overflow-hidden space-y-2 pointer-events-auto"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="block w-full py-2.5 px-4 rounded-xl bg-white/80 dark:bg-[#121D2C] hover:bg-[#2196F3] hover:text-white dark:hover:bg-[#2196F3] dark:hover:text-white border border-[#D9E7F5]/80 dark:border-[#1F2D40] text-sm font-semibold text-[#0D1B3E] dark:text-[#E2E8F0] text-center shadow-2xs transition-all active:scale-98"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-[#D9E7F5]/80 dark:border-[#1F2D40] flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-white/80 dark:bg-[#121D2C] border border-[#D9E7F5]/80 dark:border-[#1F2D40] text-sm font-semibold text-[#0D1B3E] dark:text-[#E2E8F0] hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?tab=register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#2196F3] text-white text-sm font-bold hover:bg-[#1854A3] transition-colors flex items-center justify-center gap-2 shadow-sm"
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
