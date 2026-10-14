import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FolderLock,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Plus,
  Moon,
  Sun,
  HardDrive,
  Upload,
  ArrowRight,
  Command,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function CommandPalette({
  isOpen,
  onClose,
  onCreateAlbum,
  onCreateGroup,
  onUploadMedia,
  groups = [],
  albums = [],
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const defaultActions = [
    {
      id: 'create-album',
      title: 'Create New Album',
      subtitle: 'Create a shared album inside a group',
      icon: Plus,
      category: 'Actions',
      run: () => {
        onClose();
        onCreateAlbum && onCreateAlbum();
      },
    },
    {
      id: 'create-group',
      title: 'Create New Group',
      subtitle: 'Start a collaborative workspace circle',
      icon: Users,
      category: 'Actions',
      run: () => {
        onClose();
        onCreateGroup && onCreateGroup();
      },
    },
    {
      id: 'upload-media',
      title: 'Upload Photos or Videos',
      subtitle: 'Add media to an existing album',
      icon: Upload,
      category: 'Actions',
      run: () => {
        onClose();
        onUploadMedia && onUploadMedia();
      },
    },
    {
      id: 'toggle-theme',
      title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: 'Toggle dashboard visual theme',
      icon: isDark ? Sun : Moon,
      category: 'Preferences',
      run: () => {
        toggleTheme();
        onClose();
      },
    },
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      subtitle: 'Overview, analytics & highlights',
      icon: Search,
      category: 'Navigation',
      run: () => {
        onClose();
        navigate('/dashboard');
      },
    },
    {
      id: 'nav-albums',
      title: 'Go to My Albums',
      subtitle: 'Browse all shared album folders',
      icon: FolderLock,
      category: 'Navigation',
      run: () => {
        onClose();
        navigate('/albums');
      },
    },
    {
      id: 'nav-groups',
      title: 'Go to Groups',
      subtitle: 'View collaborative workspace circles',
      icon: Users,
      category: 'Navigation',
      run: () => {
        onClose();
        navigate('/groups');
      },
    },
    {
      id: 'nav-shared',
      title: 'Go to Shared Media Vault',
      subtitle: 'Explore all high-res photos and videos',
      icon: ImageIcon,
      category: 'Navigation',
      run: () => {
        onClose();
        navigate('/shared');
      },
    },
    {
      id: 'nav-settings',
      title: 'Google Drive & Settings',
      subtitle: 'Manage cloud backup & credentials',
      icon: HardDrive,
      category: 'Navigation',
      run: () => {
        onClose();
        navigate('/settings');
      },
    },
  ];

  // Dynamic items for user groups & albums
  const dynamicItems = [
    ...groups.map((g) => ({
      id: `group-${g.id}`,
      title: `Group: ${g.name}`,
      subtitle: `${g.groupMembers?.length || 1} members • ${g.description || 'Workspace'}`,
      icon: Users,
      category: 'Your Groups',
      run: () => {
        onClose();
        navigate(`/groups/${g.id}`);
      },
    })),
    ...albums.map((a) => ({
      id: `album-${a.id}`,
      title: `Album: ${a.name}`,
      subtitle: `${a.media?.length || 0} media items`,
      icon: FolderLock,
      category: 'Your Albums',
      run: () => {
        onClose();
        if (a.groupId || a.group?.id) {
          navigate(`/groups/${a.groupId || a.group.id}?tab=albums`);
        } else {
          navigate('/albums');
        }
      },
    })),
  ];

  const allItems = [...defaultActions, ...dynamicItems];

  const filteredItems = allItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) current.run();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#0E1724] border border-[#CBD5E1] dark:border-[#2F4158] rounded-sm shadow-2xl overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 border-b border-[#E2E8F0] dark:border-[#1F2D40] bg-slate-50/50 dark:bg-[#121D2C]">
            <Search className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search actions, albums, groups, or pages..."
              className="w-full px-3 py-4 bg-transparent text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] focus:outline-none"
            />
            <kbd className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 text-[#64748B] dark:text-[#94A3B8] px-1.5 py-0.5 rounded-xs border border-[#CBD5E1] dark:border-[#334155]">
              ESC
            </kbd>
          </div>

          {/* List of actions */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
                No actions or archives found matching "{query}"
              </div>
            ) : (
              filteredItems.slice(0, 10).map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => item.run()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-sm cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#2563EB] text-white'
                        : 'text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-[#152338]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-[#1A2737] text-[#2563EB] dark:text-[#38BDF8]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{item.title}</p>
                        <p
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-blue-100' : 'text-[#64748B] dark:text-[#94A3B8]'
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2 shrink-0">
                      <span
                        className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-xs ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-[#152338] text-[#64748B] dark:text-[#94A3B8]'
                        }`}
                      >
                        {item.category}
                      </span>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2 border-t border-[#E2E8F0] dark:border-[#1F2D40] bg-slate-50/70 dark:bg-[#121D2C] flex items-center justify-between text-[11px] font-mono text-[#64748B] dark:text-[#64748B]">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
            </div>
            <span>SNAPLY // COMMAND PALETTE</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

