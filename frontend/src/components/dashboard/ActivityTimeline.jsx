import React from 'react';
import { Upload, Users, FolderLock, MessageSquare, Clock } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

function formatDayLabel(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ActivityTimeline({
  media = [],
  groups = [],
  messages = [],
}) {
  // Aggregate activities into unified timeline
  const activities = [];

  // Media upload activities
  media.forEach((m) => {
    activities.push({
      id: `media-${m.id || m.fileName}`,
      type: 'media',
      title: `${m.uploadedByName || m.uploaderName || 'Someone'} uploaded "${m.fileName}"`,
      subtext: m.groupName || m.folderName || 'Vault Archive',
      timestamp: m.createdAt || new Date().toISOString(),
      icon: Upload,
    });
  });

  // Group join activities
  groups.forEach((g) => {
    activities.push({
      id: `group-${g.id}`,
      type: 'group',
      title: `Created circle "${g.name}"`,
      subtext: `${g.groupMembers?.length || 1} members active`,
      timestamp: g.createdAt || new Date().toISOString(),
      icon: Users,
    });
  });

  // Message chat activities
  messages.slice(0, 5).forEach((msg) => {
    activities.push({
      id: `msg-${msg.id}`,
      type: 'message',
      title: `${msg.senderName || 'Member'}: "${msg.content}"`,
      subtext: msg.groupName || 'Chat Stream',
      timestamp: msg.createdAt || new Date().toISOString(),
      icon: MessageSquare,
    });
  });

  // Sort descending by timestamp
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Group by day label
  const groupedByDay = activities.slice(0, 12).reduce((acc, act) => {
    const day = formatDayLabel(act.timestamp);
    if (!acc[day]) acc[day] = [];
    acc[day].push(act);
    return acc;
  }, {});

  const dayKeys = Object.keys(groupedByDay);

  if (dayKeys.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/50">
            Activity Stream
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
        <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#12141C] text-center text-xs text-white/40">
          No recent activity recorded yet.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/50">
            Activity Timeline
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="text-xs font-mono text-white/40 num-tabular">
            ({activities.length} events)
          </span>
        </div>
      </div>

      {/* Timeline grouped by day with sticky day headers */}
      <div className="space-y-6">
        {dayKeys.length === 0 ? (
          <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#12141C] text-center space-y-1.5">
            <Clock className="w-6 h-6 text-white/30 mx-auto mb-1" />
            <p className="text-xs font-medium text-white/70">No activity yet</p>
            <p className="text-[11px] text-white/40">Upload photos or join a circle to see updates here.</p>
          </div>
        ) : (
          dayKeys.map((day) => (
          <div key={day} className="relative">
            {/* Sticky Day Label */}
            <div className="sticky top-0 z-10 bg-[#0B0C12]/95 backdrop-blur-xs py-2 mb-2 flex items-center gap-3">
              <span className="text-xs font-semibold text-white/80 tracking-wide">
                {day}
              </span>
              <div className="h-px bg-white/[0.08] flex-1" />
            </div>

            {/* Day Activity Items */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] divide-y divide-white/[0.06] overflow-hidden">
              {groupedByDay[day].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className="p-4 flex items-start gap-3.5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.08] text-white/70 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-white truncate">
                          {item.title}
                        </p>
                        <span className="text-[10px] font-mono text-white/40 shrink-0">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 truncate mt-0.5">
                        {item.subtext}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )))}
      </div>
    </section>
  );
}

