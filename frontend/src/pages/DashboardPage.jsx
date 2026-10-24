import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../services/groupService';
import { folderService } from '../services/folderService';
import { joinRequestService } from '../services/joinRequestService';
import { messageService } from '../services/messageService';

import HomeHeroSection from '../components/dashboard/HomeHeroSection';
import GroupCarousel3D from '../components/3d/GroupCarousel3D';
import JoinRequestsSection from '../components/dashboard/JoinRequestsSection';
import CuratedAlbumsSection from '../components/dashboard/CuratedAlbumsSection';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';

import PhotoViewer from '../components/albums/PhotoViewer';
import ErrorState from '../components/common/ErrorState';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const scrollerRef = outletContext?.scrollerRef;

  const [groups, setGroups] = useState([]);
  const [folders, setFolders] = useState([]);
  const [allMedia, setAllMedia] = useState([]);
  const [messages, setMessages] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Photo viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPhotos, setViewerPhotos] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Live backend requests
      const [groupsRes, foldersRes, requestsRes] = await Promise.allSettled([
        groupService.getAllGroups(),
        folderService.getAllFolders(),
        joinRequestService.getMyRequests(),
      ]);

      const loadedGroups = groupsRes.status === 'fulfilled' ? (groupsRes.value || []) : [];
      const loadedFolders = foldersRes.status === 'fulfilled' ? (foldersRes.value || []) : [];
      const loadedReqs = requestsRes.status === 'fulfilled' ? (requestsRes.value || []) : [];

      setGroups(loadedGroups);
      setFolders(loadedFolders);
      setJoinRequests(loadedReqs);

      // Collect media deduplicated
      const mediaList = [];
      const seenMediaIds = new Set();

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

      setAllMedia(mediaList);

      if (loadedGroups.length > 0) {
        try {
          const msgs = await messageService.getGroupMessages(loadedGroups[0].id);
          setMessages(msgs || []);
        } catch {
          // ignore
        }
      }
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

  const handleOpenPhotoViewer = (photo, index, photoList = allMedia) => {
    setViewerPhotos(photoList);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const isOwnerOfAnyGroup = groups.some(
    (g) => g.ownerId === user?.id || g.user?.id === user?.id || user?.role === 'ADMIN'
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Error state if network fails */}
      {error && <ErrorState message={error} onRetry={loadDashboardData} />}

      {/* SECTION 01 — HOME HERO */}
      <HomeHeroSection
        user={user}
        groupCount={groups.length}
        photoCount={allMedia.length}
        pendingRequestCount={joinRequests.length}
        samplePhotos={allMedia}
        onCreateAlbum={() => outletContext?.onCreateAlbum()}
        scrollerRef={scrollerRef}
      />

      {/* SECTION 02 — YOUR GROUPS (3D SNAP CAROUSEL) */}
      <section className="space-y-3">
        <GroupCarousel3D
          groups={groups}
          onCreateGroup={() => outletContext?.onCreateGroup()}
          onOpenChat={outletContext?.onOpenChat}
        />
      </section>

      {/* SECTION 03 — JOIN REQUESTS (OWNER ONLY WITH OPTIMISTIC ROLLBACK) */}
      {isOwnerOfAnyGroup && (
        <JoinRequestsSection
          requests={joinRequests}
          onRequestHandled={loadDashboardData}
        />
      )}

      {/* CURATED 3D ALBUM FOLDERS */}
      <CuratedAlbumsSection
        albums={folders}
        onCreateAlbum={() => outletContext?.onCreateAlbum()}
      />

      {/* SECTION 04 — ACTIVITY TIMELINE GROUPED BY DAY */}
      <ActivityTimeline
        media={allMedia}
        groups={groups}
        messages={messages}
      />

      {/* Keyboard-navigable Photo Lightbox */}
      <PhotoViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        photos={viewerPhotos}
        currentIndex={viewerIndex}
      />
    </div>
  );
}

