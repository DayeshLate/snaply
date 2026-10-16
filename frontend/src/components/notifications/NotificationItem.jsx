import React from 'react';
import { Bell, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export default function NotificationItem({ notification, onMarkAsRead }) {
  return (
    <div
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
      className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
        notification.isRead
          ? 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400'
          : 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-500/30 text-slate-900 dark:text-white shadow-sm ring-1 ring-blue-500/10'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
          notification.isRead
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            : 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
        }`}
      >
        <Bell className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold truncate text-slate-900 dark:text-white">
            {notification.title}
          </h4>
          {!notification.isRead && (
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-cyan-400 shrink-0 ring-4 ring-blue-500/20 animate-pulse" />
          )}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
          {notification.message}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatRelativeTime(notification.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
