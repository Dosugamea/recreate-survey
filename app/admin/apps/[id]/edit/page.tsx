import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { EditAppForm } from "@/components/admin/EditAppForm";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
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
      <div>
        <h3 className="text-lg font-medium">アプリ情報を編集</h3>
        <p className="text-sm text-muted-foreground">
          「{app.name}」の基本情報を編集できます。
        </p>
      </div>
      <Separator />
      <EditAppForm app={app} />
    </div>
  );
}
