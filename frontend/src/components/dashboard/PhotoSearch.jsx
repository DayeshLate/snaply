import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  X,
  Filter,
  Image as ImageIcon,
  Film,
  FolderLock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

const SUGGESTED_QUERIES = [
  'Goa beach sunset',
  'Campfire under the stars',
  'Mountain trek & hike',
  'Family birthday dinner',
  'Video clips',
];

export default function PhotoSearch({
  allMedia = [],
  groups = [],
  onSelectPhoto,
}) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL | IMAGE | VIDEO
  const [selectedGroupId, setSelectedGroupId] = useState('ALL');
  const [isSearching, setIsSearching] = useState(false);

  // Filter matching media
  const filteredResults = useMemo(() => {
    let list = allMedia;

    if (activeFilter === 'IMAGE') {
      list = list.filter((m) => !m.mimeType || !m.mimeType.startsWith('video/'));
    } else if (activeFilter === 'VIDEO') {
      list = list.filter((m) => m.mimeType && m.mimeType.startsWith('video/'));
    }

    if (selectedGroupId !== 'ALL') {
      list = list.filter((m) => String(m.groupId) === String(selectedGroupId));
    }

    if (!query.trim()) {
      return list.slice(0, 6);
    }

    const q = query.toLowerCase().trim();
    const keywords = q.split(/\s+/);

    return list.filter((item) => {
      const fileName = (item.fileName || '').toLowerCase();
      const folderName = (item.folderName || '').toLowerCase();
      const groupName = (item.groupName || '').toLowerCase();
      const text = `${fileName} ${folderName} ${groupName}`;
      return keywords.some((k) => text.includes(k));
    });
  }, [allMedia, query, activeFilter, selectedGroupId]);

  const handleApplyQuery = (suggested) => {
    setQuery(suggested);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 300);
  };

  return (
    <section className="bg-white dark:bg-[#0E1724] border border-[#CBD5E1] dark:border-[#1F2D40] rounded-sm p-6 sm:p-8 space-y-6 shadow-2xs relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-bl from-[#2196F3]/10 via-[#38BDF8]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
              Semantic Photo Search
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs bg-cyan-50 dark:bg-[#0C243B] text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-[#134469] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AI POWERED</span>
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Query your photo archives using natural language, activities, locations, or group events
          </p>
        </div>

        <div className="font-mono text-[11px] text-[#64748B] dark:text-[#64748B] bg-slate-50 dark:bg-[#121D2C] px-2.5 py-1 rounded-xs border border-[#E2E8F0] dark:border-[#1F2D40] self-start sm:self-auto">
          INDEX: {allMedia.length} ASSETS
        </div>
      </div>

      {/* Large Search Input */}
      <div className="relative z-10">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-[#64748B] dark:text-[#64748B] absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsSearching(true);
              setTimeout(() => setIsSearching(false), 200);
            }}
            placeholder="Try searching 'Goa beach sunset', 'Campfire', or 'Family dinner'..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-[#121D2C] border border-[#CBD5E1] dark:border-[#2F4158] focus:border-[#2563EB] dark:focus:border-[#38BDF8] rounded-sm text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] focus:outline-none transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggested Queries Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-1">
          <span className="text-[11px] font-mono text-[#64748B] dark:text-[#64748B] uppercase tracking-wider">
            Quick Prompts:
          </span>
          {SUGGESTED_QUERIES.map((s) => (
            <button
              key={s}
              onClick={() => handleApplyQuery(s)}
              className="text-xs px-2.5 py-1 rounded-xs bg-slate-100 dark:bg-[#162233] hover:bg-blue-50 dark:hover:bg-[#1E3A5F] text-[#475569] dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-[#38BDF8] border border-[#E2E8F0] dark:border-[#23354C] transition-all cursor-pointer font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9] dark:border-[#162233] text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-[#64748B] dark:text-[#64748B] uppercase mr-1">
            Media Filter:
          </span>
          {['ALL', 'IMAGE', 'VIDEO'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-xs font-mono text-[11px] transition-colors cursor-pointer border ${
                activeFilter === f
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-white dark:bg-[#121D2C] text-[#64748B] dark:text-[#94A3B8] border-[#CBD5E1] dark:border-[#2F4158] hover:border-[#2563EB]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {groups.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#64748B] dark:text-[#64748B] uppercase">
              Group Scope:
            </span>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="px-2.5 py-1 rounded-xs bg-white dark:bg-[#121D2C] border border-[#CBD5E1] dark:border-[#2F4158] text-xs text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Groups</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider">
            {query ? `Search Results (${filteredResults.length})` : 'Curated Archive Sample'}
          </span>
          {query && (
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Matching query: "{query}"
            </span>
          )}
        </div>

        {filteredResults.length === 0 ? (
          <div className="p-8 rounded-sm bg-slate-50 dark:bg-[#121D2C] border border-[#E2E8F0] dark:border-[#1F2D40] text-center space-y-2">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
              No media matches found for "{query}"
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Try a different keyword like "sunset", "mountain", or pick one of the quick prompt suggestions above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {filteredResults.map((photo, idx) => {
              const streamUrl = photo.fileUrl || `/media/stream/${photo.id}`;
              const isVideo = photo.mimeType?.startsWith('video/');

              return (
                <motion.div
                  key={photo.id || idx}
                  whileHover={{ y: -3, scale: 1.02 }}
                  onClick={() => onSelectPhoto && onSelectPhoto(photo, idx)}
                  className="group relative aspect-square rounded-sm overflow-hidden bg-slate-900 border border-[#CBD5E1] dark:border-[#1F2D40] hover:border-[#2563EB] dark:hover:border-[#38BDF8] shadow-2xs cursor-pointer"
                >
                  <img
                    src={streamUrl}
                    alt={photo.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {isVideo && (
                    <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-xs text-white">
                      <Film className="w-3 h-3 text-[#38BDF8]" />
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <p className="text-[11px] font-semibold truncate leading-tight">
                      {photo.fileName}
                    </p>
                    <p className="text-[9px] font-mono text-slate-300 truncate">
                      {photo.folderName || 'Vault item'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

