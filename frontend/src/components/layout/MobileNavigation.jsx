import React from 'react';
import Sidebar from './Sidebar';
import { X } from 'lucide-react';

export default function MobileNavigation({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="relative w-72 bg-white dark:bg-[#11253E] h-full z-10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 border-r border-slate-200/80 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-3.5 text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer z-30 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar onCloseMobile={onClose} />
      </div>
    </div>
  );
}
