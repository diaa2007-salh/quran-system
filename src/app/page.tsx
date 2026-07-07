import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * الصفحة الجذرية لا تعرض أي واجهة؛ مهمتها الوحيدة توجيه الزائر فوراً
 * حسب حالته: غير مسجّل → /login، مدير → /admin، معلم → /teacher.
 */
export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  redirect("/teacher");
}
