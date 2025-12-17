import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export const metadata: Metadata = {
  title: `ホーム | ${appName}`,
  description: "ホームページ",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex flex-col items-center text-center space-y-8 max-w-2xl">
        <div className="rounded-full bg-primary/10 p-6">
          <FileText className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          アンケートアプリ
        </h1>
        <p className="text-xl text-muted-foreground">
          簡単にアンケートを作成、公開、回答の集計ができるアプリケーションです。
          管理画面から新しいアンケートを作成してください。
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/admin/surveys">管理画面へ進む</Link>
          </Button>
        </div>
      </main>
      <footer className="mt-20 text-sm text-muted-foreground">
        &copy; 2025 Antigravity Survey App. All rights reserved.
      </footer>
    </div>
  );
}

