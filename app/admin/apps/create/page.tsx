import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { CreateAppForm } from "@/components/admin/CreateAppForm";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export const metadata: Metadata = {
  title: `アプリ作成 | ${appName}`,
  description: "新しいアプリを作成",
};

export default function CreateAppPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">新しいアプリを作成</h3>
        <p className="text-sm text-muted-foreground">
          アプリの基本情報を入力して新しいアプリを作成してください。
        </p>
      </div>
      <Separator />
      <CreateAppForm />
    </div>
  );
}
