import React, { useState } from 'react';
import {
  Camera,
  KeyRound,
  MessageSquare,
  HardDrive,
  Check,
  Copy,
  ShieldCheck,
  ArrowRight,
  Cloud,
  Image as ImageIcon,
  Sparkles,
  Users
} from 'lucide-react';

export default function FeaturesShowcase() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeExifTab, setActiveExifTab] = useState('raw'); // 'raw' | 'jpeg'

  const sampleInviteCode = 'ALP-94K2-10';

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleInviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="py-12 sm:py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#5B5BF0] font-semibold">
              Why Snaply
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BF0]" />
            <span className="text-xs font-mono text-white/40">
              For Friends, Trips & Family
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,2.8vw,2.5rem)] font-bold tracking-[-0.02em] text-white leading-tight">
            Built for moments you never want to lose.
          </h2>

          <p className="text-[15px] sm:text-[16px] leading-[1.6] text-white/60 mt-3 max-w-[62ch]">
            Group photos get scattered across chat threads and crushed by compression. Snaply gives your circle a private, crystal-clear home where every memory stays organized.
          </p>
        </div>

        {/* 3-Column Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BENTO CARD 1: Full-Resolution Quality Preservation (Col-span 2) */}
          <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 sm:p-8 flex flex-col justify-between hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#5B5BF0]">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[11px] font-mono text-[#2DD4BF]">
                  Zero Blurry Compression
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">
                  Keep 100% of the Original Quality
                </h3>
                <p className="text-sm text-white/60 mt-2 max-w-[58ch] leading-relaxed">
                  Chat apps shrink your pictures to save data, turning vibrant memories into blurry files. Snaply preserves every pixel, color, and detail so your memories look as crisp years from now as they did in the moment.
                </p>
              </div>
            </div>

            {/* Interactive Quality Comparison Mini-Component */}
            <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#090A0F] p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white/80 font-medium">Compare Quality:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveExifTab('raw')}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-mono transition-colors cursor-pointer ${
                        activeExifTab === 'raw'
                          ? 'bg-[#5B5BF0] text-white font-medium'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Snaply Original
                    </button>
                    <button
                      onClick={() => setActiveExifTab('jpeg')}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-mono transition-colors cursor-pointer ${
                        activeExifTab === 'jpeg'
                          ? 'bg-white/[0.08] text-white font-medium'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Chat App Compressed
                    </button>
                  </div>
                </div>

                <span className="text-xs font-mono text-white/40">
                  {activeExifTab === 'raw' ? '100% True Resolution' : 'Heavy 4:2:0 Downscaling'}
                </span>
              </div>

              {/* Quality Comparison Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-white/40 block text-[10px] uppercase">File Clarity</span>
                  <span className="text-white font-semibold mt-0.5 block">
                    {activeExifTab === 'raw' ? 'Full Size' : 'Heavily Shrunk'}
                  </span>
                </div>
                <div className="p-2.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-white/40 block text-[10px] uppercase">Color Depth</span>
                  <span className="text-[#2DD4BF] font-semibold mt-0.5 block">
                    {activeExifTab === 'raw' ? 'Vibrant & True' : 'Faded / Lossy'}
                  </span>
                </div>
                <div className="p-2.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-white/40 block text-[10px] uppercase">Zoom Detail</span>
                  <span className="text-white font-semibold mt-0.5 block">
                    {activeExifTab === 'raw' ? 'Crystal Sharp' : 'Pixelated & Blurry'}
                  </span>
                </div>
                <div className="p-2.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-white/40 block text-[10px] uppercase">Download Size</span>
                  <span className="text-white font-semibold mt-0.5 block">
                    {activeExifTab === 'raw' ? 'Original File' : 'Low-Res Copy'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 2: Invite-Only Group Code (Col-span 1) */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 sm:p-8 flex flex-col justify-between hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#5B5BF0]">
                <KeyRound className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">
                  Simple 10-Character Group Code
                </h3>
                <p className="text-sm text-white/60 mt-2 leading-relaxed">
                  No public web links, no stranger requests. Share your group's private code with friends or family, and you approve everyone who joins.
                </p>
              </div>
            </div>

            {/* Interactive Invite Code Widget */}
            <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#090A0F] p-4 space-y-3">
              <span className="text-[11px] font-mono text-white/40 block">Group Invite Code:</span>
              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-white/[0.03] border border-white/[0.06]">
                <span className="font-mono text-sm tracking-widest text-white font-semibold">
                  {sampleInviteCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-[6px] bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#2DD4BF]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Private to your invited circle</span>
              </div>
            </div>
          </div>

          {/* BENTO CARD 3: Real-Time Sync & Group Chat (Col-span 1) */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 sm:p-8 flex flex-col justify-between hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#5B5BF0]">
                <MessageSquare className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">
                  Chat & React to Photos Together
                </h3>
                <p className="text-sm text-white/60 mt-2 leading-relaxed">
                  Share reactions and talk about favorite moments right next to the photos. When anyone uploads new trip photos, the whole group sees them immediately.
                </p>
              </div>
            </div>

            {/* Interactive Chat Mini-Preview */}
            <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#090A0F] p-4 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pb-1.5 border-b border-white/[0.06]">
                <span>#trip-chat</span>
                <span className="text-[#2DD4BF] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  Active Now
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-[8px] bg-white/[0.03] border border-white/[0.06] text-white/80">
                  <span className="text-[#A5A6F6] font-mono font-medium mr-1.5">Elena:</span>
                  <span>Just uploaded all the sunset photos from the summit!</span>
                </div>
                <div className="p-2 rounded-[8px] bg-[#5B5BF0]/15 border border-[#5B5BF0]/30 text-white/90">
                  <span className="text-white font-mono font-medium mr-1.5">Marcus:</span>
                  <span>These look incredible in full screen. Downloading now!</span>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 4: Safe Backup & Easy Export (Col-span 2) */}
          <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 sm:p-8 flex flex-col justify-between hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#5B5BF0]">
                  <HardDrive className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-white/60">
                  Full Ownership
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">
                  Safe Storage & Easy Google Drive Backup
                </h3>
                <p className="text-sm text-white/60 mt-2 max-w-[58ch] leading-relaxed">
                  Connect your Google Drive in one click for automatic backup, or let Snaply store your memories securely. You can download all your original photos whenever you want.
                </p>
              </div>
            </div>

            {/* Visual Flow Mini-Component */}
            <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#090A0F] p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-3 w-full sm:w-auto p-3 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <Camera className="w-4 h-4 text-[#5B5BF0]" />
                  <div>
                    <span className="text-white font-medium block">Phone or Camera</span>
                    <span className="text-[10px] text-white/40">Upload Any Photo</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-white/30 hidden sm:block" />

                <div className="flex items-center gap-3 w-full sm:w-auto p-3 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <ImageIcon className="w-4 h-4 text-[#2DD4BF]" />
                  <div>
                    <span className="text-white font-medium block">Private Group Album</span>
                    <span className="text-[10px] text-[#2DD4BF]">Original Quality</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-white/30 hidden sm:block" />

                <div className="flex items-center gap-3 w-full sm:w-auto p-3 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <Cloud className="w-4 h-4 text-[#5B5BF0]" />
                  <div>
                    <span className="text-white font-medium block">Google Drive or Download</span>
                    <span className="text-[10px] text-white/40">Safe Forever</span>
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
