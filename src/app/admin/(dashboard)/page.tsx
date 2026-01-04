import type { Metadata } from "next";
import { Landing } from "@/components/landing/landing";

export async function generateMetadata(): Promise<Metadata> {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title: `ホーム | ${appName}`,
    description: "ホームページ",
  };
}

export default function Home() {
  return <Landing />;
}
