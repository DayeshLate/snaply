import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Search,
  ChevronLeft,
  RefreshCw,
} from 'lucide-react';
import { groupService } from '../services/groupService';
import { messageService } from '../services/messageService';
import { mediaService } from '../services/mediaService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROLES } from '../constants/theme';
import { getInitials } from '../utils/formatters';

import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageComposer from '../components/chat/MessageComposer';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function MessagesPage() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [searchGroup, setSearchGroup] = useState('');

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [groupMedia, setGroupMedia] = useState([]);

  // Mobile navigation state
  const [showChatMobile, setShowChatMobile] = useState(false);

  // Load user groups
  const loadGroups = async () => {
    setLoadingGroups(true);
    try {
      const data = await groupService.getAllGroups();
      setGroups(data || []);

      const targetGroupId = searchParams.get('groupId');
      if (targetGroupId && data?.length > 0) {
        const found = data.find((g) => g.id.toString() === targetGroupId);
        if (found) {
          setSelectedGroup(found);
          setShowChatMobile(true);
        } else {
          setSelectedGroup(data[0]);
        }
      } else if (data?.length > 0 && !selectedGroup) {
        setSelectedGroup(data[0]);
      }
    } catch (err) {
      showError(err.message || 'Failed to load groups');
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // Fetch messages for selected group
  const fetchMessages = useCallback(
    async (isPolling = false) => {
      if (!selectedGroup) return;
      if (!isPolling) setLoadingMessages(true);

      try {
        const data = await messageService.getGroupMessages(selectedGroup.id);
        setMessages(data || []);
      } catch (err) {
        if (!isPolling) {
          showError(err.message || 'Failed to load messages');
        }
      } finally {
        if (!isPolling) setLoadingMessages(false);
      }
    },
    [selectedGroup]
  );

  // Fetch media for selected group to enable photo attachment
  const fetchGroupMedia = useCallback(async () => {
    if (!selectedGroup) return;
    try {
      const media = await mediaService.getAllMediaByGroup(selectedGroup.id);
      setGroupMedia(media || []);
    } catch {
      setGroupMedia([]);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      fetchMessages(false);
      fetchGroupMedia();

      const interval = setInterval(() => {
        fetchMessages(true);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedGroup, fetchMessages, fetchGroupMedia]);

  const handleSelectGroup = (g) => {
    setSelectedGroup(g);
    setSearchParams({ groupId: g.id });
    setShowChatMobile(true);
  };

  const handleSendMessage = async ({ message, mediaId }) => {
    if (!selectedGroup) return;
    setSending(true);
    try {
      const newMsg = await messageService.sendMessage(selectedGroup.id, {
        message,
        mediaId,
      });
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      showError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messageService.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      success('Message deleted');
    } catch (err) {
      showError(err.message || 'Failed to delete message');
    }
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchGroup.toLowerCase())
  );

  const isGroupAdmin =
    selectedGroup?.user?.id === user?.id ||
    selectedGroup?.role === ROLES.OWNER ||
    selectedGroup?.role === ROLES.ADMIN;

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden h-[calc(100vh-8rem)] flex">
      {/* Left Sidebar: Groups List */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-slate-200/80 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/40 ${
          showChatMobile ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Search header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span>Discussions</span>
            </h2>
            <button
              onClick={loadGroups}
              title="Refresh groups"
              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchGroup}
              onChange={(e) => setSearchGroup(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Group item list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {loadingGroups ? (
            <div className="p-8 flex justify-center">
              <Loader text="Loading groups..." />
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No groups found.
            </div>
          ) : (
            filteredGroups.map((g) => {
              const isSelected = selectedGroup?.id === g.id;
              const memberCount = g.members?.length || 1;
              return (
                <div
                  key={g.id}
                  onClick={() => handleSelectGroup(g)}
                  className={`p-4 flex items-center gap-3.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-500/10 border-l-4 border-l-blue-600 dark:border-l-cyan-400'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {getInitials(g.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {g.name}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                      <span>{memberCount} members</span>
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Chat Screen */}
      <div
        className={`flex-1 flex flex-col h-full bg-white/90 dark:bg-slate-900/90 ${
          !showChatMobile ? 'hidden md:flex' : 'flex'
        }`}
      >
        {selectedGroup ? (
          <>
            {/* Header */}
            <div className="flex items-center border-b border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => setShowChatMobile(false)}
                className="md:hidden p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title="Back to group list"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <ChatHeader
                  group={selectedGroup}
                  memberCount={selectedGroup.members?.length || 1}
                />
              </div>
            </div>

            {/* Messages */}
            {loadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader text="Loading messages..." />
              </div>
            ) : (
              <MessageList
                messages={messages}
                currentUserId={user?.id}
                onDeleteMessage={handleDeleteMessage}
                isGroupAdmin={isGroupAdmin}
              />
            )}

            {/* Composer */}
            <MessageComposer
              onSendMessage={handleSendMessage}
              loading={sending}
              availableMedia={groupMedia}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Select a Group"
              description="Choose a group from the left panel to join the conversation."
            />
          </div>
        )}
      </div>
    </div>
  );
}
