"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Footer() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // クライアント側でマウントされるまで待機して、ハイドレーションエラーを防ぐ
  // next-themesの推奨パターン: https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  // マウントされるまでは常にMoonアイコンを表示（サーバー側とクライアント側で一貫性を保つ）
  // マウントされた後にのみ、実際のテーマに基づいてアイコンを切り替える
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3 px-4">
      <div className="flex justify-end items-center gap-3">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          powered by {appName}
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="テーマを切り替え"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </footer>
  );
}
