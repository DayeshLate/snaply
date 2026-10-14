import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 tech-grid-pattern opacity-60 dark:opacity-40" />

      {/* Layered radial glow fields inspired by Technathon */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.18, 0.28, 0.18],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#2196F3]/30 via-[#1854A3]/20 to-transparent blur-[120px]"
      />

      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.12, 0.22, 0.12],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-[#38BDF8]/20 via-[#2563EB]/15 to-transparent blur-[140px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#1E3A8A]/25 via-[#2196F3]/10 to-transparent blur-[160px]"
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

