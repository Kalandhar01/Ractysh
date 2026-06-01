import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getAdminSnapshot } from "@/lib/admin/data";
import { canAccessModule } from "@/lib/admin/rbac";
import type { AdminModuleId, AdminRole, AdminSnapshot } from "@/lib/admin/types";
import { prisma } from "@/lib/server/prisma";

export class AdminAuthError extends Error {
  constructor(
    message: string,
    public readonly status = 401
  ) {
    super(message);
    this.name = "AdminAuthError";
  }
}

export interface AdminSessionContext {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export async function requireAdminAccess(module?: AdminModuleId): Promise<AdminSessionContext> {
  const session = await getServerSession(authOptions);

  if (session?.user?.email && session.user.role) {
    if (module && !canAccessModule(session.user.role, module)) {
      throw new AdminAuthError("Insufficient admin permissions.", 403);
    }

    return {
      id: session.user.id || "session-admin",
      email: session.user.email,
      name: session.user.name || session.user.email,
      role: session.user.role
    };
  }

  if (process.env.NODE_ENV !== "production" && process.env.ADMIN_AUTH_DISABLED !== "false") {
    return {
      id: "dev-super-admin",
      email: process.env.ADMIN_EMAIL || "admin@ractysh.com",
      name: "Development Super Admin",
      role: "super_admin"
    };
  }

  throw new AdminAuthError("Admin authentication required.", 401);
}

export async function getEnterpriseAdminSnapshot(): Promise<AdminSnapshot> {
  return getAdminSnapshot();
}

export async function recordAdminAudit(input: {
  actorId?: string;
  action: "create" | "update" | "delete" | "login" | "logout" | "publish" | "approve" | "assign" | "export" | "import";
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  if (!process.env.DATABASE_URL) return;

  await prisma.auditLog
    .create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent
      }
    })
    .catch(() => null);
}
