"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionFormSchema, QuestionFormSchema } from "@/lib/schemas";
import {
  addQuestion,
  updateQuestion,
} from "@/features/admin/questions/actions/questions";
import { useTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2 } from "lucide-react";

export interface Question {
  id: string;
  type: string;
  label: string;
  required: boolean;
  maxLength: number | null;
  options: string | null;
  order: number;
}

interface QuestionFormProps {
  surveyId: string;
  onSuccess: () => void;
  question?: Question; // If provided, we are in edit mode
}

export function QuestionForm({
  surveyId,
  onSuccess,
  question,
}: QuestionFormProps) {
  const [isPending, startTransition] = useTransition();

  // Prepare default values
  let defaultValues: QuestionFormSchema = {
    type: "TEXT",
    label: "",
    required: false,
    maxLength: undefined,
    options: [],
  };

  if (question) {
    let opts: { value: string }[] = [];
    if (question.options) {
      try {
        const parsed = JSON.parse(question.options);
        if (Array.isArray(parsed)) {
          opts = parsed.map((v) => ({ value: String(v) }));
        }
      } catch (e) {
        console.error("Failed to parse options", e);
      }
    }

    defaultValues = {
      type: question.type as QuestionFormSchema["type"],
      label: question.label,
      required: question.required,
      maxLength: question.maxLength?.toString(),
      options: opts,
    };
  }

  const form = useForm<QuestionFormSchema>({
    resolver: zodResolver(questionFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const type = useWatch({ control: form.control, name: "type" });
  const showOptions =
    type === "RADIO" || type === "SELECT" || type === "CHECKBOX";
  const showMaxLength =
    type === "TEXT" || type === "EMAIL" || type === "TEXTAREA";

  function onSubmit(data: QuestionFormSchema) {
    startTransition(async () => {
      if (question) {
        await updateQuestion(question.id, surveyId, data);
      } else {
        await addQuestion(surveyId, data);
      }
      onSuccess();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>質問タイプ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="タイプを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TEXT">短文回答 (Text)</SelectItem>
                  <SelectItem value="TEXTAREA">長文回答 (Textbox)</SelectItem>
                  <SelectItem value="EMAIL">メールアドレス (Email)</SelectItem>
                  <SelectItem value="RADIO">単一選択 (Radio)</SelectItem>
                  <SelectItem value="CHECKBOX">複数選択 (Checkbox)</SelectItem>
                  <SelectItem value="SELECT">
                    ドロップダウン (Select)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>質問文</FormLabel>
              <FormControl>
                <Input placeholder="例: 好きな色は何ですか？" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">必須</FormLabel>
                <FormDescription>
                  この質問への回答を必須にします。
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {showMaxLength && (
          <FormField
            control={form.control}
            name="maxLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最大文字数 (任意)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 100"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {showOptions && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel>選択肢</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ value: "" })}
              >
                <Plus className="h-4 w-4 mr-2" /> 選択肢を追加
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`options.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={`Option ${index + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {question ? "変更を保存" : "質問を追加"}
        </Button>
      </form>
    </Form>
  );
}
