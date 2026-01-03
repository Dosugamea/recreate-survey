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
import { Footer } from "@/components/ui/footer";
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
  return (
    <div className="flex min-h-screen flex-col bg-background">
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
      <Footer />
    </div>
  );
}
