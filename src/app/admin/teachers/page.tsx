import { getTeachers } from "@/lib/actions/teachers.actions";
import { TeachersManager } from "@/components/admin/TeachersManager";

export default async function TeachersPage() {
  const teachers = await getTeachers();
  return <TeachersManager teachers={teachers} />;
}
