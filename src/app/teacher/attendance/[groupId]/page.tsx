import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getGroupRosterForDate } from "@/lib/actions/attendance.actions";
import { AttendanceTable } from "@/components/teacher/AttendanceTable";
import { formatDateArabic, parseDateOnly, toDateInputValue } from "@/lib/utils";

export default async function TeacherAttendancePage({
  params,
  searchParams,
}: {
  params: Promise<{ groupId: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { groupId } = await params;
  const { date } = await searchParams;
  const selectedDate = date || toDateInputValue();

  const roster = await getGroupRosterForDate(groupId, selectedDate);

  if (!roster) {
    return (
      <div className="rounded-card border border-dashed border-border p-10 text-center text-ink-muted">
        لم يتم العثور على هذا الفوج، أو لا تملك صلاحية الوصول إليه.
        <br />
        <Link href="/teacher" className="mt-2 inline-block text-primary hover:underline">
          الرجوع إلى أفواجي
        </Link>
      </div>
    );
  }

  const dayObject = parseDateOnly(selectedDate);
  const previousDay = new Date(dayObject);
  previousDay.setUTCDate(previousDay.getUTCDate() - 1);
  const nextDay = new Date(dayObject);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  return (
    <div>
      <header className="mb-2">
        <Link href="/teacher" className="text-sm text-primary hover:underline">
          ← الرجوع إلى أفواجي
        </Link>
      </header>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            تسجيل حضور: {roster.name}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">{formatDateArabic(dayObject)}</p>
        </div>

        <div className="flex items-center gap-2">
          <DateLinkButton groupId={groupId} date={toDateInputValue(previousDay)}>
            <ChevronRight className="h-4 w-4" />
          </DateLinkButton>

          <form action={`/teacher/attendance/${groupId}`} className="flex items-center gap-2">
            <input
              type="date"
              name="date"
              defaultValue={selectedDate}
              className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-ink"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              عرض
            </button>
          </form>

          <DateLinkButton groupId={groupId} date={toDateInputValue(nextDay)}>
            <ChevronLeft className="h-4 w-4" />
          </DateLinkButton>
        </div>
      </div>

      <AttendanceTable groupId={groupId} date={selectedDate} students={roster.students} />
    </div>
  );
}

function DateLinkButton({
  groupId,
  date,
  children,
}: {
  groupId: string;
  date: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/teacher/attendance/${groupId}?date=${date}`}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-raised text-ink-muted hover:bg-surface"
    >
      {children}
    </Link>
  );
}
