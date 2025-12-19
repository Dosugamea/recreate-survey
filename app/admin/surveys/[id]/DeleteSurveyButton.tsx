"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteSurvey } from "@/app/actions/surveys";

interface DeleteSurveyButtonProps {
  surveyId: string;
  surveyTitle: string;
}

export function DeleteSurveyButton({
  surveyId,
  surveyTitle,
}: DeleteSurveyButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSurvey(surveyId);
    } catch (error) {
      console.error("削除エラー:", error);
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>アンケートを削除しますか？</DialogTitle>
            <DialogDescription>
              この操作は取り消せません。アンケート「{surveyTitle}」と
              すべての関連データ（質問項目、回答など）が完全に削除されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "削除中..." : "削除する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        variant="destructive"
        size="sm"
        className="mt-2 mb-2"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        アンケートを削除
      </Button>
    </>
  );
}
