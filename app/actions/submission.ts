"use server";

import { prisma } from "@/lib/prisma";
import { verifyTurnstile } from "@/lib/turnstile";

export async function submitSurvey(
  surveyId: string,
  userId: string,
  rawAnswers: Record<string, string | string[]>,
  turnstileToken: string | null
) {
  // Turnstile検証
  const isTurnstileValid = await verifyTurnstile(turnstileToken);
  if (!isTurnstileValid) {
    return {
      error:
        "スパム対策の検証に失敗しました。ページを再読み込みして再度お試しください。",
    };
  }

  // Create Response
  try {
    // まず、surveyIdが存在するか確認
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: { questions: true },
    });

    if (!survey) {
      return { error: "Survey not found." };
    }

    // アンケートがアクティブかどうか確認
    if (!survey.isActive) {
      return { error: "このアンケートは現在利用できません。" };
    }

    // 期間のバリデーション
    const now = new Date();
    if (now < survey.startAt) {
      return { error: "このアンケートはまだ開始されていません。" };
    }
    if (now > survey.endAt) {
      return { error: "このアンケートは終了しました。" };
    }

    // 同一ユーザーIDでの重複登録チェック
    const existingResponse = await prisma.response.findUnique({
      where: {
        surveyId_userId: {
          surveyId,
          userId,
        },
      },
    });

    if (existingResponse) {
      return { error: "このアンケートは既に回答済みです。" };
    }

    // questionIdが全て存在するか確認
    const questionIds = survey.questions.map((q) => q.id);
    const submittedQuestionIds = Object.keys(rawAnswers);
    const invalidQuestionIds = submittedQuestionIds.filter(
      (id) => !questionIds.includes(id)
    );

    if (invalidQuestionIds.length > 0) {
      console.error("Invalid question IDs:", invalidQuestionIds);
      return {
        error: `Invalid question IDs: ${invalidQuestionIds.join(", ")}`,
      };
    }

    // 空の値をフィルタリング
    const validAnswers = Object.entries(rawAnswers).filter(([, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== "";
    });

    if (validAnswers.length === 0) {
      return { error: "No valid answers provided." };
    }

    const response = await prisma.response.create({
      data: {
        surveyId,
        userId,
        answers: {
          create: validAnswers.map(([questionId, value]) => ({
            questionId,
            value: Array.isArray(value) ? value.join(",") : String(value),
          })),
        },
      },
    });

    return { success: true, responseId: response.id };
  } catch (e) {
    console.error("Submission error:", e);
    // より詳細なエラー情報を返す
    if (e instanceof Error) {
      console.error("Error message:", e.message);
      console.error("Error stack:", e.stack);
      return { error: `Failed to submit survey: ${e.message}` };
    }
    return { error: "Failed to submit survey." };
  }
}
