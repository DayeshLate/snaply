import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../services/groupService';
import { folderService } from '../services/folderService';
import { mediaService } from '../services/mediaService';
import { messageService } from '../services/messageService';
import { driveService } from '../services/driveService';
import { isDemoMode, mockStore } from '../mock/mockStore';

import AnimatedBackground from '../components/dashboard/AnimatedBackground';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import StatsOverview from '../components/dashboard/StatsOverview';
import FeaturedAlbums from '../components/dashboard/FeaturedAlbums';
import RecentActivity from '../components/dashboard/RecentActivity';
import GroupWorkspace from '../components/dashboard/GroupWorkspace';
import PhotoSearch from '../components/dashboard/PhotoSearch';

import PhotoViewer from '../components/albums/PhotoViewer';
import CreateFolderModal from '../components/albums/CreateFolderModal';
import GroupFormModal from '../components/groups/GroupFormModal';
import UploadPhotoModal from '../components/albums/UploadPhotoModal';
import ErrorState from '../components/common/ErrorState';

export default function DashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const outletContext = useOutletContext();

  const [groups, setGroups] = useState([]);
  const [folders, setFolders] = useState([]);
  const [allMedia, setAllMedia] = useState([]);
  const [messages, setMessages] = useState([]);
  const [driveStatus, setDriveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [createAlbumModalOpen, setCreateAlbumModalOpen] = useState(false);
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Photo viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPhotos, setViewerPhotos] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  const searchSectionRef = useRef(null);
  const albumsSectionRef = useRef(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isDemoMode()) {
        const demoGroups = mockStore.getAllGroups();
        const demoFolders = mockStore.getAllFolders();
        const demoMedia = mockStore.data.media || [];
        const demoMessages = mockStore.data.messages || [];

        setGroups(demoGroups);
        setFolders(demoFolders);
        setAllMedia(demoMedia);
        setMessages(demoMessages);
        setDriveStatus({ connected: true });
        setLoading(false);
        return;
      }

      // Real backend data loading
      const [groupsRes, foldersRes, driveRes] = await Promise.allSettled([
        groupService.getAllGroups(),
        folderService.getAllFolders(),
        driveService.getStatus(),
      ]);

      const loadedGroups = groupsRes.status === 'fulfilled' ? (groupsRes.value || []) : [];
      const loadedFolders = foldersRes.status === 'fulfilled' ? (foldersRes.value || []) : [];
      const loadedDrive = driveRes.status === 'fulfilled' ? driveRes.value : { connected: false };

      setGroups(loadedGroups);
      setFolders(loadedFolders);
      setDriveStatus(loadedDrive);

      // Collect media across groups and folders with O(1) Set deduplication
      const mediaList = [];
      const seenMediaIds = new Set();

      // Extract media attached to folders/DTOs
      loadedFolders.forEach((f) => {
        if (f.media && Array.isArray(f.media)) {
          f.media.forEach((m) => {
            const mId = m.id || m.fileName;
            if (!seenMediaIds.has(mId)) {
              seenMediaIds.add(mId);
              mediaList.push({
                ...m,
                folderId: f.id,
                folderName: f.name,
                groupId: f.groupId || f.group?.id,
              });
            }
          });
        }
      });

      // Extract media from group DTOs
      loadedGroups.forEach((g) => {
        if (g.folderDTOs && Array.isArray(g.folderDTOs)) {
          g.folderDTOs.forEach((f) => {
            if (f.media && Array.isArray(f.media)) {
              f.media.forEach((m) => {
                const mId = m.id || m.fileName;
                if (!seenMediaIds.has(mId)) {
                  seenMediaIds.add(mId);
                  mediaList.push({
                    ...m,
                    folderId: f.id,
                    folderName: f.name,
                    groupId: g.id,
                    groupName: g.name,
                  });
                }
              });
            }
          });
        }
      });

      // Fetch messages from first group if available
      if (loadedGroups.length > 0) {
        try {
          const msgs = await messageService.getGroupMessages(loadedGroups[0].id);
          setMessages(msgs || []);
        } catch {
          // ignore
        }
      }

      setAllMedia(mediaList);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle URL tab or anchor navigation (e.g. ?tab=search)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'search' && searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.search]);

  const handleOpenPhotoViewer = (photo, index, photoList = allMedia) => {
    setViewerPhotos(photoList);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleExploreMemories = () => {
    if (albumsSectionRef.current) {
      albumsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/albums');
    }
  };

  const handleOpenCreateAlbum = () => {
    if (groups.length === 0) {
      setCreateGroupModalOpen(true);
    } else {
      setCreateAlbumModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 relative">
      {/* Technathon-inspired Atmospheric Background */}
      <AnimatedBackground />

      {/* Error state alert if any */}
      {error && <ErrorState message={error} onRetry={loadDashboardData} />}

      {/* Hero Showcase Section */}
      <WelcomeHero
        user={user}
        onCreateAlbum={handleOpenCreateAlbum}
        onExploreMemories={handleExploreMemories}
        samplePhotos={allMedia}
        driveConnected={Boolean(driveStatus?.connected)}
      />

      {/* Expressive Metric Statistics Section */}
      <StatsOverview
        albumCount={folders.length}
        mediaCount={allMedia.length}
        groupCount={groups.length}
        driveStatus={driveStatus}
        loading={loading}
      />

      {/* Featured Albums Section */}
      <div ref={albumsSectionRef}>
        <FeaturedAlbums
          albums={folders}
          onCreateAlbum={handleOpenCreateAlbum}
          loading={loading}
        />
      </div>

      {/* AI Semantic Photo Search Section */}
      <div ref={searchSectionRef}>
        <PhotoSearch
          allMedia={allMedia}
          groups={groups}
          onSelectPhoto={(photo, idx) => handleOpenPhotoViewer(photo, idx, allMedia)}
        />
      </div>

      {/* Recent Activity Section (Reel + Technical Stream) */}
      <RecentActivity
        recentMedia={allMedia}
        groups={groups}
        messages={messages}
        onSelectPhoto={(photo, idx) => handleOpenPhotoViewer(photo, idx, allMedia)}
        driveStatus={driveStatus}
      />

      {/* Collaborative Group Workspaces Section */}
      <GroupWorkspace
        groups={groups}
        onCreateGroup={() => setCreateGroupModalOpen(true)}
        currentUserId={user?.id}
      />

      {/* Interactive Photo Lightbox / Viewer */}
      <PhotoViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        photos={viewerPhotos}
        currentIndex={viewerIndex}
        onNavigate={setViewerIndex}
        onDownload={(photo) => {
          if (photo.id) {
            window.open(mediaService.getDownloadUrl(photo.id), '_blank');
          } else if (photo.fileUrl) {
            window.open(photo.fileUrl, '_blank');
          }
        }}
      />

      {/* Create Album Modal */}
      <CreateFolderModal
        isOpen={createAlbumModalOpen}
        onClose={() => setCreateAlbumModalOpen(false)}
        groupId={groups[0]?.id}
        onSuccess={() => {
          setCreateAlbumModalOpen(false);
          loadDashboardData();
          if (outletContext?.refreshLayoutData) outletContext.refreshLayoutData();
        }}
      />

      {/* Create Group Modal */}
      <GroupFormModal
        isOpen={createGroupModalOpen}
        onClose={() => setCreateGroupModalOpen(false)}
        onSuccess={() => {
          setCreateGroupModalOpen(false);
          loadDashboardData();
          if (outletContext?.refreshLayoutData) outletContext.refreshLayoutData();
        }}
      />

      {/* Upload Media Modal */}
      <UploadPhotoModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        folderId={folders[0]?.id}
        folders={folders}
        onSuccess={() => {
          setUploadModalOpen(false);
          loadDashboardData();
          if (outletContext?.refreshLayoutData) outletContext.refreshLayoutData();
        }}
      />
    </div>
  );
}
