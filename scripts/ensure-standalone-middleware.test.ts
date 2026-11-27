import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
// scripts 配下は @/ エイリアス対象外のため相対インポートを使用
// eslint-disable-next-line no-restricted-imports
import { ensureStandaloneMiddleware } from "./ensure-standalone-middleware.mjs";

describe("ensureStandaloneMiddleware", () => {
  const tempDirs: string[] = [];

  const createTempProject = (): string => {
    const dir = fs.mkdtempSync(
      path.join(os.tmpdir(), "ensure-standalone-middleware-")
    );
    tempDirs.push(dir);
    return dir;
  };

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("standalone 出力が存在し middleware.js が不足している場合はコピーする", () => {
    const root = createTempProject();
    const sourceDir = path.join(root, ".next", "server");
    const standaloneDir = path.join(
      root,
      ".next",
      "standalone",
      ".next",
      "server"
    );
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(standaloneDir, { recursive: true });

    const sourceFile = path.join(sourceDir, "middleware.js");
    fs.writeFileSync(sourceFile, "module.exports = {};", "utf8");

    const result = ensureStandaloneMiddleware(root);

    expect(result).toBe(true);
    const targetFile = path.join(standaloneDir, "middleware.js");
    expect(fs.existsSync(targetFile)).toBe(true);
    expect(fs.readFileSync(targetFile, "utf8")).toBe("module.exports = {};");
  });

  it("standalone 出力が存在しない場合は何もしない", () => {
    const root = createTempProject();
    const sourceDir = path.join(root, ".next", "server");
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.writeFileSync(
      path.join(sourceDir, "middleware.js"),
      "module.exports = {};",
      "utf8"
    );

    const result = ensureStandaloneMiddleware(root);

    expect(result).toBe(false);
  });

  it("すでに standalone 側に middleware.js が存在する場合は上書きしない", () => {
    const root = createTempProject();
    const sourceDir = path.join(root, ".next", "server");
    const standaloneDir = path.join(
      root,
      ".next",
      "standalone",
      ".next",
      "server"
    );
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(standaloneDir, { recursive: true });

    fs.writeFileSync(path.join(sourceDir, "middleware.js"), "new", "utf8");
    const targetFile = path.join(standaloneDir, "middleware.js");
    fs.writeFileSync(targetFile, "existing", "utf8");

    const result = ensureStandaloneMiddleware(root);

    expect(result).toBe(false);
    expect(fs.readFileSync(targetFile, "utf8")).toBe("existing");
  });

  it("元の middleware.js が存在しない場合は何もしない", () => {
    const root = createTempProject();
    const standaloneDir = path.join(
      root,
      ".next",
      "standalone",
      ".next",
      "server"
    );
    fs.mkdirSync(standaloneDir, { recursive: true });

    const result = ensureStandaloneMiddleware(root);

    expect(result).toBe(false);
  });
});
