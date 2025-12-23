"use client";

import { Survey, Question } from "@prisma/client";
import { useSurveyForm } from "@/hooks/useSurveyForm";
import { SurveyTitle } from "@/components/survey/header/SurveyTitle";
import { SurveyWarn } from "@/components/survey/messages/SurveyWarn";
import { SurveyThanks } from "@/components/survey/messages/SurveyThanks";
import { SurveyDescription } from "@/components/survey/header/SurveyDescription";
import { SurveyIntroduction } from "@/components/survey/header/SurveryIntroduction";
import { FormInputView } from "@/components/survey/form/FormInputView";
import { ConfirmationView } from "@/components/survey/form/ConfirmationView";
import { useSurveyPeriod } from "@/hooks/useSurveyPeriod";

interface SurveyContentProps {
  /** アンケートのデータ。タイトル、説明、テーマカラーなどの情報を含む */
  survey: Survey;
  /** アンケートの質問リスト。order順に表示される */
  questions: Question[];
  /** 回答者のユーザーID。アンケート送信時に使用 */
  userId: string;
  /** アプリ名。送信完了メッセージで使用 */
  appName: string;
  /** 既に送信済みかどうか。サーバー側でクッキーをチェックした結果 */
  isAlreadySubmitted?: boolean;
}

/**
 * アンケートコンテンツのコンテナコンポーネント
 * Propsを上から下に流す構造で、フォーム管理ロジックはuseSurveyFormに委譲
 */
export function SurveyContent({
  survey,
  questions,
  userId,
  appName,
  isAlreadySubmitted = false,
}: SurveyContentProps) {
  const {
    register,
    formState: { errors },
    getValues,
    step,
    isSubmitted,
    isPending,
    isAllRequiredFieldsFilled,
    handleGoToConfirmation,
    handleBackToInput,
    handleConfirmSubmit,
  } = useSurveyForm({
    surveyId: survey.id,
    questions,
    userId,
    isAlreadySubmitted,
    onSubmitted: () => {
      // 送信完了時の処理（必要に応じて拡張可能）
    },
  });

  const { title, description, themeColor, headerImage, startAt, endAt } =
    survey;

  const { periodMessage } = useSurveyPeriod({ startAt, endAt });

  return (
    <article>
      <SurveyTitle title={title} headerImage={headerImage} />
      <SurveyWarn show={!userId} />
      <SurveyThanks
        show={isSubmitted}
        themeColor={themeColor}
        appName={appName}
      />
      <SurveyDescription
        periodMessage={periodMessage}
        description={description}
        themeColor={themeColor}
      />
      {!isSubmitted && (
        <>
          <SurveyIntroduction themeColor={themeColor} />
          {step === "confirmation" ? (
            <ConfirmationView
              questions={questions}
              formData={getValues()}
              themeColor={themeColor}
              isPending={isPending}
              onBack={handleBackToInput}
              onSubmit={handleConfirmSubmit}
            />
          ) : (
            <FormInputView
              questions={questions}
              register={register}
              themeColor={themeColor}
              errors={errors}
              isAllRequiredFieldsFilled={isAllRequiredFieldsFilled}
              onGoToConfirmation={handleGoToConfirmation}
            />
          )}
        </>
      )}
    </article>
  );
}
