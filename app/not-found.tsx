import { ErrorLayout } from "@/components/error/ErrorLayout";
import { FileQuestion } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `404エラー | ${appName}`,
    description: "お探しのページは見つかりませんでした",
  };
}

export default function NotFound() {
  return (
    <ErrorLayout
      statusCode={404}
      title="ページが見つかりません"
      description="お探しのページは存在しないか、移動または削除された可能性があります。"
      icon={<FileQuestion className="h-10 w-10 text-destructive" />}
    />
  );
}
