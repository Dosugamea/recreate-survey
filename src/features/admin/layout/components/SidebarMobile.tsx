"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavigationContent } from "@/features/admin/layout/components/NavigationContent";

interface SidebarMobileProps {
  userName: string;
  isAdmin: boolean;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;

/**
 * モバイル用サイドバー
 * Sheetコンポーネントを使用したドロワー形式のナビゲーション
 */
export function SidebarMobile({ userName, isAdmin }: SidebarMobileProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet key={pathname} open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="mr-4">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SheetTitle className="sr-only">ナビゲーションメニュー</SheetTitle>

        {/* モバイル用のヘッダー */}
        <Link
          href="/admin"
          className="block w-full border-b hover:opacity-80 transition-opacity cursor-pointer shrink-0"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full h-16 bg-linear-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center overflow-hidden px-4">
            <h1 className="text-xl font-bold tracking-wider text-primary drop-shadow-sm select-none">
              {appName}
            </h1>
          </div>
        </Link>

        {/* ナビゲーションコンテンツ */}
        <NavigationContent userName={userName} isAdmin={isAdmin} />
      </SheetContent>
    </Sheet>
  );
}
