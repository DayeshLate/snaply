import React, { useState } from 'react';
import { Crown, Shield, User, Edit3, Trash2, UserPlus } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '../../constants/theme';
import { getInitials, formatDate } from '../../utils/formatters';
import ConfirmDialog from '../common/ConfirmDialog';
import AddMemberModal from './AddMemberModal';
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
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOwner = currentUserRole === ROLES.OWNER;
  const isOwnerOrAdmin = currentUserRole === ROLES.OWNER || currentUserRole === ROLES.ADMIN;

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
    <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] overflow-hidden">
      <div className="p-5 border-b border-white/[0.08] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h4 className="text-sm font-semibold text-white">Circle Members ({members.length})</h4>
          <p className="text-xs text-white/50 mt-0.5">Manage member access and workspace roles</p>
        </div>
        {isOwnerOrAdmin && (
          <button
            onClick={() => setAddMemberOpen(true)}
            className="px-3.5 py-1.5 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      <div className="divide-y divide-white/[0.06]">
        {members.map((member) => {
          const memberUser = member.user || {};
          const displayName = member.userName || memberUser.name || 'Member';
          const displayEmail = member.userEmail || memberUser.email || '';
          const isTargetOwner = member.role === ROLES.OWNER;
          const isSelf = (member.userId || memberUser.id) === currentUserId;

          return (
            <div key={member.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-[10px] bg-[#1A1D28] border border-white/[0.1] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {getInitials(displayName)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                    {isSelf && (
                      <span className="text-[10px] bg-white/[0.08] text-white/80 border border-white/[0.12] px-2 py-0.5 rounded-full font-mono">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 truncate font-mono">{displayEmail}</p>
                  <p className="text-[11px] text-white/40 mt-0.5 font-mono">Joined {formatDate(member.joinedAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Role badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/[0.04] text-white/80 border border-white/[0.08]">
                  {member.role === ROLES.OWNER && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                  {member.role === ROLES.ADMIN && <Shield className="w-3.5 h-3.5 text-[#5B5BF0]" />}
                  {member.role === ROLES.EDITOR && <Edit3 className="w-3.5 h-3.5 text-[#2DD4BF]" />}
                  {member.role === ROLES.VIEWER && <User className="w-3.5 h-3.5 text-white/40" />}
                  <span>{ROLE_LABELS[member.role] || member.role}</span>
                </div>

                {/* Role change dropdown for Owner only (Hidden for non-owners) */}
                {isOwner && !isTargetOwner && (
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="text-xs border border-white/[0.1] rounded-[10px] px-2.5 py-1.5 bg-[#1A1D28] text-white focus:outline-none focus:border-[#5B5BF0] cursor-pointer font-medium"
                  >
                    <option value={ROLES.VIEWER}>{ROLE_LABELS[ROLES.VIEWER] || 'Viewer'}</option>
                    <option value={ROLES.EDITOR}>{ROLE_LABELS[ROLES.EDITOR] || 'Editor'}</option>
                    <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN] || 'Admin'}</option>
                  </select>
                )}

                {/* Remove button for Owner/Admin only (Hidden for non-owners) */}
                {isOwnerOrAdmin && !isTargetOwner && !isSelf && (
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setConfirmOpen(true);
                    }}
                    title="Remove from circle"
                    className="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-[8px] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Remove Member"
        message={`Are you sure you want to remove ${selectedMember?.userName || 'this member'} from the circle?`}
        confirmText="Remove Member"
        onConfirm={handleRemoveMember}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedMember(null);
        }}
        loading={loading}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        groupId={groupId}
        onMemberAdded={onMembersChanged}
      />
    </div>
  );
}
