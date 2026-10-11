import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import Button from '../common/Button';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Public Navbar */}
      <header className="h-16 border-b border-[#E2E8F0] bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#2563EB] flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0F172A]">Snaply</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A]">
              Home
            </NavLink>
            <a href="#features" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A]">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A]">
              How it Works
            </a>
            <a href="#privacy" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A]">
              Security & Privacy
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
      <footer className="border-t border-[#E2E8F0] bg-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#2563EB] flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-[#0F172A]">Snaply</span>
            <span className="text-xs text-[#64748B] ml-2">Your Memories. Your People. One Place.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#64748B]">
            <Link to="/login" className="hover:text-[#0F172A]">Sign In</Link>
            <a href="#features" className="hover:text-[#0F172A]">Features</a>
            <a href="#privacy" className="hover:text-[#0F172A]">Privacy Policy</a>
          </div>
          <p className="text-xs text-[#64748B]">
            &copy; {new Date().getFullYear()} Snaply Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
