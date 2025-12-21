import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} from "@/app/actions/questions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    question: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("questions actions", () => {
  const surveyId = "survey-1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addQuestion", () => {
    it("should add a question with order 1 when no questions exist", async () => {
      const questionData = {
        type: "TEXT" as const,
        label: "What is your name?",
        required: true,
        maxLength: "100",
        options: undefined,
      };

      vi.mocked(prisma.question.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.question.create).mockResolvedValue({
        id: "question-1",
        surveyId,
        ...questionData,
        maxLength: 100,
        options: null,
        order: 1,
      });

      const result = await addQuestion(surveyId, questionData);

      expect(prisma.question.findFirst).toHaveBeenCalledWith({
        where: { surveyId },
        orderBy: { order: "desc" },
      });
      expect(prisma.question.create).toHaveBeenCalledWith({
        data: {
          surveyId,
          type: questionData.type,
          label: questionData.label,
          required: questionData.required,
          maxLength: 100,
          options: null,
          order: 1,
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith(
        `/admin/surveys/${surveyId}/details`
      );
      expect(result).toEqual({ success: true });
    });

    it("should add a question with next order when questions exist", async () => {
      const questionData = {
        type: "RADIO" as const,
        label: "Choose an option",
        required: false,
        options: [{ value: "Option 1" }, { value: "Option 2" }],
      };

      vi.mocked(prisma.question.findFirst).mockResolvedValue({
        id: "question-1",
        surveyId,
        order: 5,
        type: "TEXT",
        label: "Previous question",
        required: false,
        maxLength: null,
        options: null,
      });
      vi.mocked(prisma.question.create).mockResolvedValue({
        id: "question-2",
        surveyId,
        ...questionData,
        maxLength: null,
        options: JSON.stringify(["Option 1", "Option 2"]),
        order: 6,
      });

      const result = await addQuestion(surveyId, questionData);

      expect(prisma.question.create).toHaveBeenCalledWith({
        data: {
          surveyId,
          type: questionData.type,
          label: questionData.label,
          required: questionData.required,
          maxLength: null,
          options: JSON.stringify(["Option 1", "Option 2"]),
          order: 6,
        },
      });
      expect(result).toEqual({ success: true });
    });

    it("should handle options array correctly", async () => {
      const questionData = {
        type: "SELECT" as const,
        label: "Select one",
        required: true,
        options: [{ value: "A" }, { value: "B" }, { value: "C" }],
      };

      vi.mocked(prisma.question.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.question.create).mockResolvedValue({
        id: "question-1",
        surveyId,
        type: questionData.type,
        label: questionData.label,
        required: questionData.required,
        maxLength: null,
        options: JSON.stringify(["A", "B", "C"]),
        order: 1,
      });

      await addQuestion(surveyId, questionData);

      expect(prisma.question.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          options: JSON.stringify(["A", "B", "C"]),
        }),
      });
    });

    it("should return error on database error", async () => {
      const questionData = {
        type: "TEXT" as const,
        label: "Test question",
        required: false,
      };

      vi.mocked(prisma.question.findFirst).mockRejectedValue(
        new Error("Database error")
      );

      const result = await addQuestion(surveyId, questionData);

      expect(result).toEqual({ error: "Failed to add question" });
    });
  });

  describe("updateQuestion", () => {
    it("should update a question successfully", async () => {
      const questionId = "question-1";
      const questionData = {
        type: "TEXT" as const,
        label: "Updated question",
        required: true,
        maxLength: "200",
        options: undefined,
      };

      vi.mocked(prisma.question.update).mockResolvedValue({
        id: questionId,
        surveyId,
        ...questionData,
        maxLength: 200,
        options: null,
        order: 1,
      });

      const result = await updateQuestion(questionId, surveyId, questionData);

      expect(prisma.question.update).toHaveBeenCalledWith({
        where: { id: questionId },
        data: {
          type: questionData.type,
          label: questionData.label,
          required: questionData.required,
          maxLength: 200,
          options: null,
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith(
        `/admin/surveys/${surveyId}/details`
      );
      expect(result).toEqual({ success: true });
    });

    it("should update question with options", async () => {
      const questionId = "question-1";
      const questionData = {
        type: "CHECKBOX" as const,
        label: "Select multiple",
        required: false,
        options: [{ value: "Option A" }, { value: "Option B" }],
      };

      vi.mocked(prisma.question.update).mockResolvedValue({
        id: questionId,
        surveyId,
        ...questionData,
        maxLength: null,
        options: JSON.stringify(["Option A", "Option B"]),
        order: 1,
      });

      await updateQuestion(questionId, surveyId, questionData);

      expect(prisma.question.update).toHaveBeenCalledWith({
        where: { id: questionId },
        data: {
          type: questionData.type,
          label: questionData.label,
          required: questionData.required,
          maxLength: null,
          options: JSON.stringify(["Option A", "Option B"]),
        },
      });
    });

    it("should return error on database error", async () => {
      const questionId = "question-1";
      const questionData = {
        type: "TEXT" as const,
        label: "Test",
        required: false,
      };

      vi.mocked(prisma.question.update).mockRejectedValue(
        new Error("Database error")
      );

      const result = await updateQuestion(questionId, surveyId, questionData);

      expect(result).toEqual({ error: "Failed to update question" });
    });
  });

  describe("deleteQuestion", () => {
    it("should delete a question successfully", async () => {
      const questionId = "question-1";

      vi.mocked(prisma.question.delete).mockResolvedValue({
        id: questionId,
        surveyId,
        type: "TEXT",
        label: "Deleted question",
        required: false,
        maxLength: null,
        options: null,
        order: 1,
      });

      const result = await deleteQuestion(questionId, surveyId);

      expect(prisma.question.delete).toHaveBeenCalledWith({
        where: { id: questionId },
      });
      expect(revalidatePath).toHaveBeenCalledWith(
        `/admin/surveys/${surveyId}/details`
      );
      expect(result).toEqual({ success: true });
    });

    it("should return error on failure", async () => {
      const questionId = "question-1";

      vi.mocked(prisma.question.delete).mockRejectedValue(
        new Error("Delete failed")
      );

      const result = await deleteQuestion(questionId, surveyId);

      expect(result).toEqual({ error: "Failed to delete" });
    });
  });

  describe("reorderQuestions", () => {
    it("should reorder questions using transaction", async () => {
      const items = [
        { id: "question-1", order: 1 },
        { id: "question-2", order: 2 },
        { id: "question-3", order: 3 },
      ];

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        if (typeof callback === "function") {
          return await callback(
            prisma as unknown as Parameters<typeof callback>[0]
          );
        }
        return [];
      });

      const result = await reorderQuestions(items, surveyId);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith(
        `/admin/surveys/${surveyId}/details`
      );
      expect(result).toEqual({ success: true });
    });

    it("should return error on transaction failure", async () => {
      const items = [
        { id: "question-1", order: 1 },
        { id: "question-2", order: 2 },
      ];

      vi.mocked(prisma.$transaction).mockRejectedValue(
        new Error("Transaction failed")
      );

      const result = await reorderQuestions(items, surveyId);

      expect(result).toEqual({ error: "Failed to reorder" });
    });
  });
});
