import type { Metadata } from "next";
import { Guide } from "@/components/guide";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

export const metadata: Metadata = {
  title: `ホーム | ${appName}`,
  description: "ホームページ",
};

export default function Home() {
  return <Guide />;
}
