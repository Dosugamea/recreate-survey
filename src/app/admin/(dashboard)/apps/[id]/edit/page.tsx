import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditAppForm } from "@/features/admin/apps/components/EditAppForm";
import { PageHeader } from "@/features/admin/components/layout/PageHeader";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const app = await prisma.app.findUnique({
    where: { id: params.id },
  });

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
  const app = await prisma.app.findUnique({
    where: { id: params.id },
  });

  if (!app) {
    notFound();
  }

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
