import { fallbackContent } from "@/data/fallbackContent";
import type {
  ConsultationRequest,
  ConsultationStatus,
  SiteContent,
  WorkflowAdminAction,
  WorkflowStageKey,
  WorkflowStageStatus
} from "@/lib/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

function clientAwareApiUrl(): string {
  return typeof window === "undefined" ? API_URL : "";
}

function mergeById<T extends { id: string }>(contentItems: T[] | undefined, fallbackItems: T[]): T[] {
  if (!contentItems?.length) return fallbackItems;

  const fallbackIds = new Set(fallbackItems.map((item) => item.id));
  const contentById = new Map(contentItems.map((item) => [item.id, item]));
  const mergedFallbackOrder = fallbackItems.map((item) => contentById.get(item.id) || item);
  const extraContentItems = contentItems.filter((item) => !fallbackIds.has(item.id));

  return [...mergedFallbackOrder, ...extraContentItems];
}

function normalizeSiteContent(payload: Partial<SiteContent> | null | undefined): SiteContent {
  const content = payload || {};
  const hasEnterpriseNav = Boolean(content.nav?.items?.some((item) => ["Careers", "Blog", "About Us"].includes(item.label)));
  const hasLegalFooter = Boolean(content.footer?.links?.some((item) => item.href.includes("privacy-policy")));

  return {
    ...fallbackContent,
    ...content,
    seo: {
      ...fallbackContent.seo,
      ...content.seo
    },
    theme: {
      ...fallbackContent.theme,
      ...content.theme
    },
    nav: hasEnterpriseNav
      ? {
          ...fallbackContent.nav,
          ...content.nav,
          items: content.nav?.items?.length ? content.nav.items : fallbackContent.nav.items
        }
      : fallbackContent.nav,
    hero: {
      ...fallbackContent.hero,
      ...content.hero
    },
    divisions: mergeById(content.divisions, fallbackContent.divisions),
    services: content.services?.length ? content.services : fallbackContent.services,
    projects: content.projects?.length ? content.projects : fallbackContent.projects,
    stats: content.stats?.length ? content.stats : fallbackContent.stats,
    testimonials: content.testimonials?.length ? content.testimonials : fallbackContent.testimonials,
    blogs: content.blogs?.length ? content.blogs : fallbackContent.blogs,
    founder: content.founder || fallbackContent.founder,
    directors: content.directors?.length ? content.directors : fallbackContent.directors,
    businessDivisions: mergeById(content.businessDivisions, fallbackContent.businessDivisions),
    locations: content.locations?.length ? content.locations : fallbackContent.locations,
    legal: {
      ...fallbackContent.legal,
      ...content.legal,
      documents: content.legal?.documents?.length ? content.legal.documents : fallbackContent.legal.documents
    },
    popup: {
      ...fallbackContent.popup,
      ...content.popup
    },
    googleRatings: {
      ...fallbackContent.googleRatings,
      ...content.googleRatings,
      reviews: content.googleRatings?.reviews?.length ? content.googleRatings.reviews : fallbackContent.googleRatings.reviews
    },
    feedback: {
      ...fallbackContent.feedback,
      ...content.feedback
    },
    careers: {
      ...fallbackContent.careers,
      ...content.careers,
      culture: content.careers?.culture?.length ? content.careers.culture : fallbackContent.careers.culture,
      jobs: content.careers?.jobs?.length ? content.careers.jobs : fallbackContent.careers.jobs,
      internships: content.careers?.internships?.length ? content.careers.internships : fallbackContent.careers.internships
    },
    pages: content.pages?.length ? content.pages : fallbackContent.pages,
    certifications: content.certifications?.length ? content.certifications : fallbackContent.certifications,
    milestones: content.milestones?.length ? content.milestones : fallbackContent.milestones,
    partners: content.partners?.length ? content.partners : fallbackContent.partners,
    sections: content.sections?.some((section) => section.id === "founder")
      ? content.sections
      : fallbackContent.sections,
    footer: hasLegalFooter
      ? {
          ...fallbackContent.footer,
          ...content.footer,
          links: content.footer?.links?.length ? content.footer.links : fallbackContent.footer.links,
          socialLinks: content.footer?.socialLinks?.length ? content.footer.socialLinks : fallbackContent.footer.socialLinks
        }
      : fallbackContent.footer,
    updatedAt: content.updatedAt || fallbackContent.updatedAt
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const response = await fetch(`${API_URL}/api/site`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (!response.ok) return fallbackContent;
    return normalizeSiteContent((await response.json()) as Partial<SiteContent>);
  } catch {
    return fallbackContent;
  }
}

export async function loginAdmin(email: string, password: string): Promise<{ token: string }> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return response.json() as Promise<{ token: string }>;
}

export async function saveSiteContent(content: SiteContent, token: string): Promise<SiteContent> {
  const response = await fetch(`${API_URL}/api/site`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(content)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unable to save content" }));
    throw new Error(error.message || "Unable to save content");
  }

  return response.json() as Promise<SiteContent>;
}

export async function getConsultations(token: string): Promise<ConsultationRequest[]> {
  const response = await fetch(`${API_URL}/api/consultations`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unable to load demo requests" }));
    throw new Error(error.message || "Unable to load demo requests");
  }

  return response.json() as Promise<ConsultationRequest[]>;
}

export async function getConsultationWorkflow(id: string, trackingToken: string): Promise<ConsultationRequest> {
  const apiUrl = clientAwareApiUrl();
  const response = await fetch(
    `${apiUrl}/api/consultations/${id}/workflow?trackingToken=${encodeURIComponent(trackingToken)}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unable to load demo workflow" }));
    throw new ApiRequestError(error.message || "Unable to load demo workflow", response.status);
  }

  return response.json() as Promise<ConsultationRequest>;
}

export async function updateConsultationStatus(
  id: string,
  status: ConsultationStatus,
  token: string
): Promise<ConsultationRequest> {
  const response = await fetch(`${API_URL}/api/consultations/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unable to update demo request" }));
    throw new Error(error.message || "Unable to update demo request");
  }

  return response.json() as Promise<ConsultationRequest>;
}

export async function updateConsultationWorkflowStage(
  id: string,
  stageKey: WorkflowStageKey,
  payload: {
    action: WorkflowAdminAction;
    status?: WorkflowStageStatus;
    stateLabel?: string;
    notes?: string;
  },
  token: string
): Promise<ConsultationRequest> {
  const response = await fetch(`${API_URL}/api/consultations/${id}/workflow/${stageKey}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unable to update workflow stage" }));
    throw new Error(error.message || "Unable to update workflow stage");
  }

  return response.json() as Promise<ConsultationRequest>;
}

export async function uploadConsultationResponseDocuments(
  id: string,
  stageKey: WorkflowStageKey,
  files: FileList,
  token: string
): Promise<ConsultationRequest> {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("responseDocuments", file));

  const response = await fetch(`${API_URL}/api/consultations/${id}/workflow/${stageKey}/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unable to upload response documents" }));
    throw new Error(error.message || "Unable to upload response documents");
  }

  return response.json() as Promise<ConsultationRequest>;
}
