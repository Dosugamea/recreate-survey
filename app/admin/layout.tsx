import { Sidebar } from "@/components/admin/layout/Sidebar";
import { AdminMobileNav } from "@/components/admin/layout/AdminMobileNav";
import { Footer } from "@/components/ui/footer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex items-center border-b bg-background px-4 py-3 lg:hidden">
        <AdminMobileNav />
        <span className="text-lg font-semibold">{appName}</span>
      </div>
      <Sidebar className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 border-r bg-surface" />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64 box-border">
          {children}
        </div>
        <div className="lg:ml-64">
          <Footer />
        </div>
      </div>
    </div>
  );
}
