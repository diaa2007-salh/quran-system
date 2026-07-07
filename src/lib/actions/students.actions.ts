"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export type ActionState = { error?: string; success?: boolean } | undefined;

const studentSchema = z.object({
  fullName: z.string().trim().min(2, "اسم التلميذ يجب أن يتكون من حرفين على الأقل"),
  guardianPhone: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  birthDate: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? new Date(value) : null)),
  groupId: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null)),
});

export type StudentListItem = {
  id: string;
  fullName: string;
  guardianPhone: string | null;
  notes: string | null;
  birthDate: Date | null;
  createdAt: Date;
  groupId: string | null;
  group: { id: string; name: string } | null;
};

/** يجلب كل التلاميذ مع اسم الفوج الذي ينتمون إليه (إن وُجد) */
export async function getStudents(): Promise<StudentListItem[]> {
  await requireAdmin();

  return prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      guardianPhone: true,
      notes: true,
      birthDate: true,
      createdAt: true,
      groupId: true,
      group: { select: { id: true, name: true } },
    },
  });
}

/** قائمة مبسّطة بالأفواج لاستخدامها في عنصر <select> داخل نموذج التلميذ */
export async function getGroupsForSelect() {
  await requireAdmin();

  return prisma.group.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function createStudent(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = studentSchema.safeParse({
    fullName: formData.get("fullName"),
    guardianPhone: formData.get("guardianPhone"),
    notes: formData.get("notes"),
    birthDate: formData.get("birthDate"),
    groupId: formData.get("groupId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.student.create({ data: parsed.data });

  revalidatePath("/admin/students");
  return { success: true };
}

export async function updateStudent(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = studentSchema.safeParse({
    fullName: formData.get("fullName"),
    guardianPhone: formData.get("guardianPhone"),
    notes: formData.get("notes"),
    birthDate: formData.get("birthDate"),
    groupId: formData.get("groupId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.student.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/students");
  return { success: true };
}

/** حذف تلميذ: تُحذف سجلات حضوره تلقائياً معه (Cascade) */
export async function deleteStudent(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await prisma.student.delete({ where: { id } });
  revalidatePath("/admin/students");
}
