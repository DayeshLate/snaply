import React from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';
import { formatRelativeTime, getInitials } from '../../utils/formatters';

export default function MessageBubble({
  message,
  isSelf = false,
  onDelete,
  canDelete = false,
}) {
  return (
    <div className={`flex items-start gap-3 max-w-[85%] sm:max-w-[70%] group ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {message.senderProfilePicture ? (
        <img
          src={message.senderProfilePicture}
          alt={message.senderName || 'Sender'}
          className="w-8 h-8 rounded-xl object-cover shrink-0 mt-1 border border-slate-200 dark:border-slate-700 shadow-xs"
        />
      ) : (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-1 shadow-xs">
          {getInitials(message.senderName || 'User')}
        </div>
      )}

      {/* Content Box */}
      <div className="flex flex-col">
        {!isSelf && (
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1.5">
            {message.senderName || message.senderEmail || 'Member'}
          </span>
        )}

        <div
          className={`p-3.5 rounded-2xl text-sm relative shadow-sm ${
            isSelf
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-tr-xs shadow-blue-500/15'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs'
          }`}
        >
          {/* Media attachment preview if present */}
          {message.mediaId && (
            <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 bg-black/10">
              <a
                href={message.media?.fileUrl || `/media/stream/${message.mediaId}`}
                target="_blank"
                rel="noreferrer"
                className="block hover:opacity-95 transition-opacity"
              >
                <img
                  src={message.media?.fileUrl || `/media/stream/${message.mediaId}`}
                  alt={message.mediaFileName || 'Attachment'}
                  className="max-h-48 w-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </a>
              {message.mediaFileName && (
                <div className={`p-2 text-xs flex items-center gap-1.5 font-medium ${isSelf ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{message.mediaFileName}</span>
                </div>
              )}
            </div>
          )}

          {/* Text Message */}
          {message.message && (
            <p className="whitespace-pre-wrap break-words leading-relaxed font-normal">{message.message}</p>
          )}

          {/* Timestamp and Delete Action */}
          <div className={`flex items-center justify-end gap-2 mt-1.5 text-[10px] font-medium ${isSelf ? 'text-blue-200' : 'text-slate-400'}`}>
            <span>{formatRelativeTime(message.createdAt)}</span>
            {canDelete && (
              <button
                onClick={() => onDelete && onDelete(message.id)}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer ${
                  isSelf ? 'hover:text-red-200' : 'hover:text-rose-500'
                }`}
                title="Delete message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
