import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  X,
  Filter,
  Image as ImageIcon,
  Film,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { mediaService } from '../../services/mediaService';
import { formatRelativeTime } from '../../utils/formatters';

const SUGGESTED_QUERIES = [
  'Goa beach sunset',
  'Family birthday celebration with cake',
  'Mountain trek & hiking trail',
  'Campfire under the starry sky',
  'Cars and road trip moments',
];

export default function PhotoSearch({
  allMedia = [],
  groups = [],
  onSelectPhoto,
}) {
  const [query, setQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('ALL');
  const [activeTypeFilter, setActiveTypeFilter] = useState('ALL'); // ALL | IMAGE | VIDEO
  const [minSimilarity, setMinSimilarity] = useState(0.25);

  const [semanticResults, setSemanticResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Embedding indexing status state
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  // Load embedding status on mount
  const loadStatus = useCallback(async () => {
    try {
      setStatusLoading(true);
      const data = await mediaService.getEmbeddingStatus();
      setStatus(data);
    } catch {
      // ignore
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Execute Semantic Search API call
  const performSearch = useCallback(
    async (searchQuery, groupId, similarity) => {
      if (!searchQuery || !searchQuery.trim()) {
        setSemanticResults([]);
        setHasSearched(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const results = await mediaService.searchSemantic({
          query: searchQuery.trim(),
          groupId: groupId !== 'ALL' ? Number(groupId) : undefined,
          minSimilarity: similarity,
          limit: 24,
        });

        setSemanticResults(results || []);
        setHasSearched(true);
      } catch (err) {
        console.error('Semantic search error:', err);
        setSearchError(err.response?.data?.message || err.message || 'Semantic search encountered an issue');
        // Client fallback if offline/mock
        setSemanticResults([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Debounced search on query change
  useEffect(() => {
    if (!query.trim()) {
      setSemanticResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query, selectedGroupId, minSimilarity);
    }, 350);

    return () => clearTimeout(timer);
  }, [query, selectedGroupId, minSimilarity, performSearch]);

  const handleApplyQuery = (suggested) => {
    setQuery(suggested);
  };

  const handleTriggerSyncAll = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await mediaService.indexAllEmbeddings();
      setSyncMessage(`Indexing started for ${res.enqueuedCount || 0} photos.`);
      setTimeout(() => {
        loadStatus();
        setIsSyncing(false);
      }, 1500);
    } catch {
      setIsSyncing(false);
      setSyncMessage('Failed to trigger background index.');
    }
  };

  // Filter results by media type (IMAGE vs VIDEO)
  const displayResults = useMemo(() => {
    let list = hasSearched ? semanticResults : allMedia.slice(0, 12);

    if (activeTypeFilter === 'IMAGE') {
      list = list.filter((m) => !m.mimeType || !m.mimeType.startsWith('video/'));
    } else if (activeTypeFilter === 'VIDEO') {
      list = list.filter((m) => m.mimeType && m.mimeType.startsWith('video/'));
    }

    if (!hasSearched && selectedGroupId !== 'ALL') {
      list = list.filter((m) => String(m.groupId) === String(selectedGroupId));
    }

    return list;
  }, [hasSearched, semanticResults, allMedia, activeTypeFilter, selectedGroupId]);

  return (
    <section className="bg-white dark:bg-[#0E1724] border border-[#CBD5E1] dark:border-[#1F2D40] rounded-sm p-6 sm:p-8 space-y-6 shadow-2xs relative overflow-hidden">
      {/* Decorative ambient background glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(33, 150, 243, 0.15) 0%, rgba(56, 189, 248, 0.08) 40%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Top Header Row with System Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
              AI Semantic Photo Search
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs bg-cyan-50 dark:bg-[#0C243B] text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-[#134469] flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-[#2196F3]" />
              <span>PGVECTOR 768-D</span>
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Search your private photo archives using visual descriptions, moods, scene concepts, and activities
          </p>
        </div>

        {/* Index Status & Sync Pill */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          {status && (
            <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] px-2.5 py-1 rounded-xs bg-slate-50 dark:bg-[#121D2C] border border-[#CBD5E1] dark:border-[#1F2D40] text-[#64748B] dark:text-[#94A3B8]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                INDEXED: <strong className="text-[#0F172A] dark:text-white">{status.completedCount || 0}</strong> / {status.totalMedia || allMedia.length}
              </span>
            </div>
          )}

          <button
            onClick={handleTriggerSyncAll}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-xs bg-[#2196F3]/10 hover:bg-[#2196F3]/20 text-[#1854A3] dark:text-[#38BDF8] border border-[#64B5F6]/40 transition-colors cursor-pointer disabled:opacity-50"
            title="Scan vault and generate embeddings for unindexed media"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Indexing...' : 'Sync Vault'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="text-xs px-3 py-1.5 rounded-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Natural Language Search Input */}
      <div className="relative z-10 space-y-3">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-[#64748B] dark:text-[#64748B] absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe anything: 'sunset at the beach', 'birthday party with cake', 'mountain trail', 'food dinner'..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-[#121D2C] border border-[#CBD5E1] dark:border-[#2F4158] focus:border-[#2196F3] dark:focus:border-[#38BDF8] rounded-sm text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] focus:outline-none transition-all shadow-inner"
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
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-[11px] font-mono text-[#64748B] dark:text-[#64748B] uppercase tracking-wider">
            Quick Prompts:
          </span>
          {SUGGESTED_QUERIES.map((s) => (
            <button
              key={s}
              onClick={() => handleApplyQuery(s)}
              className="text-xs px-2.5 py-1 rounded-xs bg-slate-100 dark:bg-[#162233] hover:bg-blue-50 dark:hover:bg-[#1E3A5F] text-[#475569] dark:text-[#CBD5E1] hover:text-[#2196F3] dark:hover:text-[#38BDF8] border border-[#E2E8F0] dark:border-[#23354C] transition-all cursor-pointer font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sensitivity Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9] dark:border-[#162233] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Media Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-[#64748B] dark:text-[#64748B] uppercase mr-1">
              Type:
            </span>
            {['ALL', 'IMAGE', 'VIDEO'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveTypeFilter(f)}
                className={`px-2.5 py-1 rounded-xs font-mono text-[11px] transition-colors cursor-pointer border ${
                  activeTypeFilter === f
                    ? 'bg-[#2196F3] text-white border-[#2196F3]'
                    : 'bg-white dark:bg-[#121D2C] text-[#64748B] dark:text-[#94A3B8] border-[#CBD5E1] dark:border-[#2F4158] hover:border-[#2196F3]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Group Filter */}
          {groups.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-[#64748B] dark:text-[#64748B] uppercase">
                Group:
              </span>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="px-2 py-1 rounded-xs bg-white dark:bg-[#121D2C] border border-[#CBD5E1] dark:border-[#2F4158] text-xs text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#2196F3]"
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

        {/* Semantic Similarity Sensitivity */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[#64748B] dark:text-[#64748B] uppercase">
            Match Cutoff:
          </span>
          <select
            value={minSimilarity}
            onChange={(e) => setMinSimilarity(Number(e.target.value))}
            className="px-2 py-1 rounded-xs bg-white dark:bg-[#121D2C] border border-[#CBD5E1] dark:border-[#2F4158] text-xs font-mono text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#2196F3]"
          >
            <option value={0.2}>Broad (20%)</option>
            <option value={0.25}>Standard (25%)</option>
            <option value={0.35}>Precise (35%)</option>
            <option value={0.5}>Strict (50%)</option>
          </select>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider">
              {hasSearched ? `Semantic Matches (${displayResults.length})` : 'Curated Archive Sample'}
            </span>
            {isSearching && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#2196F3] animate-pulse">
                <Cpu className="w-3 h-3 animate-spin" />
                <span>Computing vector cosine distance...</span>
              </span>
            )}
          </div>

          {hasSearched && query && (
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Query: <strong className="text-[#0F172A] dark:text-white">"{query}"</strong>
            </span>
          )}
        </div>

        {searchError && (
          <div className="p-3 rounded-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {isSearching && displayResults.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div
                key={k}
                className="aspect-square rounded-sm bg-slate-100 dark:bg-[#121D2C] animate-pulse border border-[#E2E8F0] dark:border-[#1F2D40]"
              />
            ))}
          </div>
        ) : displayResults.length === 0 ? (
          <div className="p-10 rounded-sm bg-slate-50 dark:bg-[#121D2C] border border-[#E2E8F0] dark:border-[#1F2D40] text-center space-y-2">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
              {hasSearched
                ? `No semantic matches found for "${query}"`
                : 'Your photo vault is ready for semantic search'}
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto">
              {hasSearched
                ? 'Try broadening the match cutoff, using different descriptive words (e.g. "beach", "sunset", "party"), or click Sync Vault above.'
                : 'Enter a descriptive sentence or click any quick prompt to search photographs by what is in them.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {displayResults.map((photo, idx) => {
              const streamUrl = photo.fileUrl || `/media/stream/${photo.mediaId || photo.id}`;
              const isVideo = photo.mimeType?.startsWith('video/');
              const similarityScore = photo.similarity != null ? Math.round(photo.similarity * 100) : null;

              return (
                <motion.div
                  key={photo.mediaId || photo.id || idx}
                  whileHover={{ y: -3, scale: 1.02 }}
                  onClick={() => onSelectPhoto && onSelectPhoto(photo, idx)}
                  className="group relative aspect-square rounded-sm overflow-hidden bg-slate-900 border border-[#CBD5E1] dark:border-[#1F2D40] hover:border-[#2196F3] dark:hover:border-[#38BDF8] shadow-2xs cursor-pointer"
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Similarity Badge */}
                  {similarityScore !== null && (
                    <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded-xs bg-[#2196F3]/90 text-white font-mono text-[9px] font-bold shadow-xs">
                      {similarityScore}% MATCH
                    </div>
                  )}

                  {isVideo && (
                    <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-xs text-white">
                      <Film className="w-3 h-3 text-[#38BDF8]" />
                    </div>
                  )}

                  {/* Metadata and Hover Description */}
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <p className="text-[11px] font-semibold truncate leading-tight">
                      {photo.fileName}
                    </p>
                    <p className="text-[9px] font-mono text-slate-300 truncate mt-0.5">
                      {photo.folderName || photo.groupName || 'Vault Item'}
                    </p>

                    {photo.description && (
                      <p className="hidden group-hover:line-clamp-2 text-[9px] text-slate-200 mt-1 leading-snug font-sans">
                        {photo.description}
                      </p>
                    )}
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
