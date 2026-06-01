import { NextResponse } from "next/server";
import { getEnterpriseAdminSnapshot, requireAdminAccess } from "@/lib/admin/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminAccess("executive");
    const snapshot = await getEnterpriseAdminSnapshot();
    return NextResponse.json(snapshot);
  } catch (error) {
    const status = error instanceof Error && "status" in error ? Number(error.status) : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load admin overview." }, { status });
  }
}
