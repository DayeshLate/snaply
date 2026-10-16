import React, { useState, useEffect } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { groupService } from '../services/groupService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import GroupCard from '../components/groups/GroupCard';
import GroupFormModal from '../components/groups/GroupFormModal';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

export default function GroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupService.getAllGroups();
      setGroups(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const filteredGroups = groups.filter((g) =>
    g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Group Workspaces
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Spaces where your circles collaborate on photos and albums
              </p>
            </div>
          </div>
        </div>

        <Button icon={Plus} onClick={() => setCreateModalOpen(true)} variant="primary">
          Create Group
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Search groups by name or description..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadGroups} />
      ) : filteredGroups.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchQuery ? 'No matching groups' : 'No groups yet'}
          description={
            searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Create your first group to start inviting members and sharing albums.'
          }
          actionText={!searchQuery ? 'Create Group' : undefined}
          onAction={!searchQuery ? () => setCreateModalOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <GroupFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => loadGroups()}
      />
    </div>
  );
}
