import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#090A0F] pt-16 pb-12 text-white/60 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info (Span 2) */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[7px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center p-1">
                <img
                  src="/snaply-cloud-mark.png"
                  alt="Snaply"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm font-semibold tracking-[-0.02em] text-white">
                Snaply
              </span>
            </Link>

            <p className="text-xs text-white/50 max-w-sm leading-relaxed">
              Weightless precision in group memory preservation. Private collaborative vaults, uncompressed RAW storage, and zero-knowledge circle sharing.
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Sitemap Columns */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/40 block">
              Platform
            </span>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, '#features')}
                  className="hover:text-white transition-colors"
                >
                  Features Bento
                </a>
              </li>
              <li>
                <a
                  href="#vaults"
                  onClick={(e) => handleSmoothScroll(e, '#vaults')}
                  className="hover:text-white transition-colors"
                >
                  Circle Vaults
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  onClick={(e) => handleSmoothScroll(e, '#workflow')}
                  className="hover:text-white transition-colors"
                >
                  3-Step Workflow
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Web Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/40 block">
              Security
            </span>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#security"
                  onClick={(e) => handleSmoothScroll(e, '#security')}
                  className="hover:text-white transition-colors"
                >
                  Invite-Only Protocol
                </a>
              </li>
              <li>
                <span className="text-white/40 cursor-default">
                  Zero Public Indexing
                </span>
              </li>
              <li>
                <span className="text-white/40 cursor-default">
                  Google Drive Hybrid
                </span>
              </li>
              <li>
                <span className="text-white/40 cursor-default">
                  AES-256 Storage
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/40 block">
              Access
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Create Circle
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Join with Code
                </Link>
              </li>
              <li>
                <span className="text-white/40 cursor-default">
                  API Documentation
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-white/40">
          <div>
            © {currentYear} Snaply. Weightless Precision. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-white/80">⌘K</kbd> to search vaults
            </span>
            <span>•</span>
            <span className="text-[#2DD4BF]">Privacy First Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
