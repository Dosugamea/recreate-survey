import { useState, useTransition } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { Question } from "@prisma/client";
import { submitSurvey } from "@/app/actions/submission";
import { useRequiredFieldsValidation } from "./useRequiredFieldsValidation";
import { useScrollToElement } from "./useScrollToElement";

type Step = "input" | "confirmation";

interface UseSurveyFormProps {
  /** アンケートのID。送信時に使用 */
  surveyId: string;
  /** アンケートの質問リスト。バリデーションやフォーム生成に使用 */
  questions: Question[];
  /** 回答者のユーザーID。アンケート送信時に使用 */
  userId: string;
  /** アンケート送信が成功したときに呼ばれるコールバック関数 */
  onSubmitted?: () => void;
}

interface UseSurveyFormReturn {
  /** react-hook-formのregister関数。フォームフィールドの登録に使用 */
  register: ReturnType<typeof useForm<FieldValues>>["register"];
  /** react-hook-formのformStateオブジェクト。エラー情報などを含む */
  formState: ReturnType<typeof useForm<FieldValues>>["formState"];
  /** react-hook-formのgetValues関数。現在のフォーム値を取得 */
  getValues: ReturnType<typeof useForm<FieldValues>>["getValues"];
  /** react-hook-formのtrigger関数。バリデーションを手動で実行 */
  trigger: ReturnType<typeof useForm<FieldValues>>["trigger"];
  /** react-hook-formのwatch関数。フォーム値の変更を監視 */
  watch: ReturnType<typeof useForm<FieldValues>>["watch"];

  /** 現在のステップ。"input"（入力画面）または"confirmation"（確認画面） */
  step: Step;
  /** アンケートが送信済みかどうか。trueの場合、フォームは非表示になる */
  isSubmitted: boolean;
  /** アンケート送信処理が進行中かどうか。trueの場合、送信ボタンなどが無効化される */
  isPending: boolean;

  /** 必須項目がすべて入力されているかどうか。trueの場合、確認ページへ進むボタンが有効になる */
  isAllRequiredFieldsFilled: boolean;

  /** 確認ページへ進む処理。バリデーションを実行し、成功した場合に確認画面に遷移 */
  handleGoToConfirmation: () => Promise<void>;
  /** 入力画面に戻る処理。確認画面から入力画面に戻り、スクロール位置を調整 */
  handleBackToInput: () => void;
  /** アンケートを送信する処理。確認画面から実行される */
  handleConfirmSubmit: () => void;
}

/**
 * アンケートフォームの管理ロジックを提供するフック
 */
export function useSurveyForm({
  surveyId,
  questions,
  userId,
  onSubmitted,
}: UseSurveyFormProps): UseSurveyFormReturn {
  const [step, setStep] = useState<Step>("input");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { register, formState, getValues, trigger, watch } =
    useForm<FieldValues>();

  const { isAllRequiredFieldsFilled } = useRequiredFieldsValidation({
    questions,
    watch,
  });

  // 確認画面に進んだときにアンケートタイトルの位置にスクロールする
  useScrollToElement({
    elementId: "survey-title",
    shouldScroll: step === "confirmation",
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
        onSubmitted?.();
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

  return {
    register,
    formState,
    getValues,
    trigger,
    watch,
    step,
    isSubmitted,
    isPending,
    isAllRequiredFieldsFilled,
    handleGoToConfirmation,
    handleBackToInput,
    handleConfirmSubmit,
  };
}
