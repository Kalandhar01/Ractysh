import { fallbackContent } from "@/data/fallbackContent";
import type {
  ActivityItem,
  AdminModule,
  AdminSnapshot,
  AnalyticsProviderStatus,
  AuditRow,
  BlogRow,
  CareerApplicationRow,
  ContactRow,
  ConsultationRow,
  DivisionWorkspace,
  FounderOfficeItem,
  MediaAssetRow,
  MetricCard,
  PermissionRow,
  ProjectRow,
  SearchRecord,
  ServiceWorkspace
} from "@/lib/admin/types";
import type { SiteContent } from "@/lib/types";

export const adminModules: AdminModule[] = [
  {
    id: "executive",
    label: "Executive Dashboard",
    eyebrow: "Enterprise operating layer",
    description: "Global metrics, business overview, activity, leads, project status, website analytics and notifications.",
    shortcut: "1"
  },
  {
    id: "ecosystem",
    label: "Ecosystem Management",
    eyebrow: "Five-division command",
    description: "Architecture, construction, real estate, export-import and OTC operations with teams, docs, media and analytics.",
    shortcut: "2"
  },
  {
    id: "services",
    label: "Services Management",
    eyebrow: "Mega menu operations",
    description: "Manage every service page mapped to the public navigation and conversion flows.",
    shortcut: "3"
  },
  {
    id: "portfolio",
    label: "Work Portfolio",
    eyebrow: "Case study publishing",
    description: "Create, edit, publish, feature, upload galleries and manage project SEO.",
    shortcut: "4"
  },
  {
    id: "blog",
    label: "Blog CMS",
    eyebrow: "Editorial desk",
    description: "Rich text, authors, taxonomy, drafts, scheduled publishing, SEO and Open Graph.",
    shortcut: "5"
  },
  {
    id: "careers",
    label: "Careers Platform",
    eyebrow: "Talent pipeline",
    description: "Job postings, applications, resumes, interviews, internships and hiring analytics.",
    shortcut: "6"
  },
  {
    id: "founder",
    label: "Founder Office",
    eyebrow: "Chairman narrative",
    description: "Timeline, leadership stories, chairman profile, media assets and internal notes.",
    shortcut: "7"
  },
  {
    id: "consultations",
    label: "Consultation Management",
    eyebrow: "Lead command",
    description: "Book-consultation requests, lead tracking, meeting scheduling and lead scoring.",
    shortcut: "8"
  },
  {
    id: "contact",
    label: "Contact Center",
    eyebrow: "Enterprise inbox",
    description: "Contact forms, inquiries, support tickets, assignments and response tracking.",
    shortcut: "9"
  },
  {
    id: "media",
    label: "Media Library",
    eyebrow: "Asset control",
    description: "Images, videos, documents, folders, search and asset usage tracking.",
    shortcut: "M"
  },
  {
    id: "analytics",
    label: "Analytics Center",
    eyebrow: "Telemetry",
    description: "PostHog, Sentry, Vercel Analytics, Better Stack and Lighthouse reporting.",
    shortcut: "A"
  },
  {
    id: "search",
    label: "Enterprise Search",
    eyebrow: "Global index",
    description: "Search projects, services, careers, blogs, documents and users.",
    shortcut: "K"
  },
  {
    id: "rbac",
    label: "Role Based Access",
    eyebrow: "Security model",
    description: "Granular page-level and feature-level permissions for every enterprise role.",
    shortcut: "R"
  },
  {
    id: "notifications",
    label: "Notification Center",
    eyebrow: "Real-time queue",
    description: "Lead, career, content approval and system notifications.",
    shortcut: "N"
  },
  {
    id: "audit",
    label: "Audit System",
    eyebrow: "Governance log",
    description: "Create, update, delete, login history and user activity trails.",
    shortcut: "G"
  }
];

const serviceRoutes: Record<string, string> = {
  "Architecture Design": "/architecture-design",
  "Interior Design": "/interior-design",
  "Landscape Planning": "/landscape-planning",
  Visualization: "/3d-visualization",
  "Turnkey Projects": "/turnkey-projects",
  "Structural Work": "/structural-work",
  "Project Management": "/project-management",
  "Logistics Coordination": "/ractysh-import-export",
  "OTC Operations": "/otc-exchange"
};

const requiredServices = [
  "Architecture Design",
  "Interior Design",
  "Landscape Planning",
  "Visualization",
  "Turnkey Projects",
  "Structural Work",
  "Project Management",
  "Logistics Coordination",
  "OTC Operations"
];

function pct(value: number): string {
  return `${value.toFixed(1)}%`;
}

