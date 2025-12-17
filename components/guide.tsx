import { FileText } from "lucide-react";
import { ReactNode } from "react";

interface GuideProps {
  children?: ReactNode;
}

export function Guide({ children }: GuideProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center font-sans dark:bg-black p-4">
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
        {children}
      </main>
      <footer className="mt-20 text-sm text-muted-foreground">
        &copy; 2025 Antigravity Survey App. All rights reserved.
      </footer>
    </div>
  );
}
