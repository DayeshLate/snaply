import React, { useState } from 'react';
import { Crown, Shield, User, Trash2 } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '../../constants/theme';
import { getInitials, formatDate } from '../../utils/formatters';
import ConfirmDialog from '../common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { groupService } from '../../services/groupService';

export default function MemberList({
  groupId,
  members = [],
  currentUserRole,
  currentUserId,
  onMembersChanged,
}) {
  const { success, error: showError } = useToast();
  const [selectedMember, setSelectedMember] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOwnerOrAdmin = currentUserRole === ROLES.OWNER || currentUserRole === ROLES.ADMIN;
  const isOwner = currentUserRole === ROLES.OWNER;

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await groupService.changeRole(groupId, memberId, newRole);
      success(`Role updated to ${newRole}`);
      if (onMembersChanged) onMembersChanged();
    } catch (err) {
      showError(err.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    setLoading(true);
    try {
      await groupService.removeMember(groupId, selectedMember.id);
      success('Member removed successfully');
      setConfirmOpen(false);
      setSelectedMember(null);
      if (onMembersChanged) onMembersChanged();
    } catch (err) {
      showError(err.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">Group Members ({members.length})</h4>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {members.map((member) => {
          const memberUser = member.user || {};
          const displayName = member.userName || memberUser.name || 'Member';
          const displayEmail = member.userEmail || memberUser.email || '';
          const isTargetOwner = member.role === ROLES.OWNER;
          const isSelf = (member.userId || memberUser.id) === currentUserId;

          return (
            <div key={member.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                  {getInitials(displayName)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                    {isSelf && (
                      <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200/50 dark:border-blue-800/40 px-2 py-0.5 rounded-full font-bold">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Joined {formatDate(member.joinedAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Role badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                  {member.role === ROLES.OWNER && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                  {member.role === ROLES.ADMIN && <Shield className="w-3.5 h-3.5 text-blue-500" />}
                  {member.role === ROLES.VIEWER && <User className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{ROLE_LABELS[member.role] || member.role}</span>
                </div>

                {/* Role change dropdown for Owner */}
                {isOwner && !isTargetOwner && (
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                  >
                    <option value={ROLES.VIEWER}>Member</option>
                    <option value={ROLES.ADMIN}>Admin</option>
                  </select>
                )}

                {/* Remove button for Owner/Admin */}
                {isOwnerOrAdmin && !isTargetOwner && !isSelf && (
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setConfirmOpen(true);
                    }}
                    title="Remove from group"
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleRemoveMember}
        loading={loading}
        title="Remove Member"
        message={`Are you sure you want to remove this member from the group?`}
        confirmText="Remove"
        isDanger={true}
      />
    </div>
  );
}
