import type { NextAuthConfig } from "next-auth";

/**
 * هذا الإعداد "متوافق مع بيئة Edge" (Edge Runtime)، لذلك لا نضع فيه أي شيء
 * يحتاج Node.js الكاملة (مثل bcrypt أو Prisma) — تلك الأمور موجودة في auth.ts
 * ويتم استيراد هذا الملف من middleware.ts وأيضاً من auth.ts.
 *
 * القاعدة المستخدمة في حماية المسارات (authorized callback):
 *  - غير مسجّل دخول ويحاول دخول /admin أو /teacher  → يُحوَّل لصفحة /login
 *  - "معلم" يحاول دخول /admin                        → يُحوَّل إلى /teacher
 *  - مسجّل دخول ويحاول فتح /login                     → يُحوَّل للوحته المناسبة
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnTeacher = nextUrl.pathname.startsWith("/teacher");
      const isOnLogin = nextUrl.pathname === "/login";

      // 1) حماية لوحة الإدارة: للمدير فقط
      if (isOnAdmin) {
        if (!isLoggedIn) return false; // → يُحوَّل تلقائياً إلى pages.signIn
        if (role !== "ADMIN") {
          return Response.redirect(new URL("/teacher", nextUrl));
        }
        return true;
      }

      // 2) حماية لوحة المعلم: لأي مستخدم مسجّل دخول (معلم أو مدير)
      if (isOnTeacher) {
        if (!isLoggedIn) return false;
        return true;
      }

      // 3) منع المستخدم المسجّل دخوله مسبقاً من رؤية صفحة الدخول مجدداً
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(
          new URL(role === "ADMIN" ? "/admin" : "/teacher", nextUrl)
        );
      }

      return true;
    },
  },
  // يتم تعريف providers في auth.ts لأنه يحتاج bcrypt و Prisma
  // (وكلاهما غير متوافق مع Edge Runtime الذي يعمل عليه middleware.ts)
  providers: [],
} satisfies NextAuthConfig;
