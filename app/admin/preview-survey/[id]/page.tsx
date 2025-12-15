import { prisma } from "@/lib/prisma";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { SurveyHeader } from "@/components/survey/SurveyHeader";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewSurveyPage({ params }: PageProps) {
  const { id } = await params;
  const survey = await prisma.survey.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!survey) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4">
      {/* Navigation back */}
      <div className="max-w-2xl mx-auto mb-6">
        <Link href="/admin/preview-survey">
          <Button
            variant="ghost"
            className="gap-2 pl-0 hover:bg-transparent hover:underline text-gray-600"
          >
            <ArrowLeft size={16} /> 一覧に戻る
          </Button>
        </Link>
      </div>

      {/* Preview Container */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden">
        <div className="bg-yellow-100 p-2 text-center text-yellow-800 text-xs font-bold border-b border-yellow-200">
          これはプレビュー画面です（回答は送信されますがDBに保存されるためテストデータになります）
        </div>

        {/* Header Component */}
        <SurveyHeader survey={survey} />

        {/* Form Component (Answering Interface) */}
        <SurveyForm
          surveyId={survey.id}
          questions={survey.questions}
          userId={`preview-user-${Date.now()}`}
          themeColor={survey.themeColor}
        />
      </div>

      <div className="max-w-2xl mx-auto mt-8 text-center text-gray-400 text-sm">
        Survey Preview Mode
      </div>
    </div>
  );
}
