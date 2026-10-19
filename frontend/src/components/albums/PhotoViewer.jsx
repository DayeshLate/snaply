import React, { useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  Calendar,
  HardDrive,
  Film,
  Image as ImageIcon,
  Pencil,
  User,
  FolderOpen
} from 'lucide-react';
import { formatFileSize, formatDateTime } from '../../utils/formatters';
import { mediaService } from '../../services/mediaService';
import { useAuth } from '../../context/AuthContext';

function isVideoPhoto(photo) {
  if (!photo) return false;
  if (photo.mimeType && photo.mimeType.startsWith('video/')) return true;
  const name = photo.fileName || '';
  return /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(name);
}

function resolveStreamUrl(photo) {
  if (!photo) return '';
  if (photo.id) {
    return mediaService.getStreamUrl(photo.id);
  }
  return photo.fileUrl || '';
}

export default function PhotoViewer({
  isOpen,
  onClose,
  photos = [],
  currentIndex = 0,
  onNavigate,
  onDownload,
  onDelete,
  onEdit,
  canDelete = false,
}) {
  const { user } = useAuth();
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

  const streamUrl = resolveStreamUrl(photo);
  const isVideo = isVideoPhoto(photo);

  const isUploader = Boolean(
    photo &&
      user &&
      (photo.uploadedById === user.id ||
        photo.uploadedByEmail === user.email ||
        photo.uplodedBy?.id === user.id ||
        photo.uplodedBy?.email === user.email ||
        photo.uplodedBy === user.id)
  );

  const canManage = Boolean(canDelete || isUploader);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-in fade-in select-none">
      {/* Top action bar */}
      <div className="absolute top-0 left-0 right-0 h-20 px-6 sm:px-8 flex items-center justify-between text-white z-20 bg-black/60 backdrop-blur-md">
        <div className="min-w-0 pr-4 flex items-center gap-3.5">
          {isVideo ? (
            <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Film className="w-5 h-5" />
            </span>
          ) : (
            <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <ImageIcon className="w-5 h-5" />
            </span>
          )}
          <div className="min-w-0">
            <h4 className="text-base font-bold truncate max-w-md">{photo.fileName}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-0.5">
              <span>
                {currentIndex + 1} of {photos.length}
              </span>
              {photo.uploadedByName && (
                <>
                  <span>•</span>
                  <span>Uploaded by {isUploader ? 'You' : photo.uploadedByName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit / Rename Button */}
          {canManage && onEdit && (
            <button
              onClick={() => onEdit(photo)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer backdrop-blur-md"
              title="Edit media details / rename"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}

          {/* Download Button */}
          <button
            onClick={() => onDownload && onDownload(photo)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer backdrop-blur-md"
            title="Download media"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Delete Button */}
          {canManage && (
            <button
              onClick={() => onDelete && onDelete(photo)}
              className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 hover:text-rose-200 transition-all cursor-pointer backdrop-blur-md border border-rose-500/30"
              title={isUploader ? 'Delete your upload' : 'Delete media'}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer ml-2"
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
          className="absolute left-6 p-3.5 rounded-2xl bg-black/60 hover:bg-black/90 text-white transition-all z-20 cursor-pointer border border-white/15 backdrop-blur-md shadow-2xl hover:scale-105"
          title="Previous (Arrow Left)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-6 p-3.5 rounded-2xl bg-black/60 hover:bg-black/90 text-white transition-all z-20 cursor-pointer border border-white/15 backdrop-blur-md shadow-2xl hover:scale-105"
          title="Next (Arrow Right)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Media Container */}
      <div className="w-full h-full p-16 sm:p-20 flex items-center justify-center">
        {isVideo ? (
          <video
            key={photo.id || streamUrl}
            src={streamUrl}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-full rounded-2xl shadow-2xl outline-none border border-white/15 bg-black"
          />
        ) : (
          <img
            src={streamUrl}
            alt={photo.fileName}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-all"
          />
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur-xl text-white px-6 py-3 rounded-full text-xs flex items-center gap-5 z-20 border border-white/15 shadow-2xl font-medium">
        {photo.uploadedByName && (
          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4 text-cyan-400" />
            <span>{isUploader ? 'Uploaded by You' : photo.uploadedByName}</span>
          </div>
        )}
        {photo.folderName && (
          <div className="flex items-center gap-2 text-slate-300">
            <FolderOpen className="w-4 h-4 text-blue-400" />
            <span>{photo.folderName}</span>
          </div>
        )}
        {photo.createdAt && (
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>{formatDateTime(photo.createdAt)}</span>
          </div>
        )}
        {photo.fileSize && (
          <div className="flex items-center gap-2 text-slate-300">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>{formatFileSize(photo.fileSize)}</span>
          </div>
        )}
        <span className="uppercase text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
          {photo.mimeType ? photo.mimeType.split('/')[1] || photo.mimeType : isVideo ? 'MP4' : 'IMAGE'}
        </span>
      </div>
    </div>
  );
}
