import React, { useState } from 'react';
import { Mail, Shield, User, Edit3, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { ROLES, ROLE_LABELS } from '../../constants/theme';
import { groupService } from '../../services/groupService';
import { useToast } from '../../context/ToastContext';

export default function AddMemberModal({
  isOpen,
  onClose,
  groupId,
  isOwner = false,
  onMemberAdded,
}) {
  const { success } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(ROLES.EDITOR || 'EDITOR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter a valid email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email format (e.g. user@example.com)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await groupService.addMemberByEmail(groupId, cleanEmail, role);
      success(`Successfully added ${cleanEmail} to the group!`);
      setEmail('');
      setRole(ROLES.EDITOR || 'EDITOR');
      if (onMemberAdded) {
        onMemberAdded();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add member to group');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setEmail('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Member by Email"
      description="Invite someone to this workspace directly by their email address."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Member Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. colleague@snaply.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
            The user must already have a registered account on Snaply.
          </p>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Assigned Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Viewer */}
            <button
              type="button"
              onClick={() => setRole(ROLES.VIEWER)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                role === ROLES.VIEWER
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-cyan-400 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                <span className="text-xs font-bold">{ROLE_LABELS[ROLES.VIEWER] || 'Viewer'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Can view photos and albums</p>
            </button>

            {/* Editor */}
            <button
              type="button"
              onClick={() => setRole(ROLES.EDITOR)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                role === ROLES.EDITOR
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-cyan-400 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Edit3 className="w-4 h-4" />
                <span className="text-xs font-bold">{ROLE_LABELS[ROLES.EDITOR] || 'Editor'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Can upload & organize photos</p>
            </button>

            {/* Admin (Only selectable if Owner) */}
            {isOwner && (
              <button
                type="button"
                onClick={() => setRole(ROLES.ADMIN)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  role === ROLES.ADMIN
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-cyan-400 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold">{ROLE_LABELS[ROLES.ADMIN] || 'Admin'}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Manage members & settings</p>
              </button>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            icon={Mail}
          >
            {loading ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

