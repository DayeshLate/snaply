import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavigation from './MobileNavigation';
import CommandPalette from '../dashboard/CommandPalette';
import GroupFormModal from '../groups/GroupFormModal';
import CreateFolderModal from '../albums/CreateFolderModal';
import UploadPhotoModal from '../albums/UploadPhotoModal';
import { isDemoMode, disableDemoMode } from '../../mock/mockStore';
import { groupService } from '../../services/groupService';
import { folderService } from '../../services/folderService';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [createAlbumModalOpen, setCreateAlbumModalOpen] = useState(false);
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [groups, setGroups] = useState([]);
  const [folders, setFolders] = useState([]);

  const isDemo = isDemoMode();
  const navigate = useNavigate();

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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          onCreateAlbum={handleOpenCreateAlbum}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header
          onOpenMobile={() => setMobileMenuOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onCreateAlbum={handleOpenCreateAlbum}
          onCreateGroup={() => setCreateGroupModalOpen(true)}
          onUploadMedia={handleOpenUploadMedia}
        />

        {isDemo && (
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs px-4 py-2 flex items-center justify-between shadow-xs z-10 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] tracking-wide shrink-0">
                PREVIEW MODE
              </span>
              <span className="truncate font-medium">
                Interactive preview active — collaborative photo vaults, AI search, and cloud features are responsive.
              </span>
            </div>
            <button
              onClick={() => {
                disableDemoMode();
                window.location.href = '/login';
              }}
              className="underline font-bold text-blue-100 hover:text-white cursor-pointer ml-3 shrink-0"
            >
              Exit Demo
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet
              context={{
                onCreateAlbum: handleOpenCreateAlbum,
                onCreateGroup: () => setCreateGroupModalOpen(true),
                onUploadMedia: handleOpenUploadMedia,
                refreshLayoutData: loadNavData,
              }}
            />
          </div>
        </main>
      </div>

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

      {/* Global Modals triggered from Header / Command Palette / Sidebar */}
      {createGroupModalOpen && (
        <GroupFormModal
          isOpen={createGroupModalOpen}
          onClose={() => setCreateGroupModalOpen(false)}
          onSuccess={() => {
            setCreateGroupModalOpen(false);
            loadNavData();
          }}
        />
      )}

      {createAlbumModalOpen && (
        <CreateFolderModal
          isOpen={createAlbumModalOpen}
          onClose={() => setCreateAlbumModalOpen(false)}
          groupId={groups[0]?.id}
          onSuccess={() => {
            setCreateAlbumModalOpen(false);
            loadNavData();
          }}
        />
      )}

      {uploadModalOpen && (
        <UploadPhotoModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          folderId={folders[0]?.id}
          folders={folders}
          onSuccess={() => {
            setUploadModalOpen(false);
            loadNavData();
          }}
        />
      )}
    </div>
  );
}
