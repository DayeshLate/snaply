import React from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';
import Button from '../common/Button';
import { formatRelativeTime } from '../../utils/formatters';

export default function JoinRequestCard({
  request,
  onAccept,
  onReject,
  loading = false,
}) {
  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
          U
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            User #{request.userId}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Requested {formatRelativeTime(request.requestAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end sm:self-auto">
        <Button
          variant="outline"
          size="sm"
          icon={UserX}
          disabled={loading}
          onClick={() => onReject(request.id)}
        >
          Reject
        </Button>
        <Button
          size="sm"
          icon={UserCheck}
          disabled={loading}
          onClick={() => onAccept(request.id)}
          variant="primary"
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
