import React from 'react';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export default function NotificationItem({ notification, onMarkAsRead }) {
  return (
    <div
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
      className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 ${
        notification.isRead
          ? 'bg-white border-[#E2E8F0] text-[#64748B]'
          : 'bg-blue-50/50 border-[#2563EB]/30 text-[#0F172A] shadow-2xs'
      }`}
    >
      <div className={`p-2 rounded-full shrink-0 mt-0.5 ${notification.isRead ? 'bg-slate-100 text-[#64748B]' : 'bg-[#DBEAFE] text-[#2563EB]'}`}>
        <Bell className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold truncate text-[#0F172A]">
            {notification.title}
          </h4>
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
          )}
        </div>
        <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
          {notification.message}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-2">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeTime(notification.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
