import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Hash, ChevronDown, ArrowDown, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { groupService } from '../../services/groupService';
import { stompService } from '../../services/stompClient';
import { formatTime, getInitials } from '../../utils/formatters';

export default function ChatPanel({
  isOpen = true,
  onClose,
  activeGroupId = null,
}) {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(activeGroupId);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollContainerRef = useRef(null);
  const endMarkerRef = useRef(null);

  // Load available groups for chat channels
  useEffect(() => {
    let active = true;
    groupService.getAllGroups().then((res) => {
      if (active && res && res.length > 0) {
        setGroups(res);
        if (!selectedGroupId) {
          setSelectedGroupId(res[0].id);
        }
      }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (activeGroupId) {
      setSelectedGroupId(activeGroupId);
    }
  }, [activeGroupId]);

  // Load initial group messages
  const loadMessages = useCallback(async (gId) => {
    if (!gId) return;
    try {
      const data = await messageService.getGroupMessages(gId);
      setMessages(data || []);
      // Scroll to bottom on initial load
      setTimeout(() => {
        endMarkerRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 50);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      loadMessages(selectedGroupId);
    }
  }, [selectedGroupId, loadMessages]);

  // Subscribe over STOMP for live messages
  useEffect(() => {
    if (!selectedGroupId) return;

    stompService.connect();
    const destination = `/topic/group/${selectedGroupId}`;

    const sub = stompService.subscribe(destination, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);

      // If user scrolled up, increment unread and show pill
      if (hasScrolledUp) {
        setUnreadCount((c) => c + 1);
      } else {
        setTimeout(() => {
          endMarkerRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [selectedGroupId, hasScrolledUp]);

  // Handle scroll detection in the messages container
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 60;
    setHasScrolledUp(!isAtBottom);
    if (isAtBottom) {
      setUnreadCount(0);
    }
  };

  const scrollToBottom = () => {
    endMarkerRef.current?.scrollIntoView({ behavior: 'smooth' });
    setHasScrolledUp(false);
    setUnreadCount(0);
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedGroupId) return;

    const newMsg = {
      id: Date.now(),
      groupId: selectedGroupId,
      content: inputText.trim(),
      senderId: user?.id,
      senderName: user?.name || 'You',
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI append
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Publish via STOMP
    stompService.publish({
      destination: `/app/chat.sendMessage`,
      body: newMsg,
    });

    setTimeout(() => {
      endMarkerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    // Simulate occasional buddy reply in mock mode
    if (Math.random() > 0.4) {
      setTimeout(() => setIsTyping(true), 1200);
      setTimeout(() => {
        setIsTyping(false);
        const replyMsg = {
          id: Date.now() + 1,
          groupId: selectedGroupId,
          content: 'Just uploaded new raw files to the album!',
          senderId: 999,
          senderName: 'Marcus',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, replyMsg]);
        if (!hasScrolledUp) {
          endMarkerRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 3200);
    }
  };

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <aside
      className={`w-[340px] h-screen bg-[#12141C] border-l border-white/[0.08] flex flex-col justify-between shrink-0 select-none transition-all duration-300 relative z-30 ${
        isOpen ? 'flex' : 'hidden'
      }`}
    >
      {/* Header with Channel Picker */}
      <div className="h-16 px-4 border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/60">
            <Hash className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white truncate max-w-[170px]">
                {selectedGroup ? selectedGroup.name : 'Select Circle'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" title="Channel connected" />
            </div>
            <span className="text-[10px] text-white/40 block font-mono">
              STOMP Channel
            </span>
          </div>
        </div>

        {/* Close Button on Chat Sidebar */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close circle chat sidebar"
            className="p-1.5 rounded-[8px] text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Close chat sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Message Stream Area (Independently Scrolling) */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        aria-live="polite"
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar relative"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-white/40">
            <MessageSquare className="w-8 h-8 mx-auto text-white/20" />
            <p className="text-xs font-medium text-white/60">No messages in this circle</p>
            <p className="text-[11px] leading-relaxed max-w-[200px]">
              Chat in real-time with circle members about shared albums.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.senderId === user?.id || msg.senderName === 'You' || msg.senderName === user?.name;
            const isFirstFromSender = idx === 0 || messages[idx - 1].senderId !== msg.senderId;
            const showUnreadDivider = idx === Math.max(0, messages.length - 2);

            return (
              <React.Fragment key={msg.id || idx}>
                {showUnreadDivider && (
                  <div className="flex items-center gap-2 my-3">
                    <div className="h-px bg-white/[0.08] flex-1" />
                    <span className="text-[9px] font-mono tracking-wider uppercase text-[#5B5BF0] bg-[#12141C] px-2 py-0.5 rounded-full border border-[#5B5BF0]/30">
                      Unread
                    </span>
                    <div className="h-px bg-white/[0.08] flex-1" />
                  </div>
                )}

                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} space-y-1`}>
                  {!isOwn && isFirstFromSender && (
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-white/50 pl-1">
                      <span>{msg.senderName}</span>
                      <span className="text-[9px] text-white/30 font-mono">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-[14px] px-3.5 py-2 text-xs leading-relaxed break-words ${
                      isOwn
                        ? 'bg-[#1E2232] border border-white/[0.1] text-white self-end'
                        : 'bg-[#161822] border border-white/[0.06] text-white/90 self-start'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {isOwn && (
                    <span className="text-[9px] font-mono text-white/30 pr-1">
                      {formatTime(msg.createdAt)}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-white/50 pl-1 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse delay-100" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse delay-200" />
            <span className="text-[11px] font-mono">Marcus is typing...</span>
          </div>
        )}

        <div ref={endMarkerRef} className="h-1" />
      </div>

      {/* Floating "New Messages" Pill Button */}
      {hasScrolledUp && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={scrollToBottom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1D28] border border-white/[0.14] text-white text-xs font-medium shadow-xl hover:bg-[#222736] transition-all cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#5B5BF0]" />
            <span>New messages</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#5B5BF0] text-white font-mono text-[9px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Message Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-white/[0.08] bg-[#0E1017] flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message #${selectedGroup ? selectedGroup.name : 'channel'}...`}
          className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-[#5B5BF0] rounded-[10px] px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          aria-label="Send message"
          className="w-8 h-8 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] disabled:opacity-40 disabled:hover:bg-[#5B5BF0] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
}

