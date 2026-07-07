import { getStudents, getGroupsForSelect } from "@/lib/actions/students.actions";
import { StudentsManager } from "@/components/admin/StudentsManager";

export default async function StudentsPage() {
  const [students, groups] = await Promise.all([getStudents(), getGroupsForSelect()]);
  return <StudentsManager students={students} groups={groups} />;
}
