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
    </div>
  );
}
