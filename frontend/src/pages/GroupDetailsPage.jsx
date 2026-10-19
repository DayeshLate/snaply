import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  FolderLock,
  Image as ImageIcon,
  MessageSquare,
  UserPlus,
  Settings,
  Copy,
  Check,
  Plus,
  Upload,
  Trash2,
  Calendar,
} from 'lucide-react';
import { groupService } from '../services/groupService';
import { folderService } from '../services/folderService';
import { mediaService } from '../services/mediaService';
import { messageService } from '../services/messageService';
import { joinRequestService } from '../services/joinRequestService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROLES } from '../constants/theme';
import { formatDate } from '../utils/formatters';

import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import MemberList from '../components/groups/MemberList';
import JoinRequestCard from '../components/groups/JoinRequestCard';
import AlbumGrid from '../components/albums/AlbumGrid';
import PhotoGrid from '../components/albums/PhotoGrid';
import PhotoViewer from '../components/albums/PhotoViewer';
import UploadPhotoModal from '../components/albums/UploadPhotoModal';
import CreateFolderModal from '../components/albums/CreateFolderModal';
import EditMediaModal from '../components/albums/EditMediaModal';
import DragDropZoneOverlay from '../components/common/DragDropZoneOverlay';

import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageComposer from '../components/chat/MessageComposer';

