import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Trash2, Calendar, HardDrive } from 'lucide-react';
import { formatFileSize, formatDateTime } from '../../utils/formatters';

export default function PhotoViewer({
  isOpen,
  onClose,
  photos = [],
  currentIndex = 0,
  onNavigate,
  onDownload,
  onDelete,
  canDelete = false,
}) {
  const photo = photos[currentIndex];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  if (!isOpen || !photo) return null;

  const streamUrl = `/media/stream/${photo.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-in fade-in select-none">
      {/* Top action bar */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between text-white z-20 bg-linear-to-b from-black/70 to-transparent">
        <div className="min-w-0 pr-4">
          <h4 className="text-sm font-semibold truncate">{photo.fileName}</h4>
          <span className="text-xs text-slate-400">
            {currentIndex + 1} of {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onDownload && onDownload(photo)}
            className="p-2 rounded hover:bg-white/10 text-white transition-colors cursor-pointer"
            title="Download photo"
          >
            <Download className="w-5 h-5" />
          </button>
          {canDelete && (
            <button
              onClick={() => onDelete && onDelete(photo)}
              className="p-2 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              title="Delete photo"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10 text-white transition-colors cursor-pointer ml-2"
            title="Close viewer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Prev / Next controls */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors z-20 cursor-pointer"
          title="Previous photo (Arrow Left)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors z-20 cursor-pointer"
          title="Next photo (Arrow Right)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="w-full h-full p-16 flex items-center justify-center">
        <img
          src={streamUrl}
          alt={photo.fileName}
          className="max-w-full max-h-full object-contain rounded shadow-2xl transition-all"
        />
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white px-4 py-2 rounded-full text-xs flex items-center gap-4 z-20">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{formatDateTime(photo.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-blue-400" />
          <span>{formatFileSize(photo.fileSize)}</span>
        </div>
        {photo.mimeType && (
          <span className="uppercase text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
            {photo.mimeType.split('/')[1] || photo.mimeType}
          </span>
        )}
      </div>
    </div>
  );
}
