"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface AdminMobileNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminMobileNav({ user }: AdminMobileNavProps) {
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
        <Sidebar className="h-full border-none" user={user} />
      </SheetContent>
    </Sheet>
  );
}
