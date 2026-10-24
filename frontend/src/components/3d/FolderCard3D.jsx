import React, { useState, useRef } from 'react';
import { FolderLock, Image as ImageIcon, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function FolderCard3D({
  album,
  onClick,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 }); // max 8 deg
  const [isHovered, setIsHovered] = useState(false);

  const realPhotos = (album.media || [])
    .map((m) => m.fileUrl || m.url || (typeof m === 'string' ? m : ''))
    .filter(Boolean)
    .slice(0, 3);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    // max 8 degrees toward the pointer
    setTilt({
      x: -ny * 16, // max 8 deg
      y: nx * 16,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick && onClick(album)}
      className="relative w-full h-[320px] rounded-2xl cursor-pointer select-none group"
      style={{
        perspective: '900px',
      }}
    >
      {/* 3D Tilting Card Root */}
      <div
        className="w-full h-full rounded-2xl border border-white/[0.08] bg-[#12141C] p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 shadow-lg group-hover:border-white/[0.16]"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Top Header: Folder Tab Indicator & Photo Count */}
        <div className="flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/80">
              <FolderLock className="w-4 h-4 text-white/90" />
            </span>
            <span className="text-xs font-mono text-white/50 truncate max-w-[120px]">
              {album.group?.name || 'Group Vault'}
            </span>
          </div>
          <span className="text-xs font-mono num-tabular px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-white/50" />
            <span>{album.mediaCount ?? (album.media?.length || 0)}</span>
          </span>
        </div>

        {/* Center: 3D Folder Body with Rotating Lid & 3 Rising Thumbnails */}
        <div className="relative my-auto h-[140px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {/* Back Folder Wall */}
          <div className="absolute inset-x-4 inset-y-1 rounded-xl bg-[#1A1D28] border border-white/[0.06] shadow-inner" />

          {/* Thumbnails revealed inside folder */}
          {realPhotos.length > 0 ? (
            <div className="relative z-10 flex items-center justify-center -space-x-7 pt-2">
              {realPhotos.map((url, i) => (
                <div
                  key={i}
                  className="w-20 sm:w-24 aspect-[4/3] rounded-lg overflow-hidden border border-white/[0.14] shadow-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    transform: isHovered
                      ? `translateY(-22px) rotate(${i === 0 ? -12 : i === 2 ? 12 : 0}deg) scale(1.08)`
                      : `translateY(4px) rotate(${i === 0 ? -4 : i === 2 ? 4 : 0}deg)`,
                    zIndex: i === 1 ? 15 : 10,
                  }}
                >
                  <img src={url} alt={album.name || 'preview'} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-center pt-2">
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/30 mb-1">
                <ImageIcon className="w-5 h-5 text-white/40" />
              </div>
              <span className="text-[11px] font-mono text-white/40">No photos in vault</span>
            </div>
          )}

          {/* Front Folder Lid that Rotates Open on Hover */}
          <div
            className="absolute inset-x-2 bottom-0 h-[80px] rounded-b-xl border-t border-white/[0.1] bg-[#1E2230] shadow-md z-20 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom flex items-center px-4"
            style={{
              transform: isHovered ? 'rotateX(-45deg) translateY(4px)' : 'rotateX(0deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-full h-1 bg-white/[0.06] rounded-full" />
          </div>
        </div>

        {/* Bottom Details */}
        <div className="z-20 pt-2 border-t border-white/[0.06] space-y-1">
          <h3 className="text-base font-semibold text-white tracking-[-0.02em] leading-tight truncate">
            {album.name}
          </h3>
          <div className="flex items-center justify-between text-xs text-white/50">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Calendar className="w-3 h-3 text-white/40" />
              <span>{formatDate(album.createdAt || new Date())}</span>
            </span>
            <span className="text-[11px] font-medium text-white/60 group-hover:text-[#5B5BF0] transition-colors">
              Open vault →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

