"use client";

import { useEffect, useState } from "react";
import { getAuditLogs } from "@/features/admin/audit-logs/actions/audit-logs";
import { format } from "date-fns";

import { ja } from "date-fns/locale";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function AuditLogPageRoot() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const result = await getAuditLogs(page);
        setLogs(result.logs);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">監査ログ</h1>
      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  日時
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  ユーザー
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  操作
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  リソース
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  詳細
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  IP
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[50px]"></th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    読み込み中...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    ログがありません
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle whitespace-nowrap">
                      {format(new Date(log.createdAt), "yyyy/MM/dd HH:mm:ss", {
                        locale: ja,
                      })}
                    </td>
                    <td className="p-4 align-middle">
                      <div>{log.user.name || "不明"}</div>
                      <div className="text-xs text-muted-foreground">
                        {log.user.email}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
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
                    </td>
                    <td className="p-4 align-middle">
                      {log.resource}
                      {log.resourceId && (
                        <div className="text-xs text-muted-foreground text-ellipsis overflow-hidden max-w-[100px]">
                          {log.resourceId}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-middle max-w-[300px]">
                      <div
                        className="truncate text-xs font-mono bg-muted p-1 rounded"
                        title={log.details || ""}
                      >
                        {log.details || "-"}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-xs font-mono">
                      {log.ipAddress || "-"}
                    </td>
                    <td className="p-4 align-middle">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/audit-logs/${log.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          className="px-4 py-2 border rounded disabled:opacity-50 text-sm"
        >
          前へ
        </button>
        <span className="px-4 py-2 text-sm flex items-center">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
          className="px-4 py-2 border rounded disabled:opacity-50 text-sm"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
