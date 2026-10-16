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
  HardDrive,
  Sparkles,
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
    if (p.includes('/groups')) return 'Group Workspaces';
    if (p.includes('/albums')) return 'Photo Albums';
    if (p.includes('/shared')) return 'Shared Media Vault';
    if (p.includes('/messages')) return 'Discussions';
    if (p.includes('/notifications')) return 'Activity Feed';
    if (p.includes('/settings')) return 'Settings & Cloud';
    if (p.includes('/profile')) return 'My Profile';
    return 'Dashboard';
  };

  return (
    <header className="h-18 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left side: Mobile menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Global Search Input Pill (Triggers Command Palette) */}
      <div className="hidden sm:flex items-center max-w-sm w-full mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-4 py-2 bg-slate-100/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500/50 dark:hover:border-cyan-500/50 rounded-xl text-xs text-slate-500 dark:text-slate-400 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors" />
            <span className="truncate font-medium">Search albums, groups, actions...</span>
          </div>
          <kbd className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-2xs">
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
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/20 cursor-pointer"
            title="Quick Create"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>

          {createDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setCreateDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 text-xs">
                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    onCreateAlbum && onCreateAlbum();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800/80 rounded-xl cursor-pointer font-medium transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                    <FolderLock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold">New Album</p>
                    <p className="text-[10px] text-slate-400">Photo & video collection</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    onCreateGroup && onCreateGroup();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800/80 rounded-xl cursor-pointer font-medium transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold">New Group</p>
                    <p className="text-[10px] text-slate-400">Collaborative team vault</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    onUploadMedia && onUploadMedia();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/80 rounded-xl cursor-pointer font-medium transition-colors border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold">Upload Photos</p>
                    <p className="text-[10px] text-slate-400">Drag & drop files</p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle visual theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90 duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 transition-transform -rotate-12 hover:rotate-0 duration-300" />
          )}
        </button>

        {/* Notifications Icon with Unread Pill */}
        <NavLink
          to="/notifications"
          className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          )}
        </NavLink>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
            aria-expanded={profileDropdownOpen}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-500/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                {getInitials(user?.name)}
              </div>
            )}
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 hidden lg:inline max-w-[110px] truncate">
              {user?.name || 'Explorer'}
            </span>
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Signed in as</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="space-y-0.5 py-1">
                  <NavLink
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                  >
                    <User className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span>Profile Overview</span>
                  </NavLink>

                  <NavLink
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                  >
                    <HardDrive className="w-4 h-4 text-emerald-500" />
                    <span>Drive & Storage</span>
                  </NavLink>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl w-full text-left font-bold cursor-pointer transition-colors"
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
