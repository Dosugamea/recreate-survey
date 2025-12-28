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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  userName: string;
  isAdmin: boolean;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

export function Sidebar({ className, userName, isAdmin }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-full border-r bg-surface flex flex-col relative",
        className
      )}
    >
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
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 py-4 pb-20 scrollbar-thin scrollbar-thumb-primary/10">
        <div className="px-3">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
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
        <div className="px-3">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
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
        <div className="px-3">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            ユーザー管理
          </h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname === "/admin/users" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/admin/users">
                <User className="mr-2 h-4 w-4" />
                ユーザー一覧
              </Link>
            </Button>
            {isAdmin && (
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
            )}
          </div>
        </div>
        <div className="px-3">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
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
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 border-t bg-surface p-2 shrink-0 z-10">
        <div className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {userName || "管理者"}
            </p>
          </div>
          <form action={signOutAction} className="shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              type="submit"
              title="ログアウト"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
