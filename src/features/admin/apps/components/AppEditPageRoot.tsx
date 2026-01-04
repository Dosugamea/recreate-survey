import { App } from "@prisma/client";
import { PageHeader } from "@/features/admin/layout/components/PageHeader";
import { EditAppForm } from "@/features/admin/apps/components/EditAppForm";

interface AppEditPageRootProps {
  app: App;
}

export function AppEditPageRoot({ app }: AppEditPageRootProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="アプリ情報を編集"
        backHref="/admin/apps"
        description={`「${app.name}」の基本情報を編集できます。`}
      />
      <EditAppForm app={app} />
    </div>
  );
}
