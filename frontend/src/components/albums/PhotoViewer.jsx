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
  canDelete = false, // If group owner/admin, this is true
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

  // Check if current user is the uploader of this specific photo
  const isUploader = Boolean(
    photo &&
      user &&
      (photo.uploadedById === user.id ||
        photo.uploadedByEmail === user.email ||
        photo.uplodedBy?.id === user.id ||
        photo.uplodedBy?.email === user.email ||
        photo.uplodedBy === user.id)
  );

  // Group Admin, Group Owner, or the original uploader can edit/delete
  const canManage = Boolean(canDelete || isUploader);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md animate-in fade-in select-none">
      {/* Top action bar */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between text-white z-20 bg-linear-to-b from-black/80 to-transparent">
        <div className="min-w-0 pr-4 flex items-center gap-3">
          {isVideo ? (
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Film className="w-4 h-4" />
            </span>
          ) : (
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <ImageIcon className="w-4 h-4" />
            </span>
          )}
          <div className="min-w-0">
            <h4 className="text-sm font-semibold truncate max-w-md">{photo.fileName}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400">
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
              className="p-2 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Edit media details / rename"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}

          {/* Download Button */}
          <button
            onClick={() => onDownload && onDownload(photo)}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Download media"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Delete Button */}
          {canManage && (
            <button
              onClick={() => onDelete && onDelete(photo)}
              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              title={isUploader ? 'Delete your upload' : 'Delete media (Admin/Owner)'}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer ml-2"
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
          className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-20 cursor-pointer border border-white/10"
          title="Previous (Arrow Left)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-20 cursor-pointer border border-white/10"
          title="Next (Arrow Right)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Media Container */}
      <div className="w-full h-full p-16 flex items-center justify-center">
        {isVideo ? (
          <video
            key={photo.id || streamUrl}
            src={streamUrl}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-full rounded-lg shadow-2xl outline-none border border-white/10 bg-black"
          />
        ) : (
          <img
            src={streamUrl}
            alt={photo.fileName}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all"
          />
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-xs flex items-center gap-4 z-20 border border-white/10 shadow-lg">
        {photo.uploadedByName && (
          <div className="flex items-center gap-1.5 text-slate-300">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>{isUploader ? 'Uploaded by You' : photo.uploadedByName}</span>
          </div>
        )}
        {photo.folderName && (
          <div className="flex items-center gap-1.5 text-slate-300">
            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>{photo.folderName}</span>
          </div>
        )}
        {photo.createdAt && (
          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatDateTime(photo.createdAt)}</span>
          </div>
        )}
        {photo.fileSize && (
          <div className="flex items-center gap-1.5 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatFileSize(photo.fileSize)}</span>
          </div>
        )}
        <span className="uppercase text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono font-semibold">
          {photo.mimeType ? photo.mimeType.split('/')[1] || photo.mimeType : isVideo ? 'MP4' : 'IMAGE'}
        </span>
      </div>
    </div>
  );
}
