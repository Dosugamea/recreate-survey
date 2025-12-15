import { Sidebar } from "@/components/admin/Sidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex items-center border-b bg-background px-4 py-3 lg:hidden">
        <AdminMobileNav />
        <span className="text-lg font-semibold">Admin</span>
      </div>
      <Sidebar className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 border-r bg-gray-100/40" />
      <div className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64 box-border min-w-0">
        {children}
      </div>
    </div>
  );
}
