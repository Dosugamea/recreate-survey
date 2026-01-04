import { notFound } from "next/navigation";
import { getUser } from "@/features/admin/users/actions/users";
import { UserEditPageRoot } from "@/features/admin/users/components/UserEditPageRoot";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await getUser(id);
  return {
    title: user ? `${user.name}さんの編集` : "ユーザー編集",
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params;

  const user = await getUser(id);
  if (!user) {
    notFound();
  }

  return <UserEditPageRoot user={user} />;
}
