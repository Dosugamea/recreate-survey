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
    title,
    slug,
    description,
    startAt,
    endAt,
    themeColor,
    headerImage,
    bgImage,
  } = result.data;

  try {
    await prisma.survey.create({
      data: {
        title,
        slug,
        description,
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
  // Actually, I can redirect to `/admin/[id]/edit` if I get the ID from create.
  // Let's modify to get ID.

  const createdSurvey = await prisma.survey.findUnique({ where: { slug } });
  if (createdSurvey) {
    redirect(`/admin/${createdSurvey.id}/edit`);
  } else {
    redirect(`/admin`); // Fallback
  }
}
