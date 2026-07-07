import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";
import { toDateInputValue } from "@/lib/utils";

export function GroupCard({
  group,
}: {
  group: { id: string; name: string; description: string | null; _count: { students: number } };
}) {
  const today = toDateInputValue();

  return (
    <div className="flex flex-col rounded-card border border-border bg-surface-raised p-5">
      <h2 className="font-display text-lg font-bold text-ink">{group.name}</h2>
      {group.description && (
        <p className="mt-1 text-sm text-ink-muted">{group.description}</p>
      )}

      <div className="mt-4 flex items-center gap-1.5 text-sm text-ink-muted">
        <Users className="h-4 w-4" />
        {group._count.students} تلميذ
      </div>

      <Link
        href={`/teacher/attendance/${group.id}?date=${today}`}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        تسجيل الحضور اليومي
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}
