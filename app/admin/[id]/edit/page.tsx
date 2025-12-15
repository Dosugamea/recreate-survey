import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionList } from "@/components/admin/QuestionList";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function EditSurveyPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!survey) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          アンケート編集: {survey.title}
        </h2>
        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
          <span>Slug:</span>
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {survey.slug}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            asChild
            title="アンケートを開く"
          >
            <Link href={`/${survey.slug}?auser_id=dummy`} target="_blank">
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
      <Separator />

      <QuestionList surveyId={survey.id} questions={survey.questions} />
    </div>
  );
}
