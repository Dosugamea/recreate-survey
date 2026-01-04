import type { Metadata } from "next";
import { AppCreatePageRoot } from "@/features/admin/apps/components/AppCreatePageRoot";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `アプリ作成 | ${appName}`,
    description: "新しいアプリを作成",
  };
}

export default function CreateAppPage() {
  return <AppCreatePageRoot />;
}
