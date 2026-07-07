import { PrismaClient } from "@prisma/client";

/**
 * في وضع التطوير، يقوم Next.js بإعادة تحميل الوحدات (Hot Reload) باستمرار،
 * وهو ما قد يؤدي لإنشاء اتصالات جديدة بقاعدة البيانات في كل مرة.
 * لتفادي ذلك نخزّن نسخة واحدة من PrismaClient على الكائن العام globalThis
 * ونعيد استخدامها بدلاً من إنشاء نسخة جديدة في كل استيراد.
 *
 * راجع: https://www.prisma.io/docs/guides/nextjs
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
