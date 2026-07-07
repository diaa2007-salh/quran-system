import { cn } from "@/lib/utils";
import { ATTENDANCE_STATUS_LABELS } from "@/lib/utils";
import type { AttendanceStatus } from "@prisma/client";

const STYLES: Record<AttendanceStatus, string> = {
  PRESENT: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  ABSENT: "bg-red-50 text-red-700 ring-1 ring-red-200",
  LATE: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

export function StatusBadge({ status }: { status: AttendanceStatus | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 ring-1 ring-gray-200">
        لم يُسجَّل
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        STYLES[status]
      )}
    >
      {ATTENDANCE_STATUS_LABELS[status]}
    </span>
  );
}
