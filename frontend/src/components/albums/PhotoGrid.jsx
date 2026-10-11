import React from 'react';
import { Download, Trash2, Eye } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

export default function PhotoGrid({
  photos = [],
  onViewPhoto,
  onDownloadPhoto,
  onDeletePhoto,
  canDelete = false,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {photos.map((photo, index) => {
        const streamUrl = photo.fileUrl || `/media/stream/${photo.id}`;
        return (
          <div
            key={photo.id || index}
            onClick={() => onViewPhoto(photo, index)}
            className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-[#E2E8F0] hover:shadow-md transition-all cursor-pointer"
          >
            <img
              src={streamUrl}
              alt={photo.fileName}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
              }}
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDownloadPhoto) onDownloadPhoto(photo);
                  }}
                  title="Download"
                  className="p-1.5 rounded bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                {canDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeletePhoto) onDeletePhoto(photo);
                    }}
                    title="Delete photo"
                    className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold truncate leading-tight">{photo.fileName}</p>
                <p className="text-[10px] text-slate-300 mt-0.5">{formatFileSize(photo.fileSize)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
