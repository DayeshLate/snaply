import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderLock,
  ImageIcon,
  Users,
  HardDrive,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function AnimatedCounter({ targetValue = 0 }) {
  return <span>{targetValue ?? 0}</span>;
}

export default function StatsOverview({
  albumCount = 0,
  mediaCount = 0,
  groupCount = 0,
  driveStatus = null,
  loading = false,
}) {
  const isDriveLinked = Boolean(driveStatus?.connected);

  const stats = [
    {
      id: 'albums',
      title: 'TOTAL ALBUMS',
      value: albumCount,
      detail: 'Organized memory collections',
      tag: 'ARCHIVES',
      icon: FolderLock,
      link: '/albums',
      color: 'blue',
      accentBorder: 'hover:border-[#2563EB] dark:hover:border-[#38BDF8]',
      accentBg: 'bg-[#EFF6FF] dark:bg-[#132238] text-[#2563EB] dark:text-[#38BDF8]',
    },
    {
      id: 'media',
      title: 'PHOTOS & VIDEOS',
      value: mediaCount,
      detail: 'High-res assets in cloud',
      tag: 'VAULT',
      icon: ImageIcon,
      link: '/shared',
      color: 'cyan',
      accentBorder: 'hover:border-[#0284C7] dark:hover:border-[#38BDF8]',
      accentBg: 'bg-[#F0F9FF] dark:bg-[#0C243B] text-[#0284C7] dark:text-[#38BDF8]',
    },
    {
      id: 'groups',
      title: 'SHARED GROUPS',
      value: groupCount,
      detail: 'Active member circles',
      tag: 'COLLAB',
      icon: Users,
      link: '/groups',
      color: 'indigo',
      accentBorder: 'hover:border-[#6366F1] dark:hover:border-[#818CF8]',
      accentBg: 'bg-[#EEF2FF] dark:bg-[#181E3B] text-[#6366F1] dark:text-[#818CF8]',
    },
    {
      id: 'storage',
      title: 'STORAGE ENGINE',
      isCustom: true,
      tag: isDriveLinked ? 'ONLINE' : 'ACTION',
      icon: HardDrive,
      link: '/settings',
      color: isDriveLinked ? 'emerald' : 'amber',
      accentBorder: isDriveLinked
        ? 'hover:border-[#10B981] dark:hover:border-[#34D399]'
        : 'hover:border-[#F59E0B] dark:hover:border-[#FBBF24]',
      accentBg: isDriveLinked
        ? 'bg-[#ECFDF5] dark:bg-[#0D281E] text-[#10B981] dark:text-[#34D399]'
        : 'bg-[#FFFBEB] dark:bg-[#2C210E] text-[#D97706] dark:text-[#FBBF24]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className={`group relative bg-white dark:bg-[#0E1724] border border-[#E2E8F0] dark:border-[#1F2D40] ${stat.accentBorder} p-5 rounded-sm shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
          >
            {/* Corner technical tick */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#CBD5E1] dark:border-[#2F4158] opacity-60 group-hover:border-[#2563EB] transition-colors" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[10px] tracking-wider font-semibold uppercase text-[#64748B] dark:text-[#64748B]">
                  {stat.title}
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-xs bg-slate-100 dark:bg-[#152338] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1F2D40]">
                  [{stat.tag}]
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                {stat.isCustom ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">
                        {isDriveLinked ? 'Connected' : 'Unlinked'}
                      </span>
                      {isDriveLinked ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                      {isDriveLinked ? 'Google Drive Cloud Sync' : 'Link Drive in Settings'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F1F5F9] font-mono tracking-tight">
                      {loading ? (
                        <span className="inline-block w-8 h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xs" />
                      ) : (
                        <AnimatedCounter targetValue={stat.value} />
                      )}
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                      {stat.detail}
                    </p>
                  </div>
                )}

                <div className={`w-10 h-10 rounded-sm ${stat.accentBg} flex items-center justify-center shrink-0 border border-current/20`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-[#F1F5F9] dark:border-[#162233] flex items-center justify-between text-xs">
              <Link
                to={stat.link}
                className="inline-flex items-center gap-1 font-semibold text-[#2563EB] dark:text-[#38BDF8] hover:underline"
              >
                <span>View details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <span className="font-mono text-[10px] text-[#94A3B8] dark:text-[#475569]">
                0{idx + 1} // METRIC
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

