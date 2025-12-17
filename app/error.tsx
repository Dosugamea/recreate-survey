"use client";

import { useEffect } from "react";
import { ErrorLayout } from "@/components/error/ErrorLayout";
import { AlertCircle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  useEffect(() => {
    // エラーをログに記録
    console.error("Application error:", error);
  }, [error]);

  return (
    <ErrorLayout
      statusCode="エラー"
      title="予期しないエラーが発生しました"
      description={
        error.message ||
        "アプリケーションでエラーが発生しました。しばらく時間をおいてから再度お試しください。"
      }
      icon={<AlertCircle className="h-10 w-10 text-destructive" />}
      showHomeButton={true}
      showBackButton={true}
    />
  );
}
