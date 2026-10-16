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
  Sparkles,
  Copy,
  Check,
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
  const [copiedFolderId, setCopiedFolderId] = useState(false);

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

  const handleCopyFolderId = (folderId) => {
    if (!folderId) return;
    navigator.clipboard.writeText(folderId);
    setCopiedFolderId(true);
    setTimeout(() => setCopiedFolderId(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <span className="gradient-text">Settings & Integrations</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Configure external cloud storage, notifications, and security options
        </p>
      </div>

      {/* Google Drive Integration Card */}
      <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
        {/* Top gradient accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Google Drive Storage</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cloud storage backend for group albums & full-resolution media
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDriveStatus}
              title="Refresh status"
              className="p-2"
            >
              <RefreshCw className={`w-4 h-4 ${loadingDrive ? 'animate-spin' : ''}`} />
            </Button>
            {driveStatus?.connected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                <XCircle className="w-3.5 h-3.5" /> Disconnected
              </span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {loadingDrive ? (
            <div className="py-8 flex justify-center">
              <Loader text="Checking Google Drive integration..." />
            </div>
          ) : driveStatus?.connected ? (
            /* Connected state info */
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                      Connected Google Account
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block truncate">
                      {driveStatus.googleEmail || 'Google Drive Connected'}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                      Snaply Root Folder ID
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 truncate max-w-xs">
                        {driveStatus.driveRootFolderId || 'Default Root Folder'}
                      </span>
                      {driveStatus.driveRootFolderId && (
                        <button
                          type="button"
                          onClick={() => handleCopyFolderId(driveStatus.driveRootFolderId)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Copy Folder ID"
                        >
                          {copiedFolderId ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Your photos are safely synced to Google Drive in their original, uncompressed resolution.
                </p>
                <div className="flex items-center gap-3 shrink-0">
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
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 mt-0.5">
                  <FolderSync className="w-5 h-5" />
                </div>
                <div className="text-xs sm:text-sm text-blue-950 dark:text-blue-200 leading-relaxed space-y-1">
                  <p className="font-bold text-sm text-blue-900 dark:text-blue-100">
                    Connect Google Drive to start uploading photos
                  </p>
                  <p className="text-blue-800/80 dark:text-blue-300">
                    Snaply integrates directly with Google Drive to store high-resolution photos and organize them inside dedicated group albums. Uploaded media is synced directly to your personal cloud storage.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  onClick={handleConnectDrive}
                  loading={connectingDrive}
                  className="flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Connect Google Drive</span>
                </Button>
              </div>
            </div>
          )}

          {/* Privacy & Permissions explanation */}
          <div className="pt-5 border-t border-slate-200/80 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>How permissions and security work</span>
            </div>
            <p className="leading-relaxed">
              Snaply only requests permission to create and manage files within its own dedicated application directory on your Drive. We cannot view, modify, or delete any of your personal files, documents, or other Drive folders.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences Card */}
      <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Control in-app activity notifications and sound alerts</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* In-app notification toggle */}
          <div
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-all"
          >
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">In-App Notifications</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Receive live alerts for group join requests, role promotions, and new album media
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notificationsEnabled}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound alert toggle */}
          <div
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-all"
          >
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Notification Audio Sounds</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Play an audio alert when new messages arrive in active group chat
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={soundEnabled}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                soundEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security & Active Session Card */}
      <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security & Active Session</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Cryptographic authentication and access control details</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm space-y-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 dark:text-slate-400">Authentication Protocol:</span>
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              JWT HTTP-Only Secure Cookie
            </span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400">Active User:</span>
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400">Access Control Model:</span>
            <span className="font-semibold text-slate-900 dark:text-white">Role-Based Access Control (RBAC)</span>
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
        message="Are you sure you want to disconnect Google Drive? You will not be able to upload new photos to your group albums until you reconnect your cloud account."
        confirmText="Disconnect Drive"
        danger
      />
    </div>
  );
}
