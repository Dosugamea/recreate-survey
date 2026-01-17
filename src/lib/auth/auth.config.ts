import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl;
      const isLoggedIn = !!auth?.user;

      // 1. ログイン済みでログインページに飛ぼうとしたら、管理画面トップに飛ばしてあげる！
      const isOnLogin = pathname.startsWith("/admin/login");
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      // 2. 管理画面配下（ログインページ以外）でログインしてないなら、アクセス拒否！
      // (NextAuthが自動でログインページにリダイレクトしてくれるよ)
      const isOnAdmin = pathname.startsWith("/admin");
      if (isOnAdmin && !isOnLogin && !isLoggedIn) {
        return false;
      }

      // それ以外（公開ページとか、ログイン済み管理画面とか）はOK！
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role: string }).role = token.role as string;
        session.user.id = token.sub || ""; // next-auth usually puts id in sub
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
