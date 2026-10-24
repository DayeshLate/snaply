import React, { useState } from 'react';
import { Check, X, Shield, Clock } from 'lucide-react';
import { joinRequestService } from '../../services/joinRequestService';
import { getInitials, formatRelativeTime } from '../../utils/formatters';

export default function JoinRequestsSection({
  requests = [],
  onRequestHandled,
}) {
  const [items, setItems] = useState(requests);
  const [processingId, setProcessingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Synchronize state when requests prop changes
  React.useEffect(() => {
    setItems(requests);
  }, [requests]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = async (request, action) => {
    const prevItems = [...items];
    setProcessingId(request.id);

    // Optimistic UI removal
    setItems((curr) => curr.filter((r) => r.id !== request.id));

    try {
      if (action === 'accept') {
        await joinRequestService.acceptRequest(request.id);
        showToast(`Accepted ${request.userName || request.user?.name || 'Member'} into ${request.groupName || 'Circle'}`);
      } else {
        await joinRequestService.rejectRequest(request.id);
        showToast(`Declined request for ${request.groupName || 'Circle'}`);
      }
      setProcessingId(null);
      if (onRequestHandled) onRequestHandled();
    } catch (err) {
      // Rollback on failure!
      setItems(prevItems);
      setProcessingId(null);
      showToast(`Action failed. Rolled back state.`);
    }
  };

  if (!items || items.length === 0) {
    return null; // Role-based UI: Hide controls/section when user has no pending owner requests
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-[0.16em] text-white/50">
            Owner Review
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BF0]" />
          <span className="text-xs font-mono text-white/40 num-tabular">
            ({items.length} pending)
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-[#1A1D28] border border-white/[0.1] text-xs text-white flex items-center justify-between transition-all">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/40 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] divide-y divide-white/[0.06] overflow-hidden">
        {items.map((req) => {
          const name = req.userName || req.user?.name || 'New Member';
          const email = req.userEmail || req.user?.email || 'request@user.com';
          const groupName = req.groupName || req.group?.name || 'Private Circle';
          const isBusy = processingId === req.id;

          return (
            <div
              key={req.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
            >
              {/* Member details & requested group */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-[10px] bg-[#1A1D28] border border-white/[0.1] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {getInitials(name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {name}
                    </p>
                    <span className="text-[10px] font-mono text-white/40 truncate">
                      ({email})
                    </span>
                  </div>
                  <p className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
                    <span>Requested to join:</span>
                    <strong className="text-white/80 font-medium">{groupName}</strong>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-white/40">
                      {formatRelativeTime(req.createdAt || new Date())}
                    </span>
                  </p>
                </div>
              </div>

              {/* Accept / Reject actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => handleAction(req, 'reject')}
                  disabled={isBusy}
                  className="px-3 py-1.5 rounded-[10px] border border-white/[0.1] hover:bg-white/[0.06] active:bg-white/[0.1] text-white/70 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleAction(req, 'accept')}
                  disabled={isBusy}
                  className="px-3.5 py-1.5 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4ED9] active:bg-[#4343C7] text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-40"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

