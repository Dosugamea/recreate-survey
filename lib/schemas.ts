import * as z from "zod";

export const appSchema = z.object({
  name: z.string().min(1, "アプリ名は必須です"),
  slug: z
    .string()
    .min(1, "スラッグは必須です")
    .regex(/^[a-zA-Z0-9-]+$/, "スラッグは英数字とハイフンのみ使用できます"),
  privacyPolicyUrl: z
    .url("有効なURLを入力してください")
    .optional()
    .or(z.literal("")),
  faviconImageUrl: z
    .url("有効なURLを入力してください")
    .optional()
    .or(z.literal("")),
  copyrightNotice: z.string().optional(),
  contactUrl: z.url("有効なURLを入力してください").optional().or(z.literal("")),
});

export type AppSchema = z.infer<typeof appSchema>;

export const surveySchema = z.object({
  appId: z.string().min(1, "アプリIDは必須です"),
  title: z.string().min(1, "タイトルは必須です"),
  slug: z
    .string()
    .min(1, "スラッグは必須です")
    .regex(/^[a-zA-Z0-9-]+$/, "スラッグは英数字とハイフンのみ使用できます"),
  description: z.string().optional(),
  notes: z.string().optional(),
  startAt: z.date({ message: "開始日時は必須です" }),
  endAt: z.date({ message: "終了日時は必須です" }),
  themeColor: z.string().min(4, "無効なカラーコードです"), // e.g., #fff or #ffffff
  headerImage: z
    .url("有効なURLを入力してください")
    .optional()
    .or(z.literal("")),
  bgImage: z.url("有効なURLを入力してください").optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export type SurveySchema = z.infer<typeof surveySchema>;

export const questionFormSchema = z.object({
  type: z.enum(["RADIO", "SELECT", "TEXT", "CHECKBOX", "EMAIL", "TEXTAREA"]),
  label: z.string().min(1, "質問文は必須です"),
  required: z.boolean(),
  maxLength: z.string().optional(), // Input type="number" gives string
  options: z.array(z.object({ value: z.string() })).optional(),
});

export type QuestionFormSchema = z.infer<typeof questionFormSchema>;
