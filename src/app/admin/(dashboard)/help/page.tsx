import type { Metadata } from "next";
import { HelpPageRoot } from "@/features/admin/help/components/HelpPageRoot";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `ヘルプ | ${appName}`,
    description: "アプリの設定方法と使い方",
  };
}

export default function HelpPage() {
  return <HelpPageRoot />;
}
