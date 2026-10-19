import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderLock,
  Plus,
  Search,
  RefreshCw,
  FolderPlus,
} from 'lucide-react';
import { folderService } from '../services/folderService';
import { groupService } from '../services/groupService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/theme';

import AlbumCard from '../components/albums/AlbumCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function AlbumsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [albums, setAlbums] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Create album modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [newAlbumName, setNewAlbumName] = useState('');
  const [creating, setCreating] = useState(false);

  // Delete dialog state
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedAlbums, fetchedGroups] = await Promise.all([
        folderService.getAllFolders().catch(() => []),
        groupService.getAllGroups().catch(() => []),
      ]);

      const groupFolderMap = {};
      fetchedGroups.forEach((g) => {
        const groupFolders = g.folderDTOs || g.folders || [];
        if (Array.isArray(groupFolders)) {
          groupFolders.forEach((f) => {
            groupFolderMap[f.id] = g;
          });
        }
      });

      const enrichedAlbums = (fetchedAlbums || []).map((album) => {
        const matchingGroup = groupFolderMap[album.id] || fetchedGroups.find((g) => g.id === album.groupId);
        return {
          ...album,
          groupId: album.groupId || matchingGroup?.id,
          group: matchingGroup || (album.groupName ? { id: album.groupId, name: album.groupName } : null),
        };
      });

      setAlbums(enrichedAlbums);
      setGroups(fetchedGroups || []);
      if (fetchedGroups && fetchedGroups.length > 0 && !selectedGroupId) {
        setSelectedGroupId(fetchedGroups[0].id.toString());
      }
    } catch (err) {
      showError(err.message || 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return albums;
    const q = searchQuery.toLowerCase();
    return albums.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.group?.name && a.group.name.toLowerCase().includes(q))
    );
  }, [albums, searchQuery]);

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!selectedGroupId) {
      showError('Please select a group first');
      return;
    }
    if (!newAlbumName.trim()) {
      showError('Album name is required');
      return;
    }

    setCreating(true);
    try {
      await folderService.addFolder(selectedGroupId, newAlbumName.trim());
      success(`Album "${newAlbumName}" created successfully!`);
      setNewAlbumName('');
      setIsCreateOpen(false);
      fetchData();
    } catch (err) {
      showError(err.message || 'Failed to create album');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!albumToDelete) return;
    setDeleting(true);
    try {
      const gId = albumToDelete.group?.id;
      if (!gId) {
        throw new Error('Group ID not found for this album');
      }
      await folderService.deleteFolderByOwner(gId, albumToDelete.id);
      success('Album deleted successfully');
      setAlbumToDelete(null);
      fetchData();
    } catch (err) {
      showError(err.message || 'Failed to delete album');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Photo Albums
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Browse and organize shared memory folders across all your active groups
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
              onClick={() => setIsCreateOpen(true)}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Album</span>
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search albums by name or group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 font-medium shadow-xs"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Loading albums..." />
        </div>
      ) : filteredAlbums.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title={searchQuery ? 'No matching albums' : 'No albums yet'}
          description={
            searchQuery
              ? `No albums found matching "${searchQuery}".`
              : groups.length === 0
              ? 'Join or create a group to start creating photo albums.'
              : 'Create your first album in one of your groups to start saving memories.'
          }
          actionText={groups.length === 0 ? 'Go to Groups' : 'Create Album'}
          onAction={
            groups.length === 0
              ? () => navigate('/groups')
              : () => setIsCreateOpen(true)
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => {
            const targetGroupId = album.groupId || album.group?.id;
            const isGroupOwnerOrAdmin =
              album.group?.user?.id === user?.id ||
              album.group?.role === ROLES.OWNER ||
              album.group?.role === ROLES.ADMIN;

            return (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => {
                  if (targetGroupId) {
                    navigate(`/groups/${targetGroupId}?tab=photos&folderId=${album.id}`);
                  }
                }}
                canDelete={isGroupOwnerOrAdmin && !!targetGroupId}
                onDelete={(alb) => setAlbumToDelete(alb)}
              />
            );
          })}
        </div>
      )}

      {/* Create Album Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Album"
        description="Select a group and enter a name for your shared album"
      >
        <form onSubmit={handleCreateAlbum} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Select Group
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
              required
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Album Name"
            placeholder="e.g. Summer Vacation, Birthday Party..."
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            required
            autoFocus
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsCreateOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button type="submit" loading={creating} variant="primary">
              Create Album
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!albumToDelete}
        onClose={() => setAlbumToDelete(null)}
        onConfirm={handleDeleteAlbum}
        loading={deleting}
        title="Delete Album"
        message={`Are you sure you want to delete "${albumToDelete?.name}"? All photos in this album will be permanently deleted.`}
        confirmText="Delete Album"
        isDanger={true}
      />
    </div>
  );
}
