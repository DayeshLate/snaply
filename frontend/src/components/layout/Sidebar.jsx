import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderLock,
  Image as ImageIcon,
  MessageSquare,
  Bell,
  Settings,
  User,
  LogOut,
  HardDrive,
  Camera,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { driveService } from '../../services/driveService';
import { getInitials } from '../../utils/formatters';

export default function Sidebar({ onCloseMobile, onCreateAlbum }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchStatus = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        if (active) setUnreadCount(count);
      } catch {
        // ignore
      }
      try {
        const drive = await driveService.getStatus();
        if (active) setIsDriveConnected(drive.connected);
      } catch {
        if (active && user) setIsDriveConnected(!!user.isDriveConnected);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user]);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Albums', path: '/albums', icon: FolderLock },
    { name: 'Shared Vault', path: '/shared', icon: ImageIcon },
    { name: 'Groups', path: '/groups', icon: Users },
    { name: 'AI Search', path: '/dashboard?tab=search', icon: Sparkles, badgeText: 'AI' },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800 flex flex-col h-full select-none transition-all duration-300 relative z-20 shadow-xs`}
    >
      {/* Brand Header */}
      <div className="h-18 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800/80">
        <NavLink
          to="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 min-w-0 group"
        >
          <div className="w-11 h-11 shrink-0 transition-transform group-hover:scale-105 duration-200 flex items-center justify-center">
            <img
              src="/snaply-cloud-mark.png"
              alt="Snaply"
              className="w-full h-full object-contain drop-shadow-xs"
              loading="eager"
            />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Snaply
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
              </div>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
                Photo Workspace
              </span>
            </div>
          )}
        </NavLink>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Prominent Action Button */}
      <div className="px-3.5 pt-4 pb-2">
        <button
          onClick={() => {
            if (onCreateAlbum) onCreateAlbum();
            else navigate('/albums');
          }}
          className={`w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-center gap-2'
          } transition-all duration-200 shadow-sm hover:shadow cursor-pointer`}
          title="Create Album"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>New Album</span>}
        </button>
      </div>

      {/* Nav Links List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onCloseMobile}
              title={isCollapsed ? item.name : undefined}
              className={`relative flex items-center ${
                isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
              } py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-cyan-400'
                  }`}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </div>

              {!isCollapsed && (
                <div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-rose-500 text-white shadow-xs'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.badgeText && (
                    <span
                      className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      {item.badgeText}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Google Drive Status Module */}
      {!isCollapsed && (
        <div className="px-3.5 py-3 border-t border-slate-100 dark:border-slate-800/80">
          <NavLink
            to="/settings"
            onClick={onCloseMobile}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 transition-all group"
          >
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                <HardDrive className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-none">Drive Backup</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {isDriveConnected ? 'Cloud synced' : 'Not linked'}
                </p>
              </div>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isDriveConnected
                  ? 'bg-emerald-500 ring-4 ring-emerald-500/20'
                  : 'bg-amber-500 ring-4 ring-amber-500/20'
              }`}
            />
          </NavLink>
        </div>
      )}

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 min-w-0 flex-1 p-1 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors"
        >
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
              {getInitials(user?.name)}
            </div>
          )}
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user?.name || 'Explorer'}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                {user?.email || 'Logged In'}
              </p>
            </div>
          )}
        </NavLink>

        {!isCollapsed && (
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
