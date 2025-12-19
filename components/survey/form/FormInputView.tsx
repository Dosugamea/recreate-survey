"use client";

import { Question } from "@prisma/client";
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { QuestionItem } from "@/components/survey/form/QuestionItem";
import { ConfirmationButton } from "@/components/survey/form/ConfirmationButton";

interface FormInputViewProps {
  /** アンケートの質問リスト。order順に表示される */
  questions: Question[];
  /** react-hook-formのregister関数。フォームフィールドの登録に使用 */
  register: UseFormRegister<FieldValues>;
  /** テーマカラー（16進数形式、例: "#6c4034"）。ボタンやUI要素の色に使用 */
  themeColor: string;
  /** react-hook-formのエラーオブジェクト。各質問のバリデーションエラーを保持 */
  errors: FieldErrors<FieldValues>;
  /** 必須項目がすべて入力されているかどうか。trueの場合、確認ページへ進むボタンが有効になる */
  isAllRequiredFieldsFilled: boolean;
  /** 確認ページへ進むボタンがクリックされたときに呼ばれるコールバック関数 */
  onGoToConfirmation: () => void;
}

export function FormInputView({
  questions,
  register,
  themeColor,
  errors,
  isAllRequiredFieldsFilled,
  onGoToConfirmation,
}: FormInputViewProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGoToConfirmation();
  };

  return (
    <div className="px-4 pb-8">
      <div id="read" className="text-sm text-center my-8 font-medium">
        以下の設問にお答えください。
      </div>
      <form onSubmit={handleFormSubmit}>
        {questions.map((q) => (
          <QuestionItem
            key={q.id}
            question={q}
            register={register}
            themeColor={themeColor}
            error={errors[q.id] ? "Required" : undefined}
          />
        ))}

        <ConfirmationButton
          onClick={onGoToConfirmation}
          disabled={!isAllRequiredFieldsFilled}
          themeColor={themeColor}
        />
      </form>
    </div>
  );
}
