import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditSurveyForm } from "@/components/admin/EditSurveyForm";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
  });

  if (!survey) {
    return {
      title: `アンケート編集 | ${appName}`,
    };
  }

  return {
    title: `アンケート編集 | ${appName}`,
    description: `「${survey.title}」の編集`,
  };
}

export const dynamic = "force-dynamic";

export default async function EditSurveyPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    include: {
      app: true,
    },
  });

  if (!survey) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/surveys/${survey.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            アンケート情報編集: {survey.title}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <span>URL:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              /{survey.app.slug}/{survey.slug}/form
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              asChild
              title="アンケートを開く"
            >
              <Link
                href={`/${survey.app.slug}/${survey.slug}/form?auser_id=dummy`}
                target="_blank"
              >
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Separator />

      <EditSurveyForm survey={survey} />
    </div>
  );
}
