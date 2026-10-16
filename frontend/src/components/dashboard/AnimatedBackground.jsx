import React from 'react';

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        contain: 'strict',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 tech-grid-pattern opacity-60 dark:opacity-40" />

      {/* Layered radial glow fields - 100% GPU compositor accelerated with pure CSS, zero JS main-thread load */}
      <div
        style={{
          background: 'radial-gradient(circle, rgba(33, 150, 243, 0.18) 0%, rgba(24, 84, 163, 0.08) 40%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none animate-pulse-glow"
      />

      <div
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(37, 99, 235, 0.06) 45%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
        className="absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full pointer-events-none animate-slow-drift"
      />

      <div
        style={{
          background: 'radial-gradient(circle, rgba(30, 58, 138, 0.15) 0%, rgba(33, 150, 243, 0.04) 50%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
        className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none"
      />

      {/* Technical corner crosshair accents */}
      <div className="absolute top-6 left-6 text-[#94A3B8]/30 dark:text-[#334155]/60 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute top-6 right-6 text-[#94A3B8]/30 dark:text-[#334155]/60 font-mono text-xs select-none">
        +
      </div>
    </div>
  );
}

