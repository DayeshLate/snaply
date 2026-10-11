import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Search,
  ChevronLeft,
  RefreshCw,
  Send,
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

      // Poll messages every 3 seconds
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
    <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden h-[calc(100vh-8rem)] flex">
      {/* Left Sidebar: Groups List */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-[#E2E8F0] flex flex-col h-full bg-slate-50/50 ${
          showChatMobile ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Search header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#2563EB]" />
              Group Messages
            </h2>
            <button
              onClick={loadGroups}
              title="Refresh groups"
              className="p-1 text-[#64748B] hover:text-[#0F172A] rounded cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchGroup}
              onChange={(e) => setSearchGroup(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 rounded text-xs text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Group item list */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0]">
          {loadingGroups ? (
            <div className="p-8 flex justify-center">
              <Loader text="Loading groups..." />
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="p-8 text-center text-[#64748B] text-xs">
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
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 border-l-4 border-l-[#2563EB]'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {getInitials(g.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">
                        {g.name}
                      </p>
                    </div>
                    <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-[#2563EB]" />
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
        className={`flex-1 flex flex-col h-full bg-white ${
          !showChatMobile ? 'hidden md:flex' : 'flex'
        }`}
      >
        {selectedGroup ? (
          <>
            {/* Header */}
            <div className="flex items-center border-b border-[#E2E8F0]">
              <button
                onClick={() => setShowChatMobile(false)}
                className="md:hidden p-3 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
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
