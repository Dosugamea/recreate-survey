import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSurvey,
  updateSurvey,
  deleteSurvey,
  duplicateSurvey,
  getSurveyById,
  getSurveys,
} from "@/features/admin/surveys/actions/surveys";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { SurveySchema } from "@/lib/schemas";
import type { Survey, Question, Prisma, App } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    survey: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
    question: {
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/auth-utils", () => ({
  ensureUser: vi.fn(),
  ensureAdmin: vi.fn(),
  getCurrentUser: vi.fn(),
}));

describe("surveys actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // モックをリセットして、各テストで明示的に設定できるようにする
    vi.mocked(prisma.survey.findUnique).mockReset();
    vi.mocked(prisma.survey.create).mockReset();
    vi.mocked(prisma.survey.update).mockReset();
    vi.mocked(prisma.survey.delete).mockReset();
    vi.mocked(prisma.$transaction).mockReset();
  });

  describe("getSurveyById", () => {
    it("should return survey with questions and app", async () => {
      const surveyId = "survey-1";
      const mockSurvey = {
        id: surveyId,
        title: "Test Survey",
        app: { id: "app-1", name: "Test App" },
        questions: [{ id: "q-1", label: "Question 1", order: 1 }],
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(
        mockSurvey as unknown as Survey & { app: App; questions: Question[] }
      );

      const result = await getSurveyById(surveyId);

      expect(prisma.survey.findUnique).toHaveBeenCalledWith({
        where: { id: surveyId },
        include: {
          app: true,
          questions: {
            orderBy: { order: "asc" },
          },
        },
      });
      expect(result).toEqual(mockSurvey);
    });

    it("should return null if survey not found", async () => {
      vi.mocked(prisma.survey.findUnique).mockResolvedValue(null);
      const result = await getSurveyById("non-existent");
      expect(result).toBeNull();
    });

    it("should return null on database error", async () => {
      vi.mocked(prisma.survey.findUnique).mockRejectedValue(
        new Error("DB Error")
      );
      const result = await getSurveyById("survey-1");
      expect(result).toBeNull();
    });
  describe("getSurveys", () => {
    it("should return surveys with app", async () => {
      const mockSurveys = [
        {
          id: "survey-1",
          title: "Test Survey",
          app: { id: "app-1", name: "Test App" },
        },
      ];

      vi.mocked(prisma.survey.findMany).mockResolvedValue(
        mockSurveys as unknown as (Survey & { app: App })[]
      );

      const result = await getSurveys();

      expect(prisma.survey.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: {
          app: true,
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockSurveys);
    });

    it("should return surveys filtered by appId", async () => {
      const appId = "app-1";
      vi.mocked(prisma.survey.findMany).mockResolvedValue([]);

      await getSurveys(appId);

      expect(prisma.survey.findMany).toHaveBeenCalledWith({
        where: { appId },
        include: {
          app: true,
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return empty array on database error", async () => {
      vi.mocked(prisma.survey.findMany).mockRejectedValue(
        new Error("DB Error")
      );
      const result = await getSurveys();
      expect(result).toEqual([]);
    });
  });

  describe("createSurvey", () => {
    it("should create a survey with valid data", async () => {
      const validData = {
        appId: "app-1",
        title: "Test Survey",
        slug: "test-survey",
        description: "Test description",
        notes: "Test notes",
        startAt: new Date("2024-01-01"),
        endAt: new Date("2024-12-31"),
        themeColor: "#ffffff",
        headerImage: "https://example.com/header.jpg",
        bgImage: "https://example.com/bg.jpg",
        webhookUrl: "https://example.com/webhook",
      };

      const createdSurvey: Survey = {
        id: "survey-1",
        ...validData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.survey.create).mockResolvedValue(createdSurvey);
      vi.mocked(prisma.survey.findUnique).mockResolvedValue(createdSurvey);

      await createSurvey(validData);

      expect(prisma.survey.create).toHaveBeenCalledWith({
        data: {
          appId: validData.appId,
          title: validData.title,
          slug: validData.slug,
          description: validData.description,
          notes: validData.notes,
          startAt: validData.startAt,
          endAt: validData.endAt,
          themeColor: validData.themeColor,
          headerImage: validData.headerImage,
          bgImage: validData.bgImage,
          webhookUrl: validData.webhookUrl,
        },
      });
      expect(redirect).toHaveBeenCalledWith("/admin/surveys/survey-1");
    });

    it("should create survey with null optional fields", async () => {
      const startAt = new Date("2024-01-01");
      const endAt = new Date("2024-12-31");
      const validData = {
        appId: "app-1",
        title: "Test Survey",
        slug: "test-survey",
        description: "",
        notes: "",
        startAt,
        endAt,
        themeColor: "#000000",
        headerImage: "",
        bgImage: "",
        webhookUrl: "",
      };

      const createdSurvey: Survey = {
        id: "survey-1",
        ...validData,
        description: null,
        notes: null,
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.survey.create).mockResolvedValue(createdSurvey);
      vi.mocked(prisma.survey.findUnique).mockResolvedValue(createdSurvey);

      await createSurvey(validData);

      expect(prisma.survey.create).toHaveBeenCalledWith({
        data: {
          appId: validData.appId,
          title: validData.title,
          slug: validData.slug,
          description: "", // 空文字列はそのまま渡される
          notes: null,
          startAt: startAt,
          endAt: endAt,
          themeColor: validData.themeColor,
          headerImage: null,
          bgImage: null,
          webhookUrl: null,
        },
      });
    });

    it("should return error for invalid data", async () => {
      const invalidData: Partial<SurveySchema> = {
        appId: "",
        title: "",
        slug: "invalid slug with spaces",
        startAt: new Date("2024-01-01"),
        endAt: new Date("2024-12-31"),
        themeColor: "#ffffff",
      };

      const result = await createSurvey(invalidData as SurveySchema);

      expect(result).toEqual({ error: "Invalid data" });
      expect(prisma.survey.create).not.toHaveBeenCalled();
    });

    it("should return error when startAt >= endAt", async () => {
      const invalidData = {
        appId: "app-1",
        title: "Test Survey",
        slug: "test-survey",
        themeColor: "#ffffff",
        startAt: new Date("2024-12-31"),
        endAt: new Date("2024-01-01"),
      };

      const result = await createSurvey(invalidData);

      expect(result).toEqual({
        error: "開始日時は終了日時より前である必要があります。",
      });
      expect(prisma.survey.create).not.toHaveBeenCalled();
    });

    it("should return error for duplicate slug", async () => {
      const validData = {
        appId: "app-1",
        title: "Test Survey",
        slug: "existing-slug",
        startAt: new Date("2024-01-01"),
        endAt: new Date("2024-12-31"),
        themeColor: "#ffffff",
      };

      const error = new Error("Unique constraint failed") as Error & {
        code: string;
      };
      error.code = "P2002";

      vi.mocked(prisma.survey.create).mockRejectedValue(error);

      const result = await createSurvey(validData);

      expect(result).toEqual({
        error: "Slug already exists. Please choose another one.",
      });
    });

    it("should return error on database error", async () => {
      const validData = {
        appId: "app-1",
        title: "Test Survey",
        slug: "test-survey",
        startAt: new Date("2024-01-01"),
        endAt: new Date("2024-12-31"),
        themeColor: "#ffffff",
      };

      vi.mocked(prisma.survey.create).mockRejectedValue(
        new Error("Database error")
      );

      const result = await createSurvey(validData);

      expect(result).toEqual({ error: "Database error occurred." });
    });

    it("should redirect to surveys list if created survey not found", async () => {
      const validData = {
        appId: "app-1",
        title: "Test Survey",
        slug: "test-survey",
        startAt: new Date("2024-01-01"),
        endAt: new Date("2024-12-31"),
        themeColor: "#ffffff",
      };

      const partialSurvey: Partial<Survey> = {
        id: "survey-1",
        slug: "test-survey",
      };
      vi.mocked(prisma.survey.create).mockResolvedValue(
        partialSurvey as Survey
      );
      vi.mocked(prisma.survey.findUnique).mockResolvedValue(null);

      await createSurvey(validData);

      expect(redirect).toHaveBeenCalledWith("/admin/surveys");
    });
  });

  describe("updateSurvey", () => {
    it("should update a survey successfully", async () => {
      const surveyId = "survey-1";
      const validData = {
        appId: "app-1",
        title: "Updated Survey",
        slug: "updated-survey",
        description: "Updated description",
        notes: "Updated notes",
        startAt: new Date("2024-01-01"),
        endAt: new Date("2024-12-31"),
        themeColor: "#ff0000",
        headerImage: "https://example.com/new-header.jpg",
        bgImage: "https://example.com/new-bg.jpg",
        isActive: true,
        webhookUrl: "",
      };

      const updatedSurvey: Survey = {
        id: surveyId,
        ...validData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.survey.update).mockResolvedValue(updatedSurvey);

      const result = await updateSurvey(surveyId, validData);

      expect(prisma.survey.update).toHaveBeenCalledWith({
        where: { id: surveyId },
        data: {
          appId: validData.appId,
          title: validData.title,
          slug: validData.slug,
          description: validData.description,
          notes: validData.notes,
          startAt: validData.startAt,
          endAt: validData.endAt,
          themeColor: validData.themeColor,
          headerImage: validData.headerImage,
          bgImage: validData.bgImage,
          webhookUrl: null,
          isActive: validData.isActive,
        },
      });
      expect(result).toEqual({ success: true });
    });

    it("should return error for invalid data", async () => {
      const surveyId = "survey-1";
      const invalidData: Partial<SurveySchema> = {
        appId: "",
        title: "",
        slug: "invalid",
      };

      const result = await updateSurvey(surveyId, invalidData as SurveySchema);

      expect(result).toEqual({ error: "Invalid data" });
      expect(prisma.survey.update).not.toHaveBeenCalled();
    });

    it("should return error when startAt >= endAt", async () => {
      const surveyId = "survey-1";
      const invalidData = {
        appId: "app-1",
        title: "Test Survey",
        slug: "test-survey",
        themeColor: "#ffffff",
        startAt: new Date("2024-12-31"),
        endAt: new Date("2024-01-01"),
      };

      const result = await updateSurvey(surveyId, invalidData);

      expect(result).toEqual({
        error: "開始日時は終了日時より前である必要があります。",
      });
    });

    it("should return error for duplicate slug", async () => {
      const surveyId = "survey-1";
      const validData = {
        appId: "app-1",
        title: "Test Survey",
        slug: "existing-slug",
        startAt: new Date("2024-01-01"),
        endAt: new Date("2024-12-31"),
        themeColor: "#ffffff",
      };

      const error = { code: "P2002" } as Prisma.PrismaClientKnownRequestError;

      vi.mocked(prisma.survey.update).mockRejectedValue(error);

      const result = await updateSurvey(surveyId, validData);

      expect(result).toEqual({
        error: "Slug already exists. Please choose another one.",
      });
    });
  });

  describe("deleteSurvey", () => {
    it("should delete a survey and redirect", async () => {
      const surveyId = "survey-1";

      const deletedSurvey: Partial<Survey> = {
        id: surveyId,
      };
      vi.mocked(prisma.survey.delete).mockResolvedValue(
        deletedSurvey as Survey
      );

      await deleteSurvey(surveyId);

      expect(prisma.survey.delete).toHaveBeenCalledWith({
        where: { id: surveyId },
      });
      expect(redirect).toHaveBeenCalledWith("/admin/surveys");
    });

    it("should return error on database error", async () => {
      const surveyId = "survey-1";

      vi.mocked(prisma.survey.delete).mockRejectedValue(
        new Error("Database error")
      );

      const result = await deleteSurvey(surveyId);

      expect(result).toEqual({ error: "削除に失敗しました。" });
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe("duplicateSurvey", () => {
    it("should duplicate a survey with questions", async () => {
      const surveyId = "survey-1";
      const originalSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        title: "Original Survey",
        slug: "original-survey",
        description: "Original description",
        notes: "Original notes",
        startAt: new Date("2024-01-01"),
        endAt: new Date("2024-12-31"),
        themeColor: "#ffffff",
        headerImage: "https://example.com/header.jpg",
        bgImage: "https://example.com/bg.jpg",
        webhookUrl: "https://example.com/webhook",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: "question-1",
            surveyId,
            type: "TEXT",
            label: "Question 1",
            order: 1,
            required: true,
            maxLength: 100,
            options: null,
          },
          {
            id: "question-2",
            surveyId,
            type: "RADIO",
            label: "Question 2",
            order: 2,
            required: false,
            maxLength: null,
            options: JSON.stringify(["Option 1", "Option 2"]),
          },
        ],
      };

      const newSurvey: Survey = {
        id: "survey-2",
        appId: "app-1",
        title: "Original Survey (コピー)",
        slug: "enq-1234-Abc",
        description: "Original description",
        notes: "Original notes",
        startAt: new Date("2024-01-01"),
        endAt: new Date("2024-12-31"),
        themeColor: "#ffffff",
        headerImage: "https://example.com/header.jpg",
        bgImage: "https://example.com/bg.jpg",
        webhookUrl: "https://example.com/webhook",
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // findUniqueは2回呼ばれる:
      // 1. IDで検索（include付き）: 元のアンケートを返す
      // 2. slugで検索（重複チェック）: nullを返す（重複なし）
      vi.mocked(prisma.survey.findUnique)
        .mockResolvedValueOnce(originalSurvey) // ID検索
        .mockResolvedValueOnce(null); // slug検索（重複なし）
      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        if (typeof callback === "function") {
          const tx = {
            survey: {
              create: vi.fn().mockResolvedValue(newSurvey),
            },
            question: {
              createMany: vi.fn().mockResolvedValue({ count: 2 }),
            },
          };
          return await callback(
            tx as unknown as Parameters<typeof callback>[0]
          );
        }
        return newSurvey;
      });

      const result = await duplicateSurvey(surveyId);

      expect(prisma.survey.findUnique).toHaveBeenCalledWith({
        where: { id: surveyId },
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      });
      expect(result).toEqual({
        success: true,
        surveyId: newSurvey.id,
      });
    });

    it("should return error when survey not found", async () => {
      const surveyId = "non-existent";

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(null);

      const result = await duplicateSurvey(surveyId);

      expect(result).toEqual({ error: "アンケートが見つかりませんでした。" });
    });

    it("should handle duplicate slug generation", async () => {
      const surveyId = "survey-1";
      const startAt = new Date("2024-01-01");
      const endAt = new Date("2024-12-31");
      const originalSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        title: "Original Survey",
        slug: "original-survey",
        description: null,
        notes: null,
        startAt,
        endAt,
        themeColor: "#ffffff",
        headerImage: null,
        bgImage: null,
        webhookUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
      };

      // 最初の呼び出し: 元のアンケートを取得
      // その後のslugチェック（最大10回）は常にnullを返す（重複なし、無限ループ防止）
      vi.mocked(prisma.survey.findUnique)
        .mockResolvedValueOnce(originalSurvey)
        .mockResolvedValueOnce(null) // slug check 1
        .mockResolvedValueOnce(null) // slug check 2
        .mockResolvedValueOnce(null) // slug check 3
        .mockResolvedValueOnce(null) // slug check 4
        .mockResolvedValueOnce(null) // slug check 5
        .mockResolvedValueOnce(null) // slug check 6
        .mockResolvedValueOnce(null) // slug check 7
        .mockResolvedValueOnce(null) // slug check 8
        .mockResolvedValueOnce(null) // slug check 9
        .mockResolvedValueOnce(null); // slug check 10

      const newSurvey: Survey = {
        id: "survey-2",
        appId: "app-1",
        title: "Original Survey (コピー)",
        slug: "enq-5678-Xyz",
        description: null,
        notes: null,
        startAt,
        endAt,
        themeColor: "#ffffff",
        headerImage: null,
        bgImage: null,
        webhookUrl: null,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        if (typeof callback === "function") {
          const tx = {
            survey: {
              create: vi.fn().mockResolvedValue(newSurvey),
            },
            question: {
              createMany: vi.fn().mockResolvedValue({ count: 0 }),
            },
          };
          return await callback(
            tx as unknown as Parameters<typeof callback>[0]
          );
        }
        return newSurvey;
      });

      const result = await duplicateSurvey(surveyId);

      expect(result).toEqual({
        success: true,
        surveyId: "survey-2",
      });
    });

    it("should return error on duplication failure", async () => {
      const surveyId = "survey-1";
      const startAt = new Date("2024-01-01");
      const endAt = new Date("2024-12-31");
      const originalSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        title: "Original Survey",
        slug: "original-survey",
        description: null,
        notes: null,
        startAt,
        endAt,
        themeColor: "#ffffff",
        headerImage: null,
        bgImage: null,
        webhookUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
      };

      // findUniqueは2回呼ばれる:
      // 1. IDで検索（include付き）: 元のアンケートを返す
      // 2. slugで検索（重複チェック）: nullを返す（重複なし）
      vi.mocked(prisma.survey.findUnique)
        .mockResolvedValueOnce(originalSurvey) // ID検索
        .mockResolvedValueOnce(null); // slug検索（重複なし）
      vi.mocked(prisma.$transaction).mockRejectedValue(
        new Error("Transaction failed")
      );

      const result = await duplicateSurvey(surveyId);

      expect(result).toEqual({ error: "複製に失敗しました。" });
    });
  });
});
