import React, { useState, useEffect, useMemo } from 'react';
import {
  Image as ImageIcon,
  RefreshCw,
  Search,
  Filter,
  Upload,
} from 'lucide-react';
import { groupService } from '../services/groupService';
import { mediaService } from '../services/mediaService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

import PhotoGrid from '../components/albums/PhotoGrid';
import PhotoViewer from '../components/albums/PhotoViewer';
import UploadPhotoModal from '../components/albums/UploadPhotoModal';
import EditMediaModal from '../components/albums/EditMediaModal';
import DragDropZoneOverlay from '../components/common/DragDropZoneOverlay';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function SharedMediaPage() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [groups, setGroups] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [photoToEdit, setPhotoToEdit] = useState(null);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadGroupId, setUploadGroupId] = useState('');
  const [uploadFolderId, setUploadFolderId] = useState('');
  const [droppedFiles, setDroppedFiles] = useState([]);

  const handlePageDrop = (files) => {
    if (!files || files.length === 0) return;
    setDroppedFiles(files);
    setUploadModalOpen(true);
  };

  // Delete dialog state
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedGroups = await groupService.getAllGroups().catch(() => []);
      setGroups(fetchedGroups || []);

      if (fetchedGroups.length > 0) {
        if (!uploadGroupId) setUploadGroupId(fetchedGroups[0].id.toString());
        const firstGroupFolders = fetchedGroups[0].folders || fetchedGroups[0].folderDTOs || [];
        if (firstGroupFolders.length > 0) {
          setUploadFolderId(firstGroupFolders[0].id.toString());
        }

        const mediaPromises = fetchedGroups.map((g) =>
          mediaService.getAllMediaByGroup(g.id).catch(() => [])
        );
        const results = await Promise.all(mediaPromises);
        const allMedia = results.flat();
        const uniqueMedia = Array.from(
          new Map(allMedia.map((m) => [m.id, m])).values()
        );
        setPhotos(uniqueMedia);
      } else {
        setPhotos([]);
      }
    } catch (err) {
      showError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGroupSelect = async (groupId) => {
    setSelectedGroupId(groupId);
    if (groupId === 'ALL') {
      fetchData();
      return;
    }

    setLoading(true);
    try {
      const groupMedia = await mediaService.getAllMediaByGroup(groupId);
      setPhotos(groupMedia || []);
    } catch (err) {
      showError(err.message || 'Failed to load media for group');
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return photos;
    const q = searchQuery.toLowerCase();
    return photos.filter((p) => p.fileName && p.fileName.toLowerCase().includes(q));
  }, [photos, searchQuery]);

  const handleViewPhoto = (photo, index) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleDownload = (photo) => {
    const link = document.createElement('a');
    link.href = mediaService.getDownloadUrl(photo.id);
    link.download = photo.fileName || 'photo';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;
    setDeleting(true);
    try {
      await mediaService.deleteMedia(photoToDelete.id);
      success('Photo deleted successfully');
      setPhotos((prev) => prev.filter((p) => p.id !== photoToDelete.id));
      setPhotoToDelete(null);
      if (viewerOpen) setViewerOpen(false);
    } catch (err) {
      showError(err.message || 'Failed to delete photo');
    } finally {
      setDeleting(false);
    }
  };

  const activeUploadGroup = groups.find((g) => g.id.toString() === uploadGroupId);
  const availableUploadFolders = activeUploadGroup?.folders || activeUploadGroup?.folderDTOs || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Shared Media Vault
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Unified photo and video library across all your group archives
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchData}
            title="Refresh"
            className="p-2.5 sm:px-3"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {groups.length > 0 && (
            <Button
              onClick={() => setUploadModalOpen(true)}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Media</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search photos by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 font-medium shadow-xs"
          />
        </div>

        {groups.length > 0 && (
          <div className="flex items-center gap-2.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedGroupId}
              onChange={(e) => handleGroupSelect(e.target.value)}
              className="px-3.5 py-2.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500 shadow-xs"
            >
              <option value="ALL">All Groups ({photos.length} photos)</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Loading media..." />
        </div>
      ) : filteredPhotos.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={searchQuery ? 'No matching photos' : 'No photos yet'}
          description={
            searchQuery
              ? `No photos found matching "${searchQuery}".`
              : groups.length === 0
              ? 'Join or create a group to start sharing photos.'
              : 'Upload photos to any of your group albums to build your library.'
          }
          actionText={groups.length > 0 ? 'Upload Photo' : 'Go to Groups'}
          onAction={
            groups.length > 0 ? () => setUploadModalOpen(true) : () => {}
          }
        />
      ) : (
        <PhotoGrid
          photos={filteredPhotos}
          onViewPhoto={handleViewPhoto}
          onDownloadPhoto={handleDownload}
          onDeletePhoto={(p) => setPhotoToDelete(p)}
          onEditPhoto={(p) => setPhotoToEdit(p)}
          canDelete={true}
        />
      )}

      {/* Photo Viewer Modal */}
      <PhotoViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        photos={filteredPhotos}
        currentIndex={viewerIndex}
        onNavigate={setViewerIndex}
        onDownload={handleDownload}
        onDelete={(p) => setPhotoToDelete(p)}
        onEdit={(p) => setPhotoToEdit(p)}
        canDelete={true}
      />

      {/* Edit Media Modal */}
      {photoToEdit && (
        <EditMediaModal
          isOpen={!!photoToEdit}
          onClose={() => setPhotoToEdit(null)}
          photo={photoToEdit}
          folders={availableUploadFolders}
          onSuccess={() => {
            setPhotoToEdit(null);
            fetchData();
          }}
        />
      )}

      {/* Page-level Drag and Drop Overlay */}
      <DragDropZoneOverlay
        onFilesDropped={handlePageDrop}
        title="Drop media to upload to Shared Vault"
        subtitle="Release your photos & videos to upload directly into your shared album"
      />

      {/* Upload Media Modal */}
      {uploadModalOpen && (
        <UploadPhotoModal
          isOpen={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false);
            setDroppedFiles([]);
          }}
          folderId={uploadFolderId}
          folders={availableUploadFolders}
          groups={groups}
          selectedGroupId={uploadGroupId}
          onGroupChange={(gId) => {
            setUploadGroupId(gId);
            const grp = groups.find((g) => g.id.toString() === gId);
            const grpFolders = grp?.folders || grp?.folderDTOs || [];
            if (grpFolders.length > 0) {
              setUploadFolderId(grpFolders[0].id.toString());
            } else {
              setUploadFolderId('');
            }
          }}
          initialFiles={droppedFiles}
          onSuccess={() => {
            setUploadModalOpen(false);
            setDroppedFiles([]);
            fetchData();
          }}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!photoToDelete}
        onClose={() => setPhotoToDelete(null)}
        onConfirm={handleDeletePhoto}
        loading={deleting}
        title="Delete Photo"
        message={`Are you sure you want to delete "${photoToDelete?.fileName}"? This will permanently delete it from Google Drive and this group.`}
        confirmText="Delete Photo"
        isDanger={true}
      />
    </div>
  );
}
