import { useMemo } from "react";
import { FieldValues, UseFormWatch } from "react-hook-form";
import { Question } from "@prisma/client";

interface UseRequiredFieldsValidationProps {
  /** アンケートの質問リスト。requiredがtrueの質問を必須項目として判定 */
  questions: Question[];
  /** react-hook-formのwatch関数。フォーム値の変更を監視してバリデーションに使用 */
  watch: UseFormWatch<FieldValues>;
}

/**
 * 必須項目のバリデーションロジックを提供するフック
 */
export function useRequiredFieldsValidation({
  questions,
  watch,
}: UseRequiredFieldsValidationProps) {
  const formValues = watch();

  const requiredQuestionIds = useMemo(
    () => questions.filter((q) => q.required).map((q) => q.id),
    [questions]
  );

  const isAllRequiredFieldsFilled = useMemo(() => {
    if (requiredQuestionIds.length === 0) {
      return true;
    }

    return requiredQuestionIds.every((questionId) => {
      const value = formValues[questionId];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== "";
    });
  }, [requiredQuestionIds, formValues]);

  return {
    /** 必須項目の質問IDの配列 */
    requiredQuestionIds,
    /** 必須項目がすべて入力されているかどうか。trueの場合、すべての必須項目が入力済み */
    isAllRequiredFieldsFilled,
  };
}
