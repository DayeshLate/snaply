import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { mediaService } from '../../services/mediaService';
import { useToast } from '../../context/ToastContext';
import { formatFileSize } from '../../utils/formatters';

export default function UploadPhotoModal({
  isOpen,
  onClose,
  folderId,
  onSuccess,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { success, error: showError } = useToast();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !folderId) return;

    setLoading(true);
    try {
      const uploaded = await mediaService.uploadMedia(selectedFile, folderId);
      success(`Photo "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);
      onClose();
      if (onSuccess) onSuccess(uploaded);
    } catch (err) {
      showError(err.message || 'Failed to upload photo. Check Google Drive connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Photo to Album"
      description="Photos are synced to Google Drive and shared with group members"
    >
      <div className="space-y-4">
        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            dragOver ? 'border-[#2563EB] bg-blue-50/50' : 'border-[#E2E8F0] hover:border-slate-400 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-[#0F172A]">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-[#64748B] mt-1">
            PNG, JPG, JPEG, WEBP or MP4 up to 50MB
          </p>
        </div>

        {/* Selected file preview */}
        {selectedFile && (
          <div className="flex items-center justify-between p-3 rounded border border-[#E2E8F0] bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <File className="w-5 h-5 text-[#2563EB] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#0F172A] truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[#64748B]">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-[#64748B] hover:text-[#DC2626] p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile} loading={loading}>
            Upload Photo
          </Button>
        </div>
      </div>
    </Modal>
  );
}
