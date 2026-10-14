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
    'inline-flex items-center justify-center font-medium rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary:
      'bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF] focus:ring-[#2563EB] border border-[#1D4ED8]',
    secondary:
      'bg-[#EFF6FF] dark:bg-[#152338] text-[#1E3A8A] dark:text-[#60A5FA] hover:bg-blue-100 dark:hover:bg-[#1E3A5F] focus:ring-[#2563EB] border border-[#BFDBFE] dark:border-[#1E3A5F]',
    outline:
      'bg-white dark:bg-[#121D2C] text-[#0F172A] dark:text-[#E2E8F0] hover:bg-slate-50 dark:hover:bg-[#182638] focus:ring-[#2563EB] border border-[#CBD5E1] dark:border-[#2F4158]',
    danger:
      'bg-[#DC2626] text-white hover:bg-red-700 focus:ring-[#DC2626] border border-transparent',
    ghost:
      'bg-transparent text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#182638] hover:text-[#0F172A] dark:hover:text-white focus:ring-slate-300 border border-transparent',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
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
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}
