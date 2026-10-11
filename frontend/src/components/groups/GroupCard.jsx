import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Folder, Copy, Check, ShieldCheck, Crown } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function GroupCard({ group, currentUserId }) {
  const navigate = useNavigate();
  const { success } = useToast();
  const [copied, setCopied] = React.useState(false);

  const memberCount = group.groupMembers?.length || 1;
  const folderCount = group.folderDTOs?.length || 0;
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
      className="bg-white rounded-lg border border-[#E2E8F0] hover:border-[#2563EB]/50 hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col group"
    >
      {/* Top Banner */}
      <div className="h-28 bg-linear-to-r from-blue-600 to-indigo-700 relative p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/20 text-white backdrop-blur-xs">
            {isOwner ? 'Owner' : 'Member'}
          </span>
          {group.inviteCode && (
            <button
              onClick={handleCopyInvite}
              title="Copy invite link"
              className="p-1.5 rounded bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        <div className="text-white">
          <h4 className="text-base font-bold truncate group-hover:underline">
            {group.name}
          </h4>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <p className="text-xs text-[#64748B] line-clamp-2 min-h-[32px]">
          {group.description || 'No description provided.'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{folderCount} {folderCount === 1 ? 'album' : 'albums'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
