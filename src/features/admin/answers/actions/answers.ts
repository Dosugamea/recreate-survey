"use server";

import { prisma } from "@/lib/prisma";

export async function getAnswers(appId?: string) {
  // アプリ一覧を取得
  const apps = await prisma.app.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  // 回答があるアンケートを取得（appIdでフィルタリング）
  const surveys = await prisma.survey.findMany({
    where: {
      ...(appId ? { appId } : {}),
      responses: {
        some: {}, // 少なくとも1つの回答が存在する
      },
    },
    include: {
      app: true,
      _count: {
        select: { responses: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { apps, surveys };
}
