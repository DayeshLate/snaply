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

  const dynamicItems = [
    ...groups.map((g) => ({
      id: `group-${g.id}`,
      title: `Group: ${g.name}`,
      subtitle: `${g.groupMembers?.length || 1} members • ${g.description || 'Workspace'}`,
      icon: Users,
      category: 'Groups',
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
      category: 'Albums',
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
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Solid Top Accent Line */}
          <div className="h-1.5 w-full bg-blue-600" />

          {/* Search Header */}
          <div className="flex items-center px-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
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
              className="w-full px-3.5 py-4 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none font-medium"
            />
            <kbd className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xs">
              ESC
            </kbd>
          </div>

          {/* List of actions */}
          <div className="max-h-84 overflow-y-auto p-2 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
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
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{item.title}</p>
                        <p
                          className={`text-[11px] truncate mt-0.5 font-medium ${
                            isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.category}
                      </span>
                      {isSelected && <ArrowRight className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
            </div>
            <span className="text-blue-600 dark:text-cyan-400 font-bold">Snaply Commands</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
