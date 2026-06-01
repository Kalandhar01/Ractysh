"use client";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Database,
  Eye,
  EyeOff,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MonitorPlay,
  Phone,
  Save,
  SearchCheck,
  ShieldCheck,
  Upload,
  UserRound
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  API_URL,
  getConsultations,
  getSiteContent,
  loginAdmin,
  saveSiteContent,
  updateConsultationStatus,
  updateConsultationWorkflowStage,
  uploadConsultationResponseDocuments
} from "@/lib/api";
import type {
  ConsultationRequest,
  ConsultationStatus,
  EditableCollection,
  SectionConfig,
  SiteContent,
  WorkflowAdminAction,
  WorkflowStageKey,
  WorkflowStageStatus
} from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type Tab = "overview" | "content" | "collections" | "sections" | "media" | "consultations";

const collections: Array<{ key: EditableCollection; label: string }> = [
  { key: "divisions", label: "Companies" },
  { key: "services", label: "Services" },
  { key: "projects", label: "Projects" },
  { key: "stats", label: "Statistics" },
  { key: "testimonials", label: "Testimonials" },
  { key: "blogs", label: "Blogs" },
  { key: "directors", label: "Directors" },
  { key: "businessDivisions", label: "Business Divisions" },
  { key: "locations", label: "Locations" },
  { key: "certifications", label: "Certifications" },
  { key: "milestones", label: "Milestones" },
  { key: "partners", label: "Partners" },
  { key: "pages", label: "Dynamic Pages" }
];

const workflowStatusOptions: WorkflowStageStatus[] = ["locked", "active", "waiting", "completed", "rejected"];

const workflowStageIcons: Record<WorkflowStageKey, typeof CalendarCheck> = {
  consultation_submitted: CalendarCheck,
  internal_review: SearchCheck,
  approval_verification: ShieldCheck,
  strategy_discussion: MessageSquareText,
  execution_planning: BriefcaseBusiness,
  project_kickoff: CheckCircle2
};

function workflowStageClass(status: WorkflowStageStatus): string {
  if (status === "completed") return "border-[#2f8f5b]/55 bg-[#123e2e]/70 text-[#d8f7e5]";
  if (status === "active" || status === "waiting") return "border-[#d4af37]/62 bg-[#3c2d11]/70 text-[#fff1bd]";
  if (status === "rejected") return "border-[#f0786c]/58 bg-[#4a1717]/70 text-[#ffe0dc]";
  return "border-white/10 bg-black/24 text-white/34 blur-[1px]";
}

function WorkflowStatusIcon({ status }: { status: WorkflowStageStatus }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-[#62df99]" strokeWidth={1.8} />;
  if (status === "active" || status === "waiting") return <Clock3 className="h-4 w-4 text-[#d4af37]" strokeWidth={1.8} />;
  if (status === "rejected") return <CircleAlert className="h-4 w-4 text-[#f0786c]" strokeWidth={1.8} />;
  return <EyeOff className="h-4 w-4 text-white/32" strokeWidth={1.8} />;
}

function Field({
  label,
  value,
  onChange,
  multiline = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const className =
    "mt-2 w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30";

  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className={className} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className={className} />
      )}
    </label>
  );
}

