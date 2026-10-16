import React from 'react';

export default function Loader({ text = 'Loading...', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-4 text-slate-500 dark:text-slate-400 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-blue-500/20 dark:border-blue-500/20 border-t-blue-600 dark:border-t-cyan-400 animate-spin`}
        />
        <div
          className={`absolute inset-0 ${sizeClasses[size] || sizeClasses.md} rounded-full border-transparent border-b-purple-500 animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      {text && <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 animate-pulse">{text}</p>}
    </div>
  );
}
