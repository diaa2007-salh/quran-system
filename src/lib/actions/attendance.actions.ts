"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireTeacher } from "@/lib/auth-guard";
import { parseDateOnly } from "@/lib/utils";
import type { AttendanceStatus } from "@prisma/client";

// ============================================================================
// معلم: جلب لائحة تلاميذ الفوج مع حالة حضورهم في تاريخ معيّن
// ============================================================================

export type RosterStudent = {
  id: string;
  fullName: string;
  status: AttendanceStatus | null;
};

export async function getGroupRosterForDate(groupId: string, dateString: string) {
  const user = await requireTeacher();

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: {
      id: true,
      name: true,
      teacherId: true,
      students: {
        orderBy: { fullName: "asc" },
        select: { id: true, fullName: true },
      },
    },
  });

  if (!group) return null;
  // معلم عادي لا يمكنه رؤية فوج معلم آخر، أما المدير فيمكنه ذلك
  if (user.role !== "ADMIN" && group.teacherId !== user.id) return null;

  const day = parseDateOnly(dateString);
  const records = await prisma.attendance.findMany({
    where: { groupId, date: day },
    select: { studentId: true, status: true },
  });
  const statusByStudent = new Map(
    records.map((record: { studentId: string; status: AttendanceStatus }) => [
      record.studentId,
      record.status,
    ])
  );

  const students: RosterStudent[] = group.students.map(
    (student: { id: string; fullName: string }) => ({
      id: student.id,
      fullName: student.fullName,
      status: statusByStudent.get(student.id) ?? null,
    })
  );

  return { id: group.id, name: group.name, students };
}

// ============================================================================
// معلم: تسجيل/تحديث حالة حضور تلميذ واحد (تُستدعى من زر حاضر/غائب/متأخر)
// ============================================================================

const markAttendanceSchema = z.object({
  studentId: z.string().min(1),
  groupId: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(["PRESENT", "ABSENT", "LATE"]),
});

export async function markAttendance(input: {
  studentId: string;
  groupId: string;
  date: string;
  status: AttendanceStatus;
}): Promise<{ success: boolean; error?: string }> {
  const user = await requireTeacher();

  const parsed = markAttendanceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "بيانات غير صالحة" };
  }
  const { studentId, groupId, date, status } = parsed.data;

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { teacherId: true },
  });
  if (!group) {
    return { success: false, error: "الفوج غير موجود" };
  }
  if (user.role !== "ADMIN" && group.teacherId !== user.id) {
    return { success: false, error: "لا تملك صلاحية تسجيل حضور هذا الفوج" };
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { groupId: true },
  });
  if (!student || student.groupId !== groupId) {
    return { success: false, error: "هذا التلميذ لا ينتمي لهذا الفوج" };
  }

  const day = parseDateOnly(date);

  await prisma.attendance.upsert({
    where: { studentId_date: { studentId, date: day } },
    update: { status, groupId },
    create: { studentId, groupId, date: day, status },
  });

  revalidatePath(`/teacher/attendance/${groupId}`);
  return { success: true };
}

// ============================================================================
// مدير: تقرير الحضور والغياب عبر جميع الأفواج، مع فلاتر اختيارية
// ============================================================================

type AttendanceReportFilter = {
  groupId?: string;
  date?: { gte?: Date; lte?: Date };
};

export async function getAttendanceReport(filters: {
  groupId?: string;
  from?: string;
  to?: string;
}) {
  await requireAdmin();

  const where: AttendanceReportFilter = {};
  if (filters.groupId) {
    where.groupId = filters.groupId;
  }
  if (filters.from || filters.to) {
    where.date = {};
    if (filters.from) where.date.gte = parseDateOnly(filters.from);
    if (filters.to) where.date.lte = parseDateOnly(filters.to);
  }

  type ReportRecord = {
    id: string;
    date: Date;
    status: AttendanceStatus;
    student: { fullName: string };
    group: { name: string };
  };

  const records: ReportRecord[] = await prisma.attendance.findMany({
    where,
    orderBy: [{ date: "desc" }, { student: { fullName: "asc" } }],
    select: {
      id: true,
      date: true,
      status: true,
      student: { select: { fullName: true } },
      group: { select: { name: true } },
    },
  });

  return {
    records,
    summary: {
      total: records.length,
      present: records.filter((r) => r.status === "PRESENT").length,
      absent: records.filter((r) => r.status === "ABSENT").length,
      late: records.filter((r) => r.status === "LATE").length,
    },
  };
}

/** كل الأفواج بصيغة مبسّطة، تُستخدم في عنصر تصفية التقرير */
export async function getAllGroupsForFilter(): Promise<{ id: string; name: string }[]> {
  await requireAdmin();
  return prisma.group.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
