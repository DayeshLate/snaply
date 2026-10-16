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
    <div className="border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4">
      {/* Selected media badge */}
      {selectedMediaObj && (
        <div className="mb-3 flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3.5 py-2 rounded-xl text-xs text-blue-700 dark:text-blue-300">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold">Attached photo:</span>
            <span className="truncate">{selectedMediaObj.fileName}</span>
          </div>
          <button
            onClick={() => setSelectedMediaId(null)}
            className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Media Picker Dropdown / Selector */}
      {showMediaPicker && (
        <div className="mb-3 p-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/60 max-h-40 overflow-y-auto">
          <p className="text-xs font-bold text-slate-900 dark:text-white mb-2 px-1">Attach a group photo:</p>
          {availableMedia.length === 0 ? (
            <p className="text-xs text-slate-400 px-1">No group photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {availableMedia.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMediaId(m.id);
                    setShowMediaPicker(false);
                  }}
                  className={`aspect-square rounded-xl border overflow-hidden cursor-pointer hover:border-blue-500 transition-all ${
                    selectedMediaId === m.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <img
                    src={m.fileUrl || `/media/stream/${m.id}`}
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
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        {availableMedia.length > 0 && (
          <button
            type="button"
            onClick={() => setShowMediaPicker(!showMediaPicker)}
            title="Attach group photo"
            className={`p-2.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
              selectedMediaId ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/40' : ''
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
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-all font-medium"
        />

        <Button
          type="submit"
          size="md"
          icon={Send}
          disabled={loading || (!text.trim() && !selectedMediaId)}
          loading={loading}
          variant="primary"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
