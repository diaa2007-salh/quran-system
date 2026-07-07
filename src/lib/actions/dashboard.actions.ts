"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, requireTeacher } from "@/lib/auth-guard";
import { safePercentage } from "@/lib/utils";

/**
 * الإحصائيات الرئيسية لصفحة "نظرة عامة" في لوحة الإدارة:
 * عدد المعلمين، عدد التلاميذ، عدد الأفواج، نسبة حضور اليوم، والنسبة الكلية.
 */
export async function getAdminStats() {
  await requireAdmin();

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  const [
    teachersCount,
    studentsCount,
    groupsCount,
    totalRecords,
    presentRecords,
    todayTotal,
    todayPresent,
  ] = await prisma.$transaction([
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.student.count(),
    prisma.group.count(),
    prisma.attendance.count(),
    prisma.attendance.count({ where: { status: "PRESENT" } }),
    prisma.attendance.count({ where: { date: { gte: todayStart, lt: todayEnd } } }),
    prisma.attendance.count({
      where: { date: { gte: todayStart, lt: todayEnd }, status: "PRESENT" },
    }),
  ]);

  return {
    teachersCount,
    studentsCount,
    groupsCount,
    attendanceRateToday: safePercentage(todayPresent, todayTotal),
    hasTodayAttendanceData: todayTotal > 0,
    attendanceRateOverall: safePercentage(presentRecords, totalRecords),
    hasOverallAttendanceData: totalRecords > 0,
  };
}

export type TeacherGroupItem = {
  id: string;
  name: string;
  description: string | null;
  _count: { students: number };
};

/** الأفواج المسندة إلى المعلم الحالي فقط، مع عدد تلاميذ كل فوج */
export async function getTeacherGroups(): Promise<TeacherGroupItem[]> {
  const user = await requireTeacher();

  return prisma.group.findMany({
    where: { teacherId: user.id },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      _count: { select: { students: true } },
    },
  });
}
