"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appSchema, AppSchema } from "@/lib/schemas";
import { createApp } from "@/features/admin/apps/actions/apps";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export function CreateAppForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<AppSchema>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      name: "",
      slug: "",
      privacyPolicyUrl: "",
      faviconImageUrl: "",
      copyrightNotice: "",
      contactUrl: "",
    },
  });

  function onSubmit(data: AppSchema) {
    setServerError(null);
    startTransition(async () => {
      const response = await createApp(data);
      if (response?.error) {
        setServerError(response.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl"
      >
        {serverError && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {serverError}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>アプリ名</FormLabel>
              <FormControl>
                <Input placeholder="アンケートアプリ" {...field} />
              </FormControl>
              <FormDescription>
                アンケートアプリの名前を入力してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>スラッグ</FormLabel>
              <FormControl>
                <Input placeholder="my-app" {...field} />
              </FormControl>
              <FormDescription>
                URLに使用される識別子です。小文字英数字とハイフンのみ使用できます。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacyPolicyUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>プライバシーポリシーURL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/privacy" {...field} />
              </FormControl>
              <FormDescription>
                プライバシーポリシーのページURLを入力してください（任意）。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>お問い合わせ先URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/contact" {...field} />
              </FormControl>
              <FormDescription>
                お問い合わせページのURLを入力してください（任意）。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="faviconImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ファビコン画像URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/favicon.ico"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                ブラウザのタブに表示されるアイコンのURLを入力してください（任意）。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="copyrightNotice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>権利者表記</FormLabel>
              <FormControl>
                <Textarea placeholder="© 2025 株式会社サンプル" {...field} />
              </FormControl>
              <FormDescription>
                フッターに表示される権利者表記を入力してください（任意）。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          アプリを作成
        </Button>
      </form>
    </Form>
  );
}
