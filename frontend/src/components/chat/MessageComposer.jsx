import React, { useState } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import Button from '../common/Button';

export default function MessageComposer({
  onSendMessage,
  loading = false,
  availableMedia = [],
}) {
  const [text, setText] = useState('');
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !selectedMediaId) return;

    onSendMessage({
      message: text.trim(),
      mediaId: selectedMediaId,
    });
    setText('');
    setSelectedMediaId(null);
    setShowMediaPicker(false);
  };

  const selectedMediaObj = availableMedia.find((m) => m.id === selectedMediaId);

  return (
    <div className="border-t border-[#E2E8F0] bg-white p-3">
      {/* Selected media badge */}
      {selectedMediaObj && (
        <div className="mb-2 flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-1.5 rounded text-xs text-[#1E3A8A]">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold">Attached photo:</span>
            <span className="truncate">{selectedMediaObj.fileName}</span>
          </div>
          <button
            onClick={() => setSelectedMediaId(null)}
            className="text-slate-500 hover:text-red-500 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Media Picker Dropdown / Selector */}
      {showMediaPicker && (
        <div className="mb-2 p-2 border border-[#E2E8F0] rounded bg-slate-50 max-h-36 overflow-y-auto">
          <p className="text-xs font-semibold text-[#0F172A] mb-1.5 px-1">Attach a group photo:</p>
          {availableMedia.length === 0 ? (
            <p className="text-xs text-[#64748B] px-1">No group photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {availableMedia.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMediaId(m.id);
                    setShowMediaPicker(false);
                  }}
                  className={`aspect-square rounded border overflow-hidden cursor-pointer hover:border-[#2563EB] transition-colors ${
                    selectedMediaId === m.id ? 'border-[#2563EB] ring-2 ring-[#2563EB]' : 'border-[#E2E8F0]'
                  }`}
                >
                  <img
                    src={`/media/stream/${m.id}`}
                    alt={m.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {availableMedia.length > 0 && (
          <button
            type="button"
            onClick={() => setShowMediaPicker(!showMediaPicker)}
            title="Attach group photo"
            className={`p-2 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer ${
              selectedMediaId ? 'text-[#2563EB] bg-blue-50' : ''
            }`}
          >
            <Paperclip className="w-5 h-5" />
          </button>
        )}

        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded border border-[#E2E8F0] px-3.5 py-2 text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />

        <Button
          type="submit"
          size="md"
          icon={Send}
          disabled={loading || (!text.trim() && !selectedMediaId)}
          loading={loading}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
