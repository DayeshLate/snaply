import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderLock,
  ArrowRight,
  Plus,
  Image as ImageIcon,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import { mediaService } from '../../services/mediaService';

const FALLBACK_COVERS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
];

function resolveAlbumCover(album, index = 0) {
  if (album?.media && album.media.length > 0) {
    const firstMedia = album.media[0];
    if (firstMedia?.id) {
      return mediaService.getStreamUrl(firstMedia.id);
    }
    return firstMedia?.fileUrl || '';
  }
  return FALLBACK_COVERS[index % FALLBACK_COVERS.length];
}

export default function FeaturedAlbums({
  albums = [],
  onCreateAlbum,
  loading = false,
}) {
  const navigate = useNavigate();

  const handleOpenAlbum = (album) => {
    const targetGroupId = album.groupId || album.group?.id;
    if (targetGroupId) {
      navigate(`/groups/${targetGroupId}?tab=photos&folderId=${album.id}`);
    } else {
      navigate('/albums');
    }
  };

  return (
    <section className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Featured Albums
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
              Collections
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Curated memory vaults synchronized across your shared groups
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onCreateAlbum}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>New Album</span>
          </button>
          <Link
            to="/albums"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
          >
            <span>View All ({albums.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-68 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse"
            />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white/80 dark:bg-slate-900/80 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto ring-1 ring-blue-500/20">
            <FolderLock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Albums Created Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Albums organize shared photos and videos within your groups. Create your first album to begin archiving moments.
            </p>
          </div>
          <button
            onClick={onCreateAlbum}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Album</span>
          </button>
        </div>
      ) : (
        /* Asymmetric Editorial Composition */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {albums.slice(0, 5).map((album, idx) => {
            const isSpotlight = idx === 0 && albums.length >= 3;
            const coverUrl = resolveAlbumCover(album, idx);
            const photoCount = album.mediaCount ?? (album.media?.length || 0);
            const groupName = album.group?.name || 'Shared Group';

            return (
              <motion.div
                key={album.id || idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                onClick={() => handleOpenAlbum(album)}
                className={`group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col ${
                  isSpotlight ? 'lg:col-span-8' : 'lg:col-span-4'
                }`}
              >
                {/* Image Cover container */}
                <div className={`relative overflow-hidden bg-slate-900 ${isSpotlight ? 'h-64 sm:h-76' : 'h-52'}`}>
                  <img
                    src={coverUrl}
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-slate-950/10 group-hover:via-slate-950/25 transition-colors" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md text-white border border-white/20">
                      {groupName}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-sm text-white font-bold flex items-center gap-1.5 shadow-sm">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{photoCount}</span>
                    </span>
                  </div>

                  {/* Spotlight overlay detail */}
                  {isSpotlight && (
                    <div className="absolute top-3.5 right-24 hidden sm:flex items-center gap-1 text-[10px] font-extrabold uppercase text-cyan-300 bg-cyan-950/80 backdrop-blur-sm border border-cyan-700/60 px-3 py-1 rounded-full">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Spotlight</span>
                    </div>
                  )}

                  {/* Bottom Image Overlay text */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <h3 className={`font-black text-white group-hover:text-cyan-300 transition-colors truncate ${
                      isSpotlight ? 'text-xl sm:text-2xl' : 'text-lg'
                    }`}>
                      {album.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(album.createdAt || new Date())}</span>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        Cloud Synced
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Bar */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 truncate">
                    <FolderLock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span className="truncate">Photo Archive</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>Open Album</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
