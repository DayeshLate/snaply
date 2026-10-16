import React, { useState, useEffect } from 'react';
import { Pencil, FolderOpen, Film, Image as ImageIcon } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { mediaService } from '../../services/mediaService';
import { useToast } from '../../context/ToastContext';

function isVideoPhoto(photo) {
  if (!photo) return false;
  if (photo.mimeType && photo.mimeType.startsWith('video/')) return true;
  const name = photo.fileName || '';
  return /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(name);
}

export default function EditMediaModal({
  isOpen,
  onClose,
  photo,
  folders = [],
  onSuccess,
}) {
  const [fileName, setFileName] = useState('');
  const [targetFolderId, setTargetFolderId] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    if (photo) {
      setFileName(photo.fileName || '');
      setTargetFolderId(photo.folderId ? photo.folderId.toString() : '');
    }
  }, [photo]);

  if (!photo) return null;

  const isVideo = isVideoPhoto(photo);
  const streamUrl = mediaService.getStreamUrl(photo.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileName.trim()) {
      showError('Media name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const updated = await mediaService.updateMedia(photo.id, {
        fileName: fileName.trim(),
        folderId: targetFolderId ? Number(targetFolderId) : undefined,
      });
      success(`Updated "${updated.fileName || fileName}" successfully`);
      if (onSuccess) onSuccess(updated);
      onClose();
    } catch (err) {
      showError(err.message || 'Failed to update media');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Media Details"
      description="Update file name or move to another album folder"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Preview Thumbnail */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
            {isVideo ? (
              <div className="w-full h-full flex items-center justify-center bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Film className="w-6 h-6" />
              </div>
            ) : (
              <img
                src={streamUrl}
                alt={photo.fileName}
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute bottom-0 right-0 left-0 bg-black/70 text-white text-[9px] font-bold text-center truncate px-0.5">
              {isVideo ? 'VIDEO' : 'IMAGE'}
            </span>
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {photo.fileName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {photo.uploadedByName ? `Uploaded by ${photo.uploadedByName}` : 'Group media'}
            </p>
          </div>
        </div>

        {/* Name input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            File Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. sunset_beach.jpg"
              required
              disabled={loading}
              className="w-full px-3.5 py-2.5 pl-10 bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all font-medium"
            />
            <Pencil className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Move to another album folder */}
        {folders && folders.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Album Folder
            </label>
            <div className="relative">
              <select
                value={targetFolderId}
                onChange={(e) => setTargetFolderId(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 pl-10 bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all font-medium"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <FolderOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Move this photo or video into another album
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
