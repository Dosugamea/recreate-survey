"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isPending: boolean;
  themeColor: string;
}

export function SubmitButton({ isPending, themeColor }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="auto"
      className="w-full sm:w-auto px-12 py-6 text-lg font-bold text-white shadow-md hover:opacity-90 transition-opacity"
      style={{ backgroundColor: themeColor }}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="animate-spin" /> : "回答を送信する"}
    </Button>
  );
}
