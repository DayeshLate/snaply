import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  Search,
  Plus,
  Sun,
  Moon,
  FolderLock,
  Users,
  Upload,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/notificationService';
import { getInitials } from '../../utils/formatters';

export default function Header({
  onOpenMobile,
  onOpenCommandPalette,
  onCreateAlbum,
  onCreateGroup,
  onUploadMedia,
}) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

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

    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Determine current section title
  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/groups')) return 'Group Workspaces';
    if (p.includes('/albums')) return 'Photo Albums';
    if (p.includes('/shared')) return 'Shared Media Vault';
    if (p.includes('/messages')) return 'Group Discussions';
    if (p.includes('/notifications')) return 'Activity Notifications';
    if (p.includes('/settings')) return 'Settings & Drive Engine';
    if (p.includes('/profile')) return 'User Profile';
    return 'Creative Workspace';
  };

  return (
    <header className="h-16 bg-white/95 dark:bg-[#0E1724]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#1F2D40] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left side: Mobile menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182638] rounded-sm cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#2563EB] dark:text-[#38BDF8] font-bold">
            SNAPLY //
          </span>
          <span className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] truncate">
            {getPageTitle()}
          </span>
          {currentTime && (
            <span className="hidden xl:inline-block font-mono text-[10px] text-[#94A3B8] dark:text-[#64748B] border-l border-slate-200 dark:border-slate-800 pl-2">
              {currentTime}
            </span>
          )}
        </div>
      </div>

      {/* Center: Global Search Input Pill (Triggers Command Palette) */}
      <div className="hidden sm:flex items-center max-w-sm w-full mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-50 dark:bg-[#121D2C] hover:bg-slate-100 dark:hover:bg-[#182638] border border-[#CBD5E1] dark:border-[#2F4158] hover:border-[#2563EB] dark:hover:border-[#38BDF8] rounded-sm text-xs text-[#64748B] dark:text-[#94A3B8] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#64748B] dark:text-[#64748B] group-hover:text-[#2563EB] dark:group-hover:text-[#38BDF8]" />
            <span className="truncate">Search albums, groups, actions...</span>
          </div>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-white dark:bg-[#1A2737] border border-[#CBD5E1] dark:border-[#334155] text-[#475569] dark:text-[#94A3B8] shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Quick Create, Theme Toggle, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Create Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs rounded-sm transition-colors cursor-pointer border border-[#1D4ED8]"
            title="Quick Create"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>

          {createDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setCreateDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0E1724] rounded-sm border border-[#CBD5E1] dark:border-[#2F4158] shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 text-xs">
                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    onCreateAlbum && onCreateAlbum();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2 text-left text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-[#152338] cursor-pointer"
                >
                  <FolderLock className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8]" />
                  <span>Create Album</span>
                </button>
                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    onCreateGroup && onCreateGroup();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2 text-left text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-[#152338] cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#6366F1]" />
                  <span>Create Group</span>
                </button>
                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    onUploadMedia && onUploadMedia();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2 text-left text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-[#152338] cursor-pointer border-t border-slate-100 dark:border-slate-800"
                >
                  <Upload className="w-4 h-4 text-[#10B981]" />
                  <span>Upload Media</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182638] rounded-sm transition-colors cursor-pointer border border-transparent hover:border-[#CBD5E1] dark:hover:border-[#2F4158]"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle visual theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#F59E0B] transition-transform rotate-0 hover:rotate-90 duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-[#6366F1] transition-transform -rotate-12 hover:rotate-0 duration-300" />
          )}
        </button>

        {/* Notifications Icon with Unread Pill */}
        <NavLink
          to="/notifications"
          className="relative p-2 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182638] rounded-sm transition-colors border border-transparent hover:border-[#CBD5E1] dark:hover:border-[#2F4158]"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full ring-2 ring-white dark:ring-[#0E1724]" />
          )}
        </NavLink>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-[#182638] transition-colors cursor-pointer border border-transparent hover:border-[#CBD5E1] dark:hover:border-[#2F4158]"
            aria-expanded={profileDropdownOpen}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-7 h-7 rounded-sm object-cover border border-[#CBD5E1] dark:border-[#2F4158]"
              />
            ) : (
              <div className="w-7 h-7 rounded-sm bg-[#1E3A8A] text-white text-[11px] font-bold flex items-center justify-center">
                {getInitials(user?.name)}
              </div>
            )}
            <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] hidden lg:inline max-w-[110px] truncate">
              {user?.name || 'Explorer'}
            </span>
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#0E1724] rounded-sm border border-[#CBD5E1] dark:border-[#2F4158] shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-[#E2E8F0] dark:border-[#1F2D40]">
                  <p className="text-[10px] font-mono uppercase text-[#64748B] dark:text-[#94A3B8]">Signed in as</p>
                  <p className="text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] truncate">{user?.email}</p>
                </div>

                <NavLink
                  to="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-[#152338]"
                >
                  <User className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8]" />
                  <span>Profile Overview</span>
                </NavLink>

                <NavLink
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-[#152338]"
                >
                  <HardDrive className="w-4 h-4 text-[#10B981]" />
                  <span>Google Drive & Storage</span>
                </NavLink>

                <div className="border-t border-[#E2E8F0] dark:border-[#1F2D40] mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#DC2626] dark:text-[#F87171] hover:bg-red-50 dark:hover:bg-red-950/40 w-full text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