export default function GroupDetailsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'albums';
  const folderParam = searchParams.get('folderId');

  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [group, setGroup] = useState(null);
  const [groupMedia, setGroupMedia] = useState([]);
  const [messages, setMessages] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [copied, setCopied] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [createAlbumModalOpen, setCreateAlbumModalOpen] = useState(false);
  const [selectedFolderForUpload, setSelectedFolderForUpload] = useState(
    folderParam ? Number(folderParam) : null
  );
  const [droppedFiles, setDroppedFiles] = useState([]);

  // Sync selected folder from URL params
  useEffect(() => {
    const fId = searchParams.get('folderId');
    if (fId) {
      setSelectedFolderForUpload(Number(fId));
    }
  }, [searchParams]);

  // Load media directly for selected folder whenever it changes
  useEffect(() => {
    if (selectedFolderForUpload) {
      mediaService
        .getAllMediaByFolder(selectedFolderForUpload)
        .then((folderMedia) => {
          if (folderMedia && Array.isArray(folderMedia)) {
            setGroupMedia((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const newItems = folderMedia.filter((m) => !existingIds.has(m.id));
              return [...prev, ...newItems];
            });
          }
        })
        .catch(() => {});
    }
  }, [selectedFolderForUpload]);

  const handlePageDrop = (files) => {
    if (!files || files.length === 0) return;
    setDroppedFiles(files);
    setUploadModalOpen(true);
  };

  // Photo viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [photoToEdit, setPhotoToEdit] = useState(null);

  // Delete dialogs
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
  const [deleteActionLoading, setDeleteActionLoading] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  const loadGroupDetails = useCallback(async () => {
    try {
      const data = await groupService.getGroupById(groupId);
      setGroup(data);

      // Load group media
      try {
        const media = await mediaService.getAllMediaByGroup(groupId);
        setGroupMedia(media || []);
      } catch (err) {
        console.warn('Failed to load media by group, attempting folder fallback:', err);
        const folders = data?.folderDTOs || data?.folders || [];
        if (folders.length > 0) {
          const folderPromises = folders.map((f) =>
            mediaService.getAllMediaByFolder(f.id).catch(() => [])
          );
          const results = await Promise.all(folderPromises);
          setGroupMedia(results.flat());
        }
      }

      // Load messages
      try {
        const msgs = await messageService.getGroupMessages(groupId);
        setMessages(msgs || []);
      } catch {
        // ignore
      }
    } catch (err) {
      setError(err.message || 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadGroupDetails();
  }, [loadGroupDetails]);

  // Real-time Chat Polling when on chat tab
  useEffect(() => {
    if (activeTab !== 'chat') return;
    const interval = setInterval(async () => {
      try {
        const msgs = await messageService.getGroupMessages(groupId);
        setMessages(msgs || []);
      } catch {
        // ignore
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeTab, groupId]);

  // Load join requests if owner/admin and on joinRequests tab
  useEffect(() => {
    if (activeTab !== 'requests') return;
    const loadRequests = async () => {
      try {
        const reqs = await joinRequestService.getRequestsByGroup(groupId);
        setJoinRequests(reqs?.filter((r) => r.status === 'PENDING') || []);
      } catch {
        // ignore
      }
    };
    loadRequests();
  }, [activeTab, groupId]);

  // Current user's membership and role in this group
  const currentMember = group?.groupMembers?.find(
    (m) =>
      m.userId === user?.id ||
      m.user?.id === user?.id ||
      (m.userEmail && user?.email && m.userEmail.toLowerCase() === user.email.toLowerCase()) ||
      (m.user?.email && user?.email && m.user.email.toLowerCase() === user.email.toLowerCase())
  );
  const isOwner =
    group?.ownerId === user?.id ||
    (group?.ownerEmail && user?.email && group.ownerEmail.toLowerCase() === user.email.toLowerCase()) ||
    group?.user?.id === user?.id ||
    currentMember?.role === ROLES.OWNER;
  const isGroupAdmin = isOwner || currentMember?.role === ROLES.ADMIN;
  const canUpload = isOwner || isGroupAdmin || (currentMember ? (currentMember.isAccepted ?? true) : true);

  const allGroupFolders = group?.folderDTOs || group?.folders || [];

  const handleOpenUpload = (specificFolderId) => {
    if (specificFolderId) {
      setSelectedFolderForUpload(specificFolderId);
    }
    if (allGroupFolders.length === 0) {
      showError('Please create an album first before uploading photos!');
      setCreateAlbumModalOpen(true);
      return;
    }
    setUploadModalOpen(true);
  };

  const handleCopyInvite = () => {
    if (group?.inviteCode) {
      const inviteUrl = `${window.location.origin}/invite/${group.inviteCode}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      success('Invite link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendMessage = async ({ message, mediaId }) => {
    try {
      const sent = await messageService.sendMessage(groupId, { message, mediaId });
      setMessages((prev) => [...prev, sent]);
    } catch (err) {
      showError(err.message || 'Failed to send message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messageService.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      success('Message deleted');
    } catch (err) {
      showError(err.message || 'Failed to delete message');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await joinRequestService.acceptRequest(requestId);
      success('Join request accepted! Member added to group.');
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
      loadGroupDetails();
    } catch (err) {
      showError(err.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await joinRequestService.rejectRequest(requestId);
      success('Join request rejected');
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      showError(err.message || 'Failed to reject request');
    }
  };

  const handleDeleteGroup = async () => {
    setDeleteActionLoading(true);
    try {
      await groupService.deleteGroup(groupId);
      success('Group deleted successfully');
      navigate('/groups');
    } catch (err) {
      showError(err.message || 'Failed to delete group');
    } finally {
      setDeleteActionLoading(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!albumToDelete) return;
    setDeleteActionLoading(true);
    try {
      if (isOwner) {
        await folderService.deleteFolderByOwner(groupId, albumToDelete.id);
      } else {
        await folderService.deleteFolder(albumToDelete.id);
      }
      success('Album deleted successfully');
      setAlbumToDelete(null);
      if (selectedFolderForUpload === albumToDelete.id) {
        setSelectedFolderForUpload(null);
        setSearchParams({ tab: 'albums' });
      }
      loadGroupDetails();
    } catch (err) {
      showError(err.message || 'Failed to delete album');
    } finally {
      setDeleteActionLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;
    setDeleteActionLoading(true);
    try {
      await mediaService.deleteMedia(photoToDelete.id);
      success('Photo deleted successfully');
      setGroupMedia((prev) => prev.filter((m) => m.id !== photoToDelete.id));
      setPhotoToDelete(null);
      setViewerOpen(false);
      loadGroupDetails();
    } catch (err) {
      showError(err.message || 'Failed to delete photo');
    } finally {
      setDeleteActionLoading(false);
    }
  };

  const handleDownloadPhoto = (photo) => {
    window.open(mediaService.getDownloadUrl(photo.id), '_blank');
  };

  if (loading) return <Loader text="Loading group workspace..." className="py-24" />;
  if (error || !group) return <ErrorState message={error || 'Group not found'} onRetry={loadGroupDetails} />;

  const targetUploadFolderId = selectedFolderForUpload || allGroupFolders[0]?.id;
  const selectedFolder = allGroupFolders.find(
    (f) => Number(f.id) === Number(selectedFolderForUpload)
  );
  const filteredPhotos = selectedFolderForUpload
    ? groupMedia.filter(
        (m) =>
          Number(m.folderId) === Number(selectedFolderForUpload) ||
          Number(m.folder?.id) === Number(selectedFolderForUpload) ||
          String(m.folderId) === String(selectedFolderForUpload) ||
          String(m.folder?.id) === String(selectedFolderForUpload)
      )
    : groupMedia;

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{group.name}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                {isOwner ? 'Group Owner' : isGroupAdmin ? 'Admin' : 'Member'}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">{group.description || 'No description provided.'}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 font-semibold">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                {group.groupMembers?.length || 1} members
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Created {formatDate(group.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {group.inviteCode && (
              <Button
                variant="outline"
                size="sm"
                icon={copied ? Check : Copy}
                onClick={handleCopyInvite}
              >
                {copied ? 'Invite Copied!' : 'Copy Invite Link'}
              </Button>
            )}

            {canUpload && (
              <Button
                size="sm"
                icon={Upload}
                onClick={() => handleOpenUpload()}
                variant="primary"
              >
                Upload Media
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/80 mt-6 pt-5 overflow-x-auto">
          {[
            { id: 'albums', label: 'Albums', icon: FolderLock, count: group.folderDTOs?.length },
            { id: 'photos', label: 'All Photos', icon: ImageIcon, count: groupMedia?.length },
            { id: 'members', label: 'Members', icon: Users, count: group.groupMembers?.length },
            { id: 'chat', label: 'Group Chat', icon: MessageSquare, count: messages?.length },
            ...(isGroupAdmin
              ? [{ id: 'requests', label: 'Join Requests', icon: UserPlus, count: joinRequests?.length }]
              : []),
            ...(isOwner ? [{ id: 'settings', label: 'Settings', icon: Settings }] : []),
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      {/* 1. ALBUMS TAB */}
      {activeTab === 'albums' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Albums & Folders</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Organize group memories into dedicated albums</p>
            </div>
            <div className="flex items-center gap-2.5">
              {canUpload && (
                <Button
                  size="sm"
                  variant="outline"
                  icon={Upload}
                  onClick={() => handleOpenUpload()}
                >
                  Upload Media
                </Button>
              )}
              {canUpload && (
                <Button
                  size="sm"
                  icon={Plus}
                  onClick={() => setCreateAlbumModalOpen(true)}
                  variant="primary"
                >
                  New Album
                </Button>
              )}
            </div>
          </div>

          {allGroupFolders.length === 0 ? (
            <div className="p-12 bg-white/80 dark:bg-slate-900/80 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No custom albums in this group yet.</p>
              {canUpload && (
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => setCreateAlbumModalOpen(true)}
                  variant="primary"
                >
                  Create First Album
                </Button>
              )}
            </div>
          ) : (
            <AlbumGrid
              albums={allGroupFolders}
              onSelectAlbum={(album) => {
                setSelectedFolderForUpload(album.id);
                setSearchParams({ tab: 'photos', folderId: album.id });
              }}
              onDeleteAlbum={(album) => setAlbumToDelete(album)}
              canDelete={isGroupAdmin}
            />
          )}
        </div>
      )}

      {/* 2. PHOTOS TAB */}
      {activeTab === 'photos' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Group Photos</h3>
                {selectedFolder && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                    Album: {selectedFolder.name}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFolderForUpload(null);
                        setSearchParams({ tab: 'photos' });
                      }}
                      className="hover:text-rose-500 font-black ml-1 cursor-pointer"
                      title="Clear album filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {selectedFolder
                  ? `Showing photos inside "${selectedFolder.name}".`
                  : 'All photos and videos uploaded across group albums.'}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {allGroupFolders.length > 1 && (
                <select
                  value={selectedFolderForUpload || ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : null;
                    setSelectedFolderForUpload(val);
                    if (val) {
                      setSearchParams({ tab: 'photos', folderId: val });
                    } else {
                      setSearchParams({ tab: 'photos' });
                    }
                  }}
                  className="px-3.5 py-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 shadow-xs"
                >
                  <option value="">All Albums ({groupMedia.length})</option>
                  {allGroupFolders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              )}
              {canUpload && (
                <Button
                  size="sm"
                  icon={Upload}
                  onClick={() => handleOpenUpload(selectedFolderForUpload)}
                  variant="primary"
                >
                  Upload Media
                </Button>
              )}
            </div>
          </div>

          {filteredPhotos.length === 0 ? (
            <div className="p-16 bg-white/80 dark:bg-slate-900/80 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
              <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedFolder ? `No photos in "${selectedFolder.name}"` : 'No photos in this group yet'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedFolder
                  ? 'Upload photos or videos directly to this album.'
                  : 'Upload the first photo to begin sharing.'}
              </p>
              {canUpload && (
                <Button
                  size="sm"
                  className="mt-4"
                  icon={Upload}
                  onClick={() => handleOpenUpload(selectedFolderForUpload)}
                  variant="primary"
                >
                  Upload Media
                </Button>
              )}
            </div>
          ) : (
            <PhotoGrid
              photos={filteredPhotos}
              onViewPhoto={(photo, idx) => {
                setViewerIndex(idx);
                setViewerOpen(true);
              }}
              onDownloadPhoto={handleDownloadPhoto}
              onDeletePhoto={(photo) => setPhotoToDelete(photo)}
              onEditPhoto={(photo) => setPhotoToEdit(photo)}
              canDelete={isGroupAdmin}
            />
          )}
        </div>
      )}

      {/* 3. MEMBERS TAB */}
      {activeTab === 'members' && (
        <MemberList
          groupId={groupId}
          members={group.groupMembers || []}
          currentUserRole={isOwner ? ROLES.OWNER : currentMember?.role}
          currentUserId={user?.id}
          onMembersChanged={() => loadGroupDetails()}
        />
      )}

      {/* 4. CHAT TAB */}
      {activeTab === 'chat' && (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col h-[650px] overflow-hidden shadow-xl">
          <ChatHeader
            group={group}
            memberCount={group.groupMembers?.length || 1}
          />
          <MessageList
            messages={messages}
            currentUserId={user?.id}
            onDeleteMessage={handleDeleteMessage}
            isGroupAdmin={isGroupAdmin}
          />
          <MessageComposer
            onSendMessage={handleSendMessage}
            availableMedia={groupMedia}
          />
        </div>
      )}

      {/* 5. JOIN REQUESTS TAB */}
      {activeTab === 'requests' && isGroupAdmin && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Pending Join Requests ({joinRequests.length})
          </h3>
          {joinRequests.length === 0 ? (
            <div className="p-10 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
              No pending join requests for this group.
            </div>
          ) : (
            <div className="space-y-3">
              {joinRequests.map((req) => (
                <JoinRequestCard
                  key={req.id}
                  request={req}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. SETTINGS TAB */}
      {activeTab === 'settings' && isOwner && (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Group Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage destructive actions and ownership permissions</p>
          </div>

          <div className="p-6 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">Delete Group</h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                Permanently delete this group, its albums, and associated cloud references. This action is irreversible.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setDeleteGroupOpen(true)}
            >
              Delete Group
            </Button>
          </div>
        </div>
      )}

      {/* Full-screen Photo Viewer */}
      <PhotoViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        photos={activeTab === 'photos' ? filteredPhotos : groupMedia}
        currentIndex={viewerIndex}
        onNavigate={setViewerIndex}
        onDownload={handleDownloadPhoto}
        onDelete={(photo) => setPhotoToDelete(photo)}
        onEdit={(photo) => setPhotoToEdit(photo)}
        canDelete={isGroupAdmin}
      />

      {/* Edit Media Modal */}
      {photoToEdit && (
        <EditMediaModal
          isOpen={!!photoToEdit}
          onClose={() => setPhotoToEdit(null)}
          photo={photoToEdit}
          folders={allGroupFolders}
          onSuccess={() => {
            setPhotoToEdit(null);
            loadGroupDetails();
          }}
        />
      )}

      {/* Page-level Drag and Drop Overlay */}
      <DragDropZoneOverlay
        onFilesDropped={handlePageDrop}
        title={`Drop media into ${group?.name || 'this group'}`}
        subtitle="Release to upload photos and videos to this album"
      />

      {/* Upload Photo Modal */}
      <UploadPhotoModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setDroppedFiles([]);
        }}
        folderId={targetUploadFolderId}
        folders={allGroupFolders}
        initialFiles={droppedFiles}
        onSuccess={() => {
          setDroppedFiles([]);
          loadGroupDetails();
        }}
      />

      {/* Create Album Modal */}
      <CreateFolderModal
        isOpen={createAlbumModalOpen}
        onClose={() => setCreateAlbumModalOpen(false)}
        groupId={groupId}
        onSuccess={() => loadGroupDetails()}
      />

      {/* Confirm Delete Group */}
      <ConfirmDialog
        isOpen={deleteGroupOpen}
        onClose={() => setDeleteGroupOpen(false)}
        onConfirm={handleDeleteGroup}
        loading={deleteActionLoading}
        title="Delete Group"
        message="Are you sure you want to delete this group? All shared albums and conversations will be removed."
        confirmText="Delete Permanently"
        isDanger={true}
      />

      {/* Confirm Delete Album */}
      <ConfirmDialog
        isOpen={!!albumToDelete}
        onClose={() => setAlbumToDelete(null)}
        onConfirm={handleDeleteAlbum}
        loading={deleteActionLoading}
        title="Delete Album"
        message={`Are you sure you want to delete "${albumToDelete?.name}"? Any photos inside will also be deleted.`}
        confirmText="Delete Album"
        isDanger={true}
      />

      {/* Confirm Delete Photo */}
      <ConfirmDialog
        isOpen={!!photoToDelete}
        onClose={() => setPhotoToDelete(null)}
        onConfirm={handleDeletePhoto}
        loading={deleteActionLoading}
        title="Delete Photo"
        message="Are you sure you want to delete this photo from the group and Google Drive?"
        confirmText="Delete Photo"
        isDanger={true}
      />
    </div>
  );
}
