import React from 'react';

export default function Skeleton({ className = '', variant = 'rect' }) {
  const base = 'animate-pulse bg-slate-200/80 dark:bg-slate-850/80 dark:bg-slate-800';
  const variants = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded-lg h-4 w-full',
  };

  return <div className={`${base} ${variants[variant] || variants.rect} ${className}`} />;
}
