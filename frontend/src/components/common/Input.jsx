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
        <label htmlFor={inputId} className="text-sm font-medium text-[#0F172A] flex items-center justify-between">
          <span>
            {label} {required && <span className="text-[#DC2626]">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-[#64748B] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full rounded bg-white text-[#0F172A] placeholder-[#64748B] text-sm py-2 transition-colors border focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-slate-100 disabled:cursor-not-allowed ${
            Icon ? 'pl-9 pr-3' : 'px-3'
          } ${error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#E2E8F0]'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#DC2626] mt-0.5">{error}</p>}
      {!error && helperText && <p className="text-xs text-[#64748B] mt-0.5">{helperText}</p>}
    </div>
  );
});

export default Input;
