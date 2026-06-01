import type { AdminModuleId, AdminRole } from "@/lib/admin/types";

export const roleLabels: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  chairman: "Chairman",
  director: "Director",
  manager: "Manager",
  editor: "Editor",
  recruiter: "Recruiter",
  analyst: "Analyst"
};

const roleAccess: Record<AdminRole, AdminModuleId[]> = {
  super_admin: [
    "executive",
    "ecosystem",
    "services",
    "portfolio",
    "blog",
    "careers",
    "founder",
    "consultations",
    "contact",
    "media",
    "analytics",
    "search",
    "rbac",
    "notifications",
    "audit"
  ],
  chairman: ["executive", "ecosystem", "founder", "analytics", "search", "notifications", "audit"],
  director: ["executive", "ecosystem", "services", "portfolio", "consultations", "contact", "analytics", "search", "notifications"],
  manager: ["executive", "ecosystem", "services", "portfolio", "consultations", "contact", "media", "notifications"],
  editor: ["services", "portfolio", "blog", "founder", "media", "search", "notifications"],
  recruiter: ["careers", "media", "search", "notifications", "audit"],
  analyst: ["executive", "analytics", "search", "audit"]
};

export function canAccessModule(role: AdminRole, module: AdminModuleId): boolean {
  return roleAccess[role].includes(module);
}

export function modulesForRole(role: AdminRole): AdminModuleId[] {
  return roleAccess[role];
}
