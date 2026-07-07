import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { getSettings } from "@/lib/actions/settings.actions";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const settings = await getSettings();

  return (
    <div className="flex min-h-screen bg-surface">
      <TeacherSidebar
        userName={session.user.name ?? session.user.email ?? ""}
        schoolName={settings.schoolName}
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
