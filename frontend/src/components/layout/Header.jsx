import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  Search,
  Plus,
  FolderLock,
  Users,
  Upload,
  MessageSquare,
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { getInitials } from '../../utils/formatters';

export default function Header({
  hasScrolled = false,
  onOpenMobile,
  onOpenCommandPalette,
  onCreateAlbum,
  onCreateGroup,
  onUploadMedia,
  onToggleChat,
  isChatOpen = false,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);

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
    const timer = setInterval(loadUnread, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.startsWith('/groups/')) return 'Circle Space';
    if (p.includes('/groups')) return 'Your Circles';
    if (p.includes('/albums')) return 'Album Vaults';
    if (p.includes('/shared')) return 'Shared Media';
    if (p.includes('/notifications')) return 'Activity Feed';
    if (p.includes('/settings')) return 'Settings';
    if (p.includes('/profile')) return 'Profile';
    return 'Dashboard';
  };

  return (
    <header
      className={`h-16 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 bg-[#0B0C12] transition-colors duration-200 ${
        hasScrolled ? 'border-b border-white/[0.08]' : 'border-b border-transparent'
      }`}
    >
      {/* Left side: Mobile menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/[0.04] rounded-[10px] cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-semibold tracking-[-0.02em] text-white">
          {getPageTitle()}
        </h1>
      </div>

      {/* Center: Global Search Input Pill (Triggers Command Palette) */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-[#12141C] hover:bg-[#1A1D28] border border-white/[0.08] hover:border-white/[0.16] rounded-[10px] text-xs text-white/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-colors" />
            <span className="truncate">Search vaults, members, actions...</span>
          </div>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded-[6px] bg-white/[0.06] border border-white/[0.08] text-white/60">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Quick Create, Notifications, Chat Drawer Toggle, Profile */}
      <div className="flex items-center gap-2">
        {/* Quick Create Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white font-medium text-xs rounded-[10px] transition-colors cursor-pointer"
            title="Create new"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create</span>
          </button>

          {createDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setCreateDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-[#12141C] rounded-2xl border border-white/[0.08] shadow-2xl p-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    onCreateAlbum && onCreateAlbum();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                >
                  <FolderLock className="w-3.5 h-3.5 text-white/60" />
                  <span>New Album</span>
                </button>
                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    onCreateGroup && onCreateGroup();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                >
                  <Users className="w-3.5 h-3.5 text-white/60" />
                  <span>New Circle</span>
                </button>
                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    onUploadMedia && onUploadMedia();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                >
                  <Upload className="w-3.5 h-3.5 text-white/60" />
                  <span>Upload Media</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <NavLink
          to="/notifications"
          aria-label="View notifications"
          className="relative p-2 text-white/60 hover:text-white hover:bg-white/[0.04] rounded-[10px] transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5B5BF0]" />
          )}
        </NavLink>

        {/* Circle Chat Sidebar Toggle */}
        <button
          onClick={onToggleChat}
          aria-label="Toggle live circle chat sidebar"
          className={`p-2 rounded-[10px] transition-colors cursor-pointer relative ${
            isChatOpen
              ? 'text-white bg-[#5B5BF0]/20 border border-[#5B5BF0]/30'
              : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
          }`}
          title={isChatOpen ? 'Close chat sidebar' : 'Open circle chat'}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
        </button>

        {/* Profile Avatar & Dropdown */}
        <div className="relative pl-1">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            aria-label="User account menu"
            className="w-8 h-8 rounded-[10px] bg-[#1A1D28] border border-white/[0.1] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:border-white/[0.2] transition-colors"
          >
            {user?.name ? getInitials(user.name) : 'EX'}
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-[#12141C] rounded-2xl border border-white/[0.08] shadow-2xl p-1.5 z-50 text-xs">
                <div className="p-2 border-b border-white/[0.06] mb-1">
                  <p className="font-medium text-white truncate">{user?.name || 'Explorer'}</p>
                  <p className="text-[10px] text-white/40 truncate font-mono">{user?.email}</p>
                </div>
                <NavLink
                  to="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-white/80 hover:text-white hover:bg-white/[0.04]"
                >
                  <User className="w-3.5 h-3.5 text-white/60" />
                  <span>Profile details</span>
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-white/80 hover:text-white hover:bg-white/[0.04]"
                >
                  <Settings className="w-3.5 h-3.5 text-white/60" />
                  <span>Settings & Cloud</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer text-left mt-1 border-t border-white/[0.06]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
