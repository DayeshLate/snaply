import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderLock,
  ArrowRight,
  Plus,
  Image as ImageIcon,
  Calendar,
  Users,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

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
    return firstMedia.fileUrl || `/media/stream/${firstMedia.id}`;
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
    if (album.groupId || album.group?.id) {
      navigate(`/groups/${album.groupId || album.group.id}?tab=albums`);
    } else {
      navigate('/albums');
    }
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
              Featured Albums
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs bg-blue-50 dark:bg-[#152338] text-[#2563EB] dark:text-[#38BDF8] border border-blue-200 dark:border-[#1E3A5F]">
              Archived Collections
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Curated memory vaults synchronized across your shared groups
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateAlbum}
            className="px-3.5 py-1.5 rounded-sm bg-white dark:bg-[#121D2C] hover:bg-slate-50 dark:hover:bg-[#182638] text-[#0F172A] dark:text-[#E2E8F0] font-medium text-xs flex items-center gap-1.5 border border-[#CBD5E1] dark:border-[#2F4158] hover:border-[#2563EB] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
            <span>New Album</span>
          </button>
          <Link
            to="/albums"
            className="px-3.5 py-1.5 rounded-sm bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>View All ({albums.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-sm bg-slate-100 dark:bg-[#121D2C] border border-[#E2E8F0] dark:border-[#1F2D40] animate-pulse"
            />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="p-10 rounded-sm bg-white dark:bg-[#0E1724] border border-dashed border-[#CBD5E1] dark:border-[#2F4158] text-center space-y-3">
          <div className="w-12 h-12 rounded-sm bg-blue-50 dark:bg-[#132238] text-[#2563EB] dark:text-[#38BDF8] flex items-center justify-center mx-auto border border-blue-200 dark:border-[#1E3A5F]">
            <FolderLock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9]">No Albums Created Yet</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto mt-1">
              Albums organize shared photos and videos within your groups. Create your first album to begin archiving moments.
            </p>
          </div>
          <button
            onClick={onCreateAlbum}
            className="px-4 py-2 rounded-sm bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Album</span>
          </button>
        </div>
      ) : (
        /* Asymmetric Editorial Composition */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {albums.slice(0, 5).map((album, idx) => {
            const isSpotlight = idx === 0 && albums.length >= 3;
            const coverUrl = resolveAlbumCover(album, idx);
            const photoCount = album.media?.length || 0;
            const groupName = album.group?.name || 'Shared Group';

            return (
              <motion.div
                key={album.id || idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                onClick={() => handleOpenAlbum(album)}
                className={`group relative rounded-sm overflow-hidden bg-white dark:bg-[#0E1724] border border-[#CBD5E1] dark:border-[#1F2D40] hover:border-[#2563EB] dark:hover:border-[#38BDF8] shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col ${
                  isSpotlight ? 'lg:col-span-8' : 'lg:col-span-4'
                }`}
              >
                {/* Image Cover container */}
                <div className={`relative overflow-hidden bg-slate-900 ${isSpotlight ? 'h-64 sm:h-72' : 'h-48'}`}>
                  <img
                    src={coverUrl}
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:via-black/20 transition-colors" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs bg-black/60 backdrop-blur-xs text-white border border-white/20">
                      {groupName}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-xs bg-[#2563EB]/90 text-white font-semibold flex items-center gap-1 shadow-sm">
                      <ImageIcon className="w-3 h-3" />
                      <span>{photoCount}</span>
                    </span>
                  </div>

                  {/* Spotlight overlay detail */}
                  {isSpotlight && (
                    <div className="absolute top-3 right-20 hidden sm:flex items-center gap-1 font-mono text-[10px] uppercase text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 px-2 py-0.5 rounded-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>SPOTLIGHT</span>
                    </div>
                  )}

                  {/* Bottom Image Overlay text */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className={`font-bold text-white group-hover:text-[#38BDF8] transition-colors truncate ${
                      isSpotlight ? 'text-lg sm:text-xl' : 'text-base'
                    }`}>
                      {album.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(album.createdAt || new Date())}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-emerald-400">
                        Full-Res Sync
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Bar */}
                <div className="p-3.5 bg-slate-50/70 dark:bg-[#121D2C] border-t border-[#E2E8F0] dark:border-[#1F2D40] flex items-center justify-between text-xs">
                  <span className="text-[#64748B] dark:text-[#94A3B8] font-medium flex items-center gap-1.5 truncate">
                    <FolderLock className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
                    <span className="truncate">Shared Archive Vault</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#2563EB] dark:text-[#38BDF8] group-hover:translate-x-0.5 transition-transform shrink-0">
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

