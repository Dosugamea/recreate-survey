import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          アンケート結果: {survey.title}
        </h2>
        <p className="text-muted-foreground">
          総回答数:{" "}
          <span className="font-bold text-foreground">
            {survey._count.responses}
          </span>
        </p>
      </div>
      <Separator />

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
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {options.map((opt: string) => (
                          <div key={opt} className="contents">
                            <span>{opt}</span>
                            <div className="flex items-center gap-2">
                              <div className="h-2 bg-primary/20 rounded-full flex-1 overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{
                                    width: `${
                                      ((counts[opt] || 0) /
                                        (survey._count.responses || 1)) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                              <span className="w-8 text-right">
                                {counts[opt] || 0}
                              </span>
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
