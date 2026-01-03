"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions/signOut";
import {
  navigationConfig,
  NavItem,
} from "@/features/admin/layout/config/navigation";

interface NavigationContentProps {
  userName: string;
  isAdmin: boolean;
}

/**
 * ナビゲーションメニューの中身
 * デスクトップ・モバイル両方で共有される純粋なナビゲーションUI
 */
export function NavigationContent({
  userName,
  isAdmin,
}: NavigationContentProps) {
  const pathname = usePathname();

  const isItemActive = (item: NavItem) => {
    if (!pathname) return false;

    if (item.matchType === "startsWith") {
      if (item.excludePaths?.includes(pathname)) return false;
      return pathname.startsWith(item.href);
    }
    return pathname === item.href;
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 py-4 pb-20 scrollbar-thin scrollbar-thumb-primary/10">
        {navigationConfig.map((section, i) => (
          <div key={i} className="px-3">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item, j) => {
                if (item.adminOnly && !isAdmin) return null;

                const Icon = item.icon;
                const active = isItemActive(item);

                return (
                  <Button
                    key={j}
                    asChild
                    variant={active ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Link href={item.href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
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
    </>
  );
}
