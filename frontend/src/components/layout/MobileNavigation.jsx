import React from 'react';
import Sidebar from './Sidebar';
import { X } from 'lucide-react';

export default function MobileNavigation({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="relative w-64 bg-white h-full z-10 shadow-xl flex flex-col animate-in slide-in-from-left duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-3 text-[#64748B] hover:text-[#0F172A] p-1.5 rounded cursor-pointer z-20"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar onCloseMobile={onClose} />
      </div>
    </div>
  );
}
