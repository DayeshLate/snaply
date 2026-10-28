import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X, ShieldCheck } from 'lucide-react';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Vaults', href: '#vaults' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Security', href: '#security' },
  ];

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const topOffset = 80;
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#090A0F]/85 backdrop-blur-md border-b border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.3)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#5B5BF0] rounded-lg p-1 transition-transform"
          aria-label="Snaply Home"
        >
          <div className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center p-1 group-hover:border-[#5B5BF0]/40 transition-colors">
            <img
              src="/snaply-cloud-mark.png"
              alt="Snaply"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
              Snaply
            </span>
          </div>
        </Link>

        {/* Center: 4 Top-Level Navigation Items (Hick's Law) */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-[14px] font-medium text-white/60 hover:text-white transition-colors duration-200 cursor-pointer focus-visible:text-white focus-visible:outline-none"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Exactly ONE Primary CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-[14px] font-medium text-white/70 hover:text-white px-3 py-2 transition-colors duration-200"
          >
            Sign In
          </Link>

          <Link
            to="/dashboard"
            className="h-10 px-4 rounded-[8px] bg-[#5B5BF0] hover:bg-[#4E4ED9] active:scale-[0.98] text-white text-[13px] font-medium transition-all duration-200 flex items-center gap-2 shadow-[0_4px_16px_rgba(91,91,240,0.25)] focus-visible:ring-2 focus-visible:ring-[#5B5BF0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A0F]"
          >
            <span>Launch Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button (44x44px touch target) */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/dashboard"
            className="h-9 px-3 rounded-[8px] bg-[#5B5BF0] text-white text-xs font-medium flex items-center gap-1.5"
          >
            <span>Launch</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-11 h-11 rounded-[8px] border border-white/[0.08] bg-white/[0.03] text-white/70 hover:text-white flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
            aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#090A0F]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="px-3 py-2.5 rounded-[8px] text-[14px] font-medium text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full h-11 rounded-[8px] border border-white/[0.08] bg-white/[0.03] text-white text-center flex items-center justify-center text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="w-full h-11 rounded-[8px] bg-[#5B5BF0] text-white text-center flex items-center justify-center gap-2 text-sm font-medium"
            >
              <span>Launch Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
