import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading...', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 text-[#64748B] ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-[#2563EB]`} />
      {text && <p className="text-sm font-medium">{text}</p>}
    </div>
  );
}
