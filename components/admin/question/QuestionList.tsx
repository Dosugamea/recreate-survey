"use client";

import { useState, useTransition } from "react";
import {
  QuestionForm,
  Question,
} from "@/components/admin/question/QuestionForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowDown, ArrowUp, Edit, Plus, Trash2 } from "lucide-react";
import { deleteQuestion, reorderQuestions } from "@/app/actions/questions";
import { cn } from "@/lib/utils";

interface QuestionListProps {
  surveyId: string;
  questions: Question[];
}

export function QuestionList({ surveyId, questions }: QuestionListProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    if (confirm("本当に削除しますか？")) {
      await deleteQuestion(id, surveyId);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === questions.length - 1) return;

    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];

    // Prepare payload: id and new order
    const updates = newQuestions.map((q, i) => ({
      id: q.id,
      order: i + 1,
    }));

    startTransition(async () => {
      await reorderQuestions(updates, surveyId);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h3 className="text-xl font-semibold">質問一覧</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> 質問を追加
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto w-[95%] rounded-lg">
            <DialogHeader>
              <DialogTitle>新しい質問を追加</DialogTitle>
            </DialogHeader>
            <QuestionForm
              surveyId={surveyId}
              onSuccess={() => setIsAddOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={!!editingQuestion}
        onOpenChange={(open) => !open && setEditingQuestion(null)}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto w-[95%] rounded-lg">
          <DialogHeader>
            <DialogTitle>質問を編集</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <QuestionForm
              surveyId={surveyId}
              question={editingQuestion}
              onSuccess={() => setEditingQuestion(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
            質問はまだありません。
          </div>
        ) : (
          questions.map((q, index) => (
            <div
              key={q.id}
              className={cn(
                "p-4 border rounded-lg bg-card flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-all",
                isPending && "opacity-70 pointer-events-none"
              )}
            >
              <div className="flex gap-4 items-start w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Q{index + 1}
                    </span>
                    <span className="font-medium bg-muted px-2 py-0.5 rounded text-xs shrink-0">
                      {q.type}
                    </span>
                    {q.required && (
                      <span className="text-destructive text-xs shrink-0">
                        必須
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-medium wrap-break-word">{q.label}</p>
                  {q.options &&
                    (q.type === "SELECT" ||
                      q.type === "RADIO" ||
                      q.type === "CHECKBOX") && (
                      <p className="text-sm text-muted-foreground mt-1 wrap-break-word">
                        選択肢:{" "}
                        {(() => {
                          try {
                            return JSON.parse(q.options).join(", ");
                          } catch {
                            return q.options;
                          }
                        })()}
                      </p>
                    )}
                  {q.maxLength && (
                    <p className="text-sm text-muted-foreground">
                      最大文字数: {q.maxLength}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                <div className="flex flex-col gap-1 mx-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === questions.length - 1}
                    onClick={() => handleMove(index, "down")}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingQuestion(q)}
                    className="w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(q.id)}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
