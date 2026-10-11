import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Camera,
  LogIn,
} from 'lucide-react';
import { groupService } from '../services/groupService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

export default function JoinInvitePage() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleJoinRequest = async () => {
    if (!inviteCode) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await groupService.requestToJoin(inviteCode);
      setRequested(true);
      success('Join request submitted successfully!');
    } catch (err) {
      const msg = err.message || 'Failed to submit join request';
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Snaply
          </span>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
          Group Invitation
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          You have been invited to collaborate in a private photo group
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E2E8F0] rounded-xl sm:px-10">
          {!isAuthenticated ? (
            /* User not logged in prompt */
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] mx-auto flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Sign in to Accept Invitation
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                You need a Snaply account to join this photo group and share memories. Please sign in or register to proceed.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() =>
                    navigate(`/login?redirect=/invite/${inviteCode}`)
                  }
                  className="w-full justify-center flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In or Register</span>
                </Button>
              </div>
            </div>
          ) : requested ? (
            /* Success confirmation */
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-50 text-[#16A34A] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Request Sent!
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Your join request has been sent to the group owner. Once approved, this group and its shared albums will appear on your dashboard.
              </p>
              <div className="pt-3 flex flex-col gap-2">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full justify-center"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/groups')}
                  className="w-full justify-center"
                >
                  View My Groups
                </Button>
              </div>
            </div>
          ) : (
            /* Ready to join form */
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#64748B]">Invite Code</p>
                  <p className="text-sm font-mono font-bold text-[#0F172A] truncate">
                    {inviteCode}
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-[#DC2626]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-xs text-[#64748B] text-center leading-relaxed">
                  Click below to submit your join request as{' '}
                  <span className="font-semibold text-[#0F172A]">
                    {user?.name || user?.email}
                  </span>
                  .
                </p>

                <Button
                  onClick={handleJoinRequest}
                  loading={loading}
                  className="w-full justify-center flex items-center gap-2"
                >
                  <span>Request to Join Group</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="w-full justify-center"
                  disabled={loading}
                >
                  Cancel & Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
