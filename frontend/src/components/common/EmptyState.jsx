import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-10 text-center rounded-lg border border-dashed border-[#E2E8F0] bg-white ${className}`}>
      {Icon && (
        <div className="p-3 bg-slate-100 rounded-full text-[#64748B] mb-4">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[#0F172A] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#64748B] max-w-sm mb-6 leading-relaxed">{description}</p>}
      {actionText && onAction && (
        <Button onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
