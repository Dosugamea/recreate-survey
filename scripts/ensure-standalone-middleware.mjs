import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Next.js 16 の proxy.ts を使用した場合、standalone 出力ディレクトリに
 * server/middleware.js が含まれないことがあり、OpenNext ビルドが失敗する。
 * そのため、ビルド後に standalone 側へ middleware.js を補完する。
 *
 * @param {string} projectRoot プロジェクトルートディレクトリのパス
 * @returns {boolean} コピーを実行した場合は true、不要な場合は false
 */
export function ensureStandaloneMiddleware(projectRoot) {
  const sourcePath = path.join(projectRoot, ".next", "server", "middleware.js");
  const standaloneServerDir = path.join(
    projectRoot,
    ".next",
    "standalone",
    ".next",
    "server"
  );
  const targetPath = path.join(standaloneServerDir, "middleware.js");

  // standalone 出力が存在しない通常の next build 時は何もしない
  if (!fs.existsSync(standaloneServerDir)) {
    return false;
  }

  // 元の middleware.js が存在しない場合、または既にコピー済みの場合は何もしない
  if (!fs.existsSync(sourcePath) || fs.existsSync(targetPath)) {
    return false;
  }

  fs.copyFileSync(sourcePath, targetPath);
  return true;
}

// CLI として直接実行された場合のみ処理を実行する
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const copied = ensureStandaloneMiddleware(process.cwd());
  if (copied) {
    console.log(
      "[ensure-standalone-middleware] .next/standalone/.next/server/middleware.js を補完しました。"
    );
  }
}
