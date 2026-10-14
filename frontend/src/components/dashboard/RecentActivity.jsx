import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Image as ImageIcon,
  HardDrive,
  Users,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatRelativeTime, formatDate } from '../../utils/formatters';

export default function RecentActivity({
  recentMedia = [],
  groups = [],
  messages = [],
  onSelectPhoto,
  driveStatus = null,
}) {
  // Synthesize realistic timeline items from real data
  const activityItems = [];

  // Add recent media uploads
  recentMedia.slice(0, 4).forEach((m) => {
    activityItems.push({
      id: `media-${m.id}`,
      type: 'upload',
      title: `${m.uploadedByName || 'Member'} uploaded "${m.fileName || 'a new photo'}"`,
      subtext: m.folderName ? `Destination: ${m.folderName}` : 'Uploaded to shared vault',
      timestamp: m.createdAt,
      icon: ImageIcon,
      iconColor: 'text-[#2563EB] dark:text-[#38BDF8]',
      iconBg: 'bg-[#EFF6FF] dark:bg-[#132238] border border-[#BFDBFE] dark:border-[#1E3A5F]',
      target: `/shared`,
      mediaItem: m,
    });
  });

  // Add recent messages if available
  messages.slice(0, 2).forEach((msg) => {
    activityItems.push({
      id: `msg-${msg.id}`,
      type: 'message',
      title: `${msg.senderName || 'Member'} posted a message`,
      subtext: `"${msg.message?.slice(0, 50) || 'Shared a memory...'}"`,
      timestamp: msg.createdAt,
      icon: MessageSquare,
      iconColor: 'text-[#6366F1] dark:text-[#818CF8]',
      iconBg: 'bg-[#EEF2FF] dark:bg-[#181E3B] border border-[#C7D2FE] dark:border-[#2E365E]',
      target: '/messages',
    });
  });

  // Add group / drive status activity
  if (driveStatus?.connected) {
    activityItems.push({
      id: 'drive-sync',
      type: 'system',
      title: 'Google Drive Storage Engine Active',
      subtext: 'Photos backing up in full resolution with OAuth security',
      timestamp: new Date().toISOString(),
      icon: HardDrive,
      iconColor: 'text-[#10B981] dark:text-[#34D399]',
      iconBg: 'bg-[#ECFDF5] dark:bg-[#0D281E] border border-[#A7F3D0] dark:border-[#134E35]',
      target: '/settings',
    });
  }

  // Fallback items if activity is fresh
  if (activityItems.length === 0) {
    activityItems.push(
      {
        id: 'welcome',
        type: 'system',
        title: 'Snaply Workspace Initialized',
        subtext: 'Your collaborative photo vault is ready for uploads',
        timestamp: new Date().toISOString(),
        icon: CheckCircle2,
        iconColor: 'text-[#2563EB] dark:text-[#38BDF8]',
        iconBg: 'bg-[#EFF6FF] dark:bg-[#132238] border border-[#BFDBFE] dark:border-[#1E3A5F]',
        target: '/groups',
      }
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Recent Photos Reel */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
              <span>Recent Uploads</span>
              <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-slate-100 dark:bg-[#152338] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1F2D40]">
                REEL
              </span>
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Recently shared photos and video memories
            </p>
          </div>
          <Link
            to="/shared"
            className="text-xs font-semibold text-[#2563EB] dark:text-[#38BDF8] hover:underline flex items-center gap-1"
          >
            <span>View vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentMedia.length === 0 ? (
          <div className="p-8 rounded-sm bg-white dark:bg-[#0E1724] border border-[#E2E8F0] dark:border-[#1F2D40] text-center">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
              No media uploads recorded yet. Upload a photo in any group album to begin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentMedia.slice(0, 4).map((photo, idx) => {
              const streamUrl = photo.fileUrl || `/media/stream/${photo.id}`;
              return (
                <motion.div
                  key={photo.id || idx}
                  whileHover={{ y: -3, scale: 1.02 }}
                  onClick={() => onSelectPhoto && onSelectPhoto(photo, idx)}
                  className="group relative aspect-square rounded-sm overflow-hidden bg-slate-900 border border-[#CBD5E1] dark:border-[#1F2D40] hover:border-[#2563EB] dark:hover:border-[#38BDF8] shadow-2xs cursor-pointer"
                >
                  <img
                    src={streamUrl}
                    alt={photo.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <p className="text-[11px] font-semibold truncate leading-tight">
                      {photo.fileName}
                    </p>
                    <p className="text-[9px] font-mono text-slate-300 truncate">
                      {formatRelativeTime(photo.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Technical Activity Stream */}
      <div className="lg:col-span-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
            <span>Activity Stream</span>
            <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-emerald-50 dark:bg-[#0D281E] text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-[#134E35] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </h3>
          <span className="font-mono text-[11px] text-[#94A3B8]">
            FEED // 01
          </span>
        </div>

        <div className="bg-white dark:bg-[#0E1724] border border-[#E2E8F0] dark:border-[#1F2D40] rounded-sm divide-y divide-[#F1F5F9] dark:divide-[#162233] shadow-2xs overflow-hidden">
          {activityItems.slice(0, 4).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id || idx}
                className="p-3.5 flex items-start gap-3 hover:bg-slate-50/80 dark:hover:bg-[#121D2C] transition-colors"
              >
                <div className={`w-8 h-8 rounded-sm ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
                      {item.title}
                    </p>
                    <span className="font-mono text-[10px] text-[#94A3B8] dark:text-[#64748B] shrink-0">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate mt-0.5">
                    {item.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

