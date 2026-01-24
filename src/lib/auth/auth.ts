import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { insertAuditLog } from "@/lib/logger-utils";

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          if (!user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            try {
              await insertAuditLog({
                action: "LOGIN",
                resource: "AUTH",
                userId: user.id,
              });
            } catch (e) {
              console.error("Audit log failed during login", e);
            }
            // カスタムUser型に合わせてroleプロパティを含むオブジェクトを返す
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
