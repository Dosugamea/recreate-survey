import { describe, it, expect } from "vitest";
import { hexToRgba } from "./utils";

describe("hexToRgba", () => {
  describe("3桁の短縮形（#RGB）のテスト", () => {
    it("基本的な3桁短縮形を正しく変換する", () => {
      expect(hexToRgba("#f00", 1.0)).toBe("rgba(255, 0, 0, 1)");
      expect(hexToRgba("#0f0", 1.0)).toBe("rgba(0, 255, 0, 1)");
      expect(hexToRgba("#00f", 1.0)).toBe("rgba(0, 0, 255, 1)");
    });

    it("3桁短縮形で小文字を正しく変換する", () => {
      expect(hexToRgba("#abc", 1.0)).toBe("rgba(170, 187, 204, 1)");
    });

    it("3桁短縮形で様々なalpha値を正しく適用する", () => {
      expect(hexToRgba("#f00", 0.5)).toBe("rgba(255, 0, 0, 0.5)");
      expect(hexToRgba("#0f0", 0.0)).toBe("rgba(0, 255, 0, 0)");
      expect(hexToRgba("#00f", 1.0)).toBe("rgba(0, 0, 255, 1)");
    });
  });

  describe("6桁の標準形（#RRGGBB）のテスト", () => {
    it("基本的な6桁標準形を正しく変換する", () => {
      expect(hexToRgba("#ff0000", 1.0)).toBe("rgba(255, 0, 0, 1)");
      expect(hexToRgba("#00ff00", 1.0)).toBe("rgba(0, 255, 0, 1)");
      expect(hexToRgba("#0000ff", 1.0)).toBe("rgba(0, 0, 255, 1)");
    });

    it("6桁標準形で小文字を正しく変換する", () => {
      expect(hexToRgba("#abcdef", 1.0)).toBe("rgba(171, 205, 239, 1)");
    });

    it("6桁標準形で様々なalpha値を正しく適用する", () => {
      expect(hexToRgba("#ff0000", 0.5)).toBe("rgba(255, 0, 0, 0.5)");
      expect(hexToRgba("#00ff00", 0.0)).toBe("rgba(0, 255, 0, 0)");
      expect(hexToRgba("#0000ff", 0.75)).toBe("rgba(0, 0, 255, 0.75)");
    });
  });

  describe("エラーケースのテスト", () => {
    it("無効な形式の場合、黒色を返す", () => {
      expect(hexToRgba("#12", 1.0)).toBe("rgba(0, 0, 0, 1)");
      expect(hexToRgba("#12345", 1.0)).toBe("rgba(0, 0, 0, 1)");
      expect(hexToRgba("#1234567", 1.0)).toBe("rgba(0, 0, 0, 1)");
      expect(hexToRgba("invalid", 1.0)).toBe("rgba(0, 0, 0, 1)");
      expect(hexToRgba("", 1.0)).toBe("rgba(0, 0, 0, 1)");
    });

    it("無効な形式でもalpha値は適用される", () => {
      expect(hexToRgba("#12", 0.5)).toBe("rgba(0, 0, 0, 0.5)");
      expect(hexToRgba("invalid", 0.0)).toBe("rgba(0, 0, 0, 0)");
    });
  });

  describe("境界値テスト", () => {
    it("境界値の色コードを正しく変換する", () => {
      expect(hexToRgba("#000", 1.0)).toBe("rgba(0, 0, 0, 1)");
      expect(hexToRgba("#000000", 1.0)).toBe("rgba(0, 0, 0, 1)");
      expect(hexToRgba("#fff", 1.0)).toBe("rgba(255, 255, 255, 1)");
      expect(hexToRgba("#ffffff", 1.0)).toBe("rgba(255, 255, 255, 1)");
    });
  });
});
