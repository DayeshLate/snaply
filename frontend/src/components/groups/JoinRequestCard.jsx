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
    <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0">
          U
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">
            User #{request.userId}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Requested {formatRelativeTime(request.requestAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
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
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
