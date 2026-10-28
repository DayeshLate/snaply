import React, { useState, useEffect, useRef } from 'react';
import {
  KeyRound,
  UploadCloud,
  Eye,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock,
  Sparkles,
  Layers,
  Sliders
} from 'lucide-react';
import { HERO_PHOTOS } from './landingData';

// High-performance scroll progress hook calibrated for silky smooth 60/120fps scrolling
function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const topOffset = 64; // height of fixed top navbar (h-16)
      const scrollableDist = rect.height - (window.innerHeight - topOffset);

      if (scrollableDist > 0) {
        // Precise scroll distance past the pin point
        const scrolled = topOffset - rect.top;
        const ratio = scrolled / scrollableDist;
        setProgress(Math.max(0, Math.min(1, ratio)));
      } else {
        setProgress(rect.top < topOffset ? 1 : 0);
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return [ref, progress];
}

const STEPS = [
  {
    key: 'create',
    num: '01',
    t: '00s',
    title: 'Initialize Private Circle',
    subtitle: 'Cryptographic setup & zero tracking',
    description:
      'Generate an authenticated memory circle in two clicks. Snaply provisions an isolated storage bucket and mints a permanent 10-character circle key.',
    icon: KeyRound,
    badge: 'Invite Protected',
    highlights: ['10-char permanent key', 'Zero public URL indexing', 'Owner approval queue'],
  },
  {
    key: 'upload',
    num: '02',
    t: '15s',
    title: 'Drop Lossless RAW Frames',
    subtitle: 'Zero compression chunked upload',
    description:
      'Drag and drop full-resolution RAW frames (DNG, ARW, CR3, TIFF) up to 100MB per file. Multi-stream parallel uploading with SHA-256 integrity validation.',
    icon: UploadCloud,
    badge: '100% Bit-for-Bit',
    highlights: ['Up to 100MB per RAW file', '0% compression artifacts', 'Automatic EXIF extraction'],
  },
  {
    key: 'relive',
    num: '03',
    t: '30s',
    title: 'Relive in Full Fidelity',
    subtitle: 'Hardware-accelerated 14-bit lightbox',
    description:
      'Navigate your circle vault with hardware-accelerated rendering. Full 14-bit dynamic range, instant camera lens inspection, and keyboard navigation.',
    icon: Eye,
    badge: 'Lossless Lightbox',
    highlights: ['Full 14-bit color fidelity', 'Arrow key & ESC navigation', 'Instant EXIF metadata specs'],
  },
];

