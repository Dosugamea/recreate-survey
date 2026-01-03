import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import CreateUserForm from "./CreateUserForm";

export default async function CreateUserPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/admin/users");
  }

  return <CreateUserForm />;
}
