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
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-10 max-w-lg mx-6 text-center shadow-2xl border-2 border-dashed border-blue-500 scale-100 animate-in zoom-in-95 duration-200 ring-4 ring-blue-500/20">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
          <UploadCloud className="w-10 h-10 animate-bounce" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
            <ImageIcon className="w-3.5 h-3.5" /> Photos (JPG, PNG, WEBP)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
            <Film className="w-3.5 h-3.5" /> Videos (MP4, MOV, WEBM)
          </span>
        </div>
      </div>
    </div>
  );
}
