import { NextResponse } from "next/server";
import { filterAdminSearch } from "@/lib/admin/data";
import { getEnterpriseAdminSnapshot, requireAdminAccess } from "@/lib/admin/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdminAccess("search");
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const snapshot = await getEnterpriseAdminSnapshot();

    return NextResponse.json({
      query,
      results: filterAdminSearch(snapshot.search, query)
    });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? Number(error.status) : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to search admin records." }, { status });
  }
}
