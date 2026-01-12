import { describe, it, expect } from "vitest";
import { escapeCsvValue } from "@/lib/csv-utils";

describe("escapeCsvValue", () => {
  it("should return normal string as is", () => {
    expect(escapeCsvValue("hello")).toBe("hello");
    expect(escapeCsvValue("123")).toBe("123");
  });

  it("should escape strings starting with injection characters", () => {
    expect(escapeCsvValue("=cmd")).toBe("'=cmd");
    expect(escapeCsvValue("+cmd")).toBe("'+cmd");
    expect(escapeCsvValue("-cmd")).toBe("'-cmd");
    expect(escapeCsvValue("@cmd")).toBe("'@cmd");
    expect(escapeCsvValue("\tcmd")).toBe("'\tcmd");
    expect(escapeCsvValue("\rcmd")).toBe("'\rcmd");
  });

  it("should escape strings containing commas", () => {
    expect(escapeCsvValue("hello,world")).toBe('"hello,world"');
  });

  it("should escape strings containing newlines", () => {
    expect(escapeCsvValue("hello\nworld")).toBe('"hello\nworld"');
  });

  it("should escape strings containing double quotes", () => {
    expect(escapeCsvValue('hello"world')).toBe('"hello""world"');
  });

  it("should handle mixed cases (injection char + comma)", () => {
    // 1. 先頭に ' がつく -> '=1+1,test'
    // 2. カンマがあるので " で囲まれる -> "'=1+1,test'"
    expect(escapeCsvValue("=1+1,test")).toBe(`"'=1+1,test"`);
  });

  it("should handle mixed cases (injection char + quote)", () => {
    // 1. 先頭に ' がつく -> '=1+1"test'
    // 2. " があるのでエスケープして " で囲まれる -> "'=1+1""test'"
    expect(escapeCsvValue('=1+1"test')).toBe(`"'=1+1""test"`);
  });
});
