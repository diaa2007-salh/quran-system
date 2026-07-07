import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * ينشئ حساب المدير الأول للنظام (لا يوجد تسجيل عام، فلا بد من حساب أولي
 * يستطيع من خلاله المدير تسجيل الدخول وإنشاء بقية الحسابات).
 *
 * التشغيل: npx prisma db seed
 * (تأكد أولاً من تعبئة SEED_ADMIN_* في ملف .env)
 */
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const name = process.env.SEED_ADMIN_NAME ?? "مدير النظام";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeThisPassword123!";

  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (existingAdmin) {
    console.log(`ℹ️  يوجد حساب مسبقاً بهذا البريد: ${email} — لم يتم إنشاء شيء جديد.`);
    return;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "ADMIN",
    },
  });

  console.log("✅ تم إنشاء حساب المدير الأول بنجاح:");
  console.log(`   البريد الإلكتروني: ${email}`);
  console.log(`   كلمة المرور: ${password}`);
  console.log("   ⚠️  يُنصح بتغييرها بعد أول تسجيل دخول.");
}

main()
  .catch((error) => {
    console.error("❌ حدث خطأ أثناء تنفيذ seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
