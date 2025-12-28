"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveySchema, SurveySchema } from "@/lib/schemas";
import { updateSurvey } from "@/app/actions/surveys";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SurveyPreview } from "@/components/admin/survey/SurveyPreview";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarIcon, Loader2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { getAllApps } from "@/app/actions/apps";
import type { Survey } from "@prisma/client";
import type { App } from "@prisma/client";

interface EditSurveyFormProps {
  survey: Survey;
}

export function EditSurveyForm({ survey }: EditSurveyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    getAllApps().then(setApps);
  }, []);

  const form = useForm<SurveySchema>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      appId: survey.appId,
      title: survey.title,
      slug: survey.slug,
      description: survey.description || "",
      notes: survey.notes || "",
      startAt: survey.startAt ? new Date(survey.startAt) : new Date(),
      endAt: survey.endAt
        ? new Date(survey.endAt)
        : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 今日から2週間後
      themeColor: survey.themeColor,
      headerImage: survey.headerImage || "",
      bgImage: survey.bgImage || "",
      webhookUrl: survey.webhookUrl || "",
      isActive: survey.isActive,
    },
  });

  function onSubmit(data: SurveySchema) {
    setServerError(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const response = await updateSurvey(survey.id, data);
      if (response?.error) {
        setServerError(response.error);
      } else {
        setSuccessMessage("アンケート情報を更新しました！");
      }
    });
  }

  // eslint-disable-next-line react-hooks/incompatible-library
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

          {successMessage && (
            <div className="bg-green-500/15 text-green-600 text-sm p-3 rounded-md">
              {successMessage}
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
                  <div className="flex items-center gap-2">
                    <FormLabel>スラッグ (URLパス)</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          aria-label="スラッグについての説明"
                        >
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>アンケートのURLとして使用される一意のIDです。</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <Input placeholder="autumn-campaign-2025" {...field} />
                  </FormControl>
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
                  <FormLabel>
                    開始日 <span className="text-destructive">*</span>
                  </FormLabel>
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
                  <FormLabel>
                    終了日 <span className="text-destructive">*</span>
                  </FormLabel>
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

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>公開ステータス</FormLabel>
                  <FormControl>
                    <div className="**:data-[slot=switch]:h-7 **:data-[slot=switch]:w-12 **:data-[slot=switch-thumb]:size-6">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
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

          <FormField
            control={form.control}
            name="webhookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/webhook" {...field} />
                </FormControl>
                <FormDescription>
                  回答登録時に通知を送信するWebhook
                  URLを設定できます(オプション)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            アンケート情報を更新
          </Button>
        </form>
      </Form>
      <div className="hidden lg:block">
        <SurveyPreview formData={formValues} />
      </div>
    </div>
  );
}
