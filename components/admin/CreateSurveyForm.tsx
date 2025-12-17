"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveySchema, SurveySchema } from "@/lib/schemas";
import { createSurvey } from "@/app/actions/surveys";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SurveyPreview } from "@/components/admin/SurveyPreview";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getAllApps } from "@/app/actions/apps";
import type { App } from "@prisma/client";

function generateRandomSlug(): string {
  // ランダム4桁の数字を生成（0000-9999）
  const randomNumbers = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  // ランダムな大文字小文字3桁の英字を生成
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const randomChars = Array.from({ length: 3 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");

  return `enq-${randomNumbers}-${randomChars}`;
}

export function CreateSurveyForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    getAllApps().then(setApps);
  }, []);

  const form = useForm<SurveySchema>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      appId: "",
      title: "",
      slug: generateRandomSlug(),
      description: "",
      notes: "",
      themeColor: "#6c4034",
      headerImage: "",
      bgImage: "",
    },
  });

  function onSubmit(data: SurveySchema) {
    setServerError(null);
    startTransition(async () => {
      const response = await createSurvey(data);
      if (response?.error) {
        setServerError(response.error);
      }
    });
  }

  const formValues = form.watch();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {serverError && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {serverError}
            </div>
          )}

          <FormField
            control={form.control}
            name="appId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>アプリ</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="アプリを選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {apps.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  このアンケートが属するアプリを選択してください。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="秋のキャンペーンアンケート"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>スラッグ (URLパス)</FormLabel>
                  <FormControl>
                    <Input placeholder="autumn-campaign-2025" {...field} />
                  </FormControl>
                  <FormDescription>
                    アンケートのURLとして使用される一意のIDです。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>説明</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="このアンケートにご記入ください..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>注意事項</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="注意事項を入力してください..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  フォームの下に表示される注意事項です。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>開始日</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>日付を選択</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>終了日</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>日付を選択</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="themeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>テーマカラー</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={field.value || "#6c4034"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-16 h-10 rounded-md border border-input cursor-pointer"
                          title="カラーを選択"
                        />
                        <Input
                          placeholder="#6c4034"
                          value={field.value}
                          onChange={field.onChange}
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="headerImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ヘッダー画像URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/header.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bgImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>背景画像URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/bg.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            アンケートを作成
          </Button>
        </form>
      </Form>
      <div className="hidden lg:block">
        <SurveyPreview formData={formValues} />
      </div>
    </div>
  );
}
