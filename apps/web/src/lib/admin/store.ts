"use client";

import { create } from "zustand";
import type { AdminModuleId, AdminRole, AdminTheme } from "@/lib/admin/types";

interface AdminPlatformState {
  activeModule: AdminModuleId;
  collapsed: boolean;
  commandOpen: boolean;
  theme: AdminTheme;
  role: AdminRole;
  setActiveModule: (module: AdminModuleId) => void;
  setCollapsed: (collapsed: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setRole: (role: AdminRole) => void;
}

export const useAdminPlatformStore = create<AdminPlatformState>((set) => ({
  activeModule: "executive",
  collapsed: false,
  commandOpen: false,
  theme: "dark",
  role: "super_admin",
  setActiveModule: (activeModule) => set({ activeModule, commandOpen: false }),
  setCollapsed: (collapsed) => set({ collapsed }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setRole: (role) => set({ role })
}));
