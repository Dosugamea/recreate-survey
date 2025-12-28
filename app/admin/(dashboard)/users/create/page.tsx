"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createUser } from "@/app/actions/users";
import { PageHeader } from "@/components/admin/layout/PageHeader";

export default function CreateUserPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setErrors({});

    const result = await createUser(formData);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsPending(false);
    } else {
      router.push("/admin/users");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="新規ユーザー追加"
        backHref="/admin/users"
        description="管理画面にアクセスできる新しい仲間を追加するよ！"
      />

      <Card className="border-2">
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">お名前</Label>
              <Input
                id="name"
                name="name"
                placeholder="田中 太郎"
                required
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@example.com"
                required
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">権限</Label>
              <Select name="role" defaultValue="USER">
                <SelectTrigger>
                  <SelectValue placeholder="権限を選択してね" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">一般ユーザー</SelectItem>
                  <SelectItem value="ADMIN">管理者</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-red-500">{errors.role[0]}</p>
              )}
            </div>

            {errors._form && (
              <p className="text-sm text-red-500 p-2 bg-red-50 rounded-md border border-red-200">
                {errors._form[0]}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6 bg-muted/20">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                "ユーザーを作成する"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
