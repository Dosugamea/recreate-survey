"use client";

import { Question } from "@prisma/client";
import { useForm, FieldValues } from "react-hook-form";
import { useState, useTransition } from "react";
import { submitSurvey } from "@/app/actions/submission";
import { QuestionItem } from "./QuestionItem";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SurveyFormProps {
  surveyId: string;
  questions: Question[];
  userId: string;
  themeColor: string;
}

export function SurveyForm({
  surveyId,
  questions,
  userId,
  themeColor,
}: SurveyFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    startTransition(async () => {
      const result = await submitSurvey(surveyId, userId, data);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        alert("送信に失敗しました");
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-12 bg-gray-50 m-4 rounded-lg">
        <h3 className="text-xl font-bold mb-4" style={{ color: themeColor }}>
          ありがとうございました！
        </h3>
        <p className="mb-4">回答を受け付けました。</p>
        <div className="p-4 bg-white rounded shadow-sm inline-block">
          <p className="text-sm text-gray-500">User ID: {userId}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-8">
      <div id="read" className="text-sm mb-6 font-medium">
        以下の設問にお答えください。
      </div>

      {questions.map((q) => (
        <QuestionItem
          key={q.id}
          question={q}
          register={register}
          themeColor={themeColor}
          error={errors[q.id] ? "Required" : undefined}
        />
      ))}

      <div className="text-center mt-8">
        <Button
          type="submit"
          className="w-full sm:w-auto px-12 py-6 text-lg font-bold text-white shadow-md hover:opacity-90 transition-opacity"
          style={{ backgroundColor: themeColor }}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "回答を送信する"}
        </Button>
      </div>
    </form>
  );
}
