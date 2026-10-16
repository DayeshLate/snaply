import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Film,
  Image as ImageIcon,
  Loader2,
  Plus,
  FolderOpen
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { mediaService } from '../../services/mediaService';
import { useToast } from '../../context/ToastContext';
import { formatFileSize } from '../../utils/formatters';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

function isVideoFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith('video/')) return true;
  const name = file.name || '';
  return /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(name);
}

function getFileTypeBadge(file) {
  if (!file) return 'FILE';
  const name = file.name || '';
  const ext = name.split('.').pop();
  return ext ? ext.toUpperCase() : (isVideoFile(file) ? 'VIDEO' : 'IMAGE');
}

export default function UploadPhotoModal({
  isOpen,
  onClose,
  folderId,
  folders = [],
  groups = [],
  selectedGroupId,
  onGroupChange,
  onSuccess,
  initialFiles = [],
}) {
  const [selectedFolderId, setSelectedFolderId] = useState(folderId || '');
  const [fileQueue, setFileQueue] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { success, error: showError } = useToast();

  // Keep selectedFolderId in sync with folderId prop or first folder in list
  useEffect(() => {
    if (folderId) {
      setSelectedFolderId(folderId);
    } else if (folders && folders.length > 0) {
      // If current selectedFolderId is not in the folders list, pick first
      const exists = folders.some((f) => f.id.toString() === selectedFolderId?.toString());
      if (!exists) {
        setSelectedFolderId(folders[0].id);
      }
    }
  }, [folderId, folders]);

  // Load initial files if passed from drag-and-drop on parent page
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      addFilesToQueue(initialFiles);
    }
  }, [initialFiles]);

  // Clean up object URLs on unmount or reset
  useEffect(() => {
    return () => {
      fileQueue.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  const addFilesToQueue = (files) => {
    const validList = [];
    const oversized = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversized.push(file.name);
        return;
      }

      // Check if file is already queued by name and size
      const exists = fileQueue.some(
        (q) => q.file.name === file.name && q.file.size === file.size
      );
      if (exists) return;

      const isVideo = isVideoFile(file);
      const previewUrl = URL.createObjectURL(file);

      validList.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        file,
        isVideo,
        previewUrl,
        badge: getFileTypeBadge(file),
        status: 'pending', // 'pending' | 'uploading' | 'completed' | 'error'
        progress: 0,
        errorMessage: null,
      });
    });

    if (oversized.length > 0) {
      showError(`Skipped ${oversized.length} file(s) larger than 100MB limit.`);
    }

    if (validList.length > 0) {
      setFileQueue((prev) => [...prev, ...validList]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files);
      // Reset input value so same files can be chosen again if needed
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const removeFileFromQueue = (indexToRemove) => {
    setFileQueue((prev) => {
      const removed = prev[indexToRemove];
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const clearQueue = () => {
    fileQueue.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setFileQueue([]);
  };

  const handleUploadAll = async () => {
    const targetFolder = selectedFolderId || folderId;
    if (!targetFolder) {
      showError('Please select a destination album folder first.');
      return;
    }

    const pendingItems = fileQueue.filter((item) => item.status !== 'completed');
    if (pendingItems.length === 0) {
      showError('No new files to upload.');
      return;
    }

    setUploading(true);
    let successCount = 0;
    const uploadedResults = [];

    for (let i = 0; i < fileQueue.length; i++) {
      const currentItem = fileQueue[i];
      if (currentItem.status === 'completed') continue;

      setCurrentIndex(i + 1);
      setCurrentProgress(0);

      // Update status to uploading
      setFileQueue((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: 'uploading', progress: 0 } : item
        )
      );

      try {
        const uploaded = await mediaService.uploadMedia(
          currentItem.file,
          targetFolder,
          (percent) => {
            setCurrentProgress(percent);
            setFileQueue((prev) =>
              prev.map((item, idx) =>
                idx === i ? { ...item, progress: percent } : item
              )
            );
          }
        );

        successCount++;
        uploadedResults.push(uploaded);

        setFileQueue((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'completed', progress: 100 } : item
          )
        );
      } catch (err) {
        const message = err.message || 'Upload failed';
        setFileQueue((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'error', errorMessage: message } : item
          )
        );
      }
    }

    setUploading(false);

    if (successCount > 0) {
      success(`Successfully uploaded ${successCount} file(s)!`);
      if (onSuccess) onSuccess(uploadedResults);
      // Auto close after brief pause if all succeeded
      const hasErrors = fileQueue.some((item) => item.status === 'error');
      if (!hasErrors) {
        setTimeout(() => {
          clearQueue();
          onClose();
        }, 600);
      }
    } else {
      showError('All uploads failed. Please check connection and try again.');
    }
  };

  const completedCount = fileQueue.filter((item) => item.status === 'completed').length;
  const targetFolder = selectedFolderId || folderId;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!uploading) {
          clearQueue();
          onClose();
        }
      }}
      title="Upload Media"
      description="Add photos or videos to your album"
    >
      <div className="space-y-4">
        {/* Optional Group & Folder Pickers */}
        {groups && groups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#E2E8F0] uppercase tracking-wider mb-1.5">
                Group
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => onGroupChange && onGroupChange(e.target.value)}
                disabled={uploading}
                className="w-full px-3 py-2 bg-white dark:bg-[#121D2C] border border-[#CBD5E1] dark:border-[#1F2D40] rounded-lg text-sm text-[#0F172A] dark:text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#E2E8F0] uppercase tracking-wider mb-1.5">
                Album
              </label>
              <div className="relative">
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  disabled={uploading || folders.length === 0}
                  className="w-full px-3 py-2 pl-9 bg-white dark:bg-[#121D2C] border border-[#CBD5E1] dark:border-[#1F2D40] rounded-lg text-sm text-[#0F172A] dark:text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
                >
                  {folders.length === 0 ? (
                    <option value="">No albums available</option>
                  ) : (
                    folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))
                  )}
                </select>
                <FolderOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Folder picker if groups is not passed but multiple folders exist */}
        {(!groups || groups.length === 0) && folders && folders.length > 1 && (
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#E2E8F0] uppercase tracking-wider mb-1.5">
              Select Destination Album
            </label>
            <div className="relative">
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                disabled={uploading}
                className="w-full px-3 py-2 pl-9 bg-white dark:bg-[#121D2C] border border-[#CBD5E1] dark:border-[#1F2D40] rounded-lg text-sm text-[#0F172A] dark:text-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <FolderOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Clean, Minimalist Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(false);
          }}
          onDrop={handleDrop}
          onClick={() => {
            if (!uploading) fileInputRef.current?.click();
          }}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-[#2563EB] dark:border-[#38BDF8] bg-blue-50/70 dark:bg-blue-950/20 scale-[1.01]'
              : 'border-slate-300 dark:border-[#1F2D40] hover:border-[#2563EB] dark:hover:border-[#38BDF8] bg-slate-50/50 dark:bg-[#121D2C]/40 hover:bg-blue-50/20 dark:hover:bg-blue-950/10'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*,.jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mov,.mkv"
            multiple
            className="hidden"
          />

          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
              dragOver
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8]'
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
            Drag & drop files here, or <span className="text-[#2563EB] dark:text-[#38BDF8] underline font-medium">browse</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Photos and videos up to 100MB
          </p>
        </div>

        {/* Overall Upload Progress Bar */}
        {uploading && (
          <div className="bg-blue-50/70 dark:bg-[#121D2C] border border-blue-200 dark:border-[#1F2D40] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#0F172A] dark:text-white">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#2563EB] dark:text-[#38BDF8]" />
                Uploading {currentIndex} of {fileQueue.length}...
              </span>
              <span className="text-[#2563EB] dark:text-[#38BDF8] font-mono">{currentProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#2563EB] dark:bg-[#38BDF8] h-full rounded-full transition-all duration-200 ease-out"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Queued Files Preview List */}
        {fileQueue.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-[#0F172A] dark:text-[#E2E8F0] uppercase tracking-wider">
                Files Queue ({fileQueue.length})
                {completedCount > 0 && ` • ${completedCount} uploaded`}
              </span>
              {!uploading && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#2563EB] dark:text-[#38BDF8] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add more
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <button
                    onClick={clearQueue}
                    className="text-xs text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 rounded-lg border border-slate-100 p-1">
              {fileQueue.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-[#E2E8F0] dark:border-[#1F2D40] bg-white dark:bg-[#121D2C] hover:bg-slate-50 dark:hover:bg-[#19273A] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail preview */}
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                      {item.isVideo ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                          <Film className="w-4 h-4" />
                        </div>
                      ) : (
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* File details */}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9] truncate max-w-xs">
                        {item.file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                          {formatFileSize(item.file.size)}
                        </span>
                        {item.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle className="w-3 h-3" /> Done
                          </span>
                        )}
                        {item.status === 'uploading' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#2563EB] dark:text-[#38BDF8] font-medium">
                            <Loader2 className="w-3 h-3 animate-spin" /> {item.progress}%
                          </span>
                        )}
                        {item.status === 'error' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 font-medium">
                            <AlertCircle className="w-3 h-3" /> Failed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {item.status === 'completed' ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                    ) : item.status === 'uploading' ? (
                      <span className="text-xs font-mono font-semibold text-[#2563EB] dark:text-[#38BDF8]">
                        {item.progress}%
                      </span>
                    ) : (
                      <button
                        onClick={() => removeFileFromQueue(index)}
                        disabled={uploading}
                        className="text-[#64748B] hover:text-[#DC2626] p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-[#1F2D40]">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            {fileQueue.length === 0
              ? 'Select files to begin'
              : `${fileQueue.length} file(s) selected`}
          </span>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                clearQueue();
                onClose();
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadAll}
              disabled={fileQueue.length === 0 || !targetFolder}
              loading={uploading}
            >
              {uploading
                ? `Uploading (${currentIndex}/${fileQueue.length})...`
                : fileQueue.length > 1
                ? `Upload ${fileQueue.length} Files`
                : 'Upload Media'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
