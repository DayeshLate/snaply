import React from 'react';
import { Camera, Heart, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#D9E7F5] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#2196F3] flex items-center justify-center text-white">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0D1B3E]">
                Snaply
              </span>
            </Link>
            <p className="text-xs text-[#536784] leading-relaxed">
              Your memories. Your people. One place. Collaborative group photo
              albums integrated with personal cloud storage.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D1B3E]">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-[#536784]">
              <li>
                <a href="#features" className="hover:text-[#2196F3] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#2196F3] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#collaboration" className="hover:text-[#2196F3] transition-colors">
                  For Groups
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#2196F3] transition-colors">
                  Public Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Access & Storage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D1B3E]">
              Account & Storage
            </h4>
            <ul className="space-y-2 text-sm text-[#536784]">
              <li>
                <Link to="/login" className="hover:text-[#2196F3] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/login?tab=register" className="hover:text-[#2196F3] transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#2196F3] font-semibold hover:underline">
                  ⚡ 1-Click Demo Review
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D1B3E]">
              Privacy & Control
            </h4>
            <ul className="space-y-2 text-sm text-[#536784]">
              <li>
                <a href="#privacy" className="hover:text-[#2196F3] transition-colors">
                  Trust & Security
                </a>
              </li>
              <li>
                <span className="text-xs text-[#536784]">
                  Google Drive App Data Sync
                </span>
              </li>
              <li>
                <span className="text-xs text-[#536784]">
                  Private Role-Based Access
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#D9E7F5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#536784]">
          <p>
            &copy; {new Date().getFullYear()} Snaply. All rights reserved. Made for memories.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[#0D1B3E] font-medium transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
