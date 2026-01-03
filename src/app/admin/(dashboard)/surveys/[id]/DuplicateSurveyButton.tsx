"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { duplicateSurvey } from "@/features/admin/surveys/actions/surveys";

interface DuplicateSurveyButtonProps {
  surveyId: string;
  surveyTitle: string;
}

export function DuplicateSurveyButton({
  surveyId,
  surveyTitle,
}: DuplicateSurveyButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const result = await duplicateSurvey(surveyId);
      if (result?.error) {
        console.error("複製エラー:", result.error);
        setIsDuplicating(false);
        setOpen(false);
      } else if (result?.success && result.surveyId) {
        // 複製成功時、新しいアンケートの詳細ページにリダイレクト
        router.push(`/admin/surveys/${result.surveyId}`);
      }
    } catch (error) {
      console.error("複製エラー:", error);
      setIsDuplicating(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>アンケートを複製しますか？</DialogTitle>
            <DialogDescription>
              アンケート「{surveyTitle}」の設定と質問項目を複製します。
              複製されたアンケートは非公開の状態で作成されます。
              アンケート結果は複製されません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDuplicating}
            >
              キャンセル
            </Button>
            <Button
              variant="default"
              onClick={handleDuplicate}
              disabled={isDuplicating}
            >
              {isDuplicating ? "複製中..." : "複製する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="default" size="sm" onClick={() => setOpen(true)}>
        <Copy className="mr-2 h-4 w-4" />
        複製する
      </Button>
    </>
  );
}
