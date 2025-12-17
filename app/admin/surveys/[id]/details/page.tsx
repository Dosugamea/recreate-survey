import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditSurveyForm } from "@/components/admin/EditSurveyForm";
import { PageHeader } from "@/components/admin/PageHeader";

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
      <PageHeader
        title={`アンケート情報編集: ${survey.title}`}
        backHref={`/admin/surveys/${survey.id}`}
        url={`/${survey.app.slug}/${survey.slug}/form`}
        externalLinkHref={`/${survey.app.slug}/${survey.slug}/form?auser_id=dummy`}
        externalLinkTitle="アンケートを開く"
      />

      <EditSurveyForm survey={survey} />
    </div>
  );
}
