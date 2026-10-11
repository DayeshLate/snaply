import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { MessageSquare } from 'lucide-react';

export default function MessageList({
  messages = [],
  currentUserId,
  onDeleteMessage,
  isGroupAdmin = false,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#64748B]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
          <MessageSquare className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-[#0F172A]">No messages yet</p>
        <p className="text-xs text-[#64748B] mt-0.5">Start the conversation with your group members!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        const isSelf = msg.senderId === currentUserId;
        const canDelete = isSelf || isGroupAdmin;
        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            isSelf={isSelf}
            onDelete={onDeleteMessage}
            canDelete={canDelete}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
