"use server";

import { prisma } from "@/lib/prisma";

/**
 * Appを取得する
 */
export async function getAppBySlug(slug: string) {
  return prisma.app.findUnique({
    where: { slug },
  });
}

/**
 * 公開用のSurveyを取得する
 */
export async function getPublicSurvey(appSlug: string, surveySlug: string) {
  return prisma.survey.findFirst({
    where: {
      slug: surveySlug,
      app: {
        slug: appSlug,
      },
      isActive: true,
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      app: true,
    },
  });
}
