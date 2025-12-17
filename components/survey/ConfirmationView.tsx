"use client";

import { Question } from "@prisma/client";
import { FieldValues } from "react-hook-form";
import { cn, hexToRgba } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "./SubmitButton";

interface ConfirmationViewProps {
  questions: Question[];
  formData: FieldValues;
  themeColor: string;
  isPending: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function ConfirmationView({
  questions,
  formData,
  themeColor,
  isPending,
  onBack,
  onSubmit,
}: ConfirmationViewProps) {
  const getAnswerDisplay = (question: Question): string => {
    const value = formData[question.id];
    if (!value) return "未回答";

    if (Array.isArray(value)) {
      return value.map((item) => `- ${item}`).join("\n");
    }

    return String(value);
  };

  const legendStyle = {
    backgroundColor: hexToRgba(themeColor, 0.1),
    borderColor: themeColor,
    color: themeColor,
    borderWidth: "1px",
    borderStyle: "solid",
  };

  return (
    <div className="px-4 pb-8">
      <div id="read" className="text-sm text-center my-8 font-medium">
        以下の内容で送信してもよろしいですか？
      </div>

      <div className="space-y-6 mb-8">
        {questions.map((question) => (
          <fieldset key={question.id} className="mb-6">
            <legend
              className="w-full p-2 mb-2 font-bold text-sm sm:text-base rounded"
              style={legendStyle}
            >
              {question.label}
              {question.required && (
                <span className="text-red-500 ml-1">*必須</span>
              )}
            </legend>
            <div className="px-2">
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {getAnswerDisplay(question)}
                </p>
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      <div className="text-center mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            type="button"
            variant="auto"
            className="w-full sm:w-auto px-12 py-6 text-lg font-bold rounded-lg border-2"
            style={{
              borderColor: themeColor,
              color: themeColor,
              backgroundColor: "transparent",
            }}
            onClick={onBack}
            disabled={isPending}
          >
            戻る
          </Button>
          <Button
            type="button"
            variant="auto"
            className="w-full sm:w-auto px-12 py-6 text-lg font-bold text-white shadow-md hover:opacity-90 transition-opacity rounded-lg"
            style={{ backgroundColor: themeColor }}
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? "送信中..." : "回答を送信する"}
          </Button>
        </div>
      </div>
    </div>
  );
}
