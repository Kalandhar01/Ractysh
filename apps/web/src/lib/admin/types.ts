import type { ReactNode } from "react";

export type AdminRole =
  | "super_admin"
  | "chairman"
  | "director"
  | "manager"
  | "editor"
  | "recruiter"
  | "analyst";

export type AdminModuleId =
  | "executive"
  | "ecosystem"
  | "services"
  | "portfolio"
  | "blog"
  | "careers"
  | "founder"
  | "consultations"
  | "contact"
  | "media"
  | "analytics"
  | "search"
  | "rbac"
  | "notifications"
  | "audit";

export type AdminTheme = "dark" | "light";

export interface AdminModule {
  id: AdminModuleId;
  label: string;
  eyebrow: string;
  description: string;
  shortcut: string;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: string;
  source: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  module: AdminModuleId;
}

export interface DivisionWorkspace {
  id: string;
  name: string;
  legalName: string;
  summary: string;
  metric: string;
  sections: Array<"Overview" | "Projects" | "Team" | "Documents" | "Media" | "Analytics">;
  projects: number;
  team: number;
  documents: number;
  media: number;
  score: number;
}

export interface ServiceWorkspace {
  id: string;
  title: string;
  company: string;
  route: string;
  category: string;
  status: "Published" | "Draft" | "Review";
  requests: number;
  conversion: string;
  tags: string[];
}

export interface ProjectRow {
  id: string;
  title: string;
  division: string;
  category: string;
  location: string;
  year: string;
  status: "Concept" | "Active" | "Published" | "Featured" | "Archived";
  views: number;
  leads: number;
}

export interface BlogRow {
  id: string;
  title: string;
  category: string;
  author: string;
  status: "Draft" | "Scheduled" | "Published";
  publishAt: string;
  seoScore: number;
}

export interface CareerApplicationRow {
  id: string;
  candidate: string;
  role: string;
  source: string;
  stage: string;
  score: number;
  updatedAt: string;
}

export interface ConsultationRow {
  id: string;
  company: string;
  lead: string;
  service: string;
  status: string;
  score: number;
  meeting: string;
}

export interface ContactRow {
  id: string;
  name: string;
  interest: string;
  status: string;
  owner: string;
  response: string;
}

export interface MediaAssetRow {
  id: string;
  title: string;
  kind: string;
  folder: string;
  usage: string;
  size: string;
  updatedAt: string;
}

export interface AnalyticsProviderStatus {
  provider: "PostHog" | "Sentry" | "Vercel Analytics" | "Better Stack" | "Lighthouse";
  status: "Connected" | "Configured" | "Needs key" | "Manual import";
  metric: string;
  value: string;
}

export interface SearchRecord {
  id: string;
  resource: "Project" | "Service" | "Career" | "Blog" | "Document" | "User";
  title: string;
  summary: string;
  href: string;
  owner: string;
}

export interface PermissionRow {
  role: AdminRole;
  label: string;
  resources: string[];
  permissions: string[];
}

export interface NotificationItem {
  id: string;
  kind: "Lead" | "Career" | "Content" | "System" | "Incident";
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface AuditRow {
  id: string;
  actor: string;
  action: string;
  entity: string;
  ip: string;
  time: string;
}

export interface FounderOfficeItem {
  id: string;
  title: string;
  type: "Timeline" | "Leadership Story" | "Chairman Profile" | "Media Asset" | "Internal Note";
  status: "Draft" | "Review" | "Published" | "Private";
  owner: string;
}

export interface AdminSnapshot {
  generatedAt: string;
  metrics: MetricCard[];
  activity: ActivityItem[];
  divisions: DivisionWorkspace[];
  services: ServiceWorkspace[];
  projects: ProjectRow[];
  blogs: BlogRow[];
  careers: CareerApplicationRow[];
  consultations: ConsultationRow[];
  contacts: ContactRow[];
  media: MediaAssetRow[];
  analytics: AnalyticsProviderStatus[];
  search: SearchRecord[];
  permissions: PermissionRow[];
  notifications: NotificationItem[];
  audit: AuditRow[];
  founderOffice: FounderOfficeItem[];
}

export interface AdminNavItem {
  id: AdminModuleId;
  icon: ReactNode;
  label: string;
}
