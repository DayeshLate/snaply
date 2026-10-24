import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Users, FolderLock, ArrowRight, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../../utils/formatters';

export default function GroupCarousel3D({
  groups = [],
  onCreateGroup,
  onOpenChat,
}) {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    setScrollLeft(carouselRef.current.scrollLeft);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollByAmount = (direction) => {
    if (!carouselRef.current) return;
    const amount = direction * 320;
    carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative space-y-4">
      {/* Header and Scroll Arrows */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/50">
            Circles
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="text-xs font-mono text-white/40 num-tabular">
            ({groups.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scrollByAmount(-1)}
            aria-label="Previous groups"
            className="w-8 h-8 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollByAmount(1)}
            aria-label="Next groups"
            className="w-8 h-8 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Curved Horizontal Snap Container */}
      <div
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory py-6 px-1 no-scrollbar select-none"
        style={{
          perspective: '1200px',
          scrollBehavior: 'smooth',
        }}
      >
        {groups.map((group, idx) => {
          // Compute distance to center from current scrollLeft
          const containerWidth = carouselRef.current ? carouselRef.current.offsetWidth : 800;
          const cardCenter = (idx * 300) + 140;
          const viewportCenter = scrollLeft + containerWidth / 2;
          const distFromCenter = cardCenter - viewportCenter;
          const normalizedDist = Math.max(Math.min(distFromCenter / (containerWidth / 2), 1.5), -1.5);

          // RotateY and TranslateZ derived from distance to center
          const rotateY = -normalizedDist * 18; // degrees
          const translateZ = -Math.abs(normalizedDist) * 70; // px
          const memberCount = group.groupMembers?.length || 1;
          const albumCount = group.folderDTOs?.length || group.folders?.length || 0;

          return (
            <div
              key={group.id || idx}
              onClick={() => navigate(`/groups/${group.id}`)}
              className="snap-center shrink-0 w-[280px] sm:w-[300px] h-[340px] rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 flex flex-col justify-between cursor-pointer group hover:border-white/[0.2] transition-all shadow-xl"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                transition: 'transform 0.15s ease-out',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-[10px] bg-[#1A1D28] border border-white/[0.1] text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                    {getInitials(group.name)}
                  </div>
                  <div className="flex items-center gap-2">
                    {onOpenChat && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenChat(group.id);
                        }}
                        className="p-1.5 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors cursor-pointer"
                        title={`Open ${group.name} chat`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span className="font-mono text-[11px] text-white/40">
                      #{group.id}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white tracking-[-0.02em] group-hover:text-white transition-colors truncate">
                  {group.name}
                </h3>
                <p className="text-xs text-white/50 line-clamp-2 mt-1.5 leading-relaxed">
                  {group.description || 'Private collaborative photo circle.'}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 text-xs font-mono num-tabular text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-white/40" />
                    <span>{memberCount} members</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <FolderLock className="w-3.5 h-3.5 text-white/40" />
                    <span>{albumCount} vaults</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                  <span>Enter circle</span>
                  <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Create Group Card at End of Carousel */}
        <div
          onClick={onCreateGroup}
          className="snap-center shrink-0 w-[240px] h-[340px] rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.04] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
        >
          <div className="w-11 h-11 rounded-[10px] bg-white/[0.04] border border-white/[0.08] text-white/70 group-hover:text-white flex items-center justify-center mb-3">
            <span className="text-xl leading-none">+</span>
          </div>
          <h4 className="text-sm font-semibold text-white">Create new circle</h4>
          <p className="text-xs text-white/40 mt-1 max-w-[160px] leading-relaxed">
            Start a private group for friends or family
          </p>
        </div>
      </div>
    </div>
  );
}

