import React from 'react';
import { Download, Trash2, Play, Film, Pencil } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';
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

export default function PhotoGrid({
  photos = [],
  onViewPhoto,
  onDownloadPhoto,
  onDeletePhoto,
  onEditPhoto,
  canDelete = false,
}) {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
      {photos.map((photo, index) => {
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
          <div
            key={photo.id || index}
            onClick={() => onViewPhoto(photo, index)}
            className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-xs"
          >
            {isVideo ? (
              <div className="relative w-full h-full bg-slate-900 overflow-hidden flex items-center justify-center">
                <video
                  src={`${streamUrl}#t=0.001`}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 pointer-events-none"
                />
                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-slate-950/70 backdrop-blur-md flex items-center justify-center text-white shadow-xl border border-white/20">
                    <Play className="w-5 h-5 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Video Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/70 backdrop-blur-md text-white uppercase tracking-wider border border-white/20 shadow-xs">
                    <Film className="w-3 h-3 text-purple-400" /> Video
                  </span>
                </div>
              </div>
            ) : (
              <img
                src={streamUrl}
                alt={photo.fileName}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                }}
              />
            )}

            {/* Hover Actions & Details Overlay */}
            <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 transition-opacity p-3.5 flex flex-col justify-between text-white z-20">
              <div className="flex items-center justify-end gap-1.5">
                {/* Edit Button */}
                {canManage && onEditPhoto && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPhoto(photo);
                    }}
                    title="Edit media / rename"
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer backdrop-blur-md shadow-xs"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Download Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDownloadPhoto) onDownloadPhoto(photo);
                  }}
                  title="Download media"
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer backdrop-blur-md shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                {canManage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeletePhoto) onDeletePhoto(photo);
                    }}
                    title={isUploader ? 'Delete your upload' : 'Delete media'}
                    className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer backdrop-blur-md shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div>
                <p className="text-xs font-bold truncate leading-tight">{photo.fileName}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-1 font-medium">
                  <span>{formatFileSize(photo.fileSize)}</span>
                  {isVideo && (
                    <>
                      <span>•</span>
                      <span className="uppercase text-purple-300 font-bold">Video</span>
                    </>
                  )}
                  {photo.uploadedByName && (
                    <>
                      <span>•</span>
                      <span className="text-slate-300 truncate max-w-[100px]">
                        {isUploader ? 'You' : photo.uploadedByName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
