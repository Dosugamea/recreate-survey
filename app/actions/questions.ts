"use server";

import { prisma } from "@/lib/prisma";
import { QuestionFormSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function addQuestion(surveyId: string, data: QuestionFormSchema) {
  try {
    // Determine the next order
    const lastQuestion = await prisma.question.findFirst({
      where: { surveyId },
      orderBy: { order: "desc" },
    });
    const nextOrder = (lastQuestion?.order ?? 0) + 1;

    // Convert options array to JSON string if present
    const optionsJson = data.options
      ? JSON.stringify(data.options.map((o) => o.value))
      : null;

    await prisma.question.create({
      data: {
        surveyId,
        type: data.type,
        label: data.label,
        required: data.required,
        maxLength: data.maxLength ? parseInt(data.maxLength, 10) : null,
        options: optionsJson,
        order: nextOrder,
      },
    });

    revalidatePath(`/admin/${surveyId}/edit`); // Revalidate by ID? No, path uses ID usually?
    // Wait, my routes are /admin/[id]/edit? Wait.
    // In plan: [id]/edit/page.tsx
    // createSurvey redirected to /admin/${survey.id}/edit.
    // Yes, using ID.
    revalidatePath(`/admin/surveys/${surveyId}/edit`); // Wait, createSurvey redirected to /admin/${id}/edit?
    // Check createSurvey code: redirect(`/admin/${createdSurvey.id}/edit`);
    // So path is /admin/[id]/edit.
    revalidatePath(`/admin/${surveyId}/edit`);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to add question" };
  }
}

export async function deleteQuestion(questionId: string, surveyId: string) {
  try {
    await prisma.question.delete({
      where: { id: questionId },
    });
    revalidatePath(`/admin/${surveyId}/edit`);
    return { success: true };
  } catch {
    return { error: "Failed to delete" };
  }
}
