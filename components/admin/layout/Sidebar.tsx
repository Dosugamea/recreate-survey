"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  PlusCircle,
  Settings,
  HelpCircle,
  BarChart3,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

const appName = process.env.NEXT_PUBLIC_APP_NAME;

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-surface", className)}>
      <Link
        href="/admin"
        className="block w-full border-b hover:opacity-80 transition-opacity cursor-pointer"
      >
        <div className="relative w-full h-24 bg-linear-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center overflow-hidden px-4">
          <h1 className="text-2xl font-bold tracking-wider text-primary drop-shadow-sm select-none">
            {appName}
          </h1>
        </div>
      </Link>
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
                <ClipboardList className="mr-2 h-4 w-4" />
                アンケート一覧
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/admin/answers" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/admin/answers">
                <BarChart3 className="mr-2 h-4 w-4" />
                アンケート結果一覧
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
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            ユーザー管理
          </h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={
                pathname?.startsWith("/admin/users") &&
                pathname !== "/admin/users/create"
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
            >
              <Link href="/admin/users">
                <User className="mr-2 h-4 w-4" />
                ユーザー一覧
              </Link>
            </Button>
            <Button
              asChild
              variant={
                pathname === "/admin/users/create" ? "secondary" : "ghost"
              }
              className="w-full justify-start"
            >
              <Link href="/admin/users/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                ユーザー作成
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            その他
          </h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname === "/admin/help" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/admin/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                ヘルプ
              </Link>
            </Button>
            <form action={signOutAction} className="w-full">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                type="submit"
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
