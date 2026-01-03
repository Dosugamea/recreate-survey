"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavigationContent } from "@/features/admin/layout/components/NavigationContent";

interface SidebarDesktopProps extends React.HTMLAttributes<HTMLDivElement> {
  userName: string;
  isAdmin: boolean;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

/**
 * デスクトップ用サイドバー
 * 固定配置されるサイドバーのレイアウトとヘッダーを提供
 */
export function SidebarDesktop({
  className,
  userName,
  isAdmin,
}: SidebarDesktopProps) {
  return (
    <div
      className={cn(
        "h-full border-r bg-surface flex flex-col relative",
        className
      )}
    >
      {/* アプリケーションヘッダー */}
      <Link
        href="/admin"
        className="block w-full border-b hover:opacity-80 transition-opacity cursor-pointer shrink-0"
      >
        <div className="relative w-full h-16 bg-linear-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center overflow-hidden px-4">
          <h1 className="text-xl font-bold tracking-wider text-primary drop-shadow-sm select-none">
            {appName}
          </h1>
        </div>
      </Link>

      {/* ナビゲーションコンテンツ */}
      <NavigationContent userName={userName} isAdmin={isAdmin} />
    </div>
  );
}
