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
      {/* Subtle modern grid pattern */}
      <div className="absolute inset-0 tech-grid-pattern opacity-40 dark:opacity-30" />

      {/* Layered radial glow fields - 100% GPU compositor accelerated with pure CSS, zero JS main-thread load */}
      <div
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.16) 0%, rgba(79, 70, 229, 0.08) 40%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full pointer-events-none animate-pulse-glow"
      />

      <div
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(37, 99, 235, 0.06) 45%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none animate-slow-drift"
      />

      <div
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(37, 99, 235, 0.04) 50%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
        className="absolute -bottom-40 left-1/4 w-[750px] h-[750px] rounded-full pointer-events-none"
      />
    </div>
  );
}
