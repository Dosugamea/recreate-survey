import { Sidebar } from "@/components/admin/layout/Sidebar";
import { AdminMobileNav } from "@/components/admin/layout/AdminMobileNav";
import { Footer } from "@/components/ui/footer";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userName, isAdmin } = await getCurrentUser();
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex items-center border-b bg-background px-4 py-3 lg:hidden">
        <AdminMobileNav userName={userName} isAdmin={isAdmin} />
        <span className="text-lg font-semibold">{appName}</span>
      </div>
      <Sidebar
        className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r"
        userName={userName}
        isAdmin={isAdmin}
      />
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
