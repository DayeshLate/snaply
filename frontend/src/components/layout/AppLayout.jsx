import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatPanel from '../chat/ChatPanel';
import MobileNavigation from './MobileNavigation';
import CommandPalette from '../dashboard/CommandPalette';
import GroupFormModal from '../groups/GroupFormModal';
import CreateFolderModal from '../albums/CreateFolderModal';
import UploadPhotoModal from '../albums/UploadPhotoModal';
import JoinInvitePage from '../../pages/JoinInvitePage';
import { groupService } from '../../services/groupService';
import { folderService } from '../../services/folderService';

export default function AppLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false); // Off by default as requested
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [customChatGroupId, setCustomChatGroupId] = useState(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [createAlbumModalOpen, setCreateAlbumModalOpen] = useState(false);
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const [groups, setGroups] = useState([]);
  const [folders, setFolders] = useState([]);

  const mainScrollerRef = useRef(null);

  const loadNavData = async () => {
    try {
      const [g, f] = await Promise.allSettled([
        groupService.getAllGroups(),
        folderService.getAllFolders(),
      ]);
      if (g.status === 'fulfilled') setGroups(g.value || []);
      if (f.status === 'fulfilled') setFolders(f.value || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadNavData();

    // Global Command/Ctrl + K shortcut handler
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 403 Forbidden handler
    const handleForbidden = (e) => {
      alert(e.detail?.message || 'Access restricted. Redirecting to groups.');
      window.location.href = '/groups';
    };
    window.addEventListener('snaply:forbidden', handleForbidden);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('snaply:forbidden', handleForbidden);
    };
  }, []);

  // Sticky header hairline triggers when content scrolls beneath it
  const handleMainScroll = (e) => {
    const top = e.currentTarget.scrollTop;
    setHasScrolled(top > 12);
  };

  const handleOpenCreateAlbum = () => {
    if (groups.length === 0) {
      setCreateGroupModalOpen(true);
    } else {
      setCreateAlbumModalOpen(true);
    }
  };

  const handleOpenUploadMedia = () => {
    if (folders.length === 0) {
      handleOpenCreateAlbum();
    } else {
      setUploadModalOpen(true);
    }
  };

  // Derive active group ID from URL if on /groups/:groupId or custom selection
  const groupMatch = location.pathname.match(/\/groups\/([0-9a-zA-Z-]+)/);
  const activeGroupId = customChatGroupId || (groupMatch ? groupMatch[1] : (groups[0]?.id || null));

  // Sync active group whenever URL changes to /groups/:id
  useEffect(() => {
    const match = location.pathname.match(/\/groups\/([0-9a-zA-Z-]+)/);
    if (match) {
      setCustomChatGroupId(match[1]);
    }
  }, [location.pathname]);

  const handleOpenGroupChat = (groupId) => {
    if (groupId) {
      setCustomChatGroupId(groupId);
    }
    if (window.innerWidth >= 1280) {
      setChatOpen(true);
    } else {
      setChatDrawerOpen(true);
    }
  };

  const handleToggleChat = (groupId) => {
    if (groupId && typeof groupId !== 'object') {
      setCustomChatGroupId(groupId);
    }
    if (window.innerWidth >= 1280) {
      setChatOpen((prev) => !prev);
    } else {
      setChatDrawerOpen((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0B0C12] text-[#F8FAFC] overflow-hidden select-none">
      {/* REGION 1: Left Sidebar 264px (Independent Scroll) */}
      <div className="hidden lg:flex shrink-0 w-[264px]">
        <Sidebar
          onCreateGroup={() => setCreateGroupModalOpen(true)}
          onJoinWithCode={() => setJoinModalOpen(true)}
          onOpenChat={handleOpenGroupChat}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onCreateGroup={() => setCreateGroupModalOpen(true)}
        onJoinWithCode={() => setJoinModalOpen(true)}
        onOpenChat={handleOpenGroupChat}
      />

      {/* Center Shell: Top Bar + Independently Scrolling Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Top Bar with sticky hairline */}
        <Header
          hasScrolled={hasScrolled}
          onOpenMobile={() => setMobileMenuOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onCreateAlbum={handleOpenCreateAlbum}
          onCreateGroup={() => setCreateGroupModalOpen(true)}
          onUploadMedia={handleOpenUploadMedia}
          onToggleChat={() => handleToggleChat(activeGroupId)}
          isChatOpen={chatOpen || chatDrawerOpen}
        />

        {/* REGION 2: Main Panel (Independently Scrolling) */}
        <main
          ref={mainScrollerRef}
          onScroll={handleMainScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 relative no-scrollbar"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            <Outlet
              context={{
                scrollerRef: mainScrollerRef,
                onCreateAlbum: handleOpenCreateAlbum,
                onCreateGroup: () => setCreateGroupModalOpen(true),
                onUploadMedia: handleOpenUploadMedia,
                refreshLayoutData: loadNavData,
                onToggleChat: handleToggleChat,
                onOpenChat: handleOpenGroupChat,
                isChatOpen: chatOpen || chatDrawerOpen,
              }}
            />
          </div>
        </main>
      </div>

      {/* REGION 3: Right Chat Panel 340px (Independent Scroll, Collapsible) */}
      {chatOpen && (
        <div className="hidden xl:flex shrink-0 w-[340px] transition-all duration-300">
          <ChatPanel
            isOpen={true}
            onClose={() => setChatOpen(false)}
            activeGroupId={activeGroupId}
          />
        </div>
      )}

      {/* Floating Re-open Chat Button on Desktop when Chat is closed */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="hidden xl:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#12141C] border border-white/[0.12] hover:border-[#5B5BF0] shadow-2xl text-white text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
          title="Open circle chat sidebar"
        >
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
          <span className="text-[#A5A6F6]">Circle Chat</span>
        </button>
      )}

      {/* Right Chat Drawer for screens < 1280px */}
      {chatDrawerOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setChatDrawerOpen(false)}
          />
          <div className="relative z-10 w-[340px] max-w-[90vw] h-full shadow-2xl">
            <ChatPanel
              isOpen={true}
              onClose={() => setChatDrawerOpen(false)}
              activeGroupId={activeGroupId}
            />
          </div>
        </div>
      )}

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onCreateAlbum={handleOpenCreateAlbum}
        onCreateGroup={() => setCreateGroupModalOpen(true)}
        onUploadMedia={handleOpenUploadMedia}
        groups={groups}
        albums={folders}
      />

      {/* Group Create Modal */}
      <GroupFormModal
        isOpen={createGroupModalOpen}
        onClose={() => setCreateGroupModalOpen(false)}
        onSuccess={() => {
          setCreateGroupModalOpen(false);
          loadNavData();
        }}
      />

      {/* Create Folder/Album Modal */}
      <CreateFolderModal
        isOpen={createAlbumModalOpen}
        onClose={() => setCreateAlbumModalOpen(false)}
        groups={groups}
        onSuccess={() => {
          setCreateAlbumModalOpen(false);
          loadNavData();
        }}
      />

      {/* Upload Modal */}
      <UploadPhotoModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        folders={folders}
        onSuccess={() => {
          setUploadModalOpen(false);
          loadNavData();
        }}
      />
    </div>
  );
}