function JsonEditor<T>({
  label,
  value,
  onChange
}: {
  label: string;
  value: T;
  onChange: (next: T) => void;
}) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState("");

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]);

  function commit() {
    try {
      onChange(JSON.parse(text) as T);
      setError("");
    } catch {
      setError("Invalid JSON. Fix formatting before saving.");
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-white">{label}</p>
        <button
          onClick={commit}
          className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/62 transition hover:bg-white/10 hover:text-white"
        >
          Apply JSON
        </button>
      </div>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={commit}
        rows={12}
        className="w-full rounded-md border border-white/10 bg-black/50 p-3 font-mono text-xs leading-5 text-white/78 outline-none focus:border-white/30"
      />
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

function moveSection(sections: SectionConfig[], from: number, to: number): SectionConfig[] {
  const next = [...sections].sort((a, b) => a.order - b.order);
  const [item] = next.splice(from, 1);
  if (!item) return sections;
  next.splice(to, 0, item);
  return next.map((section, index) => ({ ...section, order: index + 1 }));
}

function AdminMetricCard({
  label,
  value,
  detail,
  Icon
}: {
  label: string;
  value: string;
  detail: string;
  Icon: typeof Activity;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_54px_rgba(0,0,0,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/36">{label}</p>
          <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.06em] text-white">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4af37]/12 text-[#d4af37]">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/44">{detail}</p>
    </div>
  );
}

export function AdminDashboard() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("admin@ractysh.com");
  const [password, setPassword] = useState("change-me-now");
  const [tab, setTab] = useState<Tab>("overview");
  const [status, setStatus] = useState("Loading CMS content...");
  const [consultationStatus, setConsultationStatus] = useState("");
  const [workflowNotes, setWorkflowNotes] = useState<Record<string, string>>({});
  const [workflowBusy, setWorkflowBusy] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const dirtyRef = useRef(false);
  const didLoadRef = useRef(false);

  const orderedSections = useMemo(
    () => [...(content?.sections || [])].sort((a, b) => a.order - b.order),
    [content?.sections]
  );

  const visibleSectionCount = useMemo(
    () => orderedSections.filter((section) => section.visible).length,
    [orderedSections]
  );

  useEffect(() => {
    const storedToken = window.localStorage.getItem("ractysh-admin-token") || "";
    setToken(storedToken);

    getSiteContent()
      .then((site) => {
        setContent(site);
        setStatus(storedToken ? "Connected. Changes auto-save after edits." : "Login to publish changes.");
        setTimeout(() => {
          didLoadRef.current = true;
        }, 0);
      })
      .catch(() => setStatus("Unable to load CMS content."));
  }, []);

  useEffect(() => {
    if (!content || !token || !dirtyRef.current || !didLoadRef.current) return;

    const timer = window.setTimeout(async () => {
      try {
        setStatus("Saving...");
        const saved = await saveSiteContent(content, token);
        setContent(saved);
        dirtyRef.current = false;
        setStatus("Saved. Live website will reflect the update.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Save failed.");
      }
    }, 850);

    return () => window.clearTimeout(timer);
  }, [content, token]);

  useEffect(() => {
    if (!token) {
      setConsultations([]);
      return;
    }

    let cancelled = false;
    const loadConsultations = async (quiet = false) => {
      if (!quiet) setConsultationStatus("Loading demo requests...");

      try {
        const items = await getConsultations(token);
        if (cancelled) return;
        setConsultations(items);
        setConsultationStatus(items.length ? "Demo desk is synced." : "No demo requests yet.");
      } catch (error) {
        if (!cancelled) {
          setConsultationStatus(error instanceof Error ? error.message : "Unable to load demo requests.");
        }
      }
    };

    loadConsultations();
    const timer = window.setInterval(() => loadConsultations(true), 8000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [token]);

  function updateContent(updater: (current: SiteContent) => SiteContent) {
    setContent((current) => {
      if (!current) return current;
      dirtyRef.current = true;
      return updater(current);
    });
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Authenticating...");
    try {
      const result = await loginAdmin(email, password);
      window.localStorage.setItem("ractysh-admin-token", result.token);
      setToken(result.token);
      setStatus("Authenticated. CMS is ready.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed.");
    }
  }

  async function manualSave() {
    if (!content || !token) return;
    setStatus("Saving...");
    const saved = await saveSiteContent(content, token);
    setContent(saved);
    dirtyRef.current = false;
    setStatus("Saved manually.");
  }

  async function handleUpload(file: File | undefined) {
    if (!file || !token) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploadStatus("Uploading...");

    const response = await fetch(`${API_URL}/api/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const payload = await response.json().catch(() => null);
    setUploadStatus(response.ok ? `Uploaded: ${payload?.secure_url || file.name}` : payload?.message || "Upload failed.");
  }

  async function handleConsultationStatus(id: string, nextStatus: ConsultationStatus) {
    if (!token) return;
    setConsultationStatus("Updating demo request...");
    try {
      const updated = await updateConsultationStatus(id, nextStatus, token);
      setConsultations((items) => items.map((item) => (item._id === id ? updated : item)));
      setConsultationStatus("Demo request updated.");
    } catch (error) {
      setConsultationStatus(error instanceof Error ? error.message : "Unable to update demo request.");
    }
  }

  async function handleWorkflowAction(
    requestId: string,
    stageKey: WorkflowStageKey,
    action: WorkflowAdminAction,
    statusOverride?: WorkflowStageStatus
  ) {
    if (!token) return;

    const noteKey = `${requestId}-${stageKey}`;
    const notes = workflowNotes[noteKey]?.trim();

    if (action === "add_note" && !notes) {
      setConsultationStatus("Add a note before saving it to the workflow.");
      return;
    }

    setWorkflowBusy(`${requestId}-${stageKey}-${action}`);
    setConsultationStatus("Updating workflow stage...");

    try {
      const updated = await updateConsultationWorkflowStage(
        requestId,
        stageKey,
        {
          action,
          status: statusOverride,
          notes: notes || undefined
        },
        token
      );
      setConsultations((items) => items.map((item) => (item._id === requestId ? updated : item)));
      if (notes) setWorkflowNotes((current) => ({ ...current, [noteKey]: "" }));
      setConsultationStatus("Workflow stage updated.");
    } catch (error) {
      setConsultationStatus(error instanceof Error ? error.message : "Unable to update workflow stage.");
    } finally {
      setWorkflowBusy("");
    }
  }

  async function handleResponseDocumentUpload(requestId: string, stageKey: WorkflowStageKey, files: FileList | null) {
    if (!token || !files?.length) return;

    setWorkflowBusy(`${requestId}-${stageKey}-upload_response`);
    setConsultationStatus("Uploading response documents...");

    try {
      const updated = await uploadConsultationResponseDocuments(requestId, stageKey, files, token);
      setConsultations((items) => items.map((item) => (item._id === requestId ? updated : item)));
      setConsultationStatus("Response documents uploaded.");
    } catch (error) {
      setConsultationStatus(error instanceof Error ? error.message : "Unable to upload response documents.");
    } finally {
      setWorkflowBusy("");
    }
  }

  function logout() {
    window.localStorage.removeItem("ractysh-admin-token");
    setToken("");
    setStatus("Logged out.");
  }

  if (!content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-950 px-5 text-white">
        <p className="text-sm uppercase tracking-[0.22em] text-white/45">{status}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink-950 px-5 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/40">Ractysh CMS</p>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-[-0.06em]">Enterprise content control</h1>
            <p className="mt-2 text-sm text-white/48">{status}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={manualSave}
              disabled={!token}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-35"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            {token ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm text-white/68"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : null}
          </div>
        </div>

        {!token ? (
          <form onSubmit={handleLogin} className="mb-6 grid gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <Field label="Admin email" value={email} onChange={setEmail} />
            <Field label="Password" value={password} onChange={setPassword} />
            <button className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black">Login</button>
          </form>
        ) : null}

        <div className="mb-6 flex gap-2 overflow-auto">
          {(["overview", "content", "collections", "sections", "media", "consultations"] as Tab[]).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium capitalize transition",
                tab === item ? "bg-white text-black" : "border border-white/10 bg-white/[0.035] text-white/58"
              )}
            >
              {item === "consultations" ? "Demos" : item}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <section className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <AdminMetricCard
                label="Published sections"
                value={`${visibleSectionCount}/${orderedSections.length}`}
                detail="Homepage visibility controlled from section ordering."
                Icon={LayoutDashboard}
              />
              <AdminMetricCard
                label="Service inventory"
                value={`${content.services.length}`}
                detail="Editable service cards across Ractysh ecosystem companies."
                Icon={Database}
              />
              <AdminMetricCard
                label="Project signals"
                value={`${content.projects.length}`}
                detail="Case-study and credibility inputs for premium conversion."
                Icon={BarChart3}
              />
              <AdminMetricCard
                label="SEO readiness"
                value={content.seo.title && content.seo.description ? "Ready" : "Draft"}
                detail="Search metadata is centralized for publishing review."
                Icon={SearchCheck}
              />
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.72fr_1fr]">
              <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d4af37]">Publishing cockpit</p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.055em]">Ractysh ecosystem control</h2>
                  </div>
                  <Activity className="h-7 w-7 text-[#d4af37]" strokeWidth={1.7} />
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    { label: "Hero narrative", value: content.hero.headline ? "Configured" : "Missing" },
                    { label: "Navigation model", value: content.nav.items.length ? "Mapped" : "Review" },
                    { label: "Services catalog", value: `${content.services.length} entries` },
                    { label: "Testimonials", value: `${content.testimonials.length} proof points` },
                    { label: "Last update", value: new Date(content.updatedAt).toLocaleString() }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/24 px-4 py-3">
                      <span className="text-sm text-white/58">{item.label}</span>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.045]">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/36">Live preview</p>
                    <p className="mt-1 text-sm text-white/58">A fast read of the public homepage inside the CMS.</p>
                  </div>
                  <MonitorPlay className="h-5 w-5 text-[#d4af37]" />
                </div>
                <div className="h-[27rem] bg-[#f5f4f1]">
                  <iframe title="Ractysh homepage preview" src="/" className="h-full w-full scale-[0.72] origin-top-left border-0 xl:w-[138.8%]" />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {tab === "content" ? (
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <h2 className="mb-5 font-display text-2xl tracking-[-0.04em]">Hero</h2>
              <div className="grid gap-4">
                <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, eyebrow: value } }))} />
                <Field label="Headline" value={content.hero.headline} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, headline: value } }))} multiline />
                <Field label="Subheadline" value={content.hero.subheadline} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, subheadline: value } }))} multiline />
                <Field label="Primary CTA" value={content.hero.primaryCta} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, primaryCta: value } }))} />
                <Field label="Secondary CTA" value={content.hero.secondaryCta} onChange={(value) => updateContent((current) => ({ ...current, hero: { ...current.hero, secondaryCta: value } }))} />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <h2 className="mb-5 font-display text-2xl tracking-[-0.04em]">SEO, theme and navigation</h2>
              <div className="grid gap-4">
                <Field label="SEO title" value={content.seo.title} onChange={(value) => updateContent((current) => ({ ...current, seo: { ...current.seo, title: value } }))} />
                <Field label="SEO description" value={content.seo.description} onChange={(value) => updateContent((current) => ({ ...current, seo: { ...current.seo, description: value } }))} multiline />
                <Field label="Logo text" value={content.nav.logoText} onChange={(value) => updateContent((current) => ({ ...current, nav: { ...current.nav, logoText: value } }))} />
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">Accent color</span>
                  <input
                    type="color"
                    value={content.theme.accent}
                    onChange={(event) => updateContent((current) => ({ ...current, theme: { ...current.theme, accent: event.target.value } }))}
                    className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black/40"
                  />
                </label>
                <JsonEditor label="Navbar and footer links" value={{ nav: content.nav.items, footer: content.footer.links }} onChange={(value) => updateContent((current) => ({ ...current, nav: { ...current.nav, items: value.nav }, footer: { ...current.footer, links: value.footer } }))} />
              </div>
            </div>
            <JsonEditor
              label="Founder / Chairman CMS"
              value={content.founder}
              onChange={(value) => updateContent((current) => ({ ...current, founder: value }))}
            />
            <JsonEditor
              label="Popup Manager"
              value={content.popup}
              onChange={(value) => updateContent((current) => ({ ...current, popup: value }))}
            />
            <JsonEditor
              label="Legal Pages and Trademark Certificate"
              value={content.legal}
              onChange={(value) => updateContent((current) => ({ ...current, legal: value }))}
            />
            <JsonEditor
              label="Google Ratings and Feedback"
              value={{ googleRatings: content.googleRatings, feedback: content.feedback }}
              onChange={(value) =>
                updateContent((current) => ({
                  ...current,
                  googleRatings: value.googleRatings,
                  feedback: value.feedback
                }))
              }
            />
            <JsonEditor
              label="Careers CMS"
              value={content.careers}
              onChange={(value) => updateContent((current) => ({ ...current, careers: value }))}
            />
          </section>
        ) : null}

        {tab === "collections" ? (
          <section className="grid gap-4 lg:grid-cols-2">
            {collections.map((collection) => (
              <JsonEditor
                key={collection.key}
                label={collection.label}
                value={content[collection.key]}
                onChange={(value) =>
                  updateContent((current) => ({
                    ...current,
                    [collection.key]: value
                  }))
                }
              />
            ))}
          </section>
        ) : null}

        {tab === "sections" ? (
          <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <h2 className="font-display text-2xl tracking-[-0.04em]">Section ordering and visibility</h2>
            <p className="mt-2 text-sm text-white/48">Drag rows or use the arrows. Changes auto-save after login.</p>
            <div className="mt-6 space-y-3">
              {orderedSections.map((section, index) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (dragIndex === null) return;
                    updateContent((current) => ({
                      ...current,
                      sections: moveSection(current.sections, dragIndex, index)
                    }));
                    setDragIndex(null);
                  }}
                  className="flex cursor-grab items-center justify-between gap-4 rounded-md border border-white/10 bg-black/35 p-4 active:cursor-grabbing"
                >
                  <div>
                    <p className="font-medium">{section.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/34">{section.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateContent((current) => ({
                          ...current,
                          sections: current.sections.map((item) =>
                            item.id === section.id ? { ...item, visible: !item.visible } : item
                          )
                        }))
                      }
                      className="rounded-md border border-white/10 p-2 text-white/56 hover:text-white"
                    >
                      {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      disabled={index === 0}
                      onClick={() =>
                        updateContent((current) => ({
                          ...current,
                          sections: moveSection(current.sections, index, Math.max(0, index - 1))
                        }))
                      }
                      className="rounded-md border border-white/10 p-2 text-white/56 disabled:opacity-25"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      disabled={index === orderedSections.length - 1}
                      onClick={() =>
                        updateContent((current) => ({
                          ...current,
                          sections: moveSection(current.sections, index, Math.min(orderedSections.length - 1, index + 1))
                        }))
                      }
                      className="rounded-md border border-white/10 p-2 text-white/56 disabled:opacity-25"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {tab === "consultations" ? (
          <section className="grid gap-5">
            <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.045] p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[#d4af37]">Demo desk</p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  Enterprise demo requests
                </h2>
                <p className="mt-2 text-sm text-white/48">
                  {token ? consultationStatus || "Requests from the premium booking page." : "Login to view demo requests."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-right md:min-w-64">
                <div className="rounded-lg border border-white/10 bg-black/24 p-3">
                  <p className="text-xs uppercase text-white/34">New</p>
                  <p className="mt-1 text-2xl font-semibold">{consultations.filter((item) => item.status === "new").length}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/24 p-3">
                  <p className="text-xs uppercase text-white/34">Total</p>
                  <p className="mt-1 text-2xl font-semibold">{consultations.length}</p>
                </div>
              </div>
            </div>

            {consultations.length ? (
              <div className="grid gap-4">
                {consultations.map((request) => (
                  <article key={request._id} className="rounded-xl border border-white/10 bg-white/[0.045] p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-md bg-[#d4af37]/12 px-2.5 py-1 text-xs font-semibold uppercase text-[#d4af37]">
                            {request.status}
                          </span>
                          <span className="text-xs text-white/38">
                            {formatDate(String(request.createdAt))} at{" "}
                            {new Date(request.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                          {request.companyName}
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">{request.projectDescription}</p>
                      </div>

                      <select
                        value={request.status}
                        onChange={(event) =>
                          handleConsultationStatus(request._id, event.target.value as ConsultationStatus)
                        }
                        className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#d4af37]/60"
                      >
                        {(["new", "reviewed", "contacted", "archived"] as ConsultationStatus[]).map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {[
                        { label: request.fullName, detail: request.emailAddress, Icon: UserRound },
                        { label: request.phoneNumber, detail: request.preferredConsultationType, Icon: Phone },
                        { label: request.serviceType, detail: request.budgetRange, Icon: BriefcaseBusiness },
                        { label: request.projectTimeline, detail: request.notification.sent ? "Email sent" : "Email pending", Icon: CalendarCheck }
                      ].map((item) => {
                        const Icon = item.Icon;

                        return (
                          <div key={`${item.label}-${item.detail}`} className="rounded-lg border border-white/10 bg-black/24 p-4">
                            <Icon className="h-4 w-4 text-[#d4af37]" strokeWidth={1.8} />
                            <p className="mt-3 text-sm font-semibold text-white">{item.label}</p>
                            <p className="mt-1 text-xs text-white/42">{item.detail}</p>
                          </div>
                        );
                      })}
                    </div>

                    {request.workflowStages?.length ? (
                      <div className="mt-4 rounded-lg border border-white/10 bg-black/24 p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase text-[#d4af37]">Operational workflow</p>
                            <p className="mt-1 text-sm text-white/46">
                              Active stage:{" "}
                              {request.workflowStages.find((stage) => stage.key === request.currentStageKey)?.title ||
                                "No active stage"}
                            </p>
                          </div>
                          <span className="rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-xs text-white/48">
                            {request.workflowStages.filter((stage) => stage.status === "completed").length}/
                            {request.workflowStages.length} completed
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 xl:grid-cols-3">
                          {request.workflowStages.map((stage) => {
                            const StageIcon = workflowStageIcons[stage.key];
                            const noteKey = `${request._id}-${stage.key}`;
                            const busy = workflowBusy.startsWith(`${request._id}-${stage.key}`);

                            return (
                              <div
                                key={stage.key}
                                className={cn(
                                  "rounded-lg border p-4 transition",
                                  workflowStageClass(stage.status),
                                  stage.status === "locked" ? "opacity-55" : "opacity-100"
                                )}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-black/18">
                                    <StageIcon className="h-4 w-4" strokeWidth={1.8} />
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/18 px-2 py-1 text-[0.65rem] font-semibold uppercase">
                                    <WorkflowStatusIcon status={stage.status} />
                                    {stage.stateLabel}
                                  </span>
                                </div>

                                <h4 className="mt-4 text-sm font-semibold leading-5 text-white">{stage.title}</h4>
                                <p className="mt-2 min-h-12 text-xs leading-5 text-white/46">{stage.description}</p>

                                <div className="mt-4 grid gap-2">
                                  <select
                                    value={stage.status}
                                    disabled={busy}
                                    onChange={(event) =>
                                      handleWorkflowAction(
                                        request._id,
                                        stage.key,
                                        "update_status",
                                        event.target.value as WorkflowStageStatus
                                      )
                                    }
                                    className="rounded-md border border-white/10 bg-black/45 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]/60 disabled:opacity-40"
                                  >
                                    {workflowStatusOptions.map((statusOption) => (
                                      <option key={statusOption} value={statusOption}>
                                        {statusOption}
                                      </option>
                                    ))}
                                  </select>

                                  <div className="grid grid-cols-3 gap-2">
                                    <button
                                      disabled={busy}
                                      onClick={() => handleWorkflowAction(request._id, stage.key, "approve")}
                                      className="rounded-md bg-[#2f8f5b] px-2 py-2 text-xs font-semibold text-white disabled:opacity-40"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      disabled={busy}
                                      onClick={() => handleWorkflowAction(request._id, stage.key, "reject")}
                                      className="rounded-md border border-[#f0786c]/40 px-2 py-2 text-xs font-semibold text-[#ffd7d2] disabled:opacity-40"
                                    >
                                      Reject
                                    </button>
                                    <button
                                      disabled={busy}
                                      onClick={() => handleWorkflowAction(request._id, stage.key, "move_next")}
                                      className="rounded-md border border-[#d4af37]/40 px-2 py-2 text-xs font-semibold text-[#ffe49a] disabled:opacity-40"
                                    >
                                      Next
                                    </button>
                                  </div>

                                  <textarea
                                    value={workflowNotes[noteKey] || ""}
                                    onChange={(event) =>
                                      setWorkflowNotes((current) => ({ ...current, [noteKey]: event.target.value }))
                                    }
                                    rows={2}
                                    placeholder="Admin note"
                                    className="resize-none rounded-md border border-white/10 bg-black/45 px-3 py-2 text-xs leading-5 text-white outline-none placeholder:text-white/24 focus:border-[#d4af37]/60"
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      disabled={busy}
                                      onClick={() => handleWorkflowAction(request._id, stage.key, "add_note")}
                                      className="rounded-md border border-white/10 px-2 py-2 text-xs font-semibold text-white/64 disabled:opacity-40"
                                    >
                                      Save Note
                                    </button>
                                    <label className="cursor-pointer rounded-md border border-white/10 px-2 py-2 text-center text-xs font-semibold text-white/64 transition hover:text-white">
                                      Upload
                                      <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(event) => {
                                          void handleResponseDocumentUpload(request._id, stage.key, event.currentTarget.files);
                                          event.currentTarget.value = "";
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>

                                {stage.adminNotes ? (
                                  <p className="mt-3 whitespace-pre-line rounded-md border border-white/10 bg-black/18 p-3 text-xs leading-5 text-white/46">
                                    {stage.adminNotes}
                                  </p>
                                ) : null}

                                {stage.responseDocuments.length ? (
                                  <div className="mt-3 grid gap-2">
                                    {stage.responseDocuments.map((document) =>
                                      document.url ? (
                                        <a
                                          key={document.id || document.filename}
                                          href={document.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="flex items-center gap-2 rounded-md border border-white/10 bg-black/18 px-3 py-2 text-xs text-white/58 transition hover:text-white"
                                        >
                                          <FileText className="h-3.5 w-3.5 text-[#d4af37]" />
                                          <span className="min-w-0 truncate">{document.filename}</span>
                                        </a>
                                      ) : (
                                        <span
                                          key={document.id || document.filename}
                                          className="flex items-center gap-2 rounded-md border border-white/10 bg-black/18 px-3 py-2 text-xs text-white/46"
                                        >
                                          <FileText className="h-3.5 w-3.5 text-[#d4af37]" />
                                          <span className="min-w-0 truncate">{document.filename}</span>
                                        </span>
                                      )
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {request.attachments.length ? (
                      <div className="mt-4 rounded-lg border border-white/10 bg-black/24 p-4">
                        <p className="mb-3 text-xs font-semibold uppercase text-white/38">
                          Uploaded files
                        </p>
                        <div className="grid gap-2 md:grid-cols-2">
                          {request.attachments.map((attachment) =>
                            attachment.url ? (
                              <a
                                key={`${request._id}-${attachment.filename}`}
                                href={attachment.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/62 transition hover:text-white"
                              >
                                <FileText className="h-4 w-4 text-[#d4af37]" />
                                {attachment.filename}
                              </a>
                            ) : (
                              <span
                                key={`${request._id}-${attachment.filename}`}
                                className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/52"
                              >
                                <FileText className="h-4 w-4 text-[#d4af37]" />
                                {attachment.filename}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/14 bg-white/[0.035] p-10 text-center">
                <CalendarCheck className="mx-auto h-8 w-8 text-[#d4af37]" strokeWidth={1.8} />
                <p className="mt-4 text-sm text-white/48">
                  {token ? "No demo requests have been submitted yet." : "Login to access the demo inbox."}
                </p>
              </div>
            )}
          </section>
        ) : null}

        {tab === "media" ? (
          <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <h2 className="font-display text-2xl tracking-[-0.04em]">Media manager</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/48">
              Uploads are routed to Cloudinary when API credentials are configured. Without credentials, the API reports that Cloudinary is not configured.
            </p>
            <label className="mt-6 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/18 bg-black/30 p-6 text-center transition hover:bg-white/[0.04]">
              <Upload className="mb-4 h-8 w-8 text-white/42" />
              <span className="text-sm font-medium">Upload image or video</span>
              <input type="file" className="hidden" onChange={(event) => handleUpload(event.target.files?.[0])} />
            </label>
            {uploadStatus ? <p className="mt-4 text-sm text-white/52">{uploadStatus}</p> : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}
