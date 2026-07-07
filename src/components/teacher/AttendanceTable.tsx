"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, X, Clock3, Loader2 } from "lucide-react";
import { markAttendance, type RosterStudent } from "@/lib/actions/attendance.actions";
import { cn, ATTENDANCE_STATUS_LABELS } from "@/lib/utils";
import type { AttendanceStatus } from "@prisma/client";

const STATUS_BUTTONS: {
  status: AttendanceStatus;
  icon: typeof Check;
  activeClass: string;
}[] = [
  { status: "PRESENT", icon: Check, activeClass: "bg-emerald-600 text-white" },
  { status: "LATE", icon: Clock3, activeClass: "bg-amber-500 text-white" },
  { status: "ABSENT", icon: X, activeClass: "bg-red-600 text-white" },
];

export function AttendanceTable({
  groupId,
  date,
  students,
}: {
  groupId: string;
  date: string;
  students: RosterStudent[];
}) {
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus | null>>(() =>
    Object.fromEntries(students.map((student) => [student.id, student.status]))
  );
  const [errorByStudent, setErrorByStudent] = useState<Record<string, string>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const summary = useMemo(() => {
    const values = Object.values(statuses);
    return {
      present: values.filter((s) => s === "PRESENT").length,
      absent: values.filter((s) => s === "ABSENT").length,
      late: values.filter((s) => s === "LATE").length,
      unmarked: values.filter((s) => !s).length,
    };
  }, [statuses]);

  function handleSetStatus(studentId: string, status: AttendanceStatus) {
    setPendingId(studentId);
    setErrorByStudent((prev) => ({ ...prev, [studentId]: "" }));

    startTransition(async () => {
      const result = await markAttendance({ studentId, groupId, date, status });

      if (result.success) {
        setStatuses((prev) => ({ ...prev, [studentId]: status }));
      } else {
        setErrorByStudent((prev) => ({
          ...prev,
          [studentId]: result.error ?? "حدث خطأ ما",
        }));
      }
      setPendingId(null);
    });
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryPill label="حاضر" value={summary.present} tone="text-emerald-700" />
        <SummaryPill label="متأخر" value={summary.late} tone="text-amber-700" />
        <SummaryPill label="غائب" value={summary.absent} tone="text-red-700" />
        <SummaryPill label="لم يُسجَّل" value={summary.unmarked} tone="text-ink-muted" />
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface-raised">
        <table className="w-full text-start text-sm">
          <thead className="bg-surface text-ink-muted">
            <tr>
              <th className="px-5 py-3 text-start font-medium">التلميذ</th>
              <th className="px-5 py-3 text-end font-medium">تسجيل الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((student) => {
              const currentStatus = statuses[student.id];
              const isRowPending = pendingId === student.id;

              return (
                <tr key={student.id}>
                  <td className="px-5 py-3 font-medium text-ink">
                    {student.fullName}
                    {errorByStudent[student.id] && (
                      <p className="mt-0.5 text-xs text-red-600">
                        {errorByStudent[student.id]}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {isRowPending && (
                        <Loader2 className="h-4 w-4 animate-spin text-ink-muted" />
                      )}
                      {STATUS_BUTTONS.map(({ status, icon: Icon, activeClass }) => (
                        <button
                          key={status}
                          type="button"
                          disabled={isRowPending}
                          onClick={() => handleSetStatus(student.id, status)}
                          title={ATTENDANCE_STATUS_LABELS[status]}
                          aria-pressed={currentStatus === status}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                            currentStatus === status
                              ? cn(activeClass, "border-transparent")
                              : "border-border bg-surface text-ink-muted hover:bg-surface-raised"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}

            {students.length === 0 && (
              <tr>
                <td colSpan={2} className="px-5 py-10 text-center text-ink-muted">
                  لا يوجد تلاميذ في هذا الفوج حتى الآن
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-card border border-border bg-surface-raised p-3 text-center">
      <p className={`font-display text-2xl font-bold ${tone}`}>{value}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}
