import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import CreateUserForm from "@/app/admin/(dashboard)/users/create/CreateUserForm";

export default async function CreateUserPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/admin/users");
  }

  return <CreateUserForm />;
}
