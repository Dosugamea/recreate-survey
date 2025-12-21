import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/layout/PageHeader";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
  });

  if (!survey) {
    return {
      title: `アンケート結果 | ${appName}`,
    };
  }

  return {
    title: `アンケート結果 | ${appName}`,
    description: `「${survey.title}」の結果`,
  };
}

export default async function SurveyResultsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          answers: true,
        },
      },
      _count: {
        select: { responses: true },
      },
    },
  });

  if (!survey) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`アンケート結果: ${survey.title}`}
        backHref={`/admin/surveys/${params.id}`}
        description={`総回答数: ${survey._count.responses}`}
      />

      <div className="space-y-8">
        {survey.questions.map((q) => (
          <div key={q.id} className="border p-4 rounded-lg bg-card">
            <h3 className="font-semibold mb-4">{q.label}</h3>
            <div className="space-y-2">
              {q.type === "TEXT" || q.type === "EMAIL" ? (
                <div className="max-h-40 overflow-y-auto space-y-2 bg-muted/50 p-2 rounded">
                  {q.answers.map((a) => (
                    <div
                      key={a.id}
                      className="text-sm border-b last:border-0 pb-1"
                    >
                      {a.value}
                    </div>
                  ))}
                  {q.answers.length === 0 && (
                    <span className="text-muted-foreground text-sm">
                      回答なし
                    </span>
                  )}
                </div>
              ) : (
                // Aggregate for choices
                <div className="space-y-1">
                  {/* Simple tally */}
                  {(() => {
                    const counts: Record<string, number> = {};
                    q.answers.forEach((a) => {
                      const vals = a.value.split(","); // Handle checkbox multiple values
                      vals.forEach((v) => {
                        counts[v] = (counts[v] || 0) + 1;
                      });
                    });
                    // Get options from question to show 0 counts too?
                    const options = q.options ? JSON.parse(q.options) : [];

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {options.map((opt: string) => (
                          <div
                            key={opt}
                            className="contents sm:block bg-muted/20 p-2 rounded"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium wrap-break-word">
                                {opt}
                              </span>
                              <span className="text-muted-foreground w-8 text-right">
                                {counts[opt] || 0}
                              </span>
                            </div>
                            <div className="h-2 bg-primary/20 rounded-full w-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{
                                  width: `${
                                    ((counts[opt] || 0) /
                                      (survey._count.responses || 1)) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
