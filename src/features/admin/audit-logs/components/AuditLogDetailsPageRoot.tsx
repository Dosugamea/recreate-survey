"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Log {
  id: string;
  userId: string;
  user: { name: string | null; email: string | null };
  action: string;
  resource: string;
  resourceId: string | null;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

interface AuditLogDetailsPageRootProps {
  log: Log;
}

export function AuditLogDetailsPageRoot({ log }: AuditLogDetailsPageRootProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/audit-logs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">監査ログ詳細</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-2 font-semibold">基本情報</h2>
            <dl className="grid gap-2 text-sm">
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">日時</dt>
                <dd className="col-span-2">
                  {format(new Date(log.createdAt), "yyyy/MM/dd HH:mm:ss", {
                    locale: ja,
                  })}
                </dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">ID</dt>
                <dd className="col-span-2 font-mono text-xs">{log.id}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">
                  アクション
                </dt>
                <dd className="col-span-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                    ${
                      log.action === "CREATE"
                        ? "bg-green-100 text-green-800"
                        : log.action === "UPDATE"
                          ? "bg-blue-100 text-blue-800"
                          : log.action === "DELETE"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {log.action}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-2 font-semibold">ユーザー情報</h2>
            <dl className="grid gap-2 text-sm">
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">名前</dt>
                <dd className="col-span-2">{log.user.name || "不明"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">メール</dt>
                <dd className="col-span-2">{log.user.email}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">
                  ユーザーID
                </dt>
                <dd className="col-span-2 font-mono text-xs">{log.userId}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-2 font-semibold">接続情報</h2>
            <dl className="grid gap-2 text-sm">
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">
                  IPアドレス
                </dt>
                <dd className="col-span-2 font-mono">{log.ipAddress || "-"}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">
                  User Agent
                </dt>
                <dd className="col-span-2 font-mono text-xs break-all">
                  {log.userAgent || "-"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-2 font-semibold">リソース情報</h2>
            <dl className="grid gap-2 text-sm">
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">種別</dt>
                <dd className="col-span-2">{log.resource}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-muted-foreground">
                  リソースID
                </dt>
                <dd className="col-span-2 font-mono text-xs break-all">
                  {log.resourceId || "-"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border bg-card p-4 h-full">
            <h2 className="mb-2 font-semibold">詳細データ</h2>
            <div className="rounded-md bg-muted p-4 overflow-auto max-h-[400px]">
              <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                {log.details
                  ? (() => {
                      try {
                        return JSON.stringify(JSON.parse(log.details), null, 2);
                      } catch {
                        return log.details;
                      }
                    })()
                  : "-"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
