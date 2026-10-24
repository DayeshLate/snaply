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
  Plus,
  KeyRound,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { groupService } from '../../services/groupService';
import { notificationService } from '../../services/notificationService';
import { getInitials } from '../../utils/formatters';

export default function Sidebar({
  onCloseMobile,
  onCreateGroup,
  onJoinWithCode,
  onOpenChat,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [groups, setGroups] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [gList, count] = await Promise.allSettled([
          groupService.getAllGroups(),
          notificationService.getUnreadCount(),
        ]);
        if (active) {
          if (gList.status === 'fulfilled') setGroups(gList.value || []);
          if (count.status === 'fulfilled') setUnreadCount(count.value || 0);
        }
      } catch {
        // ignore
      }
    };

    loadData();
    const interval = setInterval(loadData, 20000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Your Groups', path: '/groups', icon: Users },
    { name: 'All Albums', path: '/albums', icon: FolderLock },
    { name: 'Shared Media', path: '/shared', icon: ImageIcon },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-[264px] h-screen bg-[#12141C] border-r border-white/[0.08] flex flex-col justify-between select-none shrink-0 overflow-hidden">
      {/* Top Brand & Workspace Indicator */}
      <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
        <NavLink
          to="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-[10px] bg-[#1A1D28] border border-white/[0.1] flex items-center justify-center text-white font-bold text-xs">
            SN
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-[-0.02em] text-white">
                Snaply
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" title="Connected" />
            </div>
            <span className="text-[10px] text-white/40 block font-mono">
              Private Vault
            </span>
          </div>
        </NavLink>
      </div>

      {/* Middle Section: Navigation & Group List (Independently Scrolling) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#5B5BF0] text-white shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge != null && (
                  <span
                    className={`text-[10px] font-mono num-tabular px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#5B5BF0] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Actions (Create Group & Join with Code) */}
        <div className="pt-2 space-y-1.5 border-t border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 px-2 block mb-1">
            Circle Actions
          </span>
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onCreateGroup) onCreateGroup();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-medium text-white/80 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] transition-colors cursor-pointer text-left"
          >
            <Plus className="w-3.5 h-3.5 text-white/60" />
            <span>Create circle</span>
          </button>

          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onJoinWithCode) onJoinWithCode();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-medium text-white/80 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] transition-colors cursor-pointer text-left"
          >
            <KeyRound className="w-3.5 h-3.5 text-white/60" />
            <span>Join with code</span>
          </button>
        </div>

        {/* Your Groups List with Unread Dots */}
        <div className="pt-2 space-y-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40">
              Your Circles
            </span>
            <span className="text-[10px] font-mono text-white/30 num-tabular">
              {groups.length}
            </span>
          </div>

          <div className="space-y-0.5">
            {groups.length === 0 ? (
              <p className="text-[11px] text-white/30 px-2 py-2">
                No circles joined yet
              </p>
            ) : (
              groups.map((g, idx) => {
                const isCurrent = location.pathname === `/groups/${g.id}`;
                const hasUnread = idx === 0 || g.hasUnread; // realistic demo unread dot

                return (
                  <NavLink
                    key={g.id}
                    to={`/groups/${g.id}`}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3 py-2 rounded-[10px] text-xs transition-colors group ${
                      isCurrent
                        ? 'bg-white/[0.08] text-white font-medium'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-5 h-5 rounded-[6px] bg-[#1A1D28] border border-white/[0.1] text-white/80 flex items-center justify-center font-bold text-[9px] shrink-0">
                        {getInitials(g.name)}
                      </div>
                      <span className="truncate">{g.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {onOpenChat && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onCloseMobile) onCloseMobile();
                            onOpenChat(g.id);
                          }}
                          className="p-1 rounded-[6px] text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                          title={`Open ${g.name} chat`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {hasUnread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BF0] shrink-0" title="Unread activity" />
                      )}
                    </div>
                  </NavLink>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom User Area */}
      <div className="p-3 border-t border-white/[0.08] bg-[#0E1017] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-[10px] bg-[#1A1D28] border border-white/[0.1] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user?.name ? getInitials(user.name) : 'EX'}
          </div>
          <div className="min-w-0 truncate">
            <span className="text-xs font-medium text-white block truncate">
              {user?.name || 'Explorer'}
            </span>
            <span className="text-[10px] text-white/40 block truncate font-mono">
              {user?.email || 'user@snaply.com'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-1.5 text-white/40 hover:text-white rounded-[8px] hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
