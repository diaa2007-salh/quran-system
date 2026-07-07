import { getAttendanceReport, getAllGroupsForFilter } from "@/lib/actions/attendance.actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateArabic } from "@/lib/utils";

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ groupId?: string; from?: string; to?: string }>;
}) {
  const filters = await searchParams;
  const [groups, report] = await Promise.all([
    getAllGroupsForFilter(),
    getAttendanceReport(filters),
  ]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">تقارير الحضور والغياب</h1>
        <p className="mt-1 text-sm text-ink-muted">
          سجلات الحضور عبر جميع الأفواج، مع إمكانية التصفية بالفوج والتاريخ
        </p>
      </header>

      <form
        method="get"
        className="mb-6 flex flex-wrap items-end gap-3 rounded-card border border-border bg-surface-raised p-4"
      >
        <div>
          <label htmlFor="groupId" className="mb-1.5 block text-xs font-medium text-ink-muted">
            الفوج
          </label>
          <select
            id="groupId"
            name="groupId"
            defaultValue={filters.groupId ?? ""}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink"
          >
            <option value="">كل الأفواج</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="from" className="mb-1.5 block text-xs font-medium text-ink-muted">
            من تاريخ
          </label>
          <input
            id="from"
            type="date"
            name="from"
            defaultValue={filters.from ?? ""}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink"
          />
        </div>

        <div>
          <label htmlFor="to" className="mb-1.5 block text-xs font-medium text-ink-muted">
            إلى تاريخ
          </label>
          <input
            id="to"
            type="date"
            name="to"
            defaultValue={filters.to ?? ""}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          تصفية
        </button>
      </form>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="إجمالي السجلات" value={report.summary.total} />
        <SummaryCard label="حاضر" value={report.summary.present} tone="text-emerald-700" />
        <SummaryCard label="غائب" value={report.summary.absent} tone="text-red-700" />
        <SummaryCard label="متأخر" value={report.summary.late} tone="text-amber-700" />
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface-raised">
        <table className="w-full text-start text-sm">
          <thead className="bg-surface text-ink-muted">
            <tr>
              <th className="px-5 py-3 text-start font-medium">التلميذ</th>
              <th className="px-5 py-3 text-start font-medium">الفوج</th>
              <th className="px-5 py-3 text-start font-medium">التاريخ</th>
              <th className="px-5 py-3 text-start font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {report.records.map((record) => (
              <tr key={record.id}>
                <td className="px-5 py-3.5 font-medium text-ink">{record.student.fullName}</td>
                <td className="px-5 py-3.5 text-ink-muted">{record.group.name}</td>
                <td className="px-5 py-3.5 text-ink-muted">{formatDateArabic(record.date)}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={record.status} />
                </td>
              </tr>
            ))}

            {report.records.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-ink-muted">
                  لا توجد سجلات مطابقة لهذه التصفية
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "text-ink",
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="rounded-card border border-border bg-surface-raised p-4">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
