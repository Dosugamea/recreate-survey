import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSurveyForm } from "./useSurveyForm";
import type { Question } from "@prisma/client";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

// Mock dependencies
vi.mock("@/app/actions/submission", () => ({
  submitSurvey: vi.fn(),
}));

vi.mock("@/hooks/useRequiredFieldsValidation", () => ({
  useRequiredFieldsValidation: vi.fn(() => ({
    isAllRequiredFieldsFilled: true,
  })),
}));

vi.mock("@/hooks/useScrollToElement", () => ({
  useScrollToElement: vi.fn(),
}));

import { submitSurvey } from "@/app/actions/submission";

describe("useSurveyForm", () => {
  const surveyId = "survey-1";
  const userId = "user-1";
  const questions: Question[] = [
    {
      id: "question-1",
      surveyId,
      type: "TEXT",
      label: "質問1",
      order: 1,
      required: true,
      maxLength: null,
      options: null,
    },
    {
      id: "question-2",
      surveyId,
      type: "RADIO",
      label: "質問2",
      order: 2,
      required: false,
      maxLength: null,
      options: JSON.stringify(["選択肢1", "選択肢2"]),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // document.cookieをモック
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  describe("初期状態", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() =>
        useSurveyForm({
          surveyId,
          questions,
          userId,
        })
      );

      expect(result.current.step).toBe("input");
      expect(result.current.isSubmitted).toBe(false);
      expect(result.current.isPending).toBe(false);
    });

    it("should initialize with isAlreadySubmitted when provided", () => {
      const { result } = renderHook(() =>
        useSurveyForm({
          surveyId,
          questions,
          userId,
          isAlreadySubmitted: true,
        })
      );

      expect(result.current.isSubmitted).toBe(true);
    });
  });

  describe("フォーム操作", () => {
    it("should handle going to confirmation step", async () => {
      const { result } = renderHook(() =>
        useSurveyForm({
          surveyId,
          questions,
          userId,
        })
      );

      await act(async () => {
        await result.current.handleGoToConfirmation();
      });

      expect(result.current.step).toBe("confirmation");
    });

    it("should handle going back to input step", () => {
      const { result } = renderHook(() =>
        useSurveyForm({
          surveyId,
          questions,
          userId,
        })
      );

      // まず確認画面に進む
      act(() => {
        result.current.handleGoToConfirmation();
      });

      // 入力画面に戻る
      act(() => {
        result.current.handleBackToInput();
      });

      expect(result.current.step).toBe("input");
    });
  });

  describe("送信処理", () => {
    it("should submit survey successfully", async () => {
      vi.mocked(submitSurvey).mockResolvedValue({
        success: true,
        responseId: "response-1",
      });

      const { result } = renderHook(() =>
        useSurveyForm({
          surveyId,
          questions,
          userId,
        })
      );

      const mockTurnstileRef = {
        current: {
          getResponse: vi.fn(() => "turnstile-token"),
        } as unknown as TurnstileInstance,
      };

      await act(async () => {
        result.current.handleConfirmSubmit(mockTurnstileRef);
      });

      await waitFor(() => {
        expect(result.current.isSubmitted).toBe(true);
      });

      expect(submitSurvey).toHaveBeenCalledWith(
        surveyId,
        userId,
        {},
        "turnstile-token"
      );
      expect(document.cookie).toContain(
        `survey_${surveyId}_${userId}=submitted`
      );
    });

    it("should handle submission error", async () => {
      vi.mocked(submitSurvey).mockResolvedValue({
        error: "送信に失敗しました",
      });

      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

      const { result } = renderHook(() =>
        useSurveyForm({
          surveyId,
          questions,
          userId,
        })
      );

      const mockTurnstileRef = {
        current: {
          getResponse: vi.fn(() => "turnstile-token"),
        } as unknown as TurnstileInstance,
      };

      await act(async () => {
        result.current.handleConfirmSubmit(mockTurnstileRef);
      });

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining("送信に失敗しました")
        );
      });

      expect(result.current.isSubmitted).toBe(false);

      alertSpy.mockRestore();
    });

    it("should show alert when Turnstile token is missing", () => {
      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

      const { result } = renderHook(() =>
        useSurveyForm({
          surveyId,
          questions,
          userId,
        })
      );

      const mockTurnstileRef = {
        current: {
          getResponse: vi.fn(() => null),
        } as unknown as TurnstileInstance,
      };

      act(() => {
        result.current.handleConfirmSubmit(mockTurnstileRef);
      });

      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining("スパム対策の検証が完了していません")
      );
      expect(submitSurvey).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });
  });

  describe("クッキー設定", () => {
    it("should set cookie on successful submission", async () => {
      vi.mocked(submitSurvey).mockResolvedValue({
        success: true,
        responseId: "response-1",
      });

      const { result } = renderHook(() =>
        useSurveyForm({
          surveyId,
          questions,
          userId,
        })
      );

      const mockTurnstileRef = {
        current: {
          getResponse: vi.fn(() => "turnstile-token"),
        } as unknown as TurnstileInstance,
      };

      await act(async () => {
        result.current.handleConfirmSubmit(mockTurnstileRef);
      });

      await waitFor(() => {
        expect(document.cookie).toContain(
          `survey_${surveyId}_${userId}=submitted`
        );
      });
    });
  });
});
