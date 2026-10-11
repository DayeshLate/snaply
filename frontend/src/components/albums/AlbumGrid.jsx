import React from 'react';
import AlbumCard from './AlbumCard';

export default function AlbumGrid({ albums = [], onSelectAlbum, onDeleteAlbum, canDelete = false }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          onClick={() => onSelectAlbum(album)}
          onDelete={onDeleteAlbum}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}
