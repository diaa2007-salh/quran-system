import "server-only";
import { auth } from "@/auth";

/**
 * الحماية عبر middleware تكفي لحجب الصفحات، لكن Server Actions يمكن نظرياً
 * استدعاؤها من أي مكان، لذلك نُعيد التحقق من الهوية والصلاحية داخل كل
 * Server Action حسّاس أيضاً (دفاع متعدد الطبقات / Defense in Depth).
 */

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export class UnauthorizedError extends Error {
  constructor(message = "غير مصرح لك بتنفيذ هذا الإجراء") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/** يتحقق من أن المستخدم الحالي مسجّل دخول وله صلاحية "مدير" */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new UnauthorizedError();
  }
  return user;
}

/** يتحقق من أن المستخدم الحالي مسجّل دخول (معلم أو مدير) */
export async function requireTeacher() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
    throw new UnauthorizedError();
  }
  return user;
}
