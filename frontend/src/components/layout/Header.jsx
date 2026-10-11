import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { getInitials } from '../../utils/formatters';

export default function Header({ onOpenMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const loadUnread = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        if (active) setUnreadCount(count);
      } catch {
        // ignore
      }
    };
    loadUnread();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Mobile menu toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-[#0F172A] hidden sm:inline">
          Collaborative Photo Album & Storage
        </span>
      </div>

      {/* Right side: Notifications & User profile */}
      <div className="flex items-center gap-3">
        <NavLink
          to="/notifications"
          className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#DC2626] rounded-full ring-2 ring-white" />
          )}
        </NavLink>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            aria-expanded={dropdownOpen}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white text-xs font-semibold flex items-center justify-center">
                {getInitials(user?.name)}
              </div>
            )}
            <span className="text-sm font-medium text-[#0F172A] hidden md:inline max-w-[120px] truncate">
              {user?.name}
            </span>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded border border-[#E2E8F0] shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-[#E2E8F0]">
                  <p className="text-xs font-medium text-[#64748B]">Signed in as</p>
                  <p className="text-sm font-semibold text-[#0F172A] truncate">{user?.email}</p>
                </div>
                <NavLink
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#0F172A] hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-[#64748B]" />
                  Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#0F172A] hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#64748B]" />
                  Settings & Drive
                </NavLink>
                <div className="border-t border-[#E2E8F0] my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#DC2626]" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
