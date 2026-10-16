import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderLock,
  ImageIcon,
  Users,
  HardDrive,
  ArrowUpRight,
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
      title: 'Total Albums',
      value: albumCount,
      detail: 'Organized memory folders',
      icon: FolderLock,
      link: '/albums',
      gradient: 'from-blue-600 to-indigo-600',
      shadowColor: 'shadow-blue-500/20',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20',
      borderAccent: 'border-l-4 border-l-blue-500',
    },
    {
      id: 'media',
      title: 'Photos & Videos',
      value: mediaCount,
      detail: 'High-res cloud assets',
      icon: ImageIcon,
      link: '/shared',
      gradient: 'from-purple-600 to-pink-600',
      shadowColor: 'shadow-purple-500/20',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
      borderAccent: 'border-l-4 border-l-purple-500',
    },
    {
      id: 'groups',
      title: 'Shared Groups',
      value: groupCount,
      detail: 'Active member circles',
      icon: Users,
      link: '/groups',
      gradient: 'from-cyan-500 to-blue-600',
      shadowColor: 'shadow-cyan-500/20',
      iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
      borderAccent: 'border-l-4 border-l-cyan-500',
    },
    {
      id: 'storage',
      title: 'Google Drive Sync',
      isCustom: true,
      detail: isDriveLinked ? 'OAuth Cloud Synchronized' : 'Connect drive in settings',
      icon: HardDrive,
      link: '/settings',
      gradient: isDriveLinked ? 'from-emerald-500 to-teal-600' : 'from-amber-500 to-orange-500',
      shadowColor: isDriveLinked ? 'shadow-emerald-500/20' : 'shadow-amber-500/20',
      iconBg: isDriveLinked
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      borderAccent: isDriveLinked ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className={`group relative bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 ${stat.borderAccent} p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-1">
                {stat.isCustom ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isDriveLinked ? 'Connected' : 'Unlinked'}
                      </span>
                      {isDriveLinked ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                      {stat.detail}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {loading ? (
                        <span className="inline-block w-10 h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                      ) : (
                        <AnimatedCounter targetValue={stat.value} />
                      )}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                      {stat.detail}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <Link
                to={stat.link}
                className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
              >
                <span>View details</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
