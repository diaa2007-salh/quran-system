"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { hashPassword } from "@/lib/utils";

export type ActionState = { error?: string; success?: boolean } | undefined;

const baseTeacherSchema = z.object({
  name: z.string().trim().min(2, "الاسم يجب أن يتكون من حرفين على الأقل"),
  email: z.string().trim().email("البريد الإلكتروني غير صالح"),
});

const createTeacherSchema = baseTeacherSchema.extend({
  password: z.string().min(6, "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل"),
});

const updateTeacherSchema = baseTeacherSchema.extend({
  // كلمة المرور اختيارية عند التعديل: نتركها فارغة إن لم نُرد تغييرها
  password: z.string().min(6).optional().or(z.literal("")),
});

export type TeacherListItem = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  _count: { groups: number };
};

/** يجلب كل المعلمين مع عدد الأفواج المسندة لكل واحد منهم */
export async function getTeachers(): Promise<TeacherListItem[]> {
  await requireAdmin();

  return prisma.user.findMany({
    where: { role: "TEACHER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { groups: true } },
    },
  });
}

export async function createTeacher(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = createTeacherSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "هذا البريد الإلكتروني مستخدم من قبل مستخدم آخر" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      role: "TEACHER",
    },
  });

  revalidatePath("/admin/teachers");
  return { success: true };
}

export async function updateTeacher(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateTeacherSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id } },
  });
  if (existing) {
    return { error: "هذا البريد الإلكتروني مستخدم من قبل مستخدم آخر" };
  }

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      ...(password ? { password: await hashPassword(password) } : {}),
    },
  });

  revalidatePath("/admin/teachers");
  return { success: true };
}

/** حذف معلم: تُصبح أفواجه بلا معلم مسؤول تلقائياً (onDelete: SetNull) */
export async function deleteTeacher(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/teachers");
}
