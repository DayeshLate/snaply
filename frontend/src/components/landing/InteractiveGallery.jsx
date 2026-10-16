import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  MapPin,
  FolderLock,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_PHOTOS } from './landingData';

export default function InteractiveGallery() {
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev > 0 ? prev - 1 : GALLERY_PHOTOS.length - 1
        );
      }
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) =>
          prev < GALLERY_PHOTOS.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activePhotoIndex]);

  const activePhoto =
    activePhotoIndex !== null ? GALLERY_PHOTOS[activePhotoIndex] : null;

  return (
    <section id="gallery" className="py-24 md:py-32 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Public Gallery Exhibition
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            A little collection of life’s best moments.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Click any photograph to open the high-resolution lightbox viewer.
            Real moments captured and shared by collaborative groups.
          </p>
        </div>

        {/* Editorial Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {GALLERY_PHOTOS.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
              onClick={() => setActivePhotoIndex(index)}
              className="group relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-xs hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="aspect-4/5 w-full overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-between text-white">
                  <div className="flex justify-end">
                    <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white shadow-xs">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                      {photo.album}
                    </span>
                    <h4 className="text-base font-bold leading-tight">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Label under photo */}
              <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  {photo.title}
                </span>
                <span className="text-[11px] shrink-0 text-blue-600 dark:text-blue-400 font-semibold">
                  {photo.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            {/* Top Toolbar */}
            <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between text-white z-20">
              <div className="min-w-0 pr-4">
                <h4 className="text-sm font-bold truncate">
                  {activePhoto.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {activePhotoIndex + 1} of {GALLERY_PHOTOS.length} •{' '}
                  {activePhoto.album}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-white cursor-pointer transition-colors"
                  aria-label="Close lightbox"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Previous Photo Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) =>
                  prev > 0 ? prev - 1 : GALLERY_PHOTOS.length - 1
                );
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer z-20"
              aria-label="Previous photo (Arrow Left)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Photo Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) =>
                  prev < GALLERY_PHOTOS.length - 1 ? prev + 1 : 0
                );
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer z-20"
              aria-label="Next photo (Arrow Right)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Central High-Res Photo Container */}
            <div
              className="max-w-5xl max-h-[80vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
              />

              {/* Bottom Caption Pill */}
              <div className="mt-4 px-6 py-2.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs flex flex-wrap items-center justify-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-[#2196F3]" />
                  {activePhoto.location}
                </span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-[#2196F3]" />
                  {activePhoto.date}
                </span>
                <span className="flex items-center gap-1.5 text-[#90CAF9] font-semibold">
                  <FolderLock className="w-3.5 h-3.5" />
                  {activePhoto.album}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
