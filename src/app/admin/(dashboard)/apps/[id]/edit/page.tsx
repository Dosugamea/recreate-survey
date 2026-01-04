import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApp } from "@/features/admin/apps/actions/apps";
import { AppEditPageRoot } from "@/features/admin/apps/components/AppEditPageRoot";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const app = await getApp(params.id);

  if (!app) {
    return {
      title: `アプリ編集 | ${appName}`,
    };
  }

  return {
    title: `アプリ編集: ${app.name} | ${appName}`,
    description: `「${app.name}」の編集`,
  };
}

export const dynamic = "force-dynamic";

export default async function EditAppPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const app = await getApp(params.id);

  if (!app) {
    notFound();
  }

  return <AppEditPageRoot app={app} />;
}
