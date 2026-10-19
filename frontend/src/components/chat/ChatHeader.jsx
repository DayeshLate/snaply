import React from 'react';
import { MessageSquare, Users } from 'lucide-react';

export default function ChatHeader({ group, memberCount = 0 }) {
  return (
    <div className="p-4 sm:p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{group?.name || 'Group'} Chat</h4>
          <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium mt-0.5">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              {memberCount} members
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live channel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
