import { createHash } from "node:crypto";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import type { AdminRole } from "@/lib/admin/types";
import { prisma } from "@/lib/server/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

function normalizeRole(role: string | null | undefined): AdminRole {
  const roles: AdminRole[] = ["super_admin", "chairman", "director", "manager", "editor", "recruiter", "analyst"];
  return roles.includes(role as AdminRole) ? (role as AdminRole) : "manager";
}

function matchesPassword(input: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  if (stored === input) return true;

  if (stored.startsWith("sha256:")) {
    const digest = createHash("sha256").update(input).digest("hex");
    return stored === `sha256:${digest}`;
  }

  return false;
}

async function findDatabaseAdmin(email: string, password: string) {
  if (!process.env.DATABASE_URL) return null;

  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user?.active || !matchesPassword(password, user.passwordHash)) return null;

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        email,
        success: true
      }
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name || user.email,
      role: normalizeRole(user.role)
    };
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin"
  },
  providers: [
    CredentialsProvider({
      name: "Ractysh Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const databaseUser = await findDatabaseAdmin(email, password);
        if (databaseUser) return databaseUser;

        const envEmail = process.env.ADMIN_EMAIL || "admin@ractysh.com";
        const envPassword = process.env.ADMIN_PASSWORD || "change-me-now";
        if (email === envEmail && password === envPassword) {
          return {
            id: "env-super-admin",
            email,
            name: "Ractysh Super Admin",
            role: "super_admin"
          };
        }

        if (process.env.DATABASE_URL) {
          await prisma.loginHistory.create({ data: { email, success: false } }).catch(() => null);
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = normalizeRole((user as { role?: string }).role);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || "");
        session.user.role = normalizeRole(String(token.role || "manager"));
      }
      return session;
    }
  }
};
