import React from 'react';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  HardDrive,
  MessageSquare,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/formatters';

export default function RecentActivity({
  recentMedia = [],
  groups = [],
  messages = [],
  onSelectPhoto,
  driveStatus = null,
}) {
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
      iconColor: 'text-blue-600 dark:text-cyan-400',
      iconBg: 'bg-blue-500/10 border border-blue-500/20',
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
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500/10 border border-purple-500/20',
      target: '/messages',
    });
  });

  // Add drive status activity
  if (driveStatus?.connected) {
    activityItems.push({
      id: 'drive-sync',
      type: 'system',
      title: 'Google Drive Storage Active',
      subtext: 'Photos backing up in full resolution with OAuth security',
      timestamp: new Date().toISOString(),
      icon: HardDrive,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 border border-emerald-500/20',
      target: '/settings',
    });
  }

  // Fallback
  if (activityItems.length === 0) {
    activityItems.push({
      id: 'welcome',
      type: 'system',
      title: 'Snaply Workspace Initialized',
      subtext: 'Your collaborative photo vault is ready for uploads',
      timestamp: new Date().toISOString(),
      icon: CheckCircle2,
      iconColor: 'text-blue-600 dark:text-cyan-400',
      iconBg: 'bg-blue-500/10 border border-blue-500/20',
      target: '/groups',
    });
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Recent Photos Reel */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Recent Uploads</span>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                Reel
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Recently shared photos and video memories
            </p>
          </div>
          <Link
            to="/shared"
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>View vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentMedia.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
            <UploadCloud className="w-9 h-9 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No media uploads recorded yet. Upload a photo in any group album to begin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {recentMedia.slice(0, 4).map((photo, idx) => {
              const streamUrl = photo.fileUrl || `/media/stream/${photo.id}`;
              return (
                <motion.div
                  key={photo.id || idx}
                  whileHover={{ y: -3, scale: 1.03 }}
                  onClick={() => onSelectPhoto && onSelectPhoto(photo, idx)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={streamUrl}
                    alt={photo.fileName}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <p className="text-xs font-bold truncate leading-tight">
                      {photo.fileName}
                    </p>
                    <p className="text-[10px] text-slate-300 truncate mt-0.5">
                      {formatRelativeTime(photo.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Activity Stream */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Activity Stream</span>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </h3>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800/80 shadow-sm overflow-hidden">
          {activityItems.slice(0, 4).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id || idx}
                className="p-4 flex items-start gap-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
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
