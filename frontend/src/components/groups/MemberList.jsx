import React, { useState } from 'react';
import { Crown, Shield, User, Trash2, MoreVertical } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '../../constants/theme';
import { getInitials, formatDate } from '../../utils/formatters';
import Button from '../common/Button';
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
    <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
      <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#0F172A]">Group Members ({members.length})</h4>
      </div>

      <div className="divide-y divide-[#E2E8F0]">
        {members.map((member) => {
          const memberUser = member.user || {};
          const displayName = member.userName || memberUser.name || 'Member';
          const displayEmail = member.userEmail || memberUser.email || '';
          const isTargetOwner = member.role === ROLES.OWNER;
          const isSelf = (member.userId || memberUser.id) === currentUserId;

          return (
            <div key={member.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-[#E2E8F0] flex items-center justify-center font-bold text-xs text-[#1E3A8A] shrink-0">
                  {getInitials(displayName)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{displayName}</p>
                    {isSelf && (
                      <span className="text-[10px] bg-slate-100 text-[#64748B] px-1.5 py-0.5 rounded font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] truncate">{displayEmail}</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Joined {formatDate(member.joinedAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Role badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-[#0F172A]">
                  {member.role === ROLES.OWNER && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                  {member.role === ROLES.ADMIN && <Shield className="w-3.5 h-3.5 text-[#2563EB]" />}
                  {member.role === ROLES.VIEWER && <User className="w-3.5 h-3.5 text-[#64748B]" />}
                  <span>{ROLE_LABELS[member.role] || member.role}</span>
                </div>

                {/* Role change dropdown for Owner */}
                {isOwner && !isTargetOwner && (
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="text-xs border border-[#E2E8F0] rounded px-2 py-1 bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
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
                    className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded transition-colors cursor-pointer"
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
      />
    </div>
  );
}
