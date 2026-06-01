import { NextResponse } from "next/server";
import { z } from "zod";
import type { AdminModuleId } from "@/lib/admin/types";
import { recordAdminAudit, requireAdminAccess } from "@/lib/admin/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    resource: string;
    id: string;
  }>;
};

const resourceModules: Record<string, AdminModuleId> = {
  divisions: "ecosystem",
  services: "services",
  projects: "portfolio",
  blogs: "blog",
  careers: "careers",
  consultations: "consultations",
  contacts: "contact",
  media: "media",
  analytics: "analytics",
  permissions: "rbac",
  notifications: "notifications",
  audit: "audit",
  founderOffice: "founder"
};

const patchSchema = z.object({
  status: z.string().trim().max(80).optional(),
  payload: z.record(z.unknown()).optional()
});

export async function PATCH(request: Request, context: RouteContext) {
  const { resource, id } = await context.params;

  try {
    const admin = await requireAdminAccess(resourceModules[resource] || "executive");
    const parsed = patchSchema.safeParse(await request.json().catch(() => ({})));

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid admin update payload.", issues: parsed.error.issues }, { status: 400 });
    }

    await recordAdminAudit({
      actorId: admin.id.startsWith("dev-") || admin.id.startsWith("env-") ? undefined : admin.id,
      action: "update",
      entityType: resource,
      entityId: id,
      metadata: parsed.data
    });

    return NextResponse.json({
      message: "Admin resource update request accepted.",
      resource,
      id,
      ...parsed.data
    });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? Number(error.status) : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to update admin resource." }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { resource, id } = await context.params;

  try {
    const admin = await requireAdminAccess(resourceModules[resource] || "executive");

    await recordAdminAudit({
      actorId: admin.id.startsWith("dev-") || admin.id.startsWith("env-") ? undefined : admin.id,
      action: "delete",
      entityType: resource,
      entityId: id
    });

    return NextResponse.json({
      message: "Admin resource delete request accepted.",
      resource,
      id
    });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? Number(error.status) : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to delete admin resource." }, { status });
  }
}
