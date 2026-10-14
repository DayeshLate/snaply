import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    type = 'text',
    className = '',
    required = false,
    id,
    ...props
  },
  ref
) {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] dark:text-[#E2E8F0] flex items-center justify-between">
          <span>
            {label} {required && <span className="text-[#DC2626]">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-[#64748B] dark:text-[#64748B] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full rounded-sm bg-white dark:bg-[#121D2C] text-[#0F172A] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] text-sm py-2 transition-colors border focus:outline-none focus:border-[#2563EB] dark:focus:border-[#38BDF8] disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${
            Icon ? 'pl-9 pr-3' : 'px-3'
          } ${error ? 'border-[#DC2626] focus:border-[#DC2626]' : 'border-[#CBD5E1] dark:border-[#2F4158]'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#DC2626] mt-0.5">{error}</p>}
      {!error && helperText && <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{helperText}</p>}
    </div>
  );
});

export default Input;
