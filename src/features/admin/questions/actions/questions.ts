"use server";

import { prisma } from "@/lib/prisma";
import { QuestionFormSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { ensureUser } from "@/lib/auth-utils";
import { insertAuditLog } from "@/lib/logger-utils";

export async function addQuestion(surveyId: string, data: QuestionFormSchema) {
  await ensureUser();
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

    const createdQuestion = await prisma.question.create({
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

    await insertAuditLog({
      action: "CREATE",
      resource: "QUESTION",
      resourceId: createdQuestion.id,
      details: { surveyId, label: data.label, type: data.type },
    });

    revalidatePath(`/admin/surveys/${surveyId}/details`);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to add question" };
  }
}

export async function updateQuestion(
  questionId: string,
  surveyId: string,
  data: QuestionFormSchema
) {
  await ensureUser();
  try {
    const optionsJson = data.options
      ? JSON.stringify(data.options.map((o) => o.value))
      : null;

    await prisma.question.update({
      where: { id: questionId },
      data: {
        type: data.type,
        label: data.label,
        required: data.required,
        maxLength: data.maxLength ? parseInt(data.maxLength, 10) : null,
        options: optionsJson,
      },
    });

    await insertAuditLog({
      action: "UPDATE",
      resource: "QUESTION",
      resourceId: questionId,
      details: { surveyId, label: data.label, type: data.type },
    });

    revalidatePath(`/admin/surveys/${surveyId}/details`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update question" };
  }
}

export async function deleteQuestion(questionId: string, surveyId: string) {
  await ensureUser();
  try {
    await prisma.question.delete({
      where: { id: questionId },
    });

    await insertAuditLog({
      action: "DELETE",
      resource: "QUESTION",
      resourceId: questionId,
      details: { surveyId },
    });

    revalidatePath(`/admin/surveys/${surveyId}/details`);
    return { success: true };
  } catch {
    return { error: "Failed to delete" };
  }
}

export async function reorderQuestions(
  items: { id: string; order: number }[],
  surveyId: string
) {
  await ensureUser();
  try {
    // Use a transaction to ensure all updates happen or none
    await prisma.$transaction(
      items.map((item) =>
        prisma.question.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    await insertAuditLog({
      action: "REORDER",
      resource: "QUESTION",
      resourceId: surveyId, // Question reordering is often logged per survey
      details: { surveyId, itemCount: items.length },
    });

    revalidatePath(`/admin/surveys/${surveyId}/details`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to reorder" };
  }
}
