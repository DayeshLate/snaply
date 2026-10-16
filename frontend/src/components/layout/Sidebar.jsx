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
  Search,
  Activity,
  Layers,
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
    { name: 'Shared With Me', path: '/shared', icon: ImageIcon },
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
      } bg-white dark:bg-[#0E1724] border-r border-[#E2E8F0] dark:border-[#1F2D40] flex flex-col h-full select-none transition-all duration-300 relative z-20`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#E2E8F0] dark:border-[#1F2D40]">
        <NavLink
          to="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="w-9 h-9 rounded-sm bg-[#2563EB] flex items-center justify-center text-white shadow-xs shrink-0 border border-[#1D4ED8]">
            <Camera className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
                  Snaply
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              </div>
              <span className="block text-[9px] text-[#64748B] dark:text-[#94A3B8] font-mono tracking-widest uppercase">
                SHARED ALBUMS
              </span>
            </div>
          )}
        </NavLink>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1 rounded-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182638] transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Prominent Sharp Rectangular Action Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => {
            if (onCreateAlbum) onCreateAlbum();
            else navigate('/albums');
          }}
          className={`w-full py-2.5 px-3 rounded-sm bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-medium text-xs flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-center gap-2'
          } transition-all shadow-sm hover:shadow hover:shadow-[#2563EB]/20 border border-[#1D4ED8] cursor-pointer`}
          title="Create Album"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Create Album</span>}
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
                isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
              } py-2 rounded-sm text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-[#EFF6FF] dark:bg-[#152338] text-[#2563EB] dark:text-[#38BDF8] border border-[#BFDBFE] dark:border-[#1E3A5F]'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#121D2C] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]'
              }`}
            >
              {/* Left active line accent */}
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-1 bg-[#2563EB] dark:bg-[#38BDF8] rounded-r-xs" />
              )}

              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#2563EB] dark:text-[#38BDF8]' : ''
                  }`}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </div>

              {!isCollapsed && (
                <div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-[#2563EB] text-white rounded-xs">
                      {item.badge}
                    </span>
                  )}
                  {item.badgeText && (
                    <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 rounded-xs border border-cyan-300 dark:border-cyan-800">
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
        <div className="px-3 py-2 border-t border-[#E2E8F0] dark:border-[#1F2D40] bg-slate-50/50 dark:bg-[#121D2C]">
          <NavLink
            to="/settings"
            onClick={onCloseMobile}
            className="flex items-center justify-between p-2 rounded-sm text-xs hover:bg-slate-100 dark:hover:bg-[#182638] transition-colors border border-transparent hover:border-[#CBD5E1] dark:hover:border-[#2F4158]"
          >
            <div className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8]">
              <HardDrive className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8]" />
              <span className="font-medium">Drive Backup</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded-xs font-mono text-[9px] font-semibold uppercase ${
                isDriveConnected
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              }`}
            >
              {isDriveConnected ? 'Synced' : 'Link Drive'}
            </span>
          </NavLink>
        </div>
      )}

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-[#E2E8F0] dark:border-[#1F2D40] flex items-center justify-between">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity"
        >
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-8 h-8 rounded-sm object-cover border border-[#CBD5E1] dark:border-[#2F4158]"
            />
          ) : (
            <div className="w-8 h-8 rounded-sm bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center shrink-0">
              {getInitials(user?.name)}
            </div>
          )}
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] truncate leading-tight">
                {user?.name || 'Explorer'}
              </p>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono truncate">
                {user?.email || 'Logged In'}
              </p>
            </div>
          )}
        </NavLink>

        {!isCollapsed && (
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#DC2626] dark:hover:text-[#F87171] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