function contentFreshness(updatedAt: string): string {
  const days = Math.max(1, Math.round((Date.now() - new Date(updatedAt).getTime()) / 86_400_000));
  return `${days}d`;
}

function buildDivisions(content: SiteContent): DivisionWorkspace[] {
  return content.divisions.map((division, index) => ({
    id: division.id,
    name: division.name,
    legalName: division.legalName,
    summary: division.summary,
    metric: division.metric,
    sections: ["Overview", "Projects", "Team", "Documents", "Media", "Analytics"],
    projects: Math.max(1, content.projects.filter((project) => project.category.toLowerCase().includes(division.name.toLowerCase().split(" ")[0])).length),
    team: index === 0 ? 8 : index === 1 ? 11 : index === 2 ? 6 : index === 3 ? 7 : 4,
    documents: 12 + index * 3,
    media: 24 + index * 5,
    score: 91 - index * 3
  }));
}

function buildServices(content: SiteContent): ServiceWorkspace[] {
  const existing = content.services.map((service, index) => ({
    id: service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    title: service.title,
    company: service.company,
    route: service.href || serviceRoutes[service.title] || "/services",
    category: service.tags[0] || "Service",
    status: "Published" as const,
    requests: 12 + index * 5,
    conversion: pct(3.8 + index * 0.24),
    tags: service.tags
  }));

  const existingTitles = new Set(existing.map((service) => service.title));
  const missing = requiredServices
    .filter((title) => !existingTitles.has(title))
    .map((title, index) => ({
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title,
      company: title.includes("OTC") ? "Ractysh OTC Exchange" : title.includes("Logistics") ? "Ractysh Import & Export" : "Ractysh Group",
      route: serviceRoutes[title] || "/services",
      category: "Mega Menu",
      status: "Review" as const,
      requests: 7 + index * 2,
      conversion: pct(2.4 + index * 0.18),
      tags: ["Public Page", "SEO", "Conversion"]
    }));

  return [...existing, ...missing];
}

function buildProjects(content: SiteContent): ProjectRow[] {
  return content.projects.map((project, index) => ({
    id: project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    title: project.title,
    division: project.category.includes("Export") ? "Export & Import" : project.category.includes("OTC") ? "OTC Exchange" : project.category,
    category: project.category,
    location: project.location,
    year: project.year,
    status: index === 1 ? "Featured" : index < 3 ? "Published" : "Active",
    views: 1800 + index * 428,
    leads: 17 + index * 6
  }));
}

function buildBlogs(content: SiteContent): BlogRow[] {
  const source = content.blogs.length
    ? content.blogs
    : [
        {
          title: "Building A Unified Enterprise Ecosystem",
          category: "Leadership",
          excerpt: "Operating notes from the Ractysh desk.",
          date: "2026-06-01"
        }
      ];

  return source.map((post, index) => ({
    id: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    title: post.title,
    category: post.category,
    author: index % 2 === 0 ? "Chairman Office" : "Editorial Desk",
    status: index === 0 ? "Published" : index === 1 ? "Scheduled" : "Draft",
    publishAt: post.date || "2026-06-15",
    seoScore: 88 - index * 4
  }));
}

function buildSearch(content: SiteContent): SearchRecord[] {
  const projects = content.projects.map((project) => ({
    id: `project-${project.title}`,
    resource: "Project" as const,
    title: project.title,
    summary: project.summary,
    href: "/our-projects",
    owner: project.category
  }));
  const services = buildServices(content).map((service) => ({
    id: `service-${service.id}`,
    resource: "Service" as const,
    title: service.title,
    summary: `${service.company} / ${service.category}`,
    href: service.route,
    owner: service.company
  }));
  const careers = content.careers.jobs.map((job) => ({
    id: `career-${job.title}`,
    resource: "Career" as const,
    title: job.title,
    summary: job.summary,
    href: "/careers",
    owner: "Recruitment"
  }));
  const blogs = content.blogs.map((post) => ({
    id: `blog-${post.title}`,
    resource: "Blog" as const,
    title: post.title,
    summary: post.excerpt,
    href: "/blog",
    owner: post.category
  }));
  const documents = content.legal.documents.map((doc) => ({
    id: `document-${doc.slug}`,
    resource: "Document" as const,
    title: doc.title,
    summary: doc.summary,
    href: `/${doc.slug}`,
    owner: "Legal"
  }));
  const users = ["Super Admin", "Chairman", "Director", "Manager", "Editor", "Recruiter", "Analyst"].map((role) => ({
    id: `user-${role}`,
    resource: "User" as const,
    title: role,
    summary: "Role workspace and permission profile",
    href: "/admin",
    owner: "RBAC"
  }));

  return [...projects, ...services, ...careers, ...blogs, ...documents, ...users];
}

