import { CreateSurveyForm } from "@/features/admin/surveys/components/CreateSurveyForm";
import type { Metadata } from "next";
import { PageHeader } from "@/features/admin/components/layout/PageHeader";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `アンケート作成 | ${appName}`,
    description: "新しいアンケートを作成",
  };
}

export default function CreateSurveyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="新しいアンケートを作成"
        backHref="/admin/surveys"
        description="詳細を入力して新しいアンケートキャンペーンを開始してください。"
      />
      <CreateSurveyForm />
    </div>
  );
}
