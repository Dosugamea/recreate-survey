"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-surface", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            アンケート管理
          </h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname === "/admin/surveys" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/admin/surveys">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                ダッシュボード
              </Link>
            </Button>
            <Button
              asChild
              variant={
                pathname === "/admin/surveys/create" ? "secondary" : "ghost"
              }
              className="w-full justify-start"
            >
              <Link href="/admin/surveys/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                新規作成
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            アプリ管理
          </h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={
                pathname?.startsWith("/admin/apps") &&
                pathname !== "/admin/apps/create"
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
            >
              <Link href="/admin/apps">
                <Settings className="mr-2 h-4 w-4" />
                アプリ一覧
              </Link>
            </Button>
            <Button
              asChild
              variant={
                pathname === "/admin/apps/create" ? "secondary" : "ghost"
              }
              className="w-full justify-start"
            >
              <Link href="/admin/apps/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                アプリ作成
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
