"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

const SETTINGS_ID = "global";

export type ActionState = { error?: string; success?: boolean } | undefined;

const settingsSchema = z.object({
  schoolName: z.string().trim().min(2, "اسم المؤسسة يجب أن يتكون من حرفين على الأقل"),
  logoUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null)),
  primaryColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "اللون يجب أن يكون بصيغة HEX مثل ‎#0f6b5c"),
});

/**
 * يجلب سجل الإعدادات الوحيد، وينشئه بالقيم الافتراضية عند أول استخدام
 * (نمط "singleton row" — سطر واحد ثابت المعرّف يمثّل إعدادات النظام كله).
 */
export async function getSettings() {
  return prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
}

export async function updateSettings(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = settingsSchema.safeParse({
    schoolName: formData.get("schoolName"),
    logoUrl: formData.get("logoUrl"),
    primaryColor: formData.get("primaryColor"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: parsed.data,
    create: { id: SETTINGS_ID, ...parsed.data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}
