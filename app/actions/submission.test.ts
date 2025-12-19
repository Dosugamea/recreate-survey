import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitSurvey } from "@/app/actions/submission";
import { prisma } from "@/lib/prisma";
import type { Survey, Question, Response } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    survey: {
      findUnique: vi.fn(),
    },
    response: {
      create: vi.fn(),
    },
  },
}));

describe("submission actions", () => {
  const surveyId = "survey-1";
  const userId = "user-1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("submitSurvey", () => {
    it("should submit survey successfully with valid answers", async () => {
      const mockSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        slug: "test-survey",
        title: "Test Survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#6c4034",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: "question-1",
            surveyId,
            type: "TEXT",
            label: "Q1",
            order: 1,
            required: false,
            maxLength: null,
            options: null,
          },
          {
            id: "question-2",
            surveyId,
            type: "RADIO",
            label: "Q2",
            order: 2,
            required: false,
            maxLength: null,
            options: null,
          },
        ],
      };

      const rawAnswers = {
        "question-1": "Answer 1",
        "question-2": "Answer 2",
      };

      const mockResponse: Response = {
        id: "response-1",
        surveyId,
        userId,
        submittedAt: new Date(),
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(mockSurvey);
      vi.mocked(prisma.response.create).mockResolvedValue(mockResponse);

      const result = await submitSurvey(surveyId, userId, rawAnswers);

      expect(prisma.survey.findUnique).toHaveBeenCalledWith({
        where: { id: surveyId },
        include: { questions: true },
      });
      expect(prisma.response.create).toHaveBeenCalledWith({
        data: {
          surveyId,
          userId,
          answers: {
            create: [
              { questionId: "question-1", value: "Answer 1" },
              { questionId: "question-2", value: "Answer 2" },
            ],
          },
        },
      });
      expect(result).toEqual({
        success: true,
        responseId: "response-1",
      });
    });

    it("should handle array answers correctly", async () => {
      const mockSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        slug: "test-survey",
        title: "Test Survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#6c4034",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: "question-1",
            surveyId,
            type: "CHECKBOX",
            label: "Q1",
            order: 1,
            required: false,
            maxLength: null,
            options: null,
          },
        ],
      };

      const rawAnswers = {
        "question-1": ["Option A", "Option B"],
      };

      const mockResponse: Response = {
        id: "response-1",
        surveyId,
        userId,
        submittedAt: new Date(),
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(mockSurvey);
      vi.mocked(prisma.response.create).mockResolvedValue(mockResponse);

      await submitSurvey(surveyId, userId, rawAnswers);

      expect(prisma.response.create).toHaveBeenCalledWith({
        data: {
          surveyId,
          userId,
          answers: {
            create: [{ questionId: "question-1", value: "Option A,Option B" }],
          },
        },
      });
    });

    it("should return error when survey not found", async () => {
      vi.mocked(prisma.survey.findUnique).mockResolvedValue(null);

      const result = await submitSurvey(surveyId, userId, {});

      expect(result).toEqual({ error: "Survey not found." });
      expect(prisma.response.create).not.toHaveBeenCalled();
    });

    it("should return error when survey is not active", async () => {
      const mockSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        slug: "test-survey",
        title: "Test Survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#6c4034",
        headerImage: null,
        bgImage: null,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(mockSurvey);

      const result = await submitSurvey(surveyId, userId, {});

      expect(result).toEqual({
        error: "このアンケートは現在利用できません。",
      });
    });

    it("should return error when survey has not started", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const mockSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        slug: "test-survey",
        title: "Test Survey",
        description: null,
        notes: null,
        startAt: futureDate,
        endAt: null,
        themeColor: "#6c4034",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(mockSurvey);

      const result = await submitSurvey(surveyId, userId, {});

      expect(result).toEqual({
        error: "このアンケートはまだ開始されていません。",
      });
    });

    it("should return error when survey has ended", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const mockSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        slug: "test-survey",
        title: "Test Survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: pastDate,
        themeColor: "#6c4034",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(mockSurvey);

      const result = await submitSurvey(surveyId, userId, {});

      expect(result).toEqual({
        error: "このアンケートは終了しました。",
      });
    });

    it("should return error for invalid question IDs", async () => {
      const mockSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        slug: "test-survey",
        title: "Test Survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#6c4034",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: "question-1",
            surveyId,
            type: "TEXT",
            label: "Q1",
            order: 1,
            required: false,
            maxLength: null,
            options: null,
          },
        ],
      };

      const rawAnswers = {
        "invalid-question-id": "Answer",
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(mockSurvey);

      const result = await submitSurvey(surveyId, userId, rawAnswers);

      expect(result).toEqual({
        error: "Invalid question IDs: invalid-question-id",
      });
    });

    it("should filter out empty answers", async () => {
      const mockSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        slug: "test-survey",
        title: "Test Survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#6c4034",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: "question-1",
            surveyId,
            type: "TEXT",
            label: "Q1",
            order: 1,
            required: false,
            maxLength: null,
            options: null,
          },
          {
            id: "question-2",
            surveyId,
            type: "TEXT",
            label: "Q2",
            order: 2,
            required: false,
            maxLength: null,
            options: null,
          },
          {
            id: "question-3",
            surveyId,
            type: "TEXT",
            label: "Q3",
            order: 3,
            required: false,
            maxLength: null,
            options: null,
          },
        ],
      };

      const rawAnswers = {
        "question-1": "Valid answer",
        "question-2": "",
        "question-3": [],
      };

      const mockResponse: Response = {
        id: "response-1",
        surveyId,
        userId,
        submittedAt: new Date(),
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(mockSurvey);
      vi.mocked(prisma.response.create).mockResolvedValue(mockResponse);

      await submitSurvey(surveyId, userId, rawAnswers);

      expect(prisma.response.create).toHaveBeenCalledWith({
        data: {
          surveyId,
          userId,
          answers: {
            create: [{ questionId: "question-1", value: "Valid answer" }],
          },
        },
      });
    });

    it("should return error when no valid answers provided", async () => {
      const mockSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        slug: "test-survey",
        title: "Test Survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#6c4034",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: "question-1",
            surveyId,
            type: "TEXT",
            label: "Q1",
            order: 1,
            required: false,
            maxLength: null,
            options: null,
          },
        ],
      };

      const rawAnswers = {
        "question-1": "",
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(mockSurvey);

      const result = await submitSurvey(surveyId, userId, rawAnswers);

      expect(result).toEqual({ error: "No valid answers provided." });
      expect(prisma.response.create).not.toHaveBeenCalled();
    });

    it("should return error on database error", async () => {
      const mockSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        slug: "test-survey",
        title: "Test Survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#6c4034",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: "question-1",
            surveyId,
            type: "TEXT",
            label: "Q1",
            order: 1,
            required: false,
            maxLength: null,
            options: null,
          },
        ],
      };

      const rawAnswers = {
        "question-1": "Answer",
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(mockSurvey);
      vi.mocked(prisma.response.create).mockRejectedValue(
        new Error("Database error")
      );

      const result = await submitSurvey(surveyId, userId, rawAnswers);

      expect(result).toEqual({
        error: "Failed to submit survey: Database error",
      });
    });

    it("should handle unknown error types", async () => {
      const mockSurvey: Survey & { questions: Question[] } = {
        id: surveyId,
        appId: "app-1",
        slug: "test-survey",
        title: "Test Survey",
        description: null,
        notes: null,
        startAt: null,
        endAt: null,
        themeColor: "#6c4034",
        headerImage: null,
        bgImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [
          {
            id: "question-1",
            surveyId,
            type: "TEXT",
            label: "Q1",
            order: 1,
            required: false,
            maxLength: null,
            options: null,
          },
        ],
      };

      const rawAnswers = {
        "question-1": "Answer",
      };

      vi.mocked(prisma.survey.findUnique).mockResolvedValue(mockSurvey);
      vi.mocked(prisma.response.create).mockRejectedValue("Unknown error");

      const result = await submitSurvey(surveyId, userId, rawAnswers);

      expect(result).toEqual({ error: "Failed to submit survey." });
    });
  });
});
