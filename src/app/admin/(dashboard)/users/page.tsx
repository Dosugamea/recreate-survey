import { getCurrentUser } from "@/lib/auth-utils";
import { getUsers } from "@/features/admin/users/actions/users";
import { UsersPageRoot } from "@/features/admin/users/components/UsersPageRoot";

export default async function UsersPage() {
  const { isAdmin } = await getCurrentUser();
  const users = await getUsers();

  return <UsersPageRoot users={users} isAdmin={isAdmin} />;
}
