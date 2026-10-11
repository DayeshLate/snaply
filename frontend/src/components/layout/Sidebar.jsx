import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { driveService } from '../../services/driveService';
import { getInitials } from '../../utils/formatters';

export default function Sidebar({ onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDriveConnected, setIsDriveConnected] = useState(false);

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
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Groups', path: '/groups', icon: Users },
    { name: 'Albums', path: '/albums', icon: FolderLock },
    { name: 'Shared Media', path: '/shared', icon: ImageIcon },
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
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col h-full select-none">
      {/* Brand Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-[#E2E8F0]">
        <div className="w-9 h-9 rounded bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-[#0F172A]">Snaply</span>
          <span className="block text-[10px] text-[#64748B] font-medium tracking-wide uppercase">Photo Albums</span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#DBEAFE] text-[#1E3A8A]'
                    : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs font-semibold bg-[#2563EB] text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Google Drive Status Bar */}
      <div className="px-4 py-3 border-t border-[#E2E8F0] bg-slate-50/60">
        <NavLink
          to="/settings"
          onClick={onCloseMobile}
          className="flex items-center justify-between p-2 rounded text-xs hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2 text-[#64748B]">
            <HardDrive className="w-4 h-4 text-[#2563EB]" />
            <span>Google Drive</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              isDriveConnected
                ? 'bg-green-100 text-[#16A34A]'
                : 'bg-slate-200 text-[#64748B]'
            }`}
          >
            {isDriveConnected ? 'Connected' : 'Link Drive'}
          </span>
        </NavLink>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity"
        >
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E2E8F0]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white text-xs font-semibold flex items-center justify-center shrink-0">
              {getInitials(user?.name)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0F172A] truncate leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-[#64748B] truncate leading-tight mt-0.5">
              {user?.email || ''}
            </p>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
