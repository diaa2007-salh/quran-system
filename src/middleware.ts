import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * middleware.ts يعمل على "Edge Runtime" قبل أي صفحة، ويستخدم فقط authConfig
 * (وليس auth.ts الكامل) لأن bcrypt/Prisma غير متوافقين مع بيئة Edge.
 * منطق الحماية الفعلي موجود في authConfig.callbacks.authorized.
 */
export default NextAuth(authConfig).auth;

export const config = {
  // نطبّق الحماية على كل المسارات ما عدا: مسارات API، ملفات Next الداخلية،
  // وملفات الصور/الأيقونات الثابتة
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
