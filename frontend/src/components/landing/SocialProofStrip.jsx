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
    <div className="border-y border-[#D9E7F5] bg-white py-6">
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
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-[#0D1B3E] flex items-center gap-1.5">
                <span>Better memories, shared together.</span>
                <Sparkles className="w-4 h-4 text-[#2196F3]" />
              </p>
              <p className="text-xs text-[#536784]">
                Private groups built for families, travel crews, and creative teams.
              </p>
            </div>
          </div>

          {/* Memory collections tag pills */}
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
            {memoryTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#F5F9FF] border border-[#D9E7F5] text-[#1854A3] hover:border-[#64B5F6] transition-colors"
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
