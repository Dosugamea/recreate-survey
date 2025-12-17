"use server";

import { redirect } from "next/navigation";
import { surveySchema, SurveySchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";

export async function createSurvey(data: SurveySchema) {
  const result = surveySchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const {
    appId,
    title,
    slug,
    description,
    notes,
    startAt,
    endAt,
    themeColor,
    headerImage,
    bgImage,
  } = result.data;

  // 期間の整合性チェック
  if (startAt && endAt && startAt >= endAt) {
    return { error: "開始日時は終了日時より前である必要があります。" };
  }

  try {
    await prisma.survey.create({
      data: {
        appId,
        title,
        slug,
        description,
        notes: notes || null,
        startAt,
        endAt,
        themeColor,
        headerImage: headerImage || null,
        bgImage: bgImage || null,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.code === "P2002") {
      return { error: "Slug already exists. Please choose another one." };
    }
    console.error(e);
    return { error: "Database error occurred." };
  }

  // Redirect to the edit page for this survey (using ID would be better but slug is unique)
  // Wait, I need the ID. Or I can find by slug.
  // Actually, I can redirect to `/admin/[id]/details` if I get the ID from create.
  // Let's modify to get ID.

  const createdSurvey = await prisma.survey.findUnique({ where: { slug } });
  if (createdSurvey) {
    redirect(`/admin/surveys/${createdSurvey.id}/details`);
  } else {
    redirect(`/admin/surveys`); // Fallback
  }
}

export async function updateSurvey(surveyId: string, data: SurveySchema) {
  const result = surveySchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const {
    appId,
    title,
    slug,
    description,
    notes,
    startAt,
    endAt,
    themeColor,
    headerImage,
    bgImage,
    isActive,
  } = result.data;

  // 期間の整合性チェック
  if (startAt && endAt && startAt >= endAt) {
    return { error: "開始日時は終了日時より前である必要があります。" };
  }

  try {
    await prisma.survey.update({
      where: { id: surveyId },
      data: {
        appId,
        title,
        slug,
        description,
        notes: notes || null,
        startAt,
        endAt,
        themeColor,
        headerImage: headerImage || null,
        bgImage: bgImage || null,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return { error: "Slug already exists. Please choose another one." };
    }
    console.error(e);
    return { error: "Database error occurred." };
  }

  return { success: true };
}

export async function deleteSurvey(surveyId: string) {
  try {
    await prisma.survey.delete({
      where: { id: surveyId },
    });
  } catch (e) {
    console.error(e);
    return { error: "削除に失敗しました。" };
  }

  redirect("/admin/surveys");
}
