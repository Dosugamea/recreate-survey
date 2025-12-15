import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
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
        <p className="text-muted-foreground">
          Slug:{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {survey.slug}
          </code>
        </p>
      </div>
      <Separator />

      <QuestionList surveyId={survey.id} questions={survey.questions} />
    </div>
  );
}
