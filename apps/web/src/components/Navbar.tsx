"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  ChevronRight,
  Clock3,
  DraftingCompass,
  Globe2,
  HardHat,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { servicePages } from "@/data/servicePages";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavbarProps {
  logoText: string;
  items: NavItem[];
}

interface MegaLink {
  label: string;
  description: string;
  href: string;
  Icon: LucideIcon;
}

interface MegaColumn {
  title: string;
  links: MegaLink[];
}

interface MegaDefinition {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  columns: MegaColumn[];
}

interface EnterpriseNavItem {
  label: string;
  href: string;
  menu?: MegaDefinition;
  variant?: "link" | "cta";
}

interface SearchItem {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
  keywords: string[];
}

const ease = [0.22, 1, 0.36, 1] as const;
const searchOverlayEase = [0.215, 0.61, 0.355, 1] as const;

const menuModels: Record<string, MegaDefinition> = {
  Ecosystem: {
    eyebrow: "Ractysh Group",
    title: "Five pillars. One premium operating ecosystem.",
    description: "Move between architecture, construction, real estate, export-import operations and OTC exchange through one enterprise brand.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    ctaLabel: "Explore ecosystem",
    ctaHref: "/business",
    columns: [
      {
        title: "Companies",
        links: [
          { label: "Architecture Division", description: "Spatial intelligence, planning and visualization.", href: "/architecture", Icon: DraftingCompass },
          { label: "Construction Division", description: "Site execution, MEP and turnkey delivery.", href: "/construction", Icon: HardHat },
          { label: "Real Estate Division", description: "Asset positioning and development advisory.", href: "/real-estate", Icon: Building2 },
          { label: "Export & Import Division", description: "Global trade and logistics operations.", href: "/import-export", Icon: Globe2 },
          { label: "OTC Exchange Division", description: "Private counterparty and deal-room coordination.", href: "/otc-exchange", Icon: ShieldCheck }
        ]
      }
    ]
  },
  "Our Work": {
    eyebrow: "Selected Work",
    title: "Selected work across five enterprise pillars.",
    description: "An editorial view of Ractysh work across architecture, construction, real estate, export-import, OTC exchange and enterprise environments.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    ctaLabel: "Explore our work",
    ctaHref: "/our-projects",
    columns: [
      {
        title: "Work Index",
        links: [
          { label: "Construction Work", description: "Commercial facilities and turnkey delivery.", href: "/our-projects", Icon: HardHat },
          { label: "Architecture Work", description: "Premium interiors and architectural concepts.", href: "/our-projects", Icon: DraftingCompass },
          { label: "Real Estate Work", description: "Asset positioning and investor-ready property workflows.", href: "/our-projects", Icon: Building2 },
          { label: "Export & Import Hubs", description: "Global logistics and enterprise operations.", href: "/our-projects", Icon: Globe2 },
          { label: "OTC Exchange Workflows", description: "Private counterparty and transaction-readiness systems.", href: "/our-projects", Icon: ShieldCheck }
        ]
      }
    ]
  },
  Services: {
    eyebrow: "Services",
    title: "Premium services across five enterprise pillars.",
    description: "Clear service pathways for clients who need architecture, construction, real estate, trade or private exchange coordination.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    ctaLabel: "Browse services",
    ctaHref: "/services",
    columns: [
      {
        title: "Design Studio",
        links: [
          { label: "Architecture Division", description: "Dedicated architecture landing experience.", href: "/architecture", Icon: DraftingCompass },
          { label: "Architecture Design", description: "Master planning and concept systems.", href: "/architecture-design", Icon: DraftingCompass },
          { label: "Interior Design", description: "Premium interior and material systems.", href: "/interior-design", Icon: Building2 },
          { label: "Landscape Planning", description: "Outdoor experience and site planning.", href: "/landscape-planning", Icon: Building2 },
          { label: "3D Visualization", description: "Decision-grade visual presentation.", href: "/3d-visualization", Icon: DraftingCompass }
        ]
      },
      {
        title: "Build Delivery",
        links: [
          { label: "Construction Division", description: "Dedicated construction operating layer.", href: "/construction", Icon: HardHat },
          { label: "Turnkey Projects", description: "Single accountability from brief to handover.", href: "/turnkey-projects", Icon: ShieldCheck },
          { label: "Structural Work", description: "Structural and PEB coordination.", href: "/structural-work", Icon: Building2 },
          { label: "Project Management", description: "Milestones, sourcing and reporting.", href: "/project-management", Icon: HardHat }
        ]
      },
      {
        title: "Enterprise",
        links: [
          { label: "Real Estate Division", description: "Asset positioning and investor readiness.", href: "/real-estate", Icon: Building2 },
          { label: "Export & Import", description: "Global trade and logistics coordination.", href: "/import-export", Icon: Globe2 },
          { label: "OTC Exchange Division", description: "Private transaction coordination desk.", href: "/otc-exchange", Icon: ShieldCheck },
          { label: "Book a Demo", description: "Structured business intake.", href: "/book-demo", Icon: ShieldCheck },
          { label: "Logistics Coordination", description: "Cargo route and documentation planning.", href: "/import-export", Icon: ArrowUpRight }
        ]
      }
    ]
  },
  "About Us": {
    eyebrow: "Company",
    title: "Leadership, location and enterprise identity.",
    description: "Learn about Ractysh Group, the founder, directors, trademark layer and Outlook business location.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    ctaLabel: "About Ractysh",
    ctaHref: "/about",
    columns: [
      {
        title: "Company",
        links: [
          { label: "About Us", description: "Group profile and business model.", href: "/about", Icon: Building2 },
          { label: "Founder Profile", description: "Chairman vision and timeline.", href: "/founder", Icon: ShieldCheck },
          { label: "Directors", description: "Executive leadership profiles.", href: "/directors", Icon: Building2 }
        ]
      }
    ]
  },
  Careers: {
    eyebrow: "Careers",
    title: "Build enterprise systems with Ractysh.",
    description: "Roles and internships across architecture, construction, real estate, trade, OTC exchange and premium client service.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80",
    ctaLabel: "View careers",
    ctaHref: "/careers",
    columns: [
      {
        title: "Hiring",
        links: [
          { label: "Open Roles", description: "Current business and technical roles.", href: "/careers", Icon: Building2 },
          { label: "Internships", description: "Design and operations internship paths.", href: "/careers", Icon: DraftingCompass }
        ]
      }
    ]
  },
  Blog: {
    eyebrow: "Insights",
    title: "Enterprise writing for premium decisions.",
    description: "Architecture insights, construction notes, real estate strategy, export-import updates, OTC exchange workflow and company stories.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
    ctaLabel: "Read insights",
    ctaHref: "/blog",
    columns: [
      {
        title: "Editorial",
        links: [
          { label: "Architecture Insights", description: "Design and visualization thinking.", href: "/blog", Icon: DraftingCompass },
          { label: "Construction News", description: "Execution and delivery frameworks.", href: "/blog", Icon: HardHat },
          { label: "Real Estate Strategy", description: "Asset positioning and development notes.", href: "/blog", Icon: Building2 },
          { label: "Export & Import Updates", description: "Trade and logistics notes.", href: "/blog", Icon: Globe2 },
          { label: "OTC Exchange Notes", description: "Private transaction workflow notes.", href: "/blog", Icon: ShieldCheck }
        ]
      }
    ]
  },
  Contact: {
    eyebrow: "Contact",
    title: "Start a premium enterprise conversation.",
    description: "Connect with the Ractysh office, book a demo or send private feedback.",
    image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80",
    ctaLabel: "Contact office",
    ctaHref: "/contact",
    columns: [
      {
        title: "Reach Us",
        links: [
          { label: "Contact", description: "Office details and map location.", href: "/contact", Icon: Building2 },
          { label: "Book a Demo", description: "Structured enterprise intake.", href: "/book-consultation", Icon: ShieldCheck }
        ]
      }
    ]
  },
  Founder: {
    eyebrow: "Founder",
    title: "Founder vision and enterprise direction.",
    description: "Read the chairman profile, Ractysh timeline and leadership principles behind the group.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    ctaLabel: "View founder",
    ctaHref: "/founder",
    columns: [
      {
        title: "Founder Office",
        links: [
          { label: "Founder Profile", description: "Chairman vision and operating philosophy.", href: "/founder", Icon: ShieldCheck },
          { label: "Leadership Timeline", description: "Milestones across the Ractysh journey.", href: "/founder#timeline", Icon: Building2 },
          { label: "Directors", description: "Executive leadership profiles.", href: "/directors", Icon: Building2 }
        ]
      }
    ]
  }
};

