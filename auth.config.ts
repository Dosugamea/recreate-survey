import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as { role?: string })?.role === "ADMIN";
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname.startsWith("/admin/login");

      // ユーザー管理の作成・編集ページへのアクセス判定
      const isUserCreateOrEdit =
        nextUrl.pathname.startsWith("/admin/users") &&
        (nextUrl.pathname.endsWith("/create") ||
          nextUrl.pathname.includes("/edit"));

      if (isOnAdmin) {
        if (isOnLogin) {
          if (isLoggedIn) {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return true;
        }

        if (!isLoggedIn) return false;

        // ユーザー作成・編集ページは管理者のみ
        if (isUserCreateOrEdit && !isAdmin) {
          return Response.redirect(new URL("/admin/users", nextUrl));
        }

        return true;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
