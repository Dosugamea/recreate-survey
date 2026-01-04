import { Response } from "@prisma/client";
import { PageHeader } from "@/features/admin/layout/components/PageHeader";
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
import { DeleteResponseButton } from "@/features/admin/surveys/components/DeleteResponseButton";

interface SurveyResponsesListPageRootProps {
  surveyId: string;
  surveyTitle: string;
  responses: Response[];
}

export function SurveyResponsesListPageRoot({
  surveyId,
  surveyTitle,
  responses,
}: SurveyResponsesListPageRootProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        title={`回答一覧: ${surveyTitle}`}
        backHref={`/admin/surveys/${surveyId}/results`}
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
                      href={`/admin/surveys/${surveyId}/results/responses/${response.id}`}
                    >
                      詳細
                    </Link>
                  </Button>
                  <DeleteResponseButton
                    surveyId={surveyId}
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
