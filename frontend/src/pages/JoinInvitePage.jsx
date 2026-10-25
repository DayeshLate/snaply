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
      await groupService.requestToJoin(inviteCode.trim());
      setRequested(true);
      success('Join request submitted successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Failed to submit join request';
      const cleanMsg = typeof msg === 'string' ? msg : 'Failed to submit join request';
      setErrorMsg(cleanMsg);
      showError(cleanMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1728] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
          <div className="w-14 h-14 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <img
              src="/snaply-cloud-mark.png"
              alt="Snaply"
              className="w-full h-full object-contain drop-shadow-sm"
              loading="eager"
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Snaply
          </span>
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Group Invitation
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          You have been invited to collaborate in a private photo group
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl py-8 px-6 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl sm:px-10">
          {!isAuthenticated ? (
            /* User not logged in prompt */
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 mx-auto flex items-center justify-center ring-1 ring-blue-500/20">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sign in to Accept Invitation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                You need a Snaply account to join this photo group and share memories. Please sign in or register to proceed.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() =>
                    navigate(`/login?redirect=/invite/${inviteCode}`)
                  }
                  variant="primary"
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
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center ring-1 ring-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Request Sent!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Your join request has been sent to the group owner. Once approved, this group and its shared albums will appear on your dashboard.
              </p>
              <div className="pt-3 flex flex-col gap-2.5">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="primary"
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
              <div className="flex items-center gap-3.5 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400 font-medium">Invite Code</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white truncate">
                    {inviteCode}
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                  Click below to submit your join request as{' '}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {user?.name || user?.email}
                  </span>
                  .
                </p>

                <Button
                  onClick={handleJoinRequest}
                  loading={loading}
                  variant="primary"
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
