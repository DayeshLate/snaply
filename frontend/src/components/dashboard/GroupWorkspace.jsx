import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  FolderLock,
  ArrowRight,
  Copy,
  Check,
  Crown,
  Shield,
  UserCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../utils/formatters';

export default function GroupWorkspace({
  groups = [],
  onCreateGroup,
  currentUserId,
}) {
  const navigate = useNavigate();
  const { success } = useToast();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyInvite = (e, group) => {
    e.stopPropagation();
    if (group.inviteCode) {
      const inviteUrl = `${window.location.origin}/invite/${group.inviteCode}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopiedId(group.id);
      success(`Invite link for "${group.name}" copied!`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
              Group Workspaces
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs bg-indigo-50 dark:bg-[#181E3B] text-[#6366F1] dark:text-[#818CF8] border border-indigo-200 dark:border-[#2E365E]">
              Shared Circles
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Spaces where family, friends, and teams collaborate on albums
          </p>
        </div>

        <button
          onClick={onCreateGroup}
          className="px-3.5 py-1.5 rounded-sm bg-white dark:bg-[#121D2C] hover:bg-slate-50 dark:hover:bg-[#182638] text-[#0F172A] dark:text-[#E2E8F0] font-medium text-xs flex items-center gap-1.5 border border-[#CBD5E1] dark:border-[#2F4158] hover:border-[#2563EB] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
          <span>Create Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((group, idx) => {
          const isOwner = group.ownerId === currentUserId || group.user?.id === currentUserId;
          const memberCount = group.groupMembers?.length || 1;
          const albumCount = group.folderDTOs?.length || group.folders?.length || 0;
          const isCopied = copiedId === group.id;

          return (
            <motion.div
              key={group.id || idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              onClick={() => navigate(`/groups/${group.id}`)}
              className="group bg-white dark:bg-[#0E1724] border border-[#CBD5E1] dark:border-[#1F2D40] hover:border-[#2563EB] dark:hover:border-[#38BDF8] p-5 rounded-sm shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                      {getInitials(group.name)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#2563EB] dark:group-hover:text-[#38BDF8] transition-colors truncate max-w-[160px]">
                        {group.name}
                      </h3>
                      <span className="font-mono text-[10px] text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                        {isOwner ? (
                          <>
                            <Crown className="w-3 h-3 text-amber-500" />
                            <span>Owner</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3 text-[#2563EB]" />
                            <span>Member</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {group.inviteCode && (
                    <button
                      onClick={(e) => handleCopyInvite(e, group)}
                      title="Copy group invite link"
                      className="p-1.5 rounded-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182638] border border-[#E2E8F0] dark:border-[#1F2D40] transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-2 min-h-[32px]">
                  {group.description || 'Collaborative album workspace with shared photo storage.'}
                </p>

                {/* Metadata Pills */}
                <div className="flex items-center gap-4 text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mt-4 pt-3 border-t border-[#F1F5F9] dark:divide-[#162233]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
                    <span>{memberCount} MEMBERS</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <FolderLock className="w-3.5 h-3.5 text-[#6366F1]" />
                    <span>{albumCount} ALBUMS</span>
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F1F5F9] dark:border-[#162233] flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-[#94A3B8] dark:text-[#64748B]">
                  ID: #{group.id}
                </span>
                <span className="font-semibold text-[#2563EB] dark:text-[#38BDF8] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Enter Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Create Group Quick Action Card */}
        <div
          onClick={onCreateGroup}
          className="border-2 border-dashed border-[#CBD5E1] dark:border-[#2F4158] hover:border-[#2563EB] dark:hover:border-[#38BDF8] rounded-sm p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/30 dark:hover:bg-[#132238]/30 transition-all min-h-[180px] group"
        >
          <div className="w-10 h-10 rounded-sm bg-slate-100 dark:bg-[#182638] group-hover:bg-[#EFF6FF] dark:group-hover:bg-[#1E3A5F] text-[#64748B] group-hover:text-[#2563EB] dark:group-hover:text-[#38BDF8] flex items-center justify-center transition-colors mb-2">
            <Plus className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#2563EB] dark:group-hover:text-[#38BDF8]">
            Create New Group
          </h4>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-[200px] mt-1">
            Invite members and collaborate on shared photo albums
          </p>
        </div>
      </div>
    </section>
  );
}

