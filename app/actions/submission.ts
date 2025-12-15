"use server";

import { prisma } from "@/lib/prisma";

export async function submitSurvey(
  surveyId: string,
  userId: string,
  rawAnswers: Record<string, string | string[]>
) {
  // Create Response
  try {
    const response = await prisma.response.create({
      data: {
        surveyId,
        userId,
        answers: {
          create: Object.entries(rawAnswers).map(([questionId, value]) => ({
            questionId,
            value: Array.isArray(value) ? value.join(",") : value,
          })),
        },
      },
    });

    return { success: true, responseId: response.id };
  } catch (e) {
    console.error(e);
    return { error: "Failed to submit survey." };
  }
}
