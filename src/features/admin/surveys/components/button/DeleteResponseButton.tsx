"use client";

import { deleteResponse } from "@/features/admin/surveys/actions/surveys";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteResponseButton({
  surveyId,
  responseId,
}: {
  surveyId: string;
  responseId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (
      !confirm(
        "この回答を削除してもよろしいですか？\nこの操作は取り消せません。"
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteResponse(surveyId, responseId);
      if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={handleDelete}
      disabled={isPending}
      title="削除"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
