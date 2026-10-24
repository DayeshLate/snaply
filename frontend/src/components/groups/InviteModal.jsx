import React, { useState } from 'react';
import { X, Copy, Check, RefreshCw, Link as LinkIcon, ShieldCheck } from 'lucide-react';

export default function InviteModal({
  isOpen,
  onClose,
  group,
  onRegenerateCode,
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!isOpen || !group) return null;

  const inviteCode = group.inviteCode || 'SNAP-VAULT26';
  const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleRegenerate = async () => {
    if (!onRegenerateCode) return;
    setIsRegenerating(true);
    try {
      await onRegenerateCode();
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 shadow-2xl space-y-6 z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-base font-semibold text-white tracking-[-0.02em]">
              Invite to Circle
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Share access to <span className="text-white font-medium">{group.name}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-[8px] text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invite Code in JetBrains Mono */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-[0.16em] text-white/50 block">
            Invite Code
          </label>
          <div className="flex items-center gap-2 p-3 rounded-[10px] bg-[#0E1017] border border-white/[0.08]">
            <span className="font-mono text-xl font-semibold tracking-wider text-white flex-1 select-all pl-1">
              {inviteCode}
            </span>

            <button
              onClick={handleCopyCode}
              title="Copy invite code"
              className="px-3 py-1.5 rounded-[8px] bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Shareable Link Box */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-[0.16em] text-white/50 block">
            Shareable Join Link
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-[10px] bg-[#0E1017] border border-white/[0.08]">
            <span className="font-mono text-xs text-white/60 truncate flex-1 pl-1">
              {inviteUrl}
            </span>

            <button
              onClick={handleCopyLink}
              title="Copy join link"
              className="px-3 py-1.5 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security notice & Regenerate Code */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-white/40">
            <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
            <span>Join requests require owner approval</span>
          </div>

          {onRegenerateCode && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="text-xs font-mono text-white/60 hover:text-white flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

