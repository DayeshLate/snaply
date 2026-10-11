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
      className="bg-white rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col group"
    >
      {/* Cover / Thumbnail Preview */}
      <div className="h-36 bg-slate-100 flex items-center justify-center relative overflow-hidden border-b border-[#E2E8F0]">
        {album.media && album.media.length > 0 ? (
          <div className="w-full h-full grid grid-cols-2 gap-0.5 bg-slate-200">
            {album.media.slice(0, 4).map((m, idx) => (
              <div key={m.id || idx} className="h-full bg-slate-100 overflow-hidden relative">
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
          <div className="flex flex-col items-center justify-center text-[#64748B] gap-2">
            <Folder className="w-10 h-10 text-blue-500/70" />
            <span className="text-xs font-medium">Empty Album</span>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-slate-900/70 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          <span>{photoCount}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">
            {album.name}
          </h4>
          {album.group?.name && (
            <p className="text-xs text-[#64748B] mt-0.5 truncate">
              Group: {album.group.name}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E2E8F0] text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5">
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
              className="p-1 hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
