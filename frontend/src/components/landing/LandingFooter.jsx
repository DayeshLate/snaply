import React from 'react';
import { Camera, Heart, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <img
                  src="/snaply-cloud-mark.png"
                  alt="Snaply"
                  className="w-full h-full object-contain drop-shadow-xs"
                  loading="lazy"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Snaply
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your memories. Your people. One place. Collaborative group photo
              albums integrated with personal cloud storage.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#collaboration" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  For Groups
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Public Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Access & Storage */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Account & Storage
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/login?tab=register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  ⚡ 1-Click Demo Review
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Privacy & Control
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="#privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Trust & Security
                </a>
              </li>
              <li>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Google Drive App Data Sync
                </span>
              </li>
              <li>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Private Role-Based Access
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Snaply. All rights reserved. Made for memories.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white font-bold transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
