import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../services/groupService';
import { folderService } from '../services/folderService';
import { mediaService } from '../services/mediaService';
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
      // 1. Fetch groups and folders in parallel
      const [groupsRes, foldersRes] = await Promise.allSettled([
        groupService.getAllGroups(),
        folderService.getAllFolders(),
      ]);

      const loadedGroups = groupsRes.status === 'fulfilled' ? (groupsRes.value || []) : [];
      const loadedFolders = foldersRes.status === 'fulfilled' ? (foldersRes.value || []) : [];

      setGroups(loadedGroups);

      // Group lookup map for fast details association
      const groupMap = new Map(loadedGroups.map((g) => [String(g.id), g]));

      // 2. Fetch media from all groups and user's media
      const groupMediaPromises = loadedGroups.map((g) =>
        mediaService.getAllMediaByGroup(g.id).catch(() => [])
      );
      const userMediaPromise = mediaService.getMyMediaPaginated({ size: 100 }).catch(() => null);

      // 3. Fetch join requests: query all loaded groups for incoming requests
      const groupReqPromises = loadedGroups.map((g) =>
        joinRequestService.getRequestsByGroup(g.id).catch(() => [])
      );
      const myReqsPromise = joinRequestService.getMyRequests().catch(() => []);

      const [groupMediaResults, userMediaRes, groupReqResults, myReqs] = await Promise.all([
        Promise.all(groupMediaPromises),
        userMediaPromise,
        Promise.all(groupReqPromises),
        myReqsPromise,
      ]);

      // Collect and deduplicate all media
      const mediaList = [];
      const seenMediaIds = new Set();

      const addMediaItem = (m, extra = {}) => {
        if (!m) return;
        const mId = m.id || m.fileName;
        if (!seenMediaIds.has(mId)) {
          seenMediaIds.add(mId);
          mediaList.push({
            ...m,
            ...extra,
          });
        }
      };

      // Add media fetched directly by group
      groupMediaResults.forEach((grpMedia, idx) => {
        const grp = loadedGroups[idx];
        if (Array.isArray(grpMedia)) {
          grpMedia.forEach((m) => {
            addMediaItem(m, {
              groupId: grp?.id,
              groupName: grp?.name,
            });
          });
        }
      });

      // Add media from user's uploaded assets
      if (userMediaRes?.content && Array.isArray(userMediaRes.content)) {
        userMediaRes.content.forEach((m) => addMediaItem(m));
      }

      // Also incorporate any media present in loaded folders/groups
      loadedFolders.forEach((f) => {
        if (f.media && Array.isArray(f.media)) {
          f.media.forEach((m) =>
            addMediaItem(m, {
              folderId: f.id,
              folderName: f.name,
              groupId: f.groupId || f.group?.id,
            })
          );
        }
      });

      loadedGroups.forEach((g) => {
        if (g.folderDTOs && Array.isArray(g.folderDTOs)) {
          g.folderDTOs.forEach((f) => {
            if (f.media && Array.isArray(f.media)) {
              f.media.forEach((m) =>
                addMediaItem(m, {
                  folderId: f.id,
                  folderName: f.name,
                  groupId: g.id,
                  groupName: g.name,
                })
              );
            }
          });
        }
      });

      setAllMedia(mediaList);

      // Enrich folder objects with actual media and accurate mediaCount
      const enrichedFolders = loadedFolders.map((f) => {
        const folderMedia = mediaList.filter(
          (m) => String(m.folderId || m.folder?.id) === String(f.id)
        );
        return {
          ...f,
          media: folderMedia.length > 0 ? folderMedia : (f.media || []),
          mediaCount: folderMedia.length > 0 ? folderMedia.length : (f.mediaCount || f.media?.length || 0),
        };
      });
      setFolders(enrichedFolders);

      // Collect and deduplicate join requests, enriching with group names
      const allRequests = [];
      const seenReqIds = new Set();

      const addRequestItem = (r) => {
        if (!r || seenReqIds.has(r.id)) return;
        seenReqIds.add(r.id);
        const associatedGroup = groupMap.get(String(r.groupId));
        allRequests.push({
          ...r,
          groupName: r.groupName || associatedGroup?.name || 'Private Circle',
        });
      };

      groupReqResults.flat().forEach(addRequestItem);
      (myReqs || []).forEach(addRequestItem);

      // Filter for pending review requests
      const pendingRequests = allRequests.filter(
        (r) => !r.status || r.status === 'PENDING'
      );
      setJoinRequests(pendingRequests);

      // 4. Messages for recent activity preview
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
    (g) =>
      user?.role === 'ADMIN' ||
      (g.ownerId && String(g.ownerId) === String(user?.id)) ||
      (g.user?.id && String(g.user.id) === String(user?.id)) ||
      (g.ownerEmail && user?.email && g.ownerEmail.toLowerCase() === user.email.toLowerCase()) ||
      g.groupMembers?.some(
        (m) =>
          (String(m.userId || m.user?.id) === String(user?.id) ||
            (m.userEmail && user?.email && m.userEmail.toLowerCase() === user.email.toLowerCase())) &&
          (m.role === 'OWNER' || m.role === 'ADMIN')
      )
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
        onCreateGroup={() => outletContext?.onCreateGroup()}
        onJoinWithCode={() => outletContext?.onJoinWithCode()}
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
      {(isOwnerOfAnyGroup || joinRequests.length > 0) && joinRequests.length > 0 && (
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
