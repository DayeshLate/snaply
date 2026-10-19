import React from 'react';

/**
 * Official Snaply Brand Logo Component
 * Uses the authentic geometric low-poly cloud + camera emblem and clean typography.
 */
export default function SnaplyLogo({
  size = 'md',
  showWordmark = true,
  showBadge = false,
  badgeText = 'Shared Albums',
  className = '',
  iconClassName = '',
}) {
  const sizeMap = {
    xs: {
      box: 'w-7 h-7',
      img: 'w-7 h-7',
      text: 'text-base',
      badge: 'text-[9px]',
    },
    sm: {
      box: 'w-10 h-10',
      img: 'w-10 h-10',
      text: 'text-lg',
      badge: 'text-[10px]',
    },
    md: {
      box: 'w-12 h-12',
      img: 'w-12 h-12',
      text: 'text-xl',
      badge: 'text-[10px]',
    },
    lg: {
      box: 'w-16 h-16',
      img: 'w-16 h-16',
      text: 'text-2xl',
      badge: 'text-xs',
    },
    xl: {
      box: 'w-20 h-20',
      img: 'w-20 h-20',
      text: 'text-3xl',
      badge: 'text-xs',
    },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Emblem */}
      <div
        className={`relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${current.box} ${iconClassName}`}
      >
        <img
          src="/snaply-cloud-mark.png"
          alt="Snaply"
          className="w-full h-full object-contain drop-shadow-sm"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Wordmark & optional badge */}
      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight text-slate-900 dark:text-white leading-none ${current.text}`}
          >
            Snaply
          </span>
          {showBadge && (
            <span
              className={`tracking-wider uppercase font-bold text-sky-600 dark:text-sky-400 mt-0.5 ${current.badge}`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

