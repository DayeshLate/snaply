import React from 'react';
import { Folder, Image as ImageIcon, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { mediaService } from '../../services/mediaService';

export default function AlbumCard({
  album,
  onClick,
  onDelete,
  canDelete = false,
}) {
  const photoCount = album.mediaCount ?? (album.media?.length || 0);

  return (
    <div
      onClick={onClick}
      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group shadow-sm"
    >
      {/* Cover / Thumbnail Preview */}
      <div className="h-44 bg-slate-100 dark:bg-slate-850 dark:bg-slate-800/60 flex items-center justify-center relative overflow-hidden border-b border-slate-100 dark:border-slate-800/80">
        {album.media && album.media.length > 0 ? (
          <div className="w-full h-full grid grid-cols-2 gap-1 bg-slate-200 dark:bg-slate-800">
            {album.media.slice(0, 4).map((m, idx) => (
              <div key={m.id || idx} className="h-full bg-slate-900 overflow-hidden relative">
                <img
                  src={m.id ? mediaService.getStreamUrl(m.id) : (m.fileUrl || '')}
                  alt={m.fileName}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center ring-1 ring-blue-500/20">
              <Folder className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-400">Empty Album</span>
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 bg-slate-950/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 border border-white/20 shadow-xs">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>{photoCount}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors truncate">
            {album.name}
          </h4>
          {album.group?.name && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate font-medium">
              Group: <span className="font-semibold text-slate-700 dark:text-slate-300">{album.group.name}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(album.createdAt)}</span>
          </div>

          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(album);
              }}
              title="Delete album"
              className="p-1.5 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
