"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/features/admin/layout/components/PageHeader";
import { EditUserForm } from "@/features/admin/users/components/EditUserForm";
import { updateUser } from "@/features/admin/users/actions/users";

interface UserEditPageRootProps {
  user: User;
}

export function UserEditPageRoot({ user }: UserEditPageRootProps) {
  const router = useRouter();

  const handleUpdateUser = async (formData: FormData) => {
    const result = await updateUser(user.id, formData);

    if (result?.error) {
      return { error: result.error as Record<string, string[]> };
    }

    router.push("/admin/users");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ユーザー編集"
        backHref="/admin/users"
        description={`${user.name}さんの情報を編集するよ！`}
      />
      <EditUserForm user={user} onSubmit={handleUpdateUser} />
    </div>
  );
}
