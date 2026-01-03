import type { Metadata } from "next";
import { getAllApps } from "@/features/admin/apps/actions/apps";
import { AppsPageRoot } from "@/features/admin/apps/components/AppsPageRoot";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `アプリ管理 | ${appName}`,
    description: "アプリの管理",
  };
}

export default async function AppsPage() {
  const apps = await getAllApps();

  return <AppsPageRoot apps={apps} />;
}