const navOrder = [
  "Ecosystem",
  "Services",
  "Our Work",
  "About Us",
  "Careers",
  "Blog",
  "Book Consultation",
  "Contact",
  "Founder"
];

const fallbackHref: Record<string, string> = {
  Ecosystem: "/business",
  Services: "/services",
  "Our Work": "/our-projects",
  "About Us": "/about",
  Careers: "/careers",
  Blog: "/blog",
  "Book Consultation": "/book-consultation",
  Contact: "/contact",
  Founder: "/founder"
};

const quickAccessSearchItems: SearchItem[] = [
  {
    title: "Our Work",
    description: "Selected Ractysh environments and enterprise execution",
    href: "/our-projects",
    Icon: DraftingCompass,
    keywords: ["work", "projects", "selected", "portfolio", "infrastructure", "design", "turnkey"]
  },
  {
    title: "About",
    description: "Company profile and identity",
    href: "/about",
    Icon: ShieldCheck,
    keywords: ["about", "company", "profile", "identity", "ractysh"]
  },
  {
    title: "Founder",
    description: "Leadership and enterprise vision",
    href: "/founder",
    Icon: ShieldCheck,
    keywords: ["founder", "chairman", "leadership", "vision", "trust"]
  },
  {
    title: "Contact",
    description: "Reach the Ractysh office",
    href: "/contact",
    Icon: Building2,
    keywords: ["contact", "office", "location", "support"]
  },
  {
    title: "Blog",
    description: "Articles and insights",
    href: "/blog",
    Icon: DraftingCompass,
    keywords: ["blog", "insights", "articles", "news", "editorial"]
  }
];

