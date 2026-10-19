import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  HardDrive,
  LogOut,
  Users,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../services/groupService';
import { driveService } from '../services/driveService';
import { getInitials, formatDate } from '../utils/formatters';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [groupCount, setGroupCount] = useState(0);
  const [driveStatus, setDriveStatus] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    groupService
      .getAllGroups()
      .then((res) => setGroupCount(res?.length || 0))
      .catch(() => {});

    driveService
      .getStatus()
      .then((res) => setDriveStatus(res))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Account Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span>My Profile</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your account credentials, storage integration, and application preferences
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setLogoutDialogOpen(true)}
          className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* Profile Hero Card */}
      <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden p-6 sm:p-8">
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-blue-600" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
          {/* Avatar */}
          <div className="relative group shrink-0">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user?.name || 'User'}
                className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-md"
              />
            ) : (
              <div className="relative w-24 h-24 rounded-full bg-blue-600 text-white text-3xl font-extrabold flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shadow-md">
                {getInitials(user?.name)}
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {user?.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </p>
            </div>

            {/* Verification & Role Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Email Verified
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Role: {user?.role || 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800">
          {/* Active Groups */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 transition-all hover:border-blue-300 dark:hover:border-blue-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Groups
              </span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
              {groupCount}
            </p>
          </div>

          {/* Google Drive Status */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 transition-all hover:border-emerald-300 dark:hover:border-emerald-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                <HardDrive className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Google Drive
              </span>
            </div>
            <div className="mt-3">
              {driveStatus?.connected ? (
                <span className="inline-flex items-center gap-1.5 text-base font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-base font-bold text-slate-400 dark:text-slate-500">
                  <XCircle className="w-4 h-4" /> Not Connected
                </span>
              )}
            </div>
          </div>

          {/* Member Since */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 transition-all hover:border-purple-300 dark:hover:border-purple-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Member Since
              </span>
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-3">
              {formatDate(user?.createdAt || new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Storage & Drive Settings Quick Link */}
      <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-base">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <HardDrive className="w-5 h-5" />
            </div>
            <span>Google Drive Storage Integration</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Connect your personal Google Drive account to sync photos in full raw quality and automatically organize them into private group folders.
          </p>
        </div>

        <Button
          onClick={() => navigate('/settings')}
          className="shrink-0 flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <span>Manage Drive Integration</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {/* Logout Dialog */}
      <ConfirmDialog
        isOpen={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of your Snaply account? You will need to sign in again to access your shared albums."
        confirmText="Sign Out"
        danger
      />
    </div>
  );
}