function buildPermissions(): PermissionRow[] {
  return [
    {
      role: "super_admin",
      label: "Super Admin",
      resources: ["All modules", "Integrations", "Audit", "RBAC"],
      permissions: ["read", "create", "update", "delete", "publish", "approve", "assign", "export", "manage"]
    },
    {
      role: "chairman",
      label: "Chairman",
      resources: ["Executive", "Founder Office", "Analytics", "Audit"],
      permissions: ["read", "approve", "export"]
    },
    {
      role: "director",
      label: "Director",
      resources: ["Ecosystem", "Projects", "Consultations", "Analytics"],
      permissions: ["read", "create", "update", "approve", "assign", "export"]
    },
    {
      role: "manager",
      label: "Manager",
      resources: ["Services", "Projects", "Contact Center", "Media"],
      permissions: ["read", "create", "update", "assign"]
    },
    {
      role: "editor",
      label: "Editor",
      resources: ["Blog", "Portfolio", "Media", "SEO"],
      permissions: ["read", "create", "update", "publish"]
    },
    {
      role: "recruiter",
      label: "Recruiter",
      resources: ["Careers", "Applications", "Interviews"],
      permissions: ["read", "create", "update", "assign", "export"]
    },
    {
      role: "analyst",
      label: "Analyst",
      resources: ["Analytics", "Audit", "Search"],
      permissions: ["read", "export"]
    }
  ];
}

function buildAnalytics(): AnalyticsProviderStatus[] {
  return [
    { provider: "PostHog", status: process.env.NEXT_PUBLIC_POSTHOG_KEY ? "Connected" : "Needs key", metric: "Conversions", value: "4.8%" },
    { provider: "Sentry", status: process.env.NEXT_PUBLIC_SENTRY_DSN ? "Connected" : "Needs key", metric: "Open errors", value: "0" },
    { provider: "Vercel Analytics", status: "Configured", metric: "Core Web Vitals", value: "92" },
    { provider: "Better Stack", status: process.env.BETTER_STACK_API_KEY ? "Connected" : "Needs key", metric: "Uptime", value: "99.96%" },
    { provider: "Lighthouse", status: "Manual import", metric: "Performance", value: "94" }
  ];
}

