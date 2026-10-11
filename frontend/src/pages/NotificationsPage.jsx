import React, { useState, useEffect, useMemo } from 'react';
import { Bell, CheckCheck, RefreshCw, Filter, Sparkles } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useToast } from '../context/ToastContext';

import NotificationItem from '../components/notifications/NotificationItem';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function NotificationsPage() {
  const { success, error: showError } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [filter, setFilter] = useState('ALL'); // 'ALL' or 'UNREAD'

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAll();
      setNotifications(data || []);
    } catch (err) {
      showError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      showError(err.message || 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      success('All notifications marked as read');
    } catch (err) {
      showError(err.message || 'Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const displayedNotifications = useMemo(() => {
    if (filter === 'UNREAD') {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, filter]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            <Bell className="w-7 h-7 text-[#2563EB]" />
            Notifications
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Stay updated with group join requests, approvals, and shared activities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={fetchNotifications}
            title="Refresh"
            className="p-2"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {unreadCount > 0 && (
            <Button
              variant="secondary"
              onClick={handleMarkAllAsRead}
              loading={markingAll}
              className="flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'ALL'
              ? 'bg-[#2563EB] text-white'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            filter === 'UNREAD'
              ? 'bg-[#2563EB] text-white'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filter === 'UNREAD'
                  ? 'bg-white text-[#2563EB]'
                  : 'bg-[#2563EB] text-white'
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Loading notifications..." />
        </div>
      ) : displayedNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'UNREAD' ? 'No unread notifications' : 'No notifications yet'}
          description={
            filter === 'UNREAD'
              ? "You're all caught up! You have no unread notifications right now."
              : 'Notifications about group requests and updates will appear here.'
          }
        />
      ) : (
        <div className="space-y-3">
          {displayedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
