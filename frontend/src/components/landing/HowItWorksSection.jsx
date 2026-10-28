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
  Users,
  Image as ImageIcon
} from 'lucide-react';
import { HERO_PHOTOS } from './landingData';

// Precision scroll progress hook: Guarantees Card 3 never enters until all 3 steps are completed
function useStepScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const topOffset = 64; // height of top navbar
      const scrolled = topOffset - rect.top;

      // Distance allocated for the 3 steps: 2.1 screen heights (70vh per step * 3 steps)
      // The remaining 1.0 screen height (out of 3.1 total) is reserved exclusively for Card 3's ride-up
      const stepTravel = 2.1 * window.innerHeight;

      if (stepTravel > 0) {
        const ratio = scrolled / stepTravel;
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
    t: '10 sec',
    title: 'Create Your Private Group',
    subtitle: 'Takes 10 seconds to set up',
    description:
      'Start a group for your trip, family gathering, or celebration. Snaply gives you a private 10-character code to share with the people you invite.',
    icon: Users,
    badge: 'Invite Only',
    highlights: ['Simple 10-character code', 'No complex app setup', 'Organizer approves members'],
  },
  {
    key: 'upload',
    num: '02',
    t: 'Instant',
    title: 'Everyone Drops Their Photos',
    subtitle: '100% original quality, zero compression',
    description:
      'Anyone in the group can upload photos directly from their phone or camera. No file shrinking, no blurry compression—every photo stays crystal clear.',
    icon: UploadCloud,
    badge: 'Original Quality',
    highlights: ['Zero compression or blur', 'Upload dozens at once', 'Full resolution downloads'],
  },
  {
    key: 'relive',
    num: '03',
    t: 'Forever',
    title: 'Relive Memories Together',
    subtitle: 'Stunning full-screen gallery',
    description:
      'Browse through all the group photos in a clean, distraction-free viewer. Download your favorites at full size and keep every memory safe.',
    icon: Eye,
    badge: 'Shared Gallery',
    highlights: ['Full-screen photo viewer', 'Organized group albums', 'Download originals anytime'],
  },
];

