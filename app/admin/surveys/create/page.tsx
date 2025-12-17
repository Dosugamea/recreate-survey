import { CreateSurveyForm } from "@/components/admin/CreateSurveyForm";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export const metadata: Metadata = {
  title: `アンケート作成 | ${appName}`,
  description: "新しいアンケートを作成",
};

export default function CreateSurveyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">新しいアンケートを作成</h3>
        <p className="text-sm text-muted-foreground">
          詳細を入力して新しいアンケートキャンペーンを開始してください。
        </p>
      </div>
      <Separator />
      <CreateSurveyForm />
    </div>
  );
}

