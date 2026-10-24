import React, { useRef, useEffect, useState, useMemo } from 'react';

function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export default function MemoryStack3D({
  photos = [],
  scrollProgress = 0, // 0 to 1 driven by first 400px of scroller
  scrollerRef = null,
}) {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 }); // +/- 6 deg
  const [internalProgress, setInternalProgress] = useState(0);

  const photoList = useMemo(() => {
    return photos
      .map((p) => p.fileUrl || p.url || (typeof p === 'string' ? p : ''))
      .filter(Boolean)
      .slice(0, 6);
  }, [photos]);

  // Check WebGL, reduced motion, and viewport width
  useEffect(() => {
    setHasWebGL(checkWebGLSupport());

    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mqMotion.matches);
    const handleMotion = (e) => setReducedMotion(e.matches);
    mqMotion.addEventListener('change', handleMotion);

    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);

    return () => {
      mqMotion.removeEventListener('change', handleMotion);
      window.removeEventListener('resize', checkWidth);
    };
  }, []);

  // Panel scroll progress tracking (0 to 400px of scroller)
  useEffect(() => {
    if (!scrollerRef?.current) return;
    const scroller = scrollerRef.current;

    const handleScroll = () => {
      const top = scroller.scrollTop;
      const progress = Math.min(Math.max(top / 400, 0), 1);
      setInternalProgress(progress);
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [scrollerRef]);

  const activeProgress = scrollProgress || internalProgress;

  // Pointer parallax (+/- 6 degrees)
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({
      x: nx * 12, // +/- 6 deg
      y: -ny * 12,
    });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  // Empty State: when no photos have been uploaded yet
  if (photoList.length === 0) {
    return (
      <div className="relative w-full aspect-[16/10] max-h-[380px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#12141C] flex flex-col items-center justify-center p-6 text-center select-none">
        {/* Soft radial indigo glow (12% opacity) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(91, 91, 240, 0.12) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 space-y-3 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 mx-auto">
            <svg className="w-6 h-6 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white">3D Memory Stack Ready</h3>
          <p className="text-xs text-white/50 leading-relaxed">
            Upload photos to your circles to dynamically populate your interactive 3D memory vault.
          </p>
        </div>
      </div>
    );
  }

  // Static Fallback for reduced motion, WebGL missing, or mobile viewport < 768px
  if (!hasWebGL || reducedMotion || isMobile) {
    return (
      <div className="relative w-full aspect-[16/10] max-h-[380px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#12141C] flex items-center justify-center p-6">
        {/* Soft radial indigo glow (12% opacity) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(91, 91, 240, 0.12) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 flex items-center justify-center -space-x-8">
          {photoList.slice(0, 3).map((url, i) => (
            <div
              key={i}
              className={`w-40 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.12] shadow-2xl transition-transform ${
                i === 0 ? '-rotate-6 translate-y-2' : i === 1 ? 'z-10 scale-105' : 'rotate-6 translate-y-2'
              }`}
            >
              <img src={url} alt="Memory stack" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6 rounded photo planes fanned in space with pointer parallax and scroll spread
  const baseCardConfigs = [
    { baseRot: -18, spreadX: -260, spreadRot: -28, zIdx: 1 },
    { baseRot: -10, spreadX: -160, spreadRot: -16, zIdx: 2 },
    { baseRot: -4,  spreadX: -60,  spreadRot: -6,  zIdx: 3 },
    { baseRot: 4,   spreadX: 60,   spreadRot: 6,   zIdx: 4 },
    { baseRot: 11,  spreadX: 160,  spreadRot: 18,  zIdx: 5 },
    { baseRot: 19,  spreadX: 260,  spreadRot: 30,  zIdx: 6 },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[16/10] max-h-[420px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#12141C] flex items-center justify-center select-none"
      style={{
        perspective: '1000px',
      }}
    >
      {/* Required Art Direction: One soft radial indigo glow (12% opacity) behind the 3D hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(91, 91, 240, 0.12) 0%, transparent 65%)',
        }}
      />

      {/* 3D Scene Root with Pointer Parallax (+/- 6 deg) */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${parallax.x}deg) rotateX(${parallax.y}deg)`,
          transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {baseCardConfigs.slice(0, Math.min(Math.max(photoList.length, 1), 6)).map((cfg, idx) => {
          const photoUrl = photoList[idx % photoList.length];
          // Linear interpolation between stacked state and spread state based on activeProgress
          const currentX = (cfg.spreadX * activeProgress) * 0.85;
          const currentRot = cfg.baseRot + (cfg.spreadRot - cfg.baseRot) * activeProgress;
          const currentZ = (idx * 14) + (activeProgress * (3 - idx) * 8);

          return (
            <div
              key={idx}
              className="absolute w-44 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.12] bg-[#1A1D28] shadow-[0_16px_36px_rgba(0,0,0,0.5)] group hover:scale-105 transition-all"
              style={{
                zIndex: cfg.zIdx,
                transformStyle: 'preserve-3d',
                transform: `translateX(${currentX}px) translateZ(${currentZ}px) rotateZ(${currentRot}deg)`,
                transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <img
                src={photoUrl}
                alt={`Memory ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C12]/80 via-transparent to-white/[0.04] opacity-70 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 text-[11px] font-medium text-white/90 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                Memory #{idx + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll indicator cue for spreading stack */}
      <div className="absolute bottom-3 right-4 text-[11px] font-mono text-white/40 flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BF0] animate-pulse" />
        <span>Scroll panel to spread fan</span>
      </div>
    </div>
  );
}

