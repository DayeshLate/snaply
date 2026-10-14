import React from 'react';
import { Folder, Image as ImageIcon, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function AlbumCard({
  album,
  onClick,
  onDelete,
  canDelete = false,
}) {
  const photoCount = album.media?.length || 0;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#0E1724] rounded-sm border border-[#CBD5E1] dark:border-[#1F2D40] hover:border-[#2563EB] dark:hover:border-[#38BDF8] hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col group shadow-2xs"
    >
      {/* Cover / Thumbnail Preview */}
      <div className="h-36 bg-slate-100 dark:bg-[#121D2C] flex items-center justify-center relative overflow-hidden border-b border-[#E2E8F0] dark:border-[#1F2D40]">
        {album.media && album.media.length > 0 ? (
          <div className="w-full h-full grid grid-cols-2 gap-0.5 bg-slate-200 dark:bg-[#1F2D40]">
            {album.media.slice(0, 4).map((m, idx) => (
              <div key={m.id || idx} className="h-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                <img
                  src={m.fileUrl || `/media/stream/${m.id}`}
                  alt={m.fileName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-[#64748B] dark:text-[#94A3B8] gap-2">
            <Folder className="w-10 h-10 text-blue-500/70" />
            <span className="text-xs font-mono">EMPTY ARCHIVE</span>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-xs backdrop-blur-xs flex items-center gap-1 border border-white/20">
          <ImageIcon className="w-3 h-3 text-[#38BDF8]" />
          <span>{photoCount}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#2563EB] dark:group-hover:text-[#38BDF8] transition-colors truncate">
            {album.name}
          </h4>
          {album.group?.name && (
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 truncate font-mono text-[11px]">
              Group: {album.group.name}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#F1F5F9] dark:border-[#162233] text-xs text-[#64748B] dark:text-[#94A3B8]">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(album.createdAt)}</span>
          </div>

          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(album);
              }}
              title="Delete album"
              className="p-1 hover:text-[#DC2626] dark:hover:text-[#F87171] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