const serviceSearchItems: SearchItem[] = servicePages.map((service) => ({
  title: service.eyebrow,
  description: service.summary,
  href: service.href,
  Icon: service.category === "Design Studio" ? DraftingCompass : service.category === "Build Delivery" ? HardHat : Globe2,
  keywords: [service.category, service.eyebrow, service.slug, "service", "premium", "enterprise"]
}));

const globalSearchItems: SearchItem[] = [
  ...quickAccessSearchItems,
  ...serviceSearchItems,
  {
    title: "Ractysh Import & Export",
    description: "Export-import, global trade and logistics operating layer",
    href: "/import-export",
    Icon: Globe2,
    keywords: ["import export", "global trade", "logistics", "supply chain", "commerce"]
  },
  {
    title: "Architecture Division",
    description: "Spatial intelligence, planning and visualization pillar",
    href: "/architecture",
    Icon: DraftingCompass,
    keywords: ["design", "architecture", "visualization", "spatial", "blueprint"]
  },
  {
    title: "Construction Division",
    description: "Construction, project execution and turnkey delivery pillar",
    href: "/construction",
    Icon: HardHat,
    keywords: ["infra", "infrastructure", "construction", "turnkey", "execution"]
  },
  {
    title: "Real Estate Division",
    description: "Asset positioning, development advisory and investor-ready property workflow",
    href: "/real-estate",
    Icon: Building2,
    keywords: ["real estate", "property", "asset", "development", "leasing", "investor"]
  },
  {
    title: "OTC Exchange Division",
    description: "Private counterparty, deal-room and OTC transaction coordination",
    href: "/otc-exchange",
    Icon: ShieldCheck,
    keywords: ["otc", "exchange", "private deals", "counterparty", "deal room", "transaction"]
  },
  {
    title: "Services",
    description: "Premium service pathways across architecture, construction, real estate, trade and OTC exchange",
    href: "/services",
    Icon: Building2,
    keywords: ["services", "operations", "enterprise", "design", "build", "trade", "real estate", "otc"]
  },
  {
    title: "Our Work",
    description: "Selected environments shaped through architecture, construction, real estate, trade and OTC exchange",
    href: "/our-projects",
    Icon: DraftingCompass,
    keywords: ["work", "projects", "portfolio", "selected work", "architecture", "construction", "real estate", "trade", "otc"]
  },
  {
    title: "About Ractysh",
    description: "Company profile, operating model and enterprise identity",
    href: "/about",
    Icon: ShieldCheck,
    keywords: ["about", "company", "profile", "identity", "ractysh"]
  },
  {
    title: "Blog & Insights",
    description: "Five-pillar enterprise writing and operating insights",
    href: "/blog",
    Icon: DraftingCompass,
    keywords: ["blog", "insights", "articles", "news", "editorial"]
  },
  {
    title: "Enterprise Solutions",
    description: "Integrated ecosystem services for modern enterprises",
    href: "/#enterprise-solutions",
    Icon: ShieldCheck,
    keywords: ["solutions", "enterprise", "ecosystem", "operations", "platform"]
  },
  {
    title: "Project Timeline",
    description: "Operational milestones across the Ractysh ecosystem",
    href: "/#project-timeline",
    Icon: Clock3,
    keywords: ["timeline", "history", "milestones", "journey"]
  },
  {
    title: "Contact Office",
    description: "Reach the Ractysh enterprise office",
    href: "/contact",
    Icon: Building2,
    keywords: ["contact", "office", "location", "support"]
  }
];

