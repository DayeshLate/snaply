import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none cursor-pointer active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500 border border-blue-500/30',
    secondary:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 focus:ring-blue-500 border border-blue-200/80 dark:border-blue-800/60 shadow-xs',
    outline:
      'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/90 focus:ring-blue-500 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-600',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md hover:shadow-red-500/25 focus:ring-red-500 border border-red-500/30',
    ghost:
      'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white focus:ring-slate-400 border border-transparent',
    gradient:
      'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-95 text-white shadow-md hover:shadow-purple-500/25 focus:ring-purple-500 border border-purple-500/30',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 rounded-2xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />}
          {children}
        </>
      )}
    </button>
  );
}
