import React from 'react';
import FolderCard3D from '../3d/FolderCard3D';

export default function AlbumGrid({
  albums = [],
  onSelectAlbum,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => (
        <FolderCard3D
          key={album.id}
          album={album}
          onClick={() => onSelectAlbum && onSelectAlbum(album)}
        />
      ))}
    </div>
  );
}
