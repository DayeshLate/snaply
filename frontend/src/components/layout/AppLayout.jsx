import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavigation from './MobileNavigation';
import { isDemoMode, disableDemoMode } from '../../mock/mockStore';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDemo = isDemoMode();

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenMobile={() => setMobileMenuOpen(true)} />
        {isDemo && (
          <div className="bg-[#2563EB] text-white text-xs px-4 py-1.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-[11px] uppercase tracking-wide shrink-0">
                Preview Mode
              </span>
              <span className="truncate">
                Interactive frontend review (no backend required) — groups, albums, photos, chat & notifications are active.
              </span>
            </div>
            <button
              onClick={() => {
                disableDemoMode();
                window.location.href = '/login';
              }}
              className="underline font-semibold text-blue-100 hover:text-white cursor-pointer ml-3 shrink-0"
            >
              Exit Demo
            </button>
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
