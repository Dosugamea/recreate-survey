import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditUserForm from "./EditUserForm";
import { auth } from "@/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: PageProps) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin");
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
