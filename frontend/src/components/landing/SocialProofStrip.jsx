import React from 'react';
import { Users, Sparkles, FolderHeart } from 'lucide-react';
import { motion } from 'framer-motion';
import { SOCIAL_AVATARS } from './landingData';

export default function SocialProofStrip() {
  const memoryTags = [
    'Summer Roadtrips',
    'Family Archives',
    'Studio Offsites',
    'Weekend Getaways',
    'Annual Reunions',
  ];

  return (
    <div className="border-y border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Avatar stack & Statement */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {SOCIAL_AVATARS.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar.src}
                  alt={avatar.name}
                  title={avatar.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Better memories, shared together.</span>
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Private groups built for families, travel crews, and creative teams.
              </p>
            </div>
          </div>

          {/* Memory collections tag pills */}
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
            {memoryTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-2xs cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
