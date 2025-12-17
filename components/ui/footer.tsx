"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

export function Footer() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";
  const { theme, setTheme, resolvedTheme } = useTheme();

  const currentTheme = resolvedTheme ?? theme;
  const isDark = currentTheme === "dark";

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
