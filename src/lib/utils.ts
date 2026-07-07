import { clsx, type ClassValue } from "clsx";
import bcrypt from "bcryptjs";

/** يدمج أصناف Tailwind بشكل آمن، مع تجاهل القيم false/null/undefined */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** يشفّر كلمة مرور قبل تخزينها في قاعدة البيانات */
export async function hashPassword(plainPassword: string) {
  return bcrypt.hash(plainPassword, 10);
}

/**
 * يحوّل نص تاريخ من نوع "YYYY-MM-DD" (كما يُرسله <input type="date">)
 * إلى كائن Date مضبوط على منتصف الليل بتوقيت UTC، لضمان أن سجل الحضور
 * يُقارَن دوماً بنفس "اليوم" بمعزل عن فرق التوقيت بين الخادم والمستخدم.
 */
export function parseDateOnly(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

/** يحوّل كائن Date إلى نص "YYYY-MM-DD" لاستخدامه كقيمة افتراضية في input[type=date] */
export function toDateInputValue(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** يهيّئ تاريخاً للعرض بالعربية، مثال: "الجمعة، 4 يوليو 2026" */
export function formatDateArabic(date: Date): string {
  return new Intl.DateTimeFormat("ar", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** يحسب نسبة مئوية بأمان (يتجنّب القسمة على صفر) ويعيدها كعدد صحيح */
export function safePercentage(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

/** ترجمة عربية لحالات الحضور، تُستخدم في كل الواجهات لتوحيد النصوص */
export const ATTENDANCE_STATUS_LABELS = {
  PRESENT: "حاضر",
  ABSENT: "غائب",
  LATE: "متأخر",
} as const;
