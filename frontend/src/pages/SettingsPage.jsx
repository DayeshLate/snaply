import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Settings,
  HardDrive,
  CheckCircle2,
  XCircle,
  Shield,
  RefreshCw,
  Bell,
  Lock,
  FolderSync,
} from 'lucide-react';
import { driveService } from '../services/driveService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function SettingsPage() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [driveStatus, setDriveStatus] = useState(null);
  const [loadingDrive, setLoadingDrive] = useState(true);
  const [connectingDrive, setConnectingDrive] = useState(false);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // General settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Check for callback query params
  useEffect(() => {
    const driveParam = searchParams.get('drive');
    const emailParam = searchParams.get('email');
    const driveError = searchParams.get('drive_error');

    if (driveParam === 'connected') {
      success(`Google Drive connected successfully${emailParam ? ` (${emailParam})` : ''}!`);
      setSearchParams({});
    } else if (driveError) {
      showError(`Google Drive connection failed: ${driveError}`);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, success, showError]);

  const loadDriveStatus = async () => {
    setLoadingDrive(true);
    try {
      const data = await driveService.getStatus();
      setDriveStatus(data);
    } catch {
      setDriveStatus({ connected: false });
    } finally {
      setLoadingDrive(false);
    }
  };

  useEffect(() => {
    loadDriveStatus();
  }, []);

  const handleConnectDrive = async () => {
    setConnectingDrive(true);
    try {
      const res = await driveService.getAuthUrl();
      if (res && res.authUrl) {
        window.location.href = res.authUrl;
      } else {
        throw new Error('Failed to retrieve Google Drive authorization link');
      }
    } catch (err) {
      showError(err.message || 'Failed to start Google Drive authorization');
      setConnectingDrive(false);
    }
  };

  const handleDisconnectDrive = async () => {
    setDisconnecting(true);
    try {
      await driveService.disconnect();
      success('Google Drive disconnected successfully');
      setDisconnectDialogOpen(false);
      loadDriveStatus();
    } catch (err) {
      showError(err.message || 'Failed to disconnect Google Drive');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
          <Settings className="w-7 h-7 text-[#2563EB]" />
          Settings & Integrations
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Configure external storage, cloud sync, and application preferences
        </p>
      </div>

      {/* Google Drive Integration Section */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Google Drive Storage</h2>
              <p className="text-xs text-[#64748B]">Cloud storage backend for group albums & high-res media</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDriveStatus}
              title="Refresh status"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            {driveStatus?.connected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-[#16A34A]">
                <CheckCircle2 className="w-4 h-4" /> Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <XCircle className="w-4 h-4" /> Disconnected
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loadingDrive ? (
            <div className="py-6 flex justify-center">
              <Loader text="Checking Google Drive status..." />
            </div>
          ) : driveStatus?.connected ? (
            /* Connected state info */
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-[#E2E8F0] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-[#64748B] block uppercase tracking-wider">
                      Connected Google Account
                    </span>
                    <span className="text-sm font-bold text-[#0F172A] mt-0.5 block truncate">
                      {driveStatus.googleEmail || 'Google Drive Connected'}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-[#64748B] block uppercase tracking-wider">
                      Snaply Root Folder ID
                    </span>
                    <span className="text-xs font-mono text-[#0F172A] mt-1 block truncate bg-white px-2 py-1 rounded border border-[#E2E8F0]">
                      {driveStatus.driveRootFolderId || 'Default Root Folder'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-[#64748B]">
                  Your photos are safely synced to Google Drive in full quality.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleConnectDrive}
                    loading={connectingDrive}
                  >
                    Reconnect Drive
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setDisconnectDialogOpen(true)}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Disconnected state prompt */
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <FolderSync className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                <div className="text-xs text-[#1E3A8A] leading-relaxed">
                  <p className="font-semibold text-sm mb-1">
                    Connect Google Drive to start uploading photos
                  </p>
                  Snaply integrates with Google Drive to store high-resolution photos and organize them inside private group folders. When connected, photos you upload are synced directly to your cloud storage.
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  onClick={handleConnectDrive}
                  loading={connectingDrive}
                  className="flex items-center gap-2"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Connect Google Drive</span>
                </Button>
              </div>
            </div>
          )}

          {/* Privacy & Permissions explanation */}
          <div className="pt-4 border-t border-[#E2E8F0] space-y-2 text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
              <Shield className="w-4 h-4 text-[#2563EB]" />
              <span>How permissions work</span>
            </div>
            <p>
              Snaply only requests access to manage files that it creates inside its dedicated application directory on your Drive. We cannot view, modify, or delete any of your personal documents or other Drive folders.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#2563EB]" />
          Notification Preferences
        </h2>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">In-App Notifications</p>
              <p className="text-xs text-[#64748B]">Receive alerts for join requests, role updates, and new album media</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">Notification Audio Sounds</p>
              <p className="text-xs text-[#64748B]">Play an audio chime when new messages arrive in active group chat</p>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
            />
          </label>
        </div>
      </div>

      {/* Security & Active Session */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#2563EB]" />
          Security & Active Session
        </h2>

        <div className="p-4 rounded-lg bg-slate-50 border border-[#E2E8F0] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Authentication Mechanism:</span>
            <span className="font-semibold text-[#0F172A]">JWT HTTP-Only Secure Cookie</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Signed In Email:</span>
            <span className="font-semibold text-[#0F172A]">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Access Control:</span>
            <span className="font-semibold text-[#0F172A]">Role-Based Access Control (RBAC)</span>
          </div>
        </div>
      </div>

      {/* Disconnect Drive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={disconnectDialogOpen}
        onClose={() => setDisconnectDialogOpen(false)}
        onConfirm={handleDisconnectDrive}
        loading={disconnecting}
        title="Disconnect Google Drive"
        message="Are you sure you want to disconnect Google Drive? You will not be able to upload new photos to your group albums until you reconnect."
        confirmText="Disconnect Drive"
        danger
      />
    </div>
  );
}
