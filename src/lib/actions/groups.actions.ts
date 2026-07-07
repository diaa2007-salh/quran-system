"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export type ActionState = { error?: string; success?: boolean } | undefined;

const groupSchema = z.object({
  name: z.string().trim().min(2, "اسم الفوج يجب أن يتكون من حرفين على الأقل"),
  description: z.string().trim().optional(),
  // نص فارغ يعني "بدون معلم" في عنصر <select>
  teacherId: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null)),
});

export type GroupListItem = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  teacherId: string | null;
  teacher: { id: string; name: string } | null;
  _count: { students: number };
};

/** يجلب كل الأفواج مع اسم المعلم المسؤول وعدد التلاميذ في كل فوج */
export async function getGroups(): Promise<GroupListItem[]> {
  await requireAdmin();

  return prisma.group.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      teacherId: true,
      teacher: { select: { id: true, name: true } },
      _count: { select: { students: true } },
    },
  });
}

/** قائمة مبسّطة بالمعلمين لاستخدامها في عنصر <select> داخل نموذج الفوج */
export async function getTeachersForSelect() {
  await requireAdmin();

  return prisma.user.findMany({
    where: { role: "TEACHER" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function createGroup(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = groupSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    teacherId: formData.get("teacherId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.group.create({ data: parsed.data });

  revalidatePath("/admin/groups");
  return { success: true };
}

export async function updateGroup(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = groupSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    teacherId: formData.get("teacherId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.group.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/groups");
  return { success: true };
}

/** حذف فوج: يُفرَّغ التلاميذ منه تلقائياً، وتُحذف سجلات حضوره (Cascade) */
export async function deleteGroup(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await prisma.group.delete({ where: { id } });
  revalidatePath("/admin/groups");
}
