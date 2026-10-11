import React from 'react';

export default function Skeleton({ className = '', variant = 'rect' }) {
  const base = 'animate-pulse bg-slate-200';
  const variants = {
    rect: 'rounded',
    circle: 'rounded-full',
    text: 'rounded h-4 w-full',
  };

  return <div className={`${base} ${variants[variant] || variants.rect} ${className}`} />;
}
