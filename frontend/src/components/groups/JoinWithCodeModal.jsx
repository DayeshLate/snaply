import React, { useState } from 'react';
import { KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { groupService } from '../../services/groupService';

export default function JoinWithCodeModal({ isOpen, onClose, onSuccess }) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { success, error: showError } = useToast();

  const handleClose = () => {
    setInviteCode('');
    setError('');
    setSubmitted(false);
    onClose();
  };

  const sanitizeCode = (raw) => {
    if (!raw) return '';
    let val = raw.trim();
    if (val.includes('/')) {
      const parts = val.split('/').filter(Boolean);
      val = parts[parts.length - 1];
    }
    return val.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanCode = sanitizeCode(inviteCode);
    if (!cleanCode) {
      setError('Please enter a valid invite code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await groupService.requestToJoin(cleanCode);
      setSubmitted(true);
      success('Join request submitted! The group owner will review it.');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Invalid or expired invite code';
      setError(typeof msg === 'string' ? msg : 'Invalid or expired invite code');
      showError(typeof msg === 'string' ? msg : 'Invalid or expired invite code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Join Circle with Code"
      description="Enter the code provided by the circle owner to request access."
    >
      {submitted ? (
        <div className="py-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center mx-auto text-[#2DD4BF]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">Request Sent</h4>
          <p className="text-xs text-white/60 max-w-xs mx-auto">
            Your request to join the circle has been submitted. You will gain access once an owner or admin approves it.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-[0.16em] text-white/50 block">
              Invite Code
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="text"
                autoFocus
                placeholder="e.g. 7a9b2c4d1e or invite link"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(sanitizeCode(e.target.value));
                  if (error) setError('');
                }}
                maxLength={60}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.12] bg-[#0B0C12] text-white font-mono tracking-wider text-sm focus:outline-none focus:border-[#5B5BF0] focus:ring-2 focus:ring-[#5B5BF0]/20 transition-all placeholder:text-white/20 placeholder:tracking-normal placeholder:font-sans"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button variant="outline" onClick={handleClose} disabled={loading} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={loading} disabled={!inviteCode.trim() || loading}>
              <span>Submit Request</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

