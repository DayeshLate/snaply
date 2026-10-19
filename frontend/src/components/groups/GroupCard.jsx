import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Folder, Copy, Check, Crown, UserCheck } from 'lucide-react';
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
      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group shadow-sm"
    >
      {/* Top Banner */}
      <div className="h-32 bg-blue-600 relative p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/40 text-white backdrop-blur-md border border-white/20">
            {isOwner ? 'Owner' : 'Member'}
          </span>
          {group.inviteCode && (
            <button
              onClick={handleCopyInvite}
              title="Copy invite link"
              className="p-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer border border-white/20 backdrop-blur-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        <div className="text-white">
          <h4 className="text-lg font-black truncate group-hover:text-cyan-200 transition-colors">
            {group.name}
          </h4>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px] leading-relaxed">
          {group.description || 'Collaborative shared album group.'}
        </p>

        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200/50 dark:border-blue-800/40">
            <Users className="w-3.5 h-3.5" />
            <span>{memberCount} members</span>
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40">
            <Folder className="w-3.5 h-3.5" />
            <span>{folderCount} albums</span>
          </span>
        </div>
      </div>
    </div>
  );
}
