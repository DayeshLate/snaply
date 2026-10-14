import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Folder, Copy, Check, Crown, UserCheck } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function GroupCard({ group, currentUserId }) {
  const navigate = useNavigate();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  const memberCount = group.groupMembers?.length || 1;
  const folderCount = group.folderDTOs?.length || group.folders?.length || 0;
  const isOwner = group.user?.id === currentUserId || group.ownerId === currentUserId;

  const handleCopyInvite = (e) => {
    e.stopPropagation();
    if (group.inviteCode) {
      const inviteUrl = `${window.location.origin}/invite/${group.inviteCode}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      success('Invite link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={() => navigate(`/groups/${group.id}`)}
      className="bg-white dark:bg-[#0E1724] rounded-sm border border-[#CBD5E1] dark:border-[#1F2D40] hover:border-[#2563EB] dark:hover:border-[#38BDF8] hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col group shadow-2xs"
    >
      {/* Top Banner */}
      <div className="h-28 bg-gradient-to-r from-[#1854A3] via-[#2196F3] to-[#2563EB] relative p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-semibold bg-black/40 text-white backdrop-blur-xs border border-white/20">
            {isOwner ? 'Owner' : 'Member'}
          </span>
          {group.inviteCode && (
            <button
              onClick={handleCopyInvite}
              title="Copy invite link"
              className="p-1.5 rounded-xs bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer border border-white/20"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        <div className="text-white">
          <h4 className="text-base font-bold truncate group-hover:text-cyan-200 transition-colors">
            {group.name}
          </h4>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-2 min-h-[32px]">
          {group.description || 'Collaborative shared album group.'}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] dark:border-[#162233] text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
            <span>{memberCount} MEMBERS</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>{folderCount} ALBUMS</span>
          </span>
        </div>
      </div>
    </div>
  );
}
