"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/features/admin/layout/components/Sidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface AdminMobileNavProps {
  userName: string;
  isAdmin: boolean;
}

export function AdminMobileNav({ userName, isAdmin }: AdminMobileNavProps) {
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
        <Sidebar
          className="h-full border-none"
          userName={userName}
          isAdmin={isAdmin}
        />
      </SheetContent>
    </Sheet>
  );
}
