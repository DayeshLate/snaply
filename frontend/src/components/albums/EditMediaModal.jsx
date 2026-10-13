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
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300 flex items-center justify-center">
            {isVideo ? (
              <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600">
                <Film className="w-6 h-6" />
              </div>
            ) : (
              <img
                src={streamUrl}
                alt={photo.fileName}
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute bottom-0 right-0 left-0 bg-black/60 text-white text-[9px] font-mono text-center truncate px-0.5">
              {isVideo ? 'VIDEO' : 'IMAGE'}
            </span>
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-[#0F172A] truncate">
              {photo.fileName}
            </h4>
            <p className="text-xs text-[#64748B] mt-0.5">
              {photo.uploadedByName ? `Uploaded by ${photo.uploadedByName}` : 'Group media'}
            </p>
          </div>
        </div>

        {/* Name input */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
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
              className="w-full px-3 py-2 pl-9 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
            />
            <Pencil className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Move to another album folder */}
        {folders && folders.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
              Album Folder
            </label>
            <div className="relative">
              <select
                value={targetFolderId}
                onChange={(e) => setTargetFolderId(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 pl-9 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <FolderOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">
              Select another album to move this photo or video into it
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

