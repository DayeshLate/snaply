import React from 'react';
import Sidebar from './Sidebar';
import { X } from 'lucide-react';

export default function MobileNavigation({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="relative w-64 bg-white dark:bg-[#0E1724] h-full z-10 shadow-xl flex flex-col animate-in slide-in-from-left duration-200 border-r border-[#CBD5E1] dark:border-[#1F2D40]">
        <button
          onClick={onClose}
          className="absolute top-4 right-3 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white p-1.5 rounded-sm cursor-pointer z-20"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar onCloseMobile={onClose} />
      </div>
    </div>
  );
}
