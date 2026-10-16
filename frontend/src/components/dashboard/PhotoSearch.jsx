import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { mediaService } from '../../services/mediaService';

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
    <section className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl relative overflow-hidden">
      {/* Decorative ambient background glow */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.16) 0%, rgba(6, 182, 212, 0.1) 40%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Top Header Row with System Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              AI Semantic Photo Search
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Vector Engine</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Search your private photo archives using visual descriptions, moods, scenes, and activities
          </p>
        </div>

        {/* Index Status & Sync Pill */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto">
          {status && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse" />
              <span>
                Indexed: <strong className="text-slate-900 dark:text-white font-black">{status.completedCount || 0}</strong> / {status.totalMedia || allMedia.length}
              </span>
            </div>
          )}

          <button
            onClick={handleTriggerSyncAll}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-cyan-400 border border-blue-500/30 transition-all cursor-pointer disabled:opacity-50"
            title="Scan vault and generate embeddings for unindexed media"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Indexing...' : 'Sync Vault'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="text-xs px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Natural Language Search Input */}
      <div className="relative z-10 space-y-3.5">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe anything: 'sunset at the beach', 'birthday party with cake', 'mountain trail', 'dinner with friends'..."
            className="w-full pl-12 pr-12 py-3.5 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 focus:border-blue-500 dark:focus:border-cyan-400 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggested Queries Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Quick Prompts:
          </span>
          {SUGGESTED_QUERIES.map((s) => (
            <button
              key={s}
              onClick={() => handleApplyQuery(s)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 transition-all cursor-pointer font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sensitivity Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Media Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
              Type:
            </span>
            {['ALL', 'IMAGE', 'VIDEO'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveTypeFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeTypeFilter === f
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Group Filter */}
          {groups.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Group:
              </span>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-blue-500"
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
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Sensitivity:
          </span>
          <select
            value={minSimilarity}
            onChange={(e) => setMinSimilarity(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value={0.2}>Broad (20%)</option>
            <option value={0.25}>Standard (25%)</option>
            <option value={0.35}>Precise (35%)</option>
            <option value={0.5}>Strict (50%)</option>
          </select>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {hasSearched ? `Semantic Matches (${displayResults.length})` : 'Curated Vault Highlights'}
            </span>
            {isSearching && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-cyan-400 animate-pulse">
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                <span>Computing vector matches...</span>
              </span>
            )}
          </div>

          {hasSearched && query && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Query: <strong className="text-slate-900 dark:text-white">"{query}"</strong>
            </span>
          )}
        </div>

        {searchError && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {isSearching && displayResults.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div
                key={k}
                className="aspect-square rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse"
              />
            ))}
          </div>
        ) : displayResults.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {hasSearched
                ? `No semantic matches found for "${query}"`
                : 'Your photo vault is ready for semantic search'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {hasSearched
                ? 'Try broadening the sensitivity cutoff or using different descriptive words.'
                : 'Enter a descriptive sentence or click any quick prompt to search photographs by visual concept.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {displayResults.map((photo, idx) => {
              const streamUrl = photo.fileUrl || `/media/stream/${photo.mediaId || photo.id}`;
              const isVideo = photo.mimeType?.startsWith('video/');
              const similarityScore = photo.similarity != null ? Math.round(photo.similarity * 100) : null;

              return (
                <motion.div
                  key={photo.mediaId || photo.id || idx}
                  whileHover={{ y: -3, scale: 1.03 }}
                  onClick={() => onSelectPhoto && onSelectPhoto(photo, idx)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={streamUrl}
                    alt={photo.fileName}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-75 group-hover:opacity-95 transition-opacity" />

                  {/* Similarity Badge */}
                  {similarityScore !== null && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-blue-600/90 backdrop-blur-sm text-white font-extrabold text-[10px] shadow-sm">
                      {similarityScore}% Match
                    </div>
                  )}

                  {isVideo && (
                    <div className="absolute top-2 right-2 bg-slate-950/60 backdrop-blur-sm p-1.5 rounded-full text-white">
                      <Film className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}

                  {/* Metadata and Description */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <p className="text-xs font-bold truncate leading-tight">
                      {photo.fileName}
                    </p>
                    <p className="text-[10px] text-slate-300 truncate mt-0.5">
                      {photo.folderName || photo.groupName || 'Vault Item'}
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
