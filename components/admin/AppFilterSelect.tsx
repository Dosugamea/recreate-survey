"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface App {
  id: string;
  name: string;
}

interface AppFilterSelectProps {
  apps: App[];
  currentAppId?: string;
}

export function AppFilterSelect({ apps, currentAppId }: AppFilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("appId");
    } else {
      params.set("appId", value);
    }
    router.push(`/admin/surveys?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <label
        htmlFor="app-filter"
        className="text-sm font-medium whitespace-nowrap"
      >
        アプリで絞り込み:
      </label>
      <Select value={currentAppId || "all"} onValueChange={handleValueChange}>
        <SelectTrigger id="app-filter" className="w-full">
          <SelectValue placeholder="すべてのアプリ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべてのアプリ</SelectItem>
          {apps.map((app) => (
            <SelectItem key={app.id} value={app.id}>
              {app.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
