"use server";

import { redirect } from "next/navigation";
import { surveySchema, SurveySchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/auth-utils";

export async function createSurvey(data: SurveySchema) {
  await ensureUser();
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
    webhookUrl,
  } = result.data;

  // 期間の整合性チェック
  if (startAt >= endAt) {
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
        startAt: startAt!,
        endAt: endAt!,
        themeColor,
        headerImage: headerImage || null,
        bgImage: bgImage || null,
        webhookUrl: webhookUrl || null,
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
  await ensureUser();
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
    webhookUrl,
    isActive,
  } = result.data;

  // 期間の整合性チェック
  if (startAt >= endAt) {
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
        startAt: startAt,
        endAt: endAt,
        themeColor,
        headerImage: headerImage || null,
        bgImage: bgImage || null,
        webhookUrl: webhookUrl || null,
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
  await ensureUser();
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

function generateRandomSlug(): string {
  // ランダム4桁の数字を生成（0000-9999）
  const randomNumbers = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  // ランダムな大文字小文字3桁の英字を生成
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const randomChars = Array.from({ length: 3 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");

  return `enq-${randomNumbers}-${randomChars}`;
}

export async function duplicateSurvey(surveyId: string) {
  await ensureUser();
  try {
    // 元のアンケートと質問を取得
    const originalSurvey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!originalSurvey) {
      return { error: "アンケートが見つかりませんでした。" };
    }

    // ランダムなslugを生成（重複チェック）
    let newSlug = generateRandomSlug();
    while (await prisma.survey.findUnique({ where: { slug: newSlug } })) {
      newSlug = generateRandomSlug();
    }

    // 新しいタイトルを生成
    const newTitle = `${originalSurvey.title} (コピー)`;

    // トランザクションでアンケートと質問を複製
    const duplicatedSurvey = await prisma.$transaction(async (tx) => {
      // アンケートを作成（isActive = false）
      const newSurvey = await tx.survey.create({
        data: {
          appId: originalSurvey.appId,
          title: newTitle,
          slug: newSlug,
          description: originalSurvey.description,
          notes: originalSurvey.notes,
          startAt: originalSurvey.startAt,
          endAt: originalSurvey.endAt,
          themeColor: originalSurvey.themeColor,
          headerImage: originalSurvey.headerImage,
          bgImage: originalSurvey.bgImage,
          webhookUrl: originalSurvey.webhookUrl,
          isActive: false, // 非公開で複製
        },
      });

      // 質問を全て複製
      if (originalSurvey.questions.length > 0) {
        await tx.question.createMany({
          data: originalSurvey.questions.map((q) => ({
            surveyId: newSurvey.id,
            type: q.type,
            label: q.label,
            order: q.order,
            required: q.required,
            maxLength: q.maxLength,
            options: q.options,
          })),
        });
      }

      return newSurvey;
    });

    // 複製したアンケートのIDを返す（クライアント側でリダイレクト）
    return { success: true, surveyId: duplicatedSurvey.id };
  } catch (e) {
    console.error(e);
    return { error: "複製に失敗しました。" };
  }
}

/**
 * CSV形式の値をエスケープする
 */
function escapeCsvValue(value: string): string {
  // カンマ、改行、ダブルクォートを含む場合はダブルクォートで囲む
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    // ダブルクォート自体は2つ重ねる
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * アンケート結果をCSV形式でエクスポート
 */
export async function exportSurveyResultsAsCSV(surveyId: string) {
  await ensureUser();
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        responses: {
          include: {
            answers: {
              include: {
                question: true,
              },
            },
          },
          orderBy: { submittedAt: "asc" },
        },
      },
    });

    if (!survey) {
      return { error: "アンケートが見つかりませんでした。" };
    }

    // CSVヘッダー行を作成（質問のラベル）
    const headers = [
      "回答ID",
      "ユーザーID",
      "回答日時",
      ...survey.questions.map((q) => q.label),
    ];

    // CSVデータ行を作成
    const rows: string[][] = [];
    for (const response of survey.responses) {
      const row: string[] = [
        response.id,
        response.userId,
        response.submittedAt.toISOString(),
      ];

      // 各質問に対する回答を取得
      for (const question of survey.questions) {
        const answer = response.answers.find(
          (a) => a.questionId === question.id
        );
        row.push(answer?.value || "");
      }

      rows.push(row);
    }

    // CSV文字列を生成
    const csvLines: string[] = [];
    csvLines.push(headers.map(escapeCsvValue).join(","));

    for (const row of rows) {
      csvLines.push(row.map(escapeCsvValue).join(","));
    }

    const csvContent = csvLines.join("\n");

    // BOMを追加してExcelで文字化けしないようにする（UTF-8）
    const bom = "\uFEFF";
    const csvWithBom = bom + csvContent;

    return { success: true, csv: csvWithBom };
  } catch (e) {
    console.error(e);
    return { error: "CSVエクスポートに失敗しました。" };
  }
}
