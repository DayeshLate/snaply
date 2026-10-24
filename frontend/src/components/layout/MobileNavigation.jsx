import React from 'react';
import Sidebar from './Sidebar';
import { X } from 'lucide-react';

export default function MobileNavigation({
  isOpen,
  onClose,
  onCreateGroup,
  onJoinWithCode,
  onOpenChat,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="relative w-72 bg-[#12141C] h-full z-10 shadow-2xl flex flex-col border-r border-white/[0.08]">
        <button
          onClick={onClose}
          className="absolute top-4 right-3.5 text-white/50 hover:text-white p-2 rounded-[8px] hover:bg-white/[0.06] cursor-pointer z-30 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar
          onCloseMobile={onClose}
          onCreateGroup={onCreateGroup}
          onJoinWithCode={onJoinWithCode}
          onOpenChat={onOpenChat}
        />
      </div>
    </div>
  );
}