export default function HowItWorksSection() {
  const [containerRef, progress] = useStepScrollProgress();
  const stepCount = STEPS.length;

  // Active step calculated from scroll progress:
  // Step 01: [0.00, 0.33]
  // Step 02: [0.34, 0.66]
  // Step 03: [0.67, 1.00] (fully displayed before next card begins to enter)
  const activeStep = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;

  // Intra-step progress for the active step's fill bar
  const stepStart = activeStep === 0 ? 0 : activeStep === 1 ? 0.34 : 0.67;
  const stepEnd = activeStep === 0 ? 0.34 : activeStep === 1 ? 0.67 : 1.0;
  const intraProgress = Math.min(1, Math.max(0, (progress - stepStart) / (stepEnd - stepStart)));

  // Smooth scroll to center of any step on click
  const scrollToStep = (idx) => {
    const el = containerRef.current;
    if (!el) return;
    const topOffset = 64;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const stepTravel = 2.1 * window.innerHeight;
    const targetRatio = (idx + 0.5) / stepCount;
    window.scrollTo({
      top: top - topOffset + targetRatio * stepTravel,
      behavior: 'smooth',
    });
  };

  return (
    <div className="bg-transparent">
      {/* Desktop Scroll-Driven Progression (Pinned Viewport Container) */}
      <div
        ref={containerRef}
        className="relative hidden lg:block"
        style={{ height: '310vh' }}
      >
        {/* Sticky Viewport Container: stays pinned while scrolling through 1 -> 2 -> 3 */}
        <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          
          {/* Integrated Header Row */}
          <div className="flex items-end justify-between gap-6 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#2DD4BF] font-semibold">
                  How It Works
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                <span className="text-xs font-mono text-white/40">
                  Scroll to advance steps
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white">
                Collect every photo from your group in{' '}
                <span className="text-[#2DD4BF] underline decoration-[#2DD4BF]/40 decoration-2 underline-offset-4">
                  three easy steps
                </span>
                .
              </h2>
            </div>

            {/* Step Counter Pill */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#2DD4BF]">
                Step {activeStep + 1} of {stepCount}
              </span>
              <div className="w-24 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#5B5BF0] to-[#2DD4BF] transition-[width] duration-150 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs text-white/40 tabular-nums">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          {/* 2-Column Interactive Step Flow */}
          <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center gap-8 xl:gap-12">
            
            {/* Left Column: Interactive Steps List */}
            <div>
              <ol className="space-y-3">
                {STEPS.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCurrent = idx === activeStep;
                  const isPassed = idx < activeStep;

                  return (
                    <li key={step.key}>
                      <button
                        type="button"
                        onClick={() => scrollToStep(idx)}
                        aria-current={isCurrent ? 'step' : undefined}
                        className={`group flex w-full items-start gap-4 rounded-2xl p-4 text-left border transition-all duration-300 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#12141C] border-[#2DD4BF] shadow-[0_8px_30px_rgba(45,212,191,0.2)] translate-x-1.5'
                            : 'bg-[#12141C]/40 border-white/[0.06] hover:bg-[#12141C]/80 hover:border-white/[0.14]'
                        }`}
                      >
                        {/* Step Icon Badge */}
                        <span
                          className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all duration-300 ${
                            isCurrent
                              ? 'bg-[#2DD4BF] text-black font-bold shadow-[0_0_18px_rgba(45,212,191,0.5)] scale-105'
                              : isPassed
                              ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/40 font-bold'
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
                              className={`text-sm sm:text-base font-bold transition-colors duration-200 ${
                                isCurrent || isPassed ? 'text-white' : 'text-white/50'
                              }`}
                            >
                              {step.title}
                            </span>
                            <span className="ml-auto font-mono text-xs text-white/40">
                              {step.t}
                            </span>
                          </span>

                          {/* Accordion Expansion for Active Step */}
                          <span
                            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                              isCurrent
                                ? 'grid-rows-[1fr] opacity-100 mt-2'
                                : 'grid-rows-[0fr] opacity-0'
                            }`}
                          >
                            <span className="overflow-hidden">
                              <span className="block text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
                                {step.description}
                              </span>

                              {/* Highlight Tags */}
                              <span className="flex flex-wrap gap-2 mt-2.5">
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

                              {/* Intra-Step Scroll Progress Bar */}
                              <span className="mt-3 block h-1 overflow-hidden rounded-full bg-white/[0.08]">
                                <span
                                  className="block h-full rounded-full bg-[#2DD4BF] transition-[width] duration-150 ease-out"
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

              {/* Navigation Hints */}
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-white/40 px-1">
                <span>Scroll down to advance steps</span>
                <span>Click any step to jump</span>
              </div>
            </div>

            {/* Right Column: Dynamic Stage Preview Mockup */}
            <div className="relative">
              {/* Ambient Radial Glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#2DD4BF]/20 via-transparent to-[#5B5BF0]/15 blur-2xl pointer-events-none"
              />

              <div className="relative rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-md">
                {/* Stage Header */}
                <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#090A0F] border border-white/[0.08] px-3 py-1 text-xs font-mono text-white">
                    <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    <span>Step {activeStep + 1}: {STEPS[activeStep].title}</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2DD4BF]">
                    <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                    {STEPS[activeStep].badge}
                  </span>
                </div>

                {/* Overlaid Stages with Butter-Smooth Spring Transform */}
                <div className="grid min-h-[290px]">
                  {/* Stage 1: Group Invite Code */}
                  <div
                    aria-hidden={activeStep !== 0}
                    className={`col-start-1 row-start-1 self-center transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeStep === 0
                        ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
                        : 'translate-y-4 scale-95 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="space-y-4 max-w-md mx-auto text-center py-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#5B5BF0]/15 border border-[#5B5BF0]/30 text-[#A5A6F6] flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(91,91,240,0.25)]">
                        <KeyRound className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base sm:text-lg font-semibold text-white">Private Group Invite Code</h4>
                        <p className="text-xs text-white/50">Share with family & friends via text or chat</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#090A0F] border border-white/[0.1] font-mono text-xl sm:text-2xl tracking-[0.2em] text-white font-bold flex items-center justify-center gap-2 shadow-inner">
                        <span>ALP-94K2-10</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center gap-2 text-xs font-mono text-[#2DD4BF]">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>You review and approve anyone who asks to join</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 2: Drag & Drop Photos */}
                  <div
                    aria-hidden={activeStep !== 1}
                    className={`col-start-1 row-start-1 self-center transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeStep === 1
                        ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
                        : 'translate-y-4 scale-95 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="space-y-4 max-w-md mx-auto py-1">
                      <div className="p-5 rounded-xl border border-dashed border-[#5B5BF0]/50 bg-[#090A0F] text-center space-y-2 shadow-inner">
                        <UploadCloud className="w-7 h-7 text-[#5B5BF0] mx-auto animate-pulse" />
                        <div>
                          <span className="text-sm font-semibold text-white block">Drop any photo or folder here</span>
                          <span className="text-xs text-white/40 mt-0.5 block">Full original resolution • No compression</span>
                        </div>
                      </div>

                      <div className="space-y-2 p-3 rounded-xl bg-[#090A0F] border border-white/[0.06]">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-white/80 truncate">Family_Hike_Original.jpg</span>
                          <span className="text-[#2DD4BF] font-semibold">100% Uploaded</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#5B5BF0] to-[#2DD4BF] rounded-full w-full" />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-0.5">
                          <span>Original Colors Preserved</span>
                          <span>0% Quality Loss</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stage 3: Relive in Full-Screen Gallery */}
                  <div
                    aria-hidden={activeStep !== 2}
                    className={`col-start-1 row-start-1 self-center transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeStep === 2
                        ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
                        : 'translate-y-4 scale-95 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="space-y-3 max-w-lg mx-auto">
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl">
                        <img
                          src={HERO_PHOTOS.card2.url}
                          alt="Shared Memory Gallery"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-lg bg-[#090A0F]/90 backdrop-blur-md border border-white/[0.1] flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                            <span className="text-white font-medium truncate">Mountain Trip 2026</span>
                          </div>
                          <span className="text-[#2DD4BF] font-semibold">Full Original Quality</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-white/50 px-1 gap-2">
                        <span className="text-[11px]">
                          Gallery view: [ ← ] Previous • [ → ] Next
                        </span>
                        <span className="text-white/70">18 photos contributed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage Footer Status */}
                <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs font-mono text-white/40">
                  <span>Safe & private for your group</span>
                  <span>Step {activeStep + 1} of {stepCount}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Fallback */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#2DD4BF] font-semibold">
              How It Works
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Collect every photo in three easy steps.
          </h2>
        </div>

        <ol className="space-y-10">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <li key={step.key} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#2DD4BF] text-black font-bold">
                    <StepIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#2DD4BF] block">
                      Step {idx + 1}
                    </span>
                    <span className="text-xs font-mono text-white/40">
                      {step.t}
                    </span>
                  </div>
                  <span className="ml-auto text-xs font-mono text-[#2DD4BF] px-2.5 py-1 rounded bg-[#2DD4BF]/10 border border-[#2DD4BF]/20">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {step.title}
                </h3>

                <p className="text-sm text-white/60 leading-relaxed font-sans">
                  {step.description}
                </p>

                {/* Mobile Mockup Card for Each Step */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] p-4 shadow-lg">
                  {idx === 0 && (
                    <div className="space-y-3 text-center py-2">
                      <div className="p-3 rounded-lg bg-[#090A0F] border border-white/[0.1] font-mono text-lg tracking-widest text-white font-bold">
                        ALP-94K2-10
                      </div>
                      <p className="text-xs font-mono text-[#2DD4BF]">
                        Private Group Invite Code • Organizer reviews requests
                      </p>
                    </div>
                  )}

                  {idx === 1 && (
                    <div className="space-y-3">
                      <div className="p-5 rounded-xl border border-dashed border-white/20 bg-[#090A0F] text-center">
                        <UploadCloud className="w-6 h-6 text-[#5B5BF0] mx-auto mb-1.5" />
                        <span className="text-xs font-mono text-white/70 block">
                          Drop any photo or folder
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-mono text-white/60">
                        <span>Family_Hike_Original.jpg</span>
                        <span className="text-[#2DD4BF]">100% Uploaded</span>
                      </div>
                    </div>
                  )}

                  {idx === 2 && (
                    <div className="space-y-2">
                      <div className="aspect-[16/9] rounded-lg overflow-hidden border border-white/[0.08]">
                        <img
                          src={HERO_PHOTOS.card2.url}
                          alt="Shared Memory Gallery"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#2DD4BF] block text-center">
                        Full Original Quality • Download Anytime
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
