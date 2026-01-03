import type { Metadata } from "next";
import { Guide } from "@/components/guide";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `管理画面 | ${appName}`,
    description: "ホームページ",
  };
}

export default function Home() {
  return <Guide />;
}
