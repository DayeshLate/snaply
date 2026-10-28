import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  KeyRound,
  MessageSquare,
  HardDrive,
  Check,
  Copy,
  ShieldCheck,
  Send,
  Cloud,
  ArrowRight,
  Database,
  Layers,
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
    <section id="features" className="py-24 bg-[#090A0F] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#5B5BF0]">
              Precision Architecture
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BF0]" />
          </div>

          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[-0.02em] text-white leading-tight">
            Engineered for fidelity. Built for privacy.
          </h2>

          <p className="text-[16px] leading-[1.6] text-white/60 mt-3 max-w-[62ch]">
            Every capability in Snaply is designed to eliminate compression artifacts and prevent unauthorized public indexing.
          </p>
        </div>

        {/* 3-Column Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BENTO CARD 1: Full-Resolution RAW Preservation (Col-span 2) */}
          <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 sm:p-8 flex flex-col justify-between hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#5B5BF0]">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[11px] font-mono text-[#2DD4BF]">
                  Zero Recompression
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">
                  Full-Resolution RAW Preservation
                </h3>
                <p className="text-sm text-white/60 mt-2 max-w-[58ch] leading-relaxed">
                  Preserves original camera-sensor files (DNG, ARW, CR3, NEF) up to 100MB each. Every pixel, dynamic range stop, and EXIF tag is preserved bit-for-bit without social media recompression.
                </p>
              </div>
            </div>

            {/* Interactive RAW Inspector Mini-Component */}
            <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#090A0F] p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white/80 font-medium">Fidelity Inspection:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveExifTab('raw')}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-mono transition-colors cursor-pointer ${
                        activeExifTab === 'raw'
                          ? 'bg-[#5B5BF0] text-white font-medium'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      DNG RAW
                    </button>
                    <button
                      onClick={() => setActiveExifTab('jpeg')}
                      className={`px-2.5 py-1 rounded-[6px] text-xs font-mono transition-colors cursor-pointer ${
                        activeExifTab === 'jpeg'
                          ? 'bg-white/[0.08] text-white font-medium'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Compressed JPEG
                    </button>
                  </div>
                </div>

                <span className="text-xs font-mono text-white/40">
                  {activeExifTab === 'raw' ? 'Checksum: 4a9f...e10d' : 'Downsampled 4:2:0'}
                </span>
              </div>

              {/* Metadata Readout Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-white/40 block text-[10px] uppercase">File Size</span>
                  <span className="text-white font-semibold mt-0.5 block">
                    {activeExifTab === 'raw' ? '42.4 MB' : '1.2 MB'}
                  </span>
                </div>
                <div className="p-2.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-white/40 block text-[10px] uppercase">Bit Depth</span>
                  <span className="text-[#2DD4BF] font-semibold mt-0.5 block">
                    {activeExifTab === 'raw' ? '14-Bit Linear' : '8-Bit Standard'}
                  </span>
                </div>
                <div className="p-2.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-white/40 block text-[10px] uppercase">Resolution</span>
                  <span className="text-white font-semibold mt-0.5 block">
                    {activeExifTab === 'raw' ? '7008 × 4672' : '1920 × 1080'}
                  </span>
                </div>
                <div className="p-2.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-white/40 block text-[10px] uppercase">Color Gamut</span>
                  <span className="text-white font-semibold mt-0.5 block">
                    {activeExifTab === 'raw' ? 'ProPhoto RGB' : 'sRGB Web'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 2: Invite-Only Protocol (Col-span 1) */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 sm:p-8 flex flex-col justify-between hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#5B5BF0]">
                <KeyRound className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">
                  Invite-Only Access Protocol
                </h3>
                <p className="text-sm text-white/60 mt-2 leading-relaxed">
                  No public web links, no crawler indexing. Every circle is gated by a 10-character code with mandatory owner approval.
                </p>
              </div>
            </div>

            {/* Interactive Invite Code Widget */}
            <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#090A0F] p-4 space-y-3">
              <span className="text-[11px] font-mono text-white/40 block">Circle Access Code:</span>
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
                <span>Zero Public Discovery</span>
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
                  Real-Time Circle Sync & Chat
                </h3>
                <p className="text-sm text-white/60 mt-2 leading-relaxed">
                  Discuss photos inside dedicated private channels. STOMP WebSocket dispatch ensures messages and album updates arrive in sub-24ms.
                </p>
              </div>
            </div>

            {/* Interactive Chat Mini-Preview */}
            <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#090A0F] p-4 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pb-1.5 border-b border-white/[0.06]">
                <span>#alpine-ridge-chat</span>
                <span className="text-[#2DD4BF] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  &lt;18ms
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-[8px] bg-white/[0.03] border border-white/[0.06] text-white/80">
                  <span className="text-[#A5A6F6] font-mono font-medium mr-1.5">Elena:</span>
                  <span>Uploaded 12 high-res RAW frames from the summit!</span>
                </div>
                <div className="p-2 rounded-[8px] bg-[#5B5BF0]/15 border border-[#5B5BF0]/30 text-white/90">
                  <span className="text-white font-mono font-medium mr-1.5">Marcus:</span>
                  <span>Reviewing on 4K display—the sharpness is insane.</span>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 4: Hybrid Cloud & Sovereign Ownership (Col-span 2) */}
          <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 sm:p-8 flex flex-col justify-between hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#5B5BF0]">
                  <HardDrive className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-white/60">
                  Sovereign Ownership
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">
                  Hybrid Cloud & Zero Vendor Lock-In
                </h3>
                <p className="text-sm text-white/60 mt-2 max-w-[58ch] leading-relaxed">
                  Connect your Google Drive account in one click for off-site archiving, or rely on Snaply's encrypted local vaults. You always retain complete control and ownership of every raw byte.
                </p>
              </div>
            </div>

            {/* Visual Pipeline Mini-Component */}
            <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#090A0F] p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-3 w-full sm:w-auto p-3 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <Camera className="w-4 h-4 text-[#5B5BF0]" />
                  <div>
                    <span className="text-white font-medium block">Camera Direct</span>
                    <span className="text-[10px] text-white/40">Chunked Upload</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-white/30 hidden sm:block" />

                <div className="flex items-center gap-3 w-full sm:w-auto p-3 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <Database className="w-4 h-4 text-[#2DD4BF]" />
                  <div>
                    <span className="text-white font-medium block">Snaply Circle Vault</span>
                    <span className="text-[10px] text-[#2DD4BF]">AES-256 Encrypted</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-white/30 hidden sm:block" />

                <div className="flex items-center gap-3 w-full sm:w-auto p-3 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
                  <Cloud className="w-4 h-4 text-[#5B5BF0]" />
                  <div>
                    <span className="text-white font-medium block">Your Google Drive</span>
                    <span className="text-[10px] text-white/40">Automatic Sync</span>
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
