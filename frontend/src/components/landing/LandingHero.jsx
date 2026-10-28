import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  HardDrive,
  Users,
  Eye,
  Camera,
} from 'lucide-react';
import { HERO_PHOTOS, SOCIAL_AVATARS } from './landingData';

export default function LandingHero() {
  const [selectedQuality, setSelectedQuality] = useState('raw'); // 'raw' | 'compressed'

  const scrollToBento = (e) => {
    e.preventDefault();
    const target = document.querySelector('#features');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#090A0F]">
      {/* Subtle radial indigo glow (12% opacity) behind hero */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#5B5BF0]/12 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Copy Container */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge / pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12141C] border border-white/[0.08] text-[12px] font-mono text-white/70 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
            <span className="text-white/50">Private Vault •</span>
            <span className="text-white font-medium">Zero Compression RAW</span>
          </div>

          {/* Benefit-Driven H1 Headline (Exactly 8 words) */}
          <h1 className="text-[clamp(2.25rem,4vw,3.5rem)] font-bold tracking-[-0.03em] leading-[1.15] text-white">
            Uncompressed group memories. Preserved in private circles.
          </h1>

          {/* 2-line Subheadline (Max width 62ch) */}
          <p className="text-[16px] leading-[1.6] text-white/60 max-w-[62ch] mx-auto">
            End-to-end invite access, uncompressed RAW storage, and collaborative photo vaults for photographers, travelers, and families who demand pixel-perfect fidelity.
          </p>

          {/* Exactly ONE Primary CTA + At most ONE Secondary Outline */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto h-12 px-6 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] active:scale-[0.98] text-white text-[14px] font-medium transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(91,91,240,0.3)] focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
            >
              <span>Create Private Circle</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={scrollToBento}
              className="w-full sm:w-auto h-12 px-6 rounded-[10px] border border-white/[0.12] hover:border-white/[0.24] bg-white/[0.03] hover:bg-white/[0.06] text-white/80 hover:text-white text-[14px] font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#5B5BF0]"
            >
              <Eye className="w-4 h-4 text-white/60" />
              <span>Explore Live Vault</span>
            </button>
          </div>

          {/* Micro Trust reassurance line */}
          <p className="text-[12px] font-mono text-white/40 pt-1">
            Zero public links • 10-char invite authentication • AES-256 encryption
          </p>
        </div>

        {/* Interactive Floating UI Preview / Mockup */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.45)] backdrop-blur-md relative overflow-hidden transition-all duration-300">
            {/* Mockup Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/[0.06] gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/80">
                  <Camera className="w-5 h-5 text-[#5B5BF0]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white tracking-[-0.02em]">
                      Alpine Expedition 2026
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[10px] font-mono text-[#2DD4BF]">
                      Lossless Vault
                    </span>
                  </div>
                  <p className="text-[12px] font-mono text-white/40 mt-0.5">
                    Sony A7 IV • 14-Bit DNG • Code: <span className="text-white/80">ALP-94K2-10</span>
                  </p>
                </div>
              </div>

              {/* Interactive Fidelity Mode Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-[10px] bg-[#090A0F] border border-white/[0.08] self-start sm:self-auto">
                <button
                  onClick={() => setSelectedQuality('raw')}
                  className={`px-3 py-1.5 rounded-[8px] text-[12px] font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedQuality === 'raw'
                      ? 'bg-[#5B5BF0] text-white font-medium shadow-xs'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#2DD4BF]" />
                  <span>Original RAW (42.4 MB)</span>
                </button>
                <button
                  onClick={() => setSelectedQuality('compressed')}
                  className={`px-3 py-1.5 rounded-[8px] text-[12px] font-mono transition-all cursor-pointer ${
                    selectedQuality === 'compressed'
                      ? 'bg-white/[0.1] text-white font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <span>Social App (1.2 MB)</span>
                </button>
              </div>
            </div>

            {/* Photo Preview Stage */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden border border-white/[0.06] bg-[#090A0F]">
              <img
                src={HERO_PHOTOS.main.url}
                alt="Pacific Coast RAW Preview"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  selectedQuality === 'compressed'
                    ? 'blur-[1.2px] contrast-95 saturate-80'
                    : 'contrast-100 saturate-105 filter-none'
                }`}
                loading="eager"
              />

              {/* Quality overlay badge inside image */}
              <div className="absolute top-4 left-4 p-2.5 rounded-lg bg-[#090A0F]/85 backdrop-blur-md border border-white/[0.12] text-xs font-mono space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedQuality === 'raw' ? 'bg-[#2DD4BF]' : 'bg-[#F59E0B]'
                    }`}
                  />
                  <span className="text-white font-semibold">
                    {selectedQuality === 'raw' ? '100% Bit-for-Bit RAW' : 'Recompressed JPEG (4:2:0)'}
                  </span>
                </div>
                <div className="text-[11px] text-white/50">
                  {selectedQuality === 'raw'
                    ? '3840 × 2160 • 42.4 MB • Lossless'
                    : '1080 × 607 • 1.2 MB • Compressed artifacts'}
                </div>
              </div>

              {/* Bottom EXIF metadata bar */}
              <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#090A0F]/90 backdrop-blur-md border border-white/[0.1]">
                <div className="flex items-center gap-4 text-xs font-mono text-white/70">
                  <span>ISO 100</span>
                  <span>•</span>
                  <span>35mm f/1.4 GM</span>
                  <span>•</span>
                  <span>1/500s</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-[#2DD4BF]">Direct Sensor Readout</span>
                </div>

                {/* Stacked Circle Members */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-white/40">Circle Access:</span>
                  <div className="flex items-center -space-x-2">
                    {SOCIAL_AVATARS.slice(0, 4).map((av, i) => (
                      <img
                        key={i}
                        src={av.src}
                        alt={av.name}
                        className="w-6 h-6 rounded-full border-2 border-[#12141C] object-cover"
                        title={av.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
