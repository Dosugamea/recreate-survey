import { Survey, Question, App } from "@prisma/client";
import { PageHeader } from "@/features/admin/layout/components/PageHeader";
import { QuestionList } from "@/features/admin/questions/components/QuestionList";

interface SurveyWithQuestionsAndApp extends Survey {
  questions: Question[];
  app: App;
}

interface SurveyQuestionsPageRootProps {
  survey: SurveyWithQuestionsAndApp;
}

export function SurveyQuestionsPageRoot({
  survey,
}: SurveyQuestionsPageRootProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={`質問項目編集: ${survey.title}`}
        backHref={`/admin/surveys/${survey.id}`}
        url={`/${survey.app.slug}/${survey.slug}/form`}
        externalLinkHref={`/${survey.app.slug}/${survey.slug}/form?auser_id=dummy`}
        externalLinkTitle="アンケートを開く"
      />

      <QuestionList surveyId={survey.id} questions={survey.questions} />
    </div>
  );
}
