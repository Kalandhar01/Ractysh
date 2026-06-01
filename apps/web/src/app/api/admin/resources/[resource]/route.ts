import { NextResponse } from "next/server";
import { z } from "zod";
import type { AdminModuleId, AdminSnapshot } from "@/lib/admin/types";
import { getEnterpriseAdminSnapshot, recordAdminAudit, requireAdminAccess } from "@/lib/admin/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    resource: string;
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

const writeSchema = z.object({
  title: z.string().trim().min(1).max(180).optional(),
  name: z.string().trim().min(1).max(180).optional(),
  status: z.string().trim().max(80).optional(),
  payload: z.record(z.unknown()).optional()
});

function snapshotValue(snapshot: AdminSnapshot, resource: string) {
  if (!Object.prototype.hasOwnProperty.call(snapshot, resource)) return null;
  return snapshot[resource as keyof AdminSnapshot];
}

export async function GET(_request: Request, context: RouteContext) {
  const { resource } = await context.params;

  try {
    await requireAdminAccess(resourceModules[resource] || "executive");
    const snapshot = await getEnterpriseAdminSnapshot();
    const value = snapshotValue(snapshot, resource);

    if (!value) {
      return NextResponse.json({ message: "Unknown admin resource." }, { status: 404 });
    }

    return NextResponse.json({ resource, data: value });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? Number(error.status) : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load admin resource." }, { status });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { resource } = await context.params;

  try {
    const admin = await requireAdminAccess(resourceModules[resource] || "executive");
    const parsed = writeSchema.safeParse(await request.json().catch(() => ({})));

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid admin payload.", issues: parsed.error.issues }, { status: 400 });
    }

    await recordAdminAudit({
      actorId: admin.id.startsWith("dev-") || admin.id.startsWith("env-") ? undefined : admin.id,
      action: "create",
      entityType: resource,
      metadata: parsed.data
    });

    return NextResponse.json(
      {
        message: "Admin resource create request accepted.",
        resource,
        draft: {
          id: `${resource}-${Date.now()}`,
          ...parsed.data
        }
      },
      { status: 201 }
    );
  } catch (error) {
    const status = error instanceof Error && "status" in error ? Number(error.status) : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create admin resource." }, { status });
  }
}
