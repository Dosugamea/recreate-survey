import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-row">
      <div className="hidden w-64 md:block">
        <Sidebar className="fixed w-64 items-stretch border-r" />
      </div>
      <div className="flex-1 p-8 md:pl-72">{children}</div>
    </div>
  );
}
