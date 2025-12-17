"use client";

import { Question } from "@prisma/client";
import { useForm, FieldValues } from "react-hook-form";
import { useState, useTransition, useEffect } from "react";
import { submitSurvey } from "@/app/actions/submission";
import { QuestionItem } from "./QuestionItem";
import { Button } from "@/components/ui/button";
import { ConfirmationView } from "./ConfirmationView";

interface SurveyFormProps {
  surveyId: string;
  questions: Question[];
  userId: string;
  themeColor: string;
}

type Step = "input" | "confirmation";

export function SurveyForm({
  surveyId,
  questions,
  userId,
  themeColor,
}: SurveyFormProps) {
  const [step, setStep] = useState<Step>("input");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
    watch,
  } = useForm();

  // 必須項目のIDを取得
  const requiredQuestionIds = questions
    .filter((q) => q.required)
    .map((q) => q.id);

  // フォームの値を監視
  const formValues = watch();

  // 必須項目が全て入力されているかチェック
  const isAllRequiredFieldsFilled =
    requiredQuestionIds.length === 0 ||
    requiredQuestionIds.every((questionId) => {
      const value = formValues[questionId];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== "";
    });

  const handleGoToConfirmation = async () => {
    // バリデーションを実行
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    setStep("confirmation");
  };

  const handleBackToInput = () => {
    setStep("input");
    // 戻る操作でもアンケート回答の位置にスクロールする
    const surveyTitle = document.getElementById("survey-title");
    if (surveyTitle) {
      surveyTitle.scrollIntoView({ behavior: "auto", block: "start" });
    }
  };

  const onSubmit = (data: FieldValues) => {
    startTransition(async () => {
      const result = await submitSurvey(surveyId, userId, data);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        const errorMessage = result.error || "送信に失敗しました";
        console.error("Submission error:", errorMessage);
        alert(`送信に失敗しました\n${errorMessage}`);
      }
    });
  };

  const handleConfirmSubmit = () => {
    const formData = getValues();
    onSubmit(formData);
  };

  // 確認画面に進んだときにアンケートタイトルの位置にスクロールする
  useEffect(() => {
    if (step === "confirmation") {
      const surveyTitle = document.getElementById("survey-title");
      if (surveyTitle) {
        surveyTitle.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }
  }, [step]);

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

  if (step === "confirmation") {
    return (
      <ConfirmationView
        questions={questions}
        formData={getValues()}
        themeColor={themeColor}
        isPending={isPending}
        onBack={handleBackToInput}
        onSubmit={handleConfirmSubmit}
      />
    );
  }

  return (
    <div className="px-4 pb-8">
      <div id="read" className="text-sm text-center my-8 font-medium">
        以下の設問にお答えください。
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            type="button"
            className="w-full sm:w-auto px-12 py-6 text-lg font-bold text-white shadow-md hover:opacity-90 transition-opacity rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: themeColor }}
            onClick={handleGoToConfirmation}
            disabled={!isAllRequiredFieldsFilled}
          >
            確認ページへ進む
          </Button>
        </div>
      </form>
    </div>
  );
}
