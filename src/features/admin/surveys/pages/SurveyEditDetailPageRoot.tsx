import { Survey, App } from "@prisma/client";
import { PageHeader } from "@/features/admin/layout/components/PageHeader";
import { EditSurveyForm } from "@/features/admin/surveys/components/edit/EditSurveyForm";

interface SurveyEditPageRootProps {
  survey: Survey & {
    app: App;
  };
}

export function SurveyEditPageRoot({ survey }: SurveyEditPageRootProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={`アンケート情報編集: ${survey.title}`}
        backHref={`/admin/surveys/${survey.id}`}
        url={`/${survey.app.slug}/${survey.slug}/form`}
        externalLinkHref={`/${survey.app.slug}/${survey.slug}/form?auser_id=dummy`}
        externalLinkTitle="アンケートを開く"
      />

      <EditSurveyForm survey={survey} />
    </div>
  );
}
