import React from 'react';
import { MessageSquare, Users, Radio } from 'lucide-react';

export default function ChatHeader({ group, memberCount = 0 }) {
  return (
    <div className="p-4 bg-white border-b border-[#E2E8F0] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#0F172A]">{group?.name || 'Group'} Chat</h4>
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#2563EB]" />
              {memberCount} members
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#16A34A]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              Live channel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
