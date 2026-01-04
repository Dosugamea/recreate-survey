import { PageHeader } from "@/features/admin/layout/components/PageHeader";
import { CreateAppForm } from "@/features/admin/apps/components/CreateAppForm";

export function AppCreatePageRoot() {
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
