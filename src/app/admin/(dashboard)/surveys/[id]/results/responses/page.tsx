import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/features/admin/components/layout/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { DeleteResponseButton } from "./DeleteResponseButton";

export const dynamic = "force-dynamic";

export default async function SurveyResponsesPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    select: { title: true },
  });

  if (!survey) {
    notFound();
  }

  const responses = await prisma.response.findMany({
    where: { surveyId: params.id },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title={`回答一覧: ${survey.title}`}
        backHref={`/admin/surveys/${params.id}/results`}
      />

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ユーザーID</TableHead>
              <TableHead>回答日時</TableHead>

              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response) => (
              <TableRow key={response.id}>
                <TableCell className="font-mono text-xs">
                  {response.userId}
                </TableCell>
                <TableCell>
                  {format(response.submittedAt, "yyyy/MM/dd HH:mm", {
                    locale: ja,
                  })}
                </TableCell>

                <TableCell className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link
                      href={`/admin/surveys/${params.id}/results/responses/${response.id}`}
                    >
                      詳細
                    </Link>
                  </Button>
                  <DeleteResponseButton
                    surveyId={params.id}
                    responseId={response.id}
                  />
                </TableCell>
              </TableRow>
            ))}
            {responses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground py-8"
                >
                  回答がまだありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
