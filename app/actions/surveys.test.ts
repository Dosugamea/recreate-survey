import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSurvey,
  updateSurvey,
  deleteSurvey,
  duplicateSurvey,
} from "@/app/actions/surveys";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { SurveySchema } from "@/lib/schemas";
import type { Survey, Question, Prisma } from "@prisma/client";

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

describe("surveys actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
        },
      });
      expect(redirect).toHaveBeenCalledWith("/admin/surveys/survey-1/details");
    });

    it("should create survey with null optional fields", async () => {
      const validData = {
        appId: "app-1",
        title: "Test Survey",
        slug: "test-survey",
        description: "",
        notes: "",
        themeColor: "#000000",
        headerImage: "",
        bgImage: "",
      };

      const createdSurvey: Survey = {
        id: "survey-1",
        ...validData,
        description: null,
        notes: null,
        headerImage: null,
        bgImage: null,
        startAt: null,
        endAt: null,
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
          description: null,
          notes: null,
          startAt: undefined,
          endAt: undefined,
          themeColor: validData.themeColor,
          headerImage: null,
          bgImage: null,
        },
      });
    });

    it("should return error for invalid data", async () => {
      const invalidData: Partial<SurveySchema> = {
        appId: "",
        title: "",
        slug: "invalid slug with spaces",
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
        themeColor: "#ffffff",
      };

      const error = new Error("Unique constraint failed") as Error & { code: string };
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
        themeColor: "#ffffff",
      };

      const partialSurvey: Partial<Survey> = {
        id: "survey-1",
        slug: "test-survey",
      };
      vi.mocked(prisma.survey.create).mockResolvedValue(partialSurvey as Survey);
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
      vi.mocked(prisma.survey.delete).mockResolvedValue(deletedSurvey as Survey);

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
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValueOnce(originalSurvey);
      vi.mocked(prisma.survey.findUnique).mockResolvedValueOnce(null); // For slug check
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
          return await callback(tx as unknown as Parameters<typeof callback>[0]);
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
      const originalSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        title: "Original Survey",
        slug: "original-survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#ffffff",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
      };

      const existingSurvey: Survey = {
        id: "existing",
        appId: "app-1",
        title: "Existing",
        slug: "existing-slug",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#ffffff",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.survey.findUnique)
        .mockResolvedValueOnce(originalSurvey)
        .mockResolvedValueOnce(existingSurvey) // First slug exists
        .mockResolvedValueOnce(null); // Second slug is available

      const newSurvey: Survey = {
        id: "survey-2",
        appId: "app-1",
        title: "Original Survey (コピー)",
        slug: "enq-5678-Xyz",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#ffffff",
        headerImage: null,
        bgImage: null,
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
          return await callback(tx as unknown as Parameters<typeof callback>[0]);
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
      const originalSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        title: "Original Survey",
        slug: "original-survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#ffffff",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(originalSurvey);
      vi.mocked(prisma.$transaction).mockRejectedValue(
        new Error("Transaction failed")
      );

      const result = await duplicateSurvey(surveyId);

      expect(result).toEqual({ error: "複製に失敗しました。" });
    });
  });
});
