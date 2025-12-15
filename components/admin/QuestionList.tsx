"use client";

import { useState } from "react";
import { AddQuestionForm } from "./AddQuestionForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { deleteQuestion } from "@/app/actions/questions";

interface Question {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options: string | null;
  order: number;
}

interface QuestionListProps {
  surveyId: string;
  questions: Question[];
}

export function QuestionList({ surveyId, questions }: QuestionListProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("本当に削除しますか？")) {
      await deleteQuestion(id, surveyId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">質問一覧</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> 質問を追加
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新しい質問を追加</DialogTitle>
            </DialogHeader>
            <AddQuestionForm
              surveyId={surveyId}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
            質問はまだありません。
          </div>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className="p-4 border rounded-lg bg-card flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium bg-muted px-2 py-0.5 rounded text-xs">
                    {q.type}
                  </span>
                  {q.required && (
                    <span className="text-destructive text-xs">必須</span>
                  )}
                </div>
                <p className="mt-1 font-medium">{q.label}</p>
                {q.options && (
                  <p className="text-sm text-muted-foreground mt-1">
                    選択肢: {JSON.parse(q.options).join(", ")}
                  </p>
                )}
              </div>
              <div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(q.id)}
                >
                  削除
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
