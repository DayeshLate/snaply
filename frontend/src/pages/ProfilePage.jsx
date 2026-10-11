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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
          <User className="w-7 h-7 text-[#2563EB]" />
          My Profile
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Manage your account credentials, storage integration, and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-[#2563EB]"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#1E3A8A] text-white text-3xl font-bold flex items-center justify-center">
              {getInitials(user?.name)}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">{user?.name}</h2>
                <p className="text-sm text-[#64748B] flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Mail className="w-4 h-4 text-[#2563EB]" />
                  <span>{user?.email}</span>
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setLogoutDialogOpen(true)}
                  className="text-[#DC2626] hover:bg-red-50 hover:border-red-200"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Verification badge */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Email Verified
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#1E3A8A] border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                Role: {user?.role || 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#E2E8F0]">
          <div className="p-4 rounded-lg bg-slate-50 border border-[#E2E8F0]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#2563EB]" />
              Active Groups
            </div>
            <p className="text-2xl font-bold text-[#0F172A] mt-2">{groupCount}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-[#E2E8F0]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              <HardDrive className="w-4 h-4 text-[#2563EB]" />
              Google Drive
            </div>
            <p className="text-sm font-bold text-[#0F172A] mt-2.5">
              {driveStatus?.connected ? (
                <span className="text-[#16A34A] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Connected
                </span>
              ) : (
                <span className="text-[#64748B] flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-slate-400" /> Not Connected
                </span>
              )}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-[#E2E8F0]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              Member Since
            </div>
            <p className="text-sm font-bold text-[#0F172A] mt-2.5">
              {formatDate(user?.createdAt || new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Storage & Drive Settings Quick Link */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#2563EB]" />
            Google Drive Storage Settings
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            Connect your personal Google Drive account to sync photos and store high-resolution album media.
          </p>
        </div>
        <Button onClick={() => navigate('/settings')} className="shrink-0">
          <span>Manage Drive Integration</span>
          <ExternalLink className="w-4 h-4 ml-1.5" />
        </Button>
      </div>

      {/* Logout Dialog */}
      <ConfirmDialog
        isOpen={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of Snaply?"
        confirmText="Sign Out"
        danger
      />
    </div>
  );
}
