import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

export const proxy = NextAuth(authConfig).auth;

export const config = {
  // https://nextjsjp.org/docs/app/api-reference/file-conventions/proxy
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
