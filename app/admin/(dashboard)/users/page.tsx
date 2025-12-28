import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, User as UserIcon, Edit, Lock } from "lucide-react";
import Link from "next/link";
import { deleteUser } from "@/app/actions/users";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function UsersPage() {
  const { isAdmin } = await getCurrentUser();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="ユーザー管理"
        description="管理画面にログインできるユーザーを管理するよ！"
        action={
          isAdmin ? (
            <Button asChild>
              <Link href="/admin/users/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                新規ユーザー追加
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg truncate">
                      {user.name}
                    </CardTitle>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mt-1 ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {isAdmin ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary h-8 w-8"
                        asChild
                      >
                        <Link href={`/admin/users/${user.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          const userId = formData.get("userId") as string;
                          await deleteUser(userId);
                        }}
                      >
                        <input type="hidden" name="userId" value={user.id} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                          type="submit"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground/30"
                      title="権限がないよ"
                    >
                      <Lock className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
              <p className="text-[10px] text-muted-foreground mt-2">
                追加日: {user.createdAt.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/20">
            <UserIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-lg font-medium text-muted-foreground">
              ユーザーが一人もいないよ...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
