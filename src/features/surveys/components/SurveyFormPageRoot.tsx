import { SurveyContainer } from "@/features/surveys/components/layout/SurveyContainer";
import { SurveyTitle } from "@/features/surveys/components/header/SurveyTitle";
import { SurveyWarn } from "@/features/surveys/components/messages/SurveyWarn";
import { SurveyDescription } from "@/features/surveys/components/header/SurveyDescription";
import { SurveyContent } from "@/features/surveys/components/layout/SurveyContent";
import { SurveyNotes } from "@/features/surveys/components/messages/SurveyNotes";
import { SurveyFooter } from "@/features/surveys/components/footer/SurveyFooter";
import { SurveyBackToTop } from "@/features/surveys/components/footer/SurveyBackToTop";
import { App, Question, Survey } from "@prisma/client";

interface SurveyFormPageRootProps {
  app: App;
  survey: Survey & {
    questions: Question[];
    app: App;
  };
  userId?: string;
  isAlreadySubmitted: boolean;
  isExpired: boolean;
  periodMessage: string;
}

/**
 * アンケートフォームのルートコンポーネント
 */
export function SurveyFormPageRoot({
  app,
  survey,
  userId,
  isAlreadySubmitted,
  isExpired,
  periodMessage,
}: SurveyFormPageRootProps) {
  // フッター用のリンクを構築
  const footerLinks = [
    ...(app.privacyPolicyUrl
      ? [{ label: "プライバシーポリシー", href: app.privacyPolicyUrl }]
      : []),
    ...(app.contactUrl
      ? [{ label: "お問い合わせ", href: app.contactUrl }]
      : []),
  ];

  return (
    <>
      <SurveyContainer survey={survey}>
        {!isExpired && userId ? (
          <SurveyContent
            survey={survey}
            questions={survey.questions}
            userId={userId}
            appName={app.name}
            isAlreadySubmitted={isAlreadySubmitted}
          />
        ) : (
          <article>
            <SurveyTitle
              title={survey.title}
              headerImage={survey.headerImage}
            />
            <SurveyWarn show={!userId} />
            <SurveyDescription
              description={survey.description}
              themeColor={survey.themeColor}
              periodMessage={periodMessage}
            />
          </article>
        )}
        <SurveyNotes survey={survey} />
      </SurveyContainer>
      <SurveyFooter
        links={footerLinks.length > 0 ? footerLinks : undefined}
        copyright={app.copyrightNotice ?? undefined}
        themeColor={survey.themeColor}
      />
      <SurveyBackToTop />
    </>
  );
}
