import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSettings } from "@/lib/actions/settings.actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // تحقق إضافي من الجلسة والدور على مستوى الخادم، بالإضافة إلى middleware.ts
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/teacher");
  }

  const settings = await getSettings();

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar
        userName={session.user.name ?? session.user.email ?? ""}
        schoolName={settings.schoolName}
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
