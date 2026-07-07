import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

/**
 * هذا الملف يوسّع (augment) الأنواع الافتراضية لمكتبة NextAuth
 * لإضافة الحقول الخاصة بنا: id و role، حتى نحصل على type-safety
 * كامل عند استخدام useSession()/auth() في كل أنحاء المشروع.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
