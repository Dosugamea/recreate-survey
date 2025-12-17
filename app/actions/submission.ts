"use server";

import { prisma } from "@/lib/prisma";

export async function submitSurvey(
  surveyId: string,
  userId: string,
  rawAnswers: Record<string, string | string[]>
) {
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
