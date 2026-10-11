import React from 'react';
import { Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { formatRelativeTime, getInitials } from '../../utils/formatters';

export default function MessageBubble({
  message,
  isSelf = false,
  onDelete,
  canDelete = false,
}) {
  return (
    <div className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%] group ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {message.senderProfilePicture ? (
        <img
          src={message.senderProfilePicture}
          alt={message.senderName || 'Sender'}
          className="w-7 h-7 rounded-full object-cover shrink-0 mt-1 border border-[#E2E8F0]"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
          {getInitials(message.senderName || 'User')}
        </div>
      )}

      {/* Content Box */}
      <div className="flex flex-col">
        {!isSelf && (
          <span className="text-[11px] font-semibold text-[#64748B] mb-0.5 ml-1">
            {message.senderName || message.senderEmail || 'Member'}
          </span>
        )}

        <div
          className={`p-3 rounded-lg text-sm relative shadow-2xs ${
            isSelf
              ? 'bg-[#2563EB] text-white rounded-tr-none'
              : 'bg-white text-[#0F172A] border border-[#E2E8F0] rounded-tl-none'
          }`}
        >
          {/* Media attachment preview if present */}
          {message.mediaId && (
            <div className="mb-2 rounded overflow-hidden border border-white/20 bg-black/10">
              <a
                href={`/media/stream/${message.mediaId}`}
                target="_blank"
                rel="noreferrer"
                className="block hover:opacity-95 transition-opacity"
              >
                <img
                  src={`/media/stream/${message.mediaId}`}
                  alt={message.mediaFileName || 'Attachment'}
                  className="max-h-48 w-full object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </a>
              {message.mediaFileName && (
                <div className={`p-1.5 text-xs flex items-center gap-1.5 ${isSelf ? 'text-blue-100' : 'text-[#64748B]'}`}>
                  <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{message.mediaFileName}</span>
                </div>
              )}
            </div>
          )}

          {/* Text Message */}
          {message.message && (
            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.message}</p>
          )}

          {/* Timestamp and Delete Action */}
          <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${isSelf ? 'text-blue-200' : 'text-[#64748B]'}`}>
            <span>{formatRelativeTime(message.createdAt)}</span>
            {canDelete && (
              <button
                onClick={() => onDelete && onDelete(message.id)}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer ${
                  isSelf ? 'hover:text-red-200' : 'hover:text-[#DC2626]'
                }`}
                title="Delete message"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
