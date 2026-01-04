import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  signInAction,
  signOutAction,
} from "@/features/admin/auth/actions/auth";
import { signIn, signOut } from "@/lib/auth/auth";
import { AuthError } from "next-auth";

// Mock dependencies
vi.mock("@/lib/auth/auth", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    type: string = "";
  },
}));

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signInAction", () => {
    it("should call signIn with credentials and formData", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      await signInAction(undefined, formData);

      expect(signIn).toHaveBeenCalledWith("credentials", formData);
    });

    it("should return 'Invalid credentials.' if CredentialsSignin error occurs", async () => {
      const formData = new FormData();
      const mockError = new AuthError();
      mockError.type = "CredentialsSignin";

      vi.mocked(signIn).mockRejectedValueOnce(mockError);

      const result = await signInAction(undefined, formData);

      expect(result).toBe("Invalid credentials.");
    });

    it("should return 'Something went wrong.' for other AuthErrors", async () => {
      const formData = new FormData();
      const mockError = new AuthError();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockError as any).type = "SomeOtherError";

      vi.mocked(signIn).mockRejectedValueOnce(mockError);

      const result = await signInAction(undefined, formData);

      expect(result).toBe("Something went wrong.");
    });

    it("should throw non-AuthErrors", async () => {
      const formData = new FormData();
      const mockError = new Error("Generic error");

      vi.mocked(signIn).mockRejectedValueOnce(mockError);

      await expect(signInAction(undefined, formData)).rejects.toThrow(
        "Generic error"
      );
    });
  });

  describe("signOutAction", () => {
    it("should call signOut with correct redirectTo path", async () => {
      await signOutAction();

      expect(signOut).toHaveBeenCalledWith({ redirectTo: "/admin/login" });
    });
  });
});
