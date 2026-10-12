import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  FolderLock,
  HardDrive,
  Plus,
  ArrowRight,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../services/groupService';
import { folderService } from '../services/folderService';
import { driveService } from '../services/driveService';
import Button from '../components/common/Button';
import GroupCard from '../components/groups/GroupCard';
import AlbumCard from '../components/albums/AlbumCard';
import GroupFormModal from '../components/groups/GroupFormModal';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [folders, setFolders] = useState([]);
  const [driveStatus, setDriveStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [groupsData, foldersData, driveData] = await Promise.allSettled([
        groupService.getAllGroups(),
        folderService.getAllFolders(),
        driveService.getStatus(),
      ]);

      if (groupsData.status === 'fulfilled') {
        setGroups(groupsData.value || []);
      } else {
        console.error('Failed to load groups:', groupsData.reason);
        setError(groupsData.reason?.message || 'Failed to load groups');
      }
      if (foldersData.status === 'fulfilled') {
        setFolders(foldersData.value || []);
      }
      if (driveData.status === 'fulfilled') {
        setDriveStatus(driveData.value);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 text-xs font-semibold text-[#2563EB] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Hi, {user?.name || 'there'}!
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-xl">
            Here is a summary of your shared albums, recent group discussions, and storage activity.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            icon={Plus}
            onClick={() => setCreateGroupModalOpen(true)}
          >
            Create Group
          </Button>
          <Link to="/albums">
            <Button variant="outline">
              View Albums
            </Button>
          </Link>
        </div>
      </div>

      {/* Google Drive Status Notification Card */}
      {driveStatus && !driveStatus.connected && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-full shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900">
                Google Drive is not linked
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Connect your Google Drive account in settings to enable full-resolution photo uploads and album sync.
              </p>
            </div>
          </div>
          <Link to="/settings" className="shrink-0 self-start sm:self-auto">
            <Button size="sm" variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100">
              Link Drive
            </Button>
          </Link>
        </div>
      )}

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">My Groups</p>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">
              {loading ? <Skeleton className="h-8 w-12" /> : groups.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Total Albums</p>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">
              {loading ? <Skeleton className="h-8 w-12" /> : folders.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FolderLock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Cloud Storage</p>
            <p className="text-sm font-bold text-[#0F172A] mt-2 flex items-center gap-1.5">
              {driveStatus?.connected ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span className="text-[#16A34A]">Drive Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-600">Drive Unlinked</span>
                </>
              )}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 text-[#64748B] flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && <ErrorState message={error} onRetry={loadDashboardData} />}

      {/* My Groups Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A]">My Groups</h2>
          <Link to="/groups" className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        ) : groups.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No groups found"
            description="Create your first private group to invite friends and start sharing albums."
            actionText="Create Group"
            onAction={() => setCreateGroupModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.slice(0, 3).map((grp) => (
              <GroupCard
                key={grp.id}
                group={grp}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent Albums Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A]">Recent Albums</h2>
          <Link to="/albums" className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : folders.length === 0 ? (
          <EmptyState
            icon={FolderLock}
            title="No albums created yet"
            description="Albums are created inside groups to organize photos."
            actionText="Browse Groups"
            onAction={() => navigate('/groups')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {folders.slice(0, 4).map((f) => (
              <AlbumCard
                key={f.id}
                album={f}
                onClick={() => {
                  if (f.group?.id) {
                    navigate(`/groups/${f.group.id}?tab=albums`);
                  } else {
                    navigate('/albums');
                  }
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create Group Modal */}
      <GroupFormModal
        isOpen={createGroupModalOpen}
        onClose={() => setCreateGroupModalOpen(false)}
        onSuccess={() => loadDashboardData()}
      />
    </div>
  );
}
