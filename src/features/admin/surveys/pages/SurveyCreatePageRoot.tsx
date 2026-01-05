import { App } from "@prisma/client";
import { PageHeader } from "@/features/admin/layout/components/PageHeader";
import { CreateSurveyForm } from "@/features/admin/surveys/components/create/CreateSurveyForm";

interface SurveyCreatePageRootProps {
  apps: App[];
}

export function SurveyCreatePageRoot({ apps }: SurveyCreatePageRootProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="新しいアンケートを作成"
        backHref="/admin/surveys"
        description="詳細を入力して新しいアンケートキャンペーンを開始してください。"
      />
      <CreateSurveyForm apps={apps} />
    </div>
  );
}
