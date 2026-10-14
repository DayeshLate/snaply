import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-md',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      <div
        className={`relative bg-white dark:bg-[#0E1724] w-full ${maxWidth} rounded-sm border border-[#CBD5E1] dark:border-[#2F4158] shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-150`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1F2D40]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9]">{title}</h3>
            {description && <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-[#182638] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
