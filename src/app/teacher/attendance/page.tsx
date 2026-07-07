import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";
import { getTeacherGroups } from "@/lib/actions/dashboard.actions";
import { toDateInputValue } from "@/lib/utils";

export default async function TeacherAttendanceEntryPage() {
  const groups = await getTeacherGroups();
  const today = toDateInputValue();

  // معلم لديه فوج واحد فقط → ننتقل مباشرة لصفحة تسجيل حضوره
  if (groups.length === 1) {
    redirect(`/teacher/attendance/${groups[0].id}?date=${today}`);
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">تسجيل الحضور اليومي</h1>
        <p className="mt-1 text-sm text-ink-muted">اختر الفوج الذي تريد تسجيل حضوره</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/teacher/attendance/${group.id}?date=${today}`}
            className="flex items-center justify-between rounded-card border border-border bg-surface-raised p-5 transition-colors hover:border-primary"
          >
            <div>
              <h2 className="font-display font-bold text-ink">{group.name}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                <Users className="h-4 w-4" />
                {group._count.students} تلميذ
              </p>
            </div>
            <ArrowLeft className="h-5 w-5 text-primary" />
          </Link>
        ))}

        {groups.length === 0 && (
          <p className="col-span-full rounded-card border border-dashed border-border p-10 text-center text-ink-muted">
            لم يتم إسناد أي فوج إليك بعد.
          </p>
        )}
      </div>
    </div>
  );
}
