"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

interface ErrorLayoutProps {
  statusCode?: number | string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

export function ErrorLayout({
  statusCode,
  title,
  description,
  icon,
  showHomeButton = false,
  showBackButton = true,
}: ErrorLayoutProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-none">
          <CardHeader className="space-y-4">
            {icon && (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                {icon}
              </div>
            )}
            {statusCode && (
              <div className="text-6xl font-bold text-destructive">
                {statusCode}
              </div>
            )}
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-base">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {showHomeButton && (
              <Button asChild size="lg" className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  ホームに戻る
                </Link>
              </Button>
            )}
            {showBackButton && (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                前のページに戻る
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3 px-4">
        <div className="flex justify-end">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            powered by {appName}
          </p>
        </div>
      </footer>
    </div>
  );
}
