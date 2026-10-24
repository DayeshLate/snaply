import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
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
import AddMemberModal from '../components/groups/AddMemberModal';
import JoinRequestCard from '../components/groups/JoinRequestCard';
import AlbumGrid from '../components/albums/AlbumGrid';
import PhotoGrid from '../components/albums/PhotoGrid';
import PhotoViewer from '../components/albums/PhotoViewer';
import UploadPhotoModal from '../components/albums/UploadPhotoModal';
import CreateFolderModal from '../components/albums/CreateFolderModal';
import EditMediaModal from '../components/albums/EditMediaModal';
import DragDropZoneOverlay from '../components/common/DragDropZoneOverlay';
import InviteModal from '../components/groups/InviteModal';

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
  const { onToggleChat, isChatOpen } = useOutletContext() || {};

  const [group, setGroup] = useState(null);
  const [groupMedia, setGroupMedia] = useState([]);
  const [messages, setMessages] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [copied, setCopied] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [createAlbumModalOpen, setCreateAlbumModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
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

  const handleRegenerateInvite = async () => {
    try {
      const newCode = `SNP-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setGroup((prev) => (prev ? { ...prev, inviteCode: newCode } : prev));
      success('New invite code generated');
    } catch {
      showError('Failed to regenerate invite code');
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

  // Active tab fallback: non-owners cannot be on settings
  const currentTab = (activeTab === 'settings' && !isOwner) ? 'albums' : activeTab;

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-[#12141C] rounded-2xl border border-white/[0.08] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.02em] leading-tight">
                {group.name}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-[8px] text-[11px] font-medium tracking-wide ${
                  isOwner
                    ? 'bg-[#5B5BF0]/15 text-[#A5A6F6] border border-[#5B5BF0]/30'
                    : 'bg-white/[0.06] text-white/70 border border-white/[0.08]'
                }`}
              >
                {isOwner ? 'Circle Owner' : isGroupAdmin ? 'Admin' : 'Member'}
              </span>
            </div>

            <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
              {group.description || 'Private collaborative memory vault.'}
            </p>

            {/* Stacked Member Avatars & Metadata */}
            <div className="flex items-center gap-4 pt-1 flex-wrap">
              <div className="flex items-center -space-x-2 overflow-hidden">
                {(group.groupMembers || []).slice(0, 5).map((m, idx) => {
                  const initial = (m.user?.fullName?.[0] || m.user?.name?.[0] || m.userName?.[0] || m.user?.email?.[0] || 'U').toUpperCase();
                  return (
                    <div
                      key={m.id || idx}
                      title={m.user?.fullName || m.userName || m.user?.email || 'Member'}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-[#12141C] bg-[#1E212E] text-white/80 text-[11px] font-medium select-none"
                    >
                      {initial}
                    </div>
                  );
                })}
                {(group.groupMembers?.length || 0) > 5 && (
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-[#12141C] bg-[#1A1D28] text-[10px] font-medium text-white/60 num-tabular">
                    +{group.groupMembers.length - 5}
                  </span>
                )}
              </div>

              <span className="text-xs text-white/50 font-medium num-tabular">
                {group.groupMembers?.length || 1} members
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-white/40 font-medium">
                Created {formatDate(group.createdAt)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setInviteModalOpen(true)}
              className="px-4 py-2 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite</span>
            </button>

            {isGroupAdmin && (
              <button
                onClick={() => setAddMemberModalOpen(true)}
                className="px-3.5 py-2 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 hover:text-white text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
              >
                <span>Add Member</span>
              </button>
            )}

            {canUpload && (
              <button
                onClick={() => handleOpenUpload(selectedFolderForUpload)}
                className="px-3.5 py-2 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 hover:text-white text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Media</span>
              </button>
            )}

            {onToggleChat && (
              <button
                onClick={() => onToggleChat(groupId)}
                className={`px-3.5 py-2 rounded-[10px] border text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BF0] ${
                  isChatOpen
                    ? 'bg-[#5B5BF0]/15 border-[#5B5BF0]/30 text-[#A5A6F6]'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-white/80 hover:text-white'
                }`}
                title={isChatOpen ? 'Close circle chat sidebar' : 'Open circle chat sidebar'}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isChatOpen ? 'Close Chat' : 'Circle Chat'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation: Albums | Members | Settings (Owner only) */}
        <div className="flex items-center gap-2 border-t border-white/[0.08] mt-6 pt-5 overflow-x-auto">
          {[
            { id: 'albums', label: 'Albums', icon: FolderLock, count: group.folderDTOs?.length },
            { id: 'members', label: 'Members', icon: Users, count: group.groupMembers?.length },
            ...(isOwner ? [{ id: 'settings', label: 'Settings', icon: Settings }] : []),
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id || (tab.id === 'albums' && currentTab === 'photos');
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'albums') {
                    setSelectedFolderForUpload(null);
                  }
                  setSearchParams({ tab: tab.id });
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BF0] ${
                  isActive
                    ? 'bg-[#5B5BF0] text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.5 rounded-[6px] text-[10px] font-medium num-tabular ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-white/60'
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
      {(currentTab === 'albums' || currentTab === 'photos') && (
        <div className="space-y-6">
          {/* If viewing a specific album or all photos */}
          {selectedFolder ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedFolderForUpload(null);
                      setSearchParams({ tab: 'albums' });
                    }}
                    className="px-3 py-1.5 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    ← All Albums
                  </button>
                  <div>
                    <h3 className="text-base font-semibold text-white tracking-[-0.02em]">
                      {selectedFolder.name}
                    </h3>
                    <p className="text-xs text-white/50 num-tabular">
                      {filteredPhotos.length} item{filteredPhotos.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {canUpload && (
                    <button
                      onClick={() => handleOpenUpload(selectedFolder.id)}
                      className="px-3.5 py-2 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload to Album</span>
                    </button>
                  )}
                </div>
              </div>

              {filteredPhotos.length === 0 ? (
                <div className="p-16 bg-[#12141C] border border-dashed border-white/[0.08] rounded-2xl text-center space-y-3">
                  <ImageIcon className="w-10 h-10 text-white/20 mx-auto" />
                  <p className="text-sm font-medium text-white/60">No photos in this album yet</p>
                  <p className="text-xs text-white/40">Upload the first photo to begin sharing.</p>
                  {canUpload && (
                    <button
                      onClick={() => handleOpenUpload(selectedFolder.id)}
                      className="px-4 py-2 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white text-xs font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Media</span>
                    </button>
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
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-[-0.02em]">Albums & Vaults</h3>
                  <p className="text-xs text-white/50 mt-0.5">Organize circle memories into curated albums</p>
                </div>
                <div className="flex items-center gap-2.5">
                  {canUpload && (
                    <button
                      onClick={() => handleOpenUpload()}
                      className="px-3.5 py-2 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 hover:text-white text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                  )}
                  {canUpload && (
                    <button
                      onClick={() => setCreateAlbumModalOpen(true)}
                      className="px-3.5 py-2 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Album</span>
                    </button>
                  )}
                </div>
              </div>

              {allGroupFolders.length === 0 ? (
                <div className="p-12 bg-[#12141C] border border-dashed border-white/[0.08] rounded-2xl text-center space-y-3">
                  <p className="text-sm font-medium text-white/60">No custom albums in this circle yet.</p>
                  {canUpload && (
                    <button
                      onClick={() => setCreateAlbumModalOpen(true)}
                      className="px-4 py-2 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white text-xs font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create First Album</span>
                    </button>
                  )}
                </div>
              ) : (
                <AlbumGrid
                  albums={allGroupFolders}
                  onSelectAlbum={(album) => {
                    setSelectedFolderForUpload(album.id);
                    setSearchParams({ tab: 'albums', folderId: album.id });
                  }}
                  onDeleteAlbum={(album) => setAlbumToDelete(album)}
                  canDelete={isGroupAdmin}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. MEMBERS TAB */}
      {currentTab === 'members' && (
        <div className="space-y-6">
          {/* Pending Join Requests (Owner / Admin only) */}
          {isGroupAdmin && joinRequests.length > 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-[-0.02em]">
                    Pending Join Requests
                  </h4>
                  <p className="text-xs text-white/50 mt-0.5">
                    Review and approve users requesting to join this circle
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-[6px] text-xs font-mono bg-[#5B5BF0]/20 text-[#A5A6F6] border border-[#5B5BF0]/30 num-tabular">
                  {joinRequests.length} pending
                </span>
              </div>

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
            </div>
          )}

          <MemberList
            groupId={groupId}
            members={group.groupMembers || []}
            currentUserRole={isOwner ? ROLES.OWNER : currentMember?.role}
            currentUserId={user?.id}
            onMembersChanged={() => loadGroupDetails()}
          />
        </div>
      )}

      {/* 3. SETTINGS TAB (Owner Only) */}
      {currentTab === 'settings' && isOwner && (
        <div className="bg-[#12141C] p-6 sm:p-8 rounded-2xl border border-white/[0.08] space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white tracking-[-0.02em]">Circle Settings</h3>
            <p className="text-xs text-white/50 mt-0.5">Manage destructive actions and circle configuration</p>
          </div>

          <div className="p-5 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-rose-400">Delete Circle</h4>
              <p className="text-xs text-white/50 mt-1 max-w-xl leading-relaxed">
                Permanently delete this circle, its albums, and associated cloud references. This action is irreversible.
              </p>
            </div>
            <button
              onClick={() => setDeleteGroupOpen(true)}
              className="px-3.5 py-2 rounded-[10px] bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Circle</span>
            </button>
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

      {/* Invite Modal */}
      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        group={group}
        onRegenerateCode={handleRegenerateInvite}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        groupId={groupId}
        isOwner={isOwner}
        onMemberAdded={() => loadGroupDetails()}
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
