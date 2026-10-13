import React, { useState, useEffect } from 'react';
import { UploadCloud, Film, Image as ImageIcon } from 'lucide-react';

export default function DragDropZoneOverlay({
  onFilesDropped,
  title = 'Drop media to upload',
  subtitle = 'Release your photos & videos to start uploading to this album',
  disabled = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  useEffect(() => {
    if (disabled) return;

    const handleDragEnter = (e) => {
      // Check if dragged items are files
      if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
        e.preventDefault();
        setDragCounter((prev) => prev + 1);
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setDragCounter((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsDragging(false);
          return 0;
        }
        return next;
      });
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      setDragCounter(0);
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (onFilesDropped) {
          onFilesDropped(Array.from(e.dataTransfer.files));
        }
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [disabled, onFilesDropped]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl p-10 max-w-lg mx-6 text-center shadow-2xl border-2 border-dashed border-[#2563EB] scale-100 animate-in zoom-in-95 duration-150">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-5 shadow-inner">
          <UploadCloud className="w-10 h-10 animate-bounce" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-[#64748B] mt-2 max-w-sm mx-auto">
          {subtitle}
        </p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#2563EB]">
            <ImageIcon className="w-3.5 h-3.5" /> Photos (JPG, PNG, WEBP)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600">
            <Film className="w-3.5 h-3.5" /> Videos (MP4, MOV, WEBM)
          </span>
        </div>
      </div>
    </div>
  );
}

