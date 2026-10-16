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
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Group Workspaces
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Circles
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Spaces where family, friends, and teams collaborate on shared albums
          </p>
        </div>

        <button
          onClick={onCreateGroup}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
          <span>New Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="group bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                      {getInitials(group.name)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors truncate max-w-[170px]">
                        {group.name}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium mt-0.5">
                        {isOwner ? (
                          <>
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-amber-600 dark:text-amber-400 font-bold">Owner</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
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
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[36px] leading-relaxed font-normal">
                  {group.description || 'Collaborative album workspace with shared photo storage.'}
                </p>

                {/* Metadata Badges */}
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 font-semibold">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200/50 dark:border-blue-800/40">
                    <Users className="w-3.5 h-3.5" />
                    <span>{memberCount} members</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40">
                    <FolderLock className="w-3.5 h-3.5" />
                    <span>{albumCount} albums</span>
                  </span>
                </div>
              </div>

              <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                  #{group.id}
                </span>
                <span className="font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-all min-h-[200px] group shadow-xs"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-indigo-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300 mb-3 shadow-xs">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
            Create New Group
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mt-1 leading-relaxed">
            Invite members and collaborate on shared photo albums
          </p>
        </div>
      </div>
    </section>
  );
}
