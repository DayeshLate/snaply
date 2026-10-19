import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import Button from '../common/Button';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Public Navbar */}
      <header className="h-18 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Snaply
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
              Home
            </NavLink>
            <a href="#features" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
              How it Works
            </a>
            <a href="#privacy" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/login?tab=register">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-[#111827]/60 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-white">Snaply</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-medium">Your Memories. Your People. One Place.</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link to="/login" className="hover:text-blue-600 dark:hover:text-white transition-colors">Sign In</Link>
            <a href="#features" className="hover:text-blue-600 dark:hover:text-white transition-colors">Features</a>
            <a href="#privacy" className="hover:text-blue-600 dark:hover:text-white transition-colors">Privacy Policy</a>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Snaply Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
