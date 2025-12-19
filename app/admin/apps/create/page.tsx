import type { Metadata } from "next";
import { CreateAppForm } from "@/components/admin/app/CreateAppForm";
import { PageHeader } from "@/components/admin/layout/PageHeader";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export const metadata: Metadata = {
  title: `アプリ作成 | ${appName}`,
  description: "新しいアプリを作成",
};

export default function CreateAppPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="新しいアプリを作成"
        backHref="/admin/apps"
        description="アプリの基本情報を入力して新しいアプリを作成してください。"
      />
      <CreateAppForm />
    </div>
  );
}
