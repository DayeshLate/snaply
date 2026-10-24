import React from 'react';
import { FolderLock, Plus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FolderCard3D from '../3d/FolderCard3D';

export default function CuratedAlbumsSection({
  albums = [],
  onCreateAlbum,
}) {
  const navigate = useNavigate();

  const handleOpenAlbum = (album) => {
    const targetGroupId = album.groupId || album.group?.id;
    if (targetGroupId) {
      navigate(`/groups/${targetGroupId}?tab=albums&folderId=${album.id}`);
    } else {
      navigate('/albums');
    }
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/50">
            Vaults
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="text-xs font-mono text-white/40 num-tabular">
            ({albums.length} albums)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/albums"
            className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid of 3D Folder Cards */}
      {albums.length === 0 ? (
        <div className="p-10 rounded-2xl border border-white/[0.08] bg-[#12141C] text-center space-y-3">
          <FolderLock className="w-8 h-8 text-white/30 mx-auto" />
          <p className="text-sm font-medium text-white/70">No albums created yet</p>
          <button
            onClick={onCreateAlbum}
            className="px-4 py-2 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white text-xs font-medium cursor-pointer"
          >
            Create first album
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.slice(0, 6).map((album) => (
            <FolderCard3D
              key={album.id}
              album={album}
              onClick={handleOpenAlbum}
            />
          ))}
        </div>
      )}
    </section>
  );
}