export function getAdminSnapshot(content: SiteContent = fallbackContent): AdminSnapshot {
  const divisions = buildDivisions(content);
  const services = buildServices(content);
  const projects = buildProjects(content);
  const blogs = buildBlogs(content);
  const generatedAt = new Date().toISOString();

  const metrics: MetricCard[] = [
    {
      id: "global-revenue-signal",
      label: "Ecosystem Signal",
      value: `${content.stats.find((stat) => stat.label.toLowerCase().includes("vertical"))?.value || divisions.length}`,
      detail: "Active business verticals connected to public website routes.",
      trend: "+12.4%",
      source: "Website CMS"
    },
    {
      id: "lead-volume",
      label: "Lead Desk",
      value: "128",
      detail: "Consultations, contact forms and service requests in current operating window.",
      trend: "+8.7%",
      source: "Forms"
    },
    {
      id: "project-health",
      label: "Project Health",
      value: "91%",
      detail: "Composite score across portfolio status, featured case studies and conversion paths.",
      trend: "+3.1%",
      source: "Portfolio"
    },
    {
      id: "website-freshness",
      label: "Content Freshness",
      value: contentFreshness(content.updatedAt),
      detail: "Time since the public website content layer was updated.",
      trend: "Stable",
      source: "CMS"
    }
  ];

  const activity: ActivityItem[] = [
    { id: "act-1", actor: "Editor", action: "published", target: "Luxury Villa Design System", time: "12 minutes ago", module: "portfolio" },
    { id: "act-2", actor: "Recruiter", action: "moved candidate", target: "Senior Architect pipeline", time: "31 minutes ago", module: "careers" },
    { id: "act-3", actor: "Director", action: "assigned", target: "Export logistics consultation", time: "58 minutes ago", module: "consultations" },
    { id: "act-4", actor: "System", action: "captured", target: "Core Web Vitals report", time: "2 hours ago", module: "analytics" },
    { id: "act-5", actor: "Chairman Office", action: "reviewed", target: "Founder timeline note", time: "3 hours ago", module: "founder" }
  ];

  const careers: CareerApplicationRow[] = [
    { id: "ca-001", candidate: "Aarav Menon", role: "Senior Architect", source: "Careers page", stage: "Technical interview", score: 91, updatedAt: "Today" },
    { id: "ca-002", candidate: "Isha Rao", role: "Project Manager", source: "Referral", stage: "Screening", score: 84, updatedAt: "Yesterday" },
    { id: "ca-003", candidate: "Nikhil Shah", role: "Trade Operations Analyst", source: "LinkedIn", stage: "Portfolio review", score: 78, updatedAt: "May 30" },
    { id: "ca-004", candidate: "Sara Thomas", role: "Design Intern", source: "Internship form", stage: "New", score: 72, updatedAt: "May 29" }
  ];

  const consultations: ConsultationRow[] = [
    { id: "lead-001", company: "Private Developer", lead: "Executive Villa Program", service: "Architecture Design", status: "Qualified", score: 94, meeting: "Jun 3, 2026" },
    { id: "lead-002", company: "Trade Consortium", lead: "Cross-border shipment", service: "Logistics Coordination", status: "Meeting scheduled", score: 87, meeting: "Jun 5, 2026" },
    { id: "lead-003", company: "Family Office", lead: "OTC counterparty workflow", service: "OTC Operations", status: "Review", score: 81, meeting: "TBD" }
  ];

  const contacts: ContactRow[] = [
    { id: "in-001", name: "Rohan Mehta", interest: "Turnkey Projects", status: "Assigned", owner: "Manager", response: "2h SLA" },
    { id: "in-002", name: "Priya Nair", interest: "Interior Design", status: "New", owner: "Unassigned", response: "4h SLA" },
    { id: "in-003", name: "Global Sourcing Desk", interest: "Import Export", status: "Responded", owner: "Director", response: "Closed" }
  ];

  const media: MediaAssetRow[] = [
    { id: "asset-001", title: "Founder portrait", kind: "Image", folder: "Founder Office", usage: "/founder", size: "1.8 MB", updatedAt: "Today" },
    { id: "asset-002", title: "Architecture hero", kind: "Image", folder: "Services", usage: "/architecture-design", size: "2.4 MB", updatedAt: "Yesterday" },
    { id: "asset-003", title: "Trademark certificate", kind: "Document", folder: "Legal", usage: "/trademark-certification", size: "410 KB", updatedAt: "May 28" },
    { id: "asset-004", title: "Portfolio gallery pack", kind: "Image Set", folder: "Projects", usage: "4 projects", size: "18.2 MB", updatedAt: "May 27" }
  ];

  const founderOffice: FounderOfficeItem[] = [
    { id: "fo-1", title: content.founder.name, type: "Chairman Profile", status: "Published", owner: "Chairman Office" },
    { id: "fo-2", title: "Enterprise formation timeline", type: "Timeline", status: "Review", owner: "Director" },
    { id: "fo-3", title: "Leadership operating principles", type: "Leadership Story", status: "Draft", owner: "Editor" },
    { id: "fo-4", title: "Private note: board narrative", type: "Internal Note", status: "Private", owner: "Chairman" }
  ];

  const notifications = [
    { id: "n-1", kind: "Lead" as const, title: "High score consultation", message: "Architecture Design lead crossed 90 score.", time: "5m", unread: true },
    { id: "n-2", kind: "Career" as const, title: "Interview due", message: "Senior Architect candidate has an interview tomorrow.", time: "24m", unread: true },
    { id: "n-3", kind: "Content" as const, title: "Blog awaiting approval", message: "Open Graph metadata needs chairman office review.", time: "1h", unread: false },
    { id: "n-4", kind: "System" as const, title: "Lighthouse report imported", message: "Performance report is available in Analytics Center.", time: "3h", unread: false }
  ];

  const audit: AuditRow[] = [
    { id: "au-001", actor: "admin@ractysh.com", action: "publish", entity: "Project", ip: "127.0.0.1", time: "12m ago" },
    { id: "au-002", actor: "chairman@ractysh.com", action: "approve", entity: "Founder Story", ip: "127.0.0.1", time: "2h ago" },
    { id: "au-003", actor: "recruiter@ractysh.com", action: "update", entity: "Career Application", ip: "127.0.0.1", time: "4h ago" },
    { id: "au-004", actor: "system", action: "create", entity: "Analytics Report", ip: "internal", time: "6h ago" }
  ];

  return {
    generatedAt,
    metrics,
    activity,
    divisions,
    services,
    projects,
    blogs,
    careers,
    consultations,
    contacts,
    media,
    analytics: buildAnalytics(),
    search: buildSearch(content),
    permissions: buildPermissions(),
    notifications,
    audit,
    founderOffice
  };
}

export function filterAdminSearch(records: SearchRecord[], query: string): SearchRecord[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return records.slice(0, 12);

  return records
    .filter((record) =>
      [record.title, record.summary, record.resource, record.owner].some((value) => value.toLowerCase().includes(normalized))
    )
    .slice(0, 20);
}
