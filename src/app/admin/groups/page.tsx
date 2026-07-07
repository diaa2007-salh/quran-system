import { getGroups, getTeachersForSelect } from "@/lib/actions/groups.actions";
import { GroupsManager } from "@/components/admin/GroupsManager";

export default async function GroupsPage() {
  const [groups, teachers] = await Promise.all([getGroups(), getTeachersForSelect()]);
  return <GroupsManager groups={groups} teachers={teachers} />;
}