function normalizeLabel(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const navHrefAliases: Record<string, string[]> = {
  "Our Work": ["/our-projects"],
  "Book Consultation": ["/book-consultation"]
};

function isActiveHref(href: string, pathname: string) {
  if ((href === "/business" || href === "/#enterprise-solutions") && pathname === "/business") return true;
  if (href.startsWith("/#") || href.startsWith("#")) return pathname === "/";
  return href === pathname || (href !== "/" && pathname.startsWith(href));
}

function buildNavItems(items: NavItem[]): EnterpriseNavItem[] {
  return navOrder.map((label) => {
    const acceptedHrefs = navHrefAliases[label] || [];
    const cmsItem = items.find((item) =>
      normalizeLabel(item.label) === normalizeLabel(label) || acceptedHrefs.includes(item.href)
    );
    return {
      label,
      href: label === "Ecosystem" ? "/business" : cmsItem?.href || fallbackHref[label],
      menu: menuModels[label],
      variant: label === "Book Consultation" ? "cta" : "link"
    };
  });
}

function MegaMenu({ item, onClose }: { item: EnterpriseNavItem; onClose: () => void }) {
  if (!item.menu) return null;

  return (
    <motion.div
      key={item.label}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease }}
      className="absolute inset-x-0 top-[72px] z-10 hidden origin-top text-[#211b17] xl:block"
      style={{
        background: "rgba(250,248,244,0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(214,180,95,0.24)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.55) inset"
      }}
      onMouseEnter={() => undefined}
    >
      <div
        className={cn(
          "mx-auto grid gap-8 px-8 py-8",
          item.menu.columns.length === 1
            ? "max-w-[72rem] grid-cols-[minmax(0,30rem)_21rem] justify-center"
            : "max-w-[90rem] grid-cols-[minmax(0,1fr)_21rem]"
        )}
      >
        <div
          className={cn(
            "grid gap-7",
            item.menu.columns.length >= 3
              ? "grid-cols-3"
              : item.menu.columns.length === 2
                ? "grid-cols-2"
                : "grid-cols-1"
          )}
        >
          {item.menu.columns.map((column) => (
            <div key={column.title}>
              <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8B1118]">
                {column.title}
              </p>
              <div className="space-y-1">
                {column.links.map((link) => {
                  const Icon = link.Icon;

                  return (
                    <Link
                      key={`${column.title}-${link.label}`}
                      href={link.href}
                      onClick={onClose}
                      className="group flex gap-3 rounded-[14px] border border-transparent px-3 py-3 transition duration-300 hover:translate-x-1 hover:border-[#D6B45F]/36 hover:bg-white/78 hover:shadow-[0_14px_32px_rgba(45,35,22,0.07)]"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-[#e2d7bf] bg-white/95 text-[#8B1118] shadow-[0_8px_20px_rgba(39,31,24,0.04)] transition duration-300 group-hover:border-[#D6B45F]/70 group-hover:bg-[#fffaf0] group-hover:text-[#9a7428]">
                        <Icon className="h-4 w-4" strokeWidth={1.9} />
                      </span>
                      <span>
                        <span className="block text-[0.98rem] font-semibold leading-tight text-[#171412] transition duration-300 group-hover:text-[#8B1118]">
                          {link.label}
                        </span>
                        <span className="mt-1 block max-w-[17rem] text-[0.84rem] leading-[1.45] text-[#5f5851] transition duration-300 group-hover:text-[#423c37]">
                          {link.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[22px] border border-white/70 bg-white/82 shadow-[0_18px_48px_rgba(31,23,16,0.09)] backdrop-blur-[16px]">
          <div className="relative h-36 overflow-hidden bg-[#12090b]">
            <img src={item.menu.image} alt="" className="h-full w-full object-cover opacity-88" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,9,11,0.04),rgba(18,9,11,0.58))]" />
          </div>
          <div className="p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8B1118]">{item.menu.eyebrow}</p>
            <h3 className="mt-3 font-display text-[1.45rem] font-semibold leading-tight tracking-normal text-[#211b17]">
              {item.menu.title}
            </h3>
            <p className="mt-3 text-[0.86rem] leading-6 text-[#625a53]">{item.menu.description}</p>
            <Link
              href={item.menu.ctaHref}
              onClick={onClose}
              className="mt-5 inline-flex items-center gap-2 text-[0.86rem] font-semibold text-[#8B1118] transition duration-300 hover:text-[#9a7428]"
            >
              {item.menu.ctaLabel}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function matchesSearchItem(item: SearchItem, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [item.title, item.description, ...item.keywords].some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  );
}

function GlobalSearchOverlay({
  activeIndex,
  compact,
  inputRef,
  items,
  open,
  query,
  onActiveChange,
  onClose,
  onNavigate,
  onQueryChange
}: {
  activeIndex: number;
  compact: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  items: SearchItem[];
  open: boolean;
  query: string;
  onActiveChange: (index: number) => void;
  onClose: () => void;
  onNavigate: (href: string) => void;
  onQueryChange: (query: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="global-search-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: searchOverlayEase }}
          className="fixed inset-0 z-[260] flex items-start justify-center px-3 pt-3 text-[#211b17] sm:items-center sm:px-6 sm:pt-0"
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: compact ? "blur(10px)" : "blur(14px)",
            WebkitBackdropFilter: compact ? "blur(10px)" : "blur(14px)",
            willChange: "opacity"
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[#211b17]/[0.055]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(214,180,95,0.14),transparent_34rem)]" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: searchOverlayEase }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/72 bg-[#fffdf8]/92 shadow-[0_34px_110px_rgba(32,24,17,0.22),0_2px_0_rgba(255,255,255,0.85)_inset]"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.74),rgba(255,255,255,0.18)_45%,rgba(214,180,95,0.08))]" />
            <div className="relative flex h-[56px] items-center gap-3 border-b border-[#e9dfcc]/72 px-4">
              <Search className="h-4 w-4 shrink-0 text-[#8B1118]" strokeWidth={2} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search..."
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-[14px] font-medium leading-none text-[#171717] outline-none placeholder:text-[#9a9a9a]"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={onClose}
                className="shrink-0 rounded-md border border-[#e8ddca] bg-white/76 px-2 py-1 text-[11px] font-medium uppercase tracking-normal text-[#777777] shadow-sm transition duration-150 hover:border-[#d6b45f]/60 hover:bg-white hover:text-[#111111]"
              >
                Esc
              </button>
            </div>

            <div className="relative max-h-[min(22rem,58vh)] overflow-y-auto p-1.5">
              {items.length ? (
                <div className="space-y-0.5">
                  {items.map((item, index) => {
                    const Icon = item.Icon;
                    const selected = activeIndex === index;

                    return (
                      <button
                        key={`${item.title}-${item.href}`}
                        type="button"
                        aria-selected={selected}
                        onMouseEnter={() => onActiveChange(index)}
                        onClick={() => onNavigate(item.href)}
                        className={cn(
                          "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[14px] font-medium text-[#242424] transition-colors duration-150 hover:bg-[#f5efe5]",
                          selected && "bg-[#f5efe5]"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-[#8f7a4d]" strokeWidth={1.9} />
                        <span className="min-w-0 flex-1 truncate">{item.title}</span>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#b0b0b0]" strokeWidth={2} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-16 items-center px-3 text-[14px] font-medium text-[#777777]">No results</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function Navbar({ logoText, items }: NavbarProps) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>("Ecosystem");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActiveIndex, setSearchActiveIndex] = useState(0);
  const [compactSearch, setCompactSearch] = useState(false);
  const navItems = useMemo(() => buildNavItems(items), [items]);
  const primaryNavItems = useMemo(() => navItems.filter((item) => item.variant !== "cta"), [navItems]);
  const consultationNavItem = useMemo(() => navItems.find((item) => item.variant === "cta"), [navItems]);
  const activeItem = activeLabel ? navItems.find((item) => item.label === activeLabel && item.menu) : null;
  const brandName = logoText && !logoText.toLowerCase().includes("audit") ? logoText : "Ractysh";
  const isLandscapePlanningRoute = pathname === "/landscape-planning";
  const displayedSearchItems = useMemo(() => {
    if (!searchQuery.trim()) return quickAccessSearchItems;
    return globalSearchItems.filter((item) => matchesSearchItem(item, searchQuery)).slice(0, 8);
  }, [searchQuery]);

  const openSearch = useCallback(() => {
    setActiveLabel(null);
    setMobileOpen(false);
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchActiveIndex(0);
  }, []);

  const navigateSearch = useCallback(
    (href: string) => {
      closeSearch();
      router.push(href);
    },
    [closeSearch, router]
  );

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setSearchActiveIndex(0);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const interactionLocked = Boolean(activeLabel || mobileOpen || searchOpen);
    let lastScrollY = Math.max(window.scrollY, 0);
    let navHidden = false;
    let ticking = false;

    const isMobileViewport = () => window.innerWidth < 768;
    const showDuration = () => (isMobileViewport() ? 0.38 : 0.5);
    const hideDuration = () => (isMobileViewport() ? 0.34 : 0.45);
    const getHeroEnd = () => {
      if (pathname !== "/") return 0;

      const hero = document.getElementById("hero");
      if (!hero) return 0;

      return hero.offsetTop + hero.offsetHeight - header.offsetHeight;
    };

    const showHeader = (duration = showDuration()) => {
      const currentY = Number(gsap.getProperty(header, "yPercent"));
      const currentOpacity = Number(gsap.getProperty(header, "opacity"));
      if (!navHidden && Math.abs(currentY) < 0.01 && currentOpacity >= 0.999) return;

      navHidden = false;
      gsap.to(header, {
        yPercent: 0,
        opacity: 1,
        duration,
        ease: "power3.out",
        overwrite: "auto"
      });
    };

    const hideHeader = () => {
      if (navHidden || interactionLocked) return;

      navHidden = true;
      gsap.to(header, {
        yPercent: -120,
        opacity: 0.96,
        duration: hideDuration(),
        ease: "power3.out",
        overwrite: "auto"
      });
    };

    const syncHeader = () => {
      const currentScroll = Math.max(window.scrollY, 0);
      const scrolled = currentScroll > 18;
      const insideHomeHero = pathname === "/" && currentScroll < getHeroEnd();
      const navBackground = isLandscapePlanningRoute
        ? scrolled
          ? "rgba(255,252,246,0.94)"
          : "rgba(255,252,246,0.86)"
        : scrolled
          ? "rgba(255,252,246,0.92)"
          : "rgba(255,252,246,0.76)";
      const navBorder = isLandscapePlanningRoute
        ? scrolled
          ? "rgba(198,164,91,0.34)"
          : "rgba(198,164,91,0.24)"
        : scrolled
          ? "rgba(198,164,91,0.34)"
          : "rgba(198,164,91,0.22)";
      const navShadow = isLandscapePlanningRoute
        ? scrolled
          ? "0 18px 54px rgba(34,22,15,0.1), inset 0 -1px 0 rgba(255,255,255,0.5)"
          : "0 10px 34px rgba(34,22,15,0.07), inset 0 -1px 0 rgba(255,255,255,0.44)"
        : scrolled
          ? "0 18px 54px rgba(34,22,15,0.09), inset 0 -1px 0 rgba(255,255,255,0.5)"
          : "0 10px 34px rgba(34,22,15,0.06), inset 0 -1px 0 rgba(255,255,255,0.42)";
      const navBlur = isLandscapePlanningRoute ? (scrolled ? "blur(22px)" : "blur(18px)") : scrolled ? "blur(22px)" : "blur(16px)";

      gsap.to(header, {
        "--nav-bg": navBackground,
        "--nav-border": navBorder,
        "--nav-shadow": navShadow,
        "--nav-blur": navBlur,
        duration: 0.3,
        ease: "power3.out"
      });

      if (isLandscapePlanningRoute) {
        showHeader(currentScroll <= 8 ? 0.24 : showDuration());
        lastScrollY = currentScroll;
        return;
      }

      if (insideHomeHero || currentScroll <= 8 || interactionLocked) {
        showHeader(insideHomeHero || currentScroll <= 8 ? 0.36 : showDuration());
        lastScrollY = currentScroll;
        return;
      }

      const scrollDelta = currentScroll - lastScrollY;
      if (Math.abs(scrollDelta) < 5) return;

      if (scrollDelta > 0) {
        hideHeader();
      } else {
        showHeader();
      }

      lastScrollY = currentScroll;
    };

    const requestSync = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        syncHeader();
      });
    };

    gsap.set(header, {
      yPercent: 0,
      opacity: 1,
      force3D: true,
      transformOrigin: "50% 0%"
    });
    syncHeader();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      gsap.killTweensOf(header);
    };
  }, [activeLabel, isLandscapePlanningRoute, mobileOpen, pathname, searchOpen]);

  useEffect(() => {
    const syncSearchMode = () => setCompactSearch(window.innerWidth < 640);

    syncSearchMode();
    window.addEventListener("resize", syncSearchMode);
    return () => window.removeEventListener("resize", syncSearchMode);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSearch]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1280) setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  useEffect(() => {
    setSearchActiveIndex((currentIndex) => {
      const lastIndex = Math.max(displayedSearchItems.length - 1, 0);
      return Math.min(currentIndex, lastIndex);
    });
  }, [displayedSearchItems.length]);

  useEffect(() => {
    if (!searchOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus({ preventScroll: true }), 80);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
        return;
      }

      if (!displayedSearchItems.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSearchActiveIndex((currentIndex) => (currentIndex + 1) % displayedSearchItems.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSearchActiveIndex((currentIndex) => (currentIndex - 1 + displayedSearchItems.length) % displayedSearchItems.length);
        return;
      }

      if (event.key === "Enter") {
        const target = displayedSearchItems[Math.min(searchActiveIndex, displayedSearchItems.length - 1)];
        if (!target) return;

        event.preventDefault();
        navigateSearch(target.href);
      }
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeSearch, displayedSearchItems, navigateSearch, searchActiveIndex, searchOpen]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-[240] w-full isolate overflow-visible",
        isLandscapePlanningRoute
          ? "[--nav-bg:rgba(255,252,246,0.86)] [--nav-blur:blur(18px)] [--nav-border:rgba(198,164,91,0.24)] [--nav-shadow:0_10px_34px_rgba(34,22,15,0.07),inset_0_-1px_0_rgba(255,255,255,0.44)]"
          : "[--nav-bg:rgba(255,252,246,0.76)] [--nav-blur:blur(16px)] [--nav-border:rgba(198,164,91,0.22)] [--nav-shadow:0_10px_34px_rgba(34,22,15,0.06),inset_0_-1px_0_rgba(255,255,255,0.42)]"
      )}
      onMouseLeave={() => setActiveLabel(null)}
      style={{
        background: "var(--nav-bg)",
        backdropFilter: "var(--nav-blur)",
        WebkitBackdropFilter: "var(--nav-blur)",
        borderBottom: "1px solid var(--nav-border)",
        boxShadow: "var(--nav-shadow)",
        willChange: "transform, opacity"
      }}
    >
      <AnimatePresence>
        {activeItem ? (
          <motion.div
            key="navbar-hover-wash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-[72px] bg-white/[0.08] xl:block"
            style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
          />
        ) : null}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="mx-auto flex h-[64px] max-w-[90rem] items-center px-5 md:px-8 xl:grid xl:h-[72px] xl:grid-cols-[minmax(13.25rem,1fr)_auto_minmax(13.25rem,1fr)] xl:gap-4 2xl:gap-5">
          <Link
            href="/#hero"
            className="flex min-w-[11rem] items-center gap-2 xl:min-w-[13.25rem] xl:gap-2.5"
            onMouseEnter={() => setActiveLabel(null)}
            aria-label="Ractysh home"
          >
            <BrandLogo size="nav" priority decorative className="translate-y-px" />
            <span className="font-display text-[1.48rem] font-semibold leading-none tracking-normal text-[#211b17] md:text-[1.54rem]">
              {brandName}
            </span>
          </Link>

          <nav className="mx-auto hidden h-full items-center justify-center gap-0.5 xl:flex 2xl:gap-1" aria-label="Primary navigation">
            {primaryNavItems.map((item) => {
              const isActive = isActiveHref(item.href, pathname);
              const isOpen = activeLabel === item.label;

              return (
                <div key={item.label} className="flex h-full items-center" onMouseEnter={() => setActiveLabel(item.menu ? item.label : null)}>
                  <Link
                    href={item.href}
                    className={cn(
                        "executive-nav-link group relative flex h-full items-center whitespace-nowrap px-1.5 !text-[0.875rem] !font-medium uppercase !leading-none !tracking-[0.08em] text-[#322b25] transition-[color,transform] duration-300 ease-out hover:-translate-y-px hover:text-[#8B1118] 2xl:px-2",
                      (isActive || isOpen) && "text-[#7e171a]"
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute bottom-[19px] left-1.5 right-1.5 h-px origin-center scale-x-0 bg-[linear-gradient(90deg,rgba(139,17,24,0.18),rgba(214,180,95,0.98),rgba(139,17,24,0.18))] shadow-[0_0_18px_rgba(214,180,95,0.28)] transition-transform duration-500 ease-out group-hover:scale-x-100 2xl:left-2 2xl:right-2",
                        (isActive || isOpen) && "scale-x-100"
                      )}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="ml-auto hidden min-w-[13.25rem] items-center justify-end gap-2.5 xl:flex">
            <span className="h-8 w-px bg-[linear-gradient(180deg,transparent,rgba(198,164,91,0.62),transparent)]" aria-hidden="true" />
            {consultationNavItem ? (
              <Link
                href={consultationNavItem.href}
                className="executive-nav-cta group relative inline-flex min-h-10 items-center justify-center gap-1 overflow-hidden rounded-full border border-[#D6B45F]/60 bg-[#7B1016] px-3 !text-[0.875rem] !font-medium uppercase !leading-none !tracking-[0.08em] text-[#fff8eb] shadow-[0_14px_34px_rgba(123,16,22,0.24),0_0_22px_rgba(214,180,95,0.12),inset_0_1px_0_rgba(255,255,255,0.14)] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-[#D6B45F]/90 hover:bg-[#8B1118] hover:text-[#f7dc95] hover:shadow-[0_20px_44px_rgba(123,16,22,0.3),0_0_34px_rgba(214,180,95,0.26),inset_0_1px_0_rgba(255,255,255,0.18)]"
                onMouseEnter={() => setActiveLabel(null)}
              >
                <span className="pointer-events-none absolute inset-[1px] rounded-full bg-[linear-gradient(135deg,rgba(255,244,205,0.18),transparent_40%,rgba(214,180,95,0.16))]" />
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(247,220,149,0.26),transparent)] opacity-0 transition-all duration-700 ease-out group-hover:left-[118%] group-hover:opacity-100" />
                <Sparkles className="relative h-3.5 w-3.5 text-[#d6b45f] transition duration-300 group-hover:rotate-12" strokeWidth={1.8} />
                <span className="relative whitespace-nowrap">{consultationNavItem.label}</span>
              </Link>
            ) : null}
          </div>

          <div className="ml-auto flex items-center gap-2 xl:hidden">
            <Link
              href="/book-consultation"
              aria-label="Book Consultation"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D6B45F]/60 bg-[#8B1118] text-[#d6b45f] shadow-[0_10px_26px_rgba(139,17,24,0.22)] transition duration-300 hover:border-[#D6B45F]/80 hover:bg-[#9d151d] hover:text-[#fff7e8]"
            >
              <Sparkles className="h-5 w-5" strokeWidth={1.8} />
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9ceb6] bg-white/70 text-[#211b17] shadow-[0_10px_26px_rgba(34,22,15,0.08)] xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeItem ? <MegaMenu item={activeItem} onClose={() => setActiveLabel(null)} /> : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease }}
            className="fixed inset-0 z-[90] bg-black/42 backdrop-blur-md xl:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              id="ractysh-mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.38, ease }}
              role="dialog"
              aria-modal="true"
              aria-label="Ractysh mobile navigation"
              onClick={(event) => event.stopPropagation()}
              className="ml-auto flex h-dvh w-full max-w-[29rem] flex-col overflow-y-auto border-l border-[#e1d4bb] bg-[#fffbf3] p-5 text-[#211b17] shadow-[-28px_0_90px_rgba(22,14,9,0.22)]"
            >
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/#hero"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-w-0 items-center gap-2.5"
                  aria-label="Ractysh home"
                >
                  <BrandLogo size="navCompact" priority decorative className="translate-y-px" />
                  <span className="truncate font-display text-[1.34rem] font-semibold leading-none">{brandName}</span>
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e1d4bb] bg-white text-[#211b17]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 rounded-[22px] border border-[#e7dbc4] bg-[#f7efe0] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8B1118]">Ractysh Enterprise</p>
                <p className="mt-2 text-[1.08rem] font-semibold leading-snug text-[#211b17]">
                  Architecture, construction, real estate, trade and OTC exchange in one premium ecosystem.
                </p>
              </div>

              <div className="mt-5 space-y-2">
                {navItems.map((item) => {
                  if (item.variant === "cta") {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="group relative flex min-h-[3.7rem] items-center justify-between overflow-hidden rounded-[18px] border border-[#D6B45F]/55 bg-[#8B1118] px-4 text-left text-[0.95rem] font-semibold text-[#fff7e8] shadow-[0_16px_34px_rgba(139,17,24,0.22),inset_0_1px_0_rgba(255,255,255,0.14)] transition duration-300 hover:border-[#D6B45F]/80 hover:bg-[#9d151d] hover:text-[#f7dc95]"
                      >
                        <span className="pointer-events-none absolute inset-[1px] rounded-[17px] bg-[linear-gradient(135deg,rgba(255,244,205,0.16),transparent_42%,rgba(214,180,95,0.14))]" />
                        <span className="relative flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#d6b45f] transition duration-300 group-hover:rotate-12" strokeWidth={1.8} />
                          {item.label}
                        </span>
                        <ArrowUpRight className="relative h-4 w-4 text-[#d6b45f]" />
                      </Link>
                    );
                  }

                  if (!item.menu) return null;

                  const expanded = expandedMobile === item.label;

                  return (
                    <div key={item.label} className="overflow-hidden rounded-[18px] border border-[#e5d8c1] bg-white/82">
                      <button
                        type="button"
                        onClick={() => setExpandedMobile(expanded ? null : item.label)}
                        className="flex min-h-[3.7rem] w-full items-center justify-between gap-3 px-4 text-left text-[1rem] font-semibold"
                      >
                        {item.label}
                        <ChevronDown className={cn("h-4 w-4 text-[#8B1118] transition duration-300", expanded && "rotate-180")} />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease }}
                            className="overflow-hidden border-t border-[#efe5d3]"
                          >
                            <div className="space-y-1 px-3 py-3">
                              {item.menu.columns.flatMap((column) => column.links).slice(0, 5).map((link) => {
                                const Icon = link.Icon;

                                return (
                                  <Link
                                    key={`${item.label}-${link.label}`}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-start gap-3 rounded-[14px] px-3 py-3 transition duration-300 hover:bg-[#8B1118]/[0.045]"
                                  >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-[#e1d4bb] bg-[#fbf5ea] text-[#8B1118]">
                                      <Icon className="h-4 w-4" />
                                    </span>
                                    <span>
                                      <span className="block text-[0.92rem] font-semibold">{link.label}</span>
                                      <span className="mt-1 block text-[0.78rem] leading-5 text-[#746a60]">{link.description}</span>
                                    </span>
                                  </Link>
                                );
                              })}
                              <Link
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="mt-2 flex items-center justify-between rounded-[14px] bg-[#8B1118] px-4 py-3 text-sm font-semibold text-white"
                              >
                                Open {item.label}
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <GlobalSearchOverlay
        activeIndex={searchActiveIndex}
        compact={compactSearch}
        inputRef={searchInputRef}
        items={displayedSearchItems}
        open={searchOpen}
        query={searchQuery}
        onActiveChange={setSearchActiveIndex}
        onClose={closeSearch}
        onNavigate={navigateSearch}
        onQueryChange={updateSearchQuery}
      />
    </header>
  );
}
