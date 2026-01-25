import { getAuditLogById } from "@/features/admin/audit-logs/actions/audit-logs";
import { AuditLogDetailsPageRoot } from "@/features/admin/audit-logs/components/AuditLogDetailsPageRoot";
import { ensureAdmin } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "監査ログ詳細 | Survey App",
};

export default async function AuditLogDetailsPage({ params }: PageProps) {
  await ensureAdmin();
  const { id } = await params;

  let log;
  try {
    log = await getAuditLogById(id);
  } catch {
    notFound();
  }

  return <AuditLogDetailsPageRoot log={log} />;
}