export default function HowItWorksSection() {
  const [containerRef, progress] = useScrollProgress();
  const stepCount = STEPS.length;

  // Hysteresis buffered step calculation for flicker-free transitions
  // Zone 0: [0.00, 0.34], Zone 1: [0.34, 0.68], Zone 2: [0.68, 1.00]
  const currentStep = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;

  // Calculate intra-step progress (0 to 1) for the active step's internal bar
  const stepStart = currentStep === 0 ? 0 : currentStep === 1 ? 0.34 : 0.68;
  const stepEnd = currentStep === 0 ? 0.34 : currentStep === 1 ? 0.68 : 1.0;
  const intraProgress = Math.min(1, Math.max(0, (progress - stepStart) / (stepEnd - stepStart)));

  // Smooth scroll directly to the center of any step on click
  const scrollToStep = (idx) => {
    const el = containerRef.current;
    if (!el) return;
    const topOffset = 64;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - (window.innerHeight - topOffset);
    const targetRatio = (idx + 0.5) / stepCount;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    window.scrollTo({
      top: top - topOffset + targetRatio * scrollable,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  return (
    <section id="workflow" className="bg-[#0B0C12] border-t border-white/[0.06] scroll-mt-16 relative">
      {/* 1. Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 sm:pt-28 sm:pb-14">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#5B5BF0] font-semibold">
                Seamless Workflow
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BF0]" />
              <span className="text-xs font-mono text-white/40">
                Live Interactive Pipeline
              </span>
            </div>

            <h2 className="text-[clamp(2rem,3.2vw,2.75rem)] font-bold tracking-[-0.02em] text-white leading-tight">
              From camera sensor to private circle in{' '}
              <span className="text-[#5B5BF0] underline decoration-[#5B5BF0]/40 decoration-2 underline-offset-4">
                three steps
              </span>
              .
            </h2>

            <p className="text-[16px] leading-[1.6] text-white/60 mt-4 max-w-[62ch]">
              Snaply replaces fragmented cloud folders and degraded chat uploads with one live, zero-compression pipeline. Creative collectives and photo groups share full RAW bits in real time.
            </p>
          </div>

          {/* Quick Metrics Comparison Card */}
          <div className="rounded-2xl bg-[#12141C] p-5 sm:p-6 border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
            <p className="mb-4 flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-[0.14em] text-white/60">
              <Clock className="h-4 w-4 text-[#5B5BF0]" aria-hidden="true" />
              <span>Full Fidelity vs Compressed</span>
            </p>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-white/60">Messaging Apps (WhatsApp / Telegram)</span>
                  <span className="text-white/40">~1.2 MB (Degraded)</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full w-[12%] rounded-full bg-white/20" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-white font-semibold">Snaply Lossless RAW Vault</span>
                  <span className="text-[#2DD4BF] font-bold">42.4 MB (100% Bit-for-Bit)</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-[#5B5BF0] to-[#2DD4BF]" />
                </div>
              </div>

              <p className="text-[11px] text-white/40 pt-1">
                Zero downscaling, zero chroma subsampling, full camera EXIF preserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Desktop Sticky Scroll-Pinned Section */}
      <div
        ref={containerRef}
        className="relative hidden lg:block"
        style={{ height: `${stepCount * 85 + 45}vh` }}
      >
        {/* Step Anchor Points */}
        {STEPS.map((step, idx) => (
          <span
            key={step.key}
            id={`step-${idx + 1}`}
            aria-hidden="true"
            className="absolute left-0 h-px w-px"
            style={{
              top: `${((idx + 0.35) / stepCount) * 100 * ((stepCount * 85 + 45 - 100) / (stepCount * 85 + 45))}%`,
            }}
          />
        ))}

        {/* Sticky Viewport Container - Sticks right under top navbar */}
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center gap-10 xl:gap-14">
              
              {/* Left Column: Interactive Steps List */}
              <div>
                {/* Global Step Counter & Smooth Total Progress Bar */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#5B5BF0]">
                    Step {currentStep + 1} of {stepCount}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5B5BF0] to-[#2DD4BF] transition-[width] duration-150 ease-out"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-white/40 tabular-nums">
                    {Math.round(progress * 100)}%
                  </span>
                </div>

                {/* Steps List */}
                <ol className="space-y-3">
                  {STEPS.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isCurrent = idx === currentStep;
                    const isPassed = idx < currentStep;

                    return (
                      <li key={step.key}>
                        <button
                          type="button"
                          onClick={() => scrollToStep(idx)}
                          aria-current={isCurrent ? 'step' : undefined}
                          className={`group flex w-full items-start gap-4 rounded-2xl p-4 sm:p-5 text-left border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                            isCurrent
                              ? 'bg-[#12141C] border-[#5B5BF0] shadow-[0_8px_30px_rgba(91,91,240,0.2)] translate-x-1.5'
                              : 'bg-[#12141C]/40 border-white/[0.06] hover:bg-[#12141C]/80 hover:border-white/[0.14]'
                          }`}
                        >
                          {/* Step Icon Badge */}
                          <span
                            className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              isCurrent
                                ? 'bg-[#5B5BF0] text-white shadow-[0_0_18px_rgba(91,91,240,0.6)] scale-105'
                                : isPassed
                                ? 'bg-[#2DD4BF] text-black font-bold'
                                : 'bg-white/[0.04] text-white/40 border border-white/[0.06]'
                            }`}
                          >
                            {isPassed ? (
                              <Check className="h-4 w-4 stroke-[3]" />
                            ) : (
                              <StepIcon className="h-4 w-4" />
                            )}
                          </span>

                          {/* Step Info */}
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span
                                className={`text-base font-bold transition-colors duration-300 ${
                                  isCurrent || isPassed ? 'text-white' : 'text-white/50'
                                }`}
                              >
                                {step.title}
                              </span>
                              <span className="ml-auto font-mono text-xs text-white/40">
                                T+{step.t}
                              </span>
                            </span>

                            {/* Smooth Accordion Expansion for Active Step */}
                            <span
                              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                isCurrent
                                  ? 'grid-rows-[1fr] opacity-100 mt-2.5'
                                  : 'grid-rows-[0fr] opacity-0'
                              }`}
                            >
                              <span className="overflow-hidden">
                                <span className="block text-xs sm:text-sm text-white/60 leading-relaxed">
                                  {step.description}
                                </span>

                                {/* Feature Highlight Tags */}
                                <span className="flex flex-wrap gap-2 mt-3">
                                  {step.highlights.map((highlight, hIdx) => (
                                    <span
                                      key={hIdx}
                                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/70 bg-white/[0.04] px-2 py-0.5 rounded-[5px] border border-white/[0.06]"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-[#2DD4BF]" />
                                      {highlight}
                                    </span>
                                  ))}
                                </span>

                                {/* Silky Smooth Intra-Step Scroll Progress Bar */}
                                <span className="mt-4 block h-1 overflow-hidden rounded-full bg-white/[0.08]">
                                  <span
                                    className="block h-full rounded-full bg-[#5B5BF0] transition-[width] duration-150 ease-out"
                                    style={{ width: `${intraProgress * 100}%` }}
                                  />
                                </span>
                              </span>
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {/* Subtitle / Navigation Hints */}
                <div className="mt-5 flex items-center justify-between text-xs font-mono text-white/40 px-1">
                  <span>Scroll down smoothly to advance pipeline</span>
                  <span>Click any step to jump</span>
                </div>
              </div>

              {/* Right Column: Dynamic Stage Preview Mockup with Hardware Accelerated Glide */}
              <div className="relative">
                {/* Ambient Radial Glow */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#5B5BF0]/20 via-transparent to-[#2DD4BF]/10 blur-2xl pointer-events-none"
                />

                <div className="relative rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 sm:p-7 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-md">
                  {/* Stage Header */}
                  <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3.5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#090A0F] border border-white/[0.08] px-3 py-1.5 text-xs font-mono text-white">
                      <Clock className="h-3.5 w-3.5 text-[#5B5BF0]" />
                      <span>Pipeline T+{STEPS[currentStep].t}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2DD4BF]">
                      <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                      {STEPS[currentStep].badge}
                    </span>
                  </div>

                  {/* Overlaid Stages with Butter-Smooth Spring Transform */}
                  <div className="grid min-h-[300px]">
                    {/* Stage 1: Circle Key Generation */}
                    <div
                      aria-hidden={currentStep !== 0}
                      className={`col-start-1 row-start-1 self-center transform-gpu transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        currentStep === 0
                          ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
                          : 'translate-y-5 scale-95 opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="space-y-5 max-w-md mx-auto text-center py-2">
                        <div className="w-13 h-13 rounded-2xl bg-[#5B5BF0]/15 border border-[#5B5BF0]/30 text-[#A5A6F6] flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(91,91,240,0.25)]">
                          <KeyRound className="w-6 h-6" />
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-lg font-semibold text-white">Permanent Circle Key</h4>
                          <p className="text-xs text-white/50 font-mono">ALP-94K2-10 • Cryptographically Bound</p>
                        </div>

                        <div className="p-4 rounded-xl bg-[#090A0F] border border-white/[0.1] font-mono text-2xl tracking-[0.2em] text-white font-bold flex items-center justify-center gap-2 shadow-inner">
                          <span>ALP-94K2-10</span>
                        </div>

                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center gap-2 text-xs font-mono text-[#2DD4BF]">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>Circle Owner reviews all pending member requests</span>
                        </div>
                      </div>
                    </div>

                    {/* Stage 2: Lossless RAW Chunked Upload */}
                    <div
                      aria-hidden={currentStep !== 1}
                      className={`col-start-1 row-start-1 self-center transform-gpu transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        currentStep === 1
                          ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
                          : 'translate-y-5 scale-95 opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="space-y-4 max-w-md mx-auto py-2">
                        <div className="p-6 rounded-xl border border-dashed border-[#5B5BF0]/50 bg-[#090A0F] text-center space-y-2 shadow-inner">
                          <UploadCloud className="w-8 h-8 text-[#5B5BF0] mx-auto animate-pulse" />
                          <div>
                            <span className="text-sm font-semibold text-white block">Drop RAW files or folders</span>
                            <span className="text-xs text-white/40 mt-1 block font-mono">DNG • ARW • CR3 • TIFF (up to 100MB)</span>
                          </div>
                        </div>

                        <div className="space-y-2 p-3.5 rounded-xl bg-[#090A0F] border border-white/[0.06]">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-white/80 truncate">DSC08492_35mm.DNG (42.4 MB)</span>
                            <span className="text-[#2DD4BF] font-semibold">100% Uploaded</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#5B5BF0] to-[#2DD4BF] rounded-full w-full" />
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-1">
                            <span>SHA-256 Checksum Verified</span>
                            <span>0% Re-compression</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stage 3: Full Fidelity Lightbox */}
                    <div
                      aria-hidden={currentStep !== 2}
                      className={`col-start-1 row-start-1 self-center transform-gpu transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        currentStep === 2
                          ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
                          : 'translate-y-5 scale-95 opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="space-y-3 max-w-lg mx-auto">
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl">
                          <img
                            src={HERO_PHOTOS.card2.url}
                            alt="Full Fidelity Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-3 inset-x-3 p-3 rounded-lg bg-[#090A0F]/90 backdrop-blur-md border border-white/[0.1] flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                              <span className="text-white font-medium truncate">Sunrise Ridge Hike.ARW</span>
                            </div>
                            <span className="text-[#2DD4BF] font-semibold">Full 14-Bit Range</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-white/50 px-1 gap-2">
                          <span className="text-[11px]">
                            Keys: <span className="text-white/80 font-bold">[ ← ]</span> Prev •{' '}
                            <span className="text-white/80 font-bold">[ → ]</span> Next •{' '}
                            <span className="text-white/80 font-bold">[ ESC ]</span> Close
                          </span>
                          <span className="text-white/70">Frame 1 of 18</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stage Footer Status */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3.5 text-xs font-mono text-white/40">
                    <span>Engine: Snaply Lossless Core</span>
                    <span>Step {currentStep + 1} of {stepCount}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Fallback */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-8">
        <ol className="space-y-12">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <li key={step.key} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#5B5BF0] text-white font-bold">
                    <StepIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#5B5BF0] block">
                      Step {idx + 1}
                    </span>
                    <span className="text-xs font-mono text-white/40">
                      T+{step.t}
                    </span>
                  </div>
                  <span className="ml-auto text-xs font-mono text-[#2DD4BF] px-2.5 py-1 rounded bg-[#2DD4BF]/10 border border-[#2DD4BF]/20">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {step.title}
                </h3>

                <p className="text-sm text-white/60 leading-relaxed">
                  {step.description}
                </p>

                {/* Mobile Mockup Card for Each Step */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] p-5 shadow-lg">
                  {idx === 0 && (
                    <div className="space-y-4 text-center py-2">
                      <div className="p-3 rounded-lg bg-[#090A0F] border border-white/[0.1] font-mono text-lg tracking-widest text-white font-bold">
                        ALP-94K2-10
                      </div>
                      <p className="text-xs font-mono text-[#2DD4BF]">
                        Cryptographic Circle Key • Owner approval required
                      </p>
                    </div>
                  )}

                  {idx === 1 && (
                    <div className="space-y-3">
                      <div className="p-6 rounded-xl border border-dashed border-white/20 bg-[#090A0F] text-center">
                        <UploadCloud className="w-7 h-7 text-[#5B5BF0] mx-auto mb-2" />
                        <span className="text-xs font-mono text-white/70 block">
                          Drop RAW up to 100MB
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-mono text-white/60">
                        <span>DSC08492.DNG</span>
                        <span className="text-[#2DD4BF]">100% Uploaded</span>
                      </div>
                    </div>
                  )}

                  {idx === 2 && (
                    <div className="space-y-2">
                      <div className="aspect-[16/9] rounded-lg overflow-hidden border border-white/[0.08]">
                        <img
                          src={HERO_PHOTOS.card2.url}
                          alt="Full Fidelity Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#2DD4BF] block text-center">
                        Full 14-Bit Uncompressed Dynamic Range
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
