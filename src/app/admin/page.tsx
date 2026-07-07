import { GraduationCap, UserRound, Users, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { getAdminStats } from "@/lib/actions/dashboard.actions";
import { StatsCard } from "@/components/admin/StatsCard";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">نظرة عامة</h1>
        <p className="mt-1 text-sm text-ink-muted">ملخص سريع لحالة النظام الآن</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="عدد المعلمين" value={stats.teachersCount} icon={GraduationCap} />
        <StatsCard label="عدد التلاميذ" value={stats.studentsCount} icon={UserRound} />
        <StatsCard label="عدد الأفواج" value={stats.groupsCount} icon={Users} />
        <StatsCard
          label="نسبة الحضور اليوم"
          value={stats.hasTodayAttendanceData ? `${stats.attendanceRateToday}%` : "—"}
          icon={ClipboardCheck}
          accent
        />
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-2 rounded-card border border-border bg-surface-raised p-4 sm:flex-row sm:items-center">
        <p className="text-sm text-ink-muted">
          النسبة الكلية لكل السجلات منذ البداية:{" "}
          <span className="font-semibold text-ink">
            {stats.hasOverallAttendanceData ? `${stats.attendanceRateOverall}%` : "لا توجد بيانات بعد"}
          </span>
        </p>
        <Link href="/admin/reports" className="text-sm font-medium text-primary hover:underline">
          عرض تقرير الحضور الكامل ←
        </Link>
      </div>

      {!stats.hasTodayAttendanceData && (
        <p className="mt-4 rounded-lg bg-accent-light px-4 py-3 text-sm text-ink-muted">
          لم يُسجَّل أي حضور اليوم بعد. ستظهر النسبة فور تسجيل أول معلم لحضور فوجه.
        </p>
      )}
    </div>
  );
}
