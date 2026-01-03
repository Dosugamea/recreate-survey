import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditUserForm from "@/app/admin/(dashboard)/users/[id]/edit/EditUserForm";
import { getCurrentUser } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: PageProps) {
  const { isAdmin } = await getCurrentUser();
  if (!isAdmin) {
    redirect("/admin/users");
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  return <EditUserForm user={user} />;
}
