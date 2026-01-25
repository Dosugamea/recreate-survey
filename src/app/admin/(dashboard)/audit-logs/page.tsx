import { AuditLogPageRoot } from "@/features/admin/audit-logs/components/AuditLogPageRoot";
import { ensureAdmin } from "@/lib/auth-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "監査ログ | Survey App",
};

export default async function AuditLogPage() {
  await ensureAdmin();
  return <AuditLogPageRoot />;
}
