import { AdminLoginPageRoot } from "@/features/admin/auth/components/AdminLoginPageRoot";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login to admin dashboard",
};

export default function LoginPage() {
  return <AdminLoginPageRoot />;
}
