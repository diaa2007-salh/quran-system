import { getTeacherGroups } from "@/lib/actions/dashboard.actions";
import { GroupCard } from "@/components/teacher/GroupCard";

export default async function TeacherHomePage() {
  const groups = await getTeacherGroups();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">أفواجي</h1>
        <p className="mt-1 text-sm text-ink-muted">الأفواج المسندة إليك حالياً</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}

        {groups.length === 0 && (
          <p className="col-span-full rounded-card border border-dashed border-border p-10 text-center text-ink-muted">
            لم يتم إسناد أي فوج إليك بعد. يرجى التواصل مع مدير النظام.
          </p>
        )}
      </div>
    </div>
  );
}
