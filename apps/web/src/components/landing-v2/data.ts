import type { LucideIcon } from "lucide-react";
import {
  Building2,
  DraftingCompass,
  HardHat,
  Landmark,
  Network,
  ShieldCheck,
  Ship,
  SquareStack
} from "lucide-react";

export type PillarV2 = {
  title: string;
  label: string;
  description: string;
  href: string;
  image: string;
  Icon: LucideIcon;
};

export const navItemsV2 = [
  { label: "Ecosystem", href: "#ecosystem-v2" },
  { label: "Services", href: "#services-v2" },
  { label: "Projects", href: "#projects-v2" },
  { label: "About", href: "#about-v2" }
];

export const pillarsV2: PillarV2[] = [
  {
    title: "Architecture",
    label: "Spatial strategy",
    description: "Concepts, plans, visualization and premium design systems shaped for serious execution.",
    href: "/architecture",
    image: "/services/design-systems-premium-bg.webp",
    Icon: DraftingCompass
  },
  {
    title: "Construction",
    label: "Site command",
    description: "Construction coordination, structural delivery and disciplined progress control for complex sites.",
    href: "/construction",
    image: "/services/infrastructure-premium-bg.webp",
    Icon: HardHat
  },
  {
    title: "Real Estate",
    label: "Asset direction",
    description: "Development intelligence, property positioning and high-value real estate workflow alignment.",
    href: "/real-estate",
    image: "/contact/enterprise-architecture-workspace.webp",
    Icon: Building2
  },
  {
    title: "Import & Export",
    label: "Global trade",
    description: "Sourcing, supplier movement, cargo planning and trade operations under one executive layer.",
    href: "/import-export",
    image: "/services/global-trade-premium-bg.webp",
    Icon: Ship
  },
  {
    title: "OTC Exchange",
    label: "Private exchange",
    description: "A controlled environment for private deal flow, counterparty clarity and executive-grade exchange workflows.",
    href: "/otc-exchange",
    image: "/visualization/systems-model.webp",
    Icon: Landmark
  }
];

export const ecosystemStepsV2 = [
  { value: "01", label: "Private brief intake", detail: "Define mandate, risk, scope and executive intent." },
  { value: "02", label: "Pillar orchestration", detail: "Connect design, site, asset, trade and exchange workflows." },
  { value: "03", label: "Execution visibility", detail: "Track decisions, ownership, timelines and delivery movement." },
  { value: "04", label: "Leadership reporting", detail: "Package the signal executives need without operational noise." }
];

export const projectSignalsV2 = [
  {
    title: "Luxury mixed-use development",
    meta: "Architecture + real estate + construction",
    image: "/visualization/gallery-exterior.webp"
  },
  {
    title: "Global procurement corridor",
    meta: "Import-export + construction supply",
    image: "/services/global-trade-transport.webp"
  },
  {
    title: "Private asset exchange workflow",
    meta: "OTC exchange + executive reporting",
    image: "/visualization/presentation-standards.webp"
  }
];

export const operatingStatsV2 = [
  { value: "05", label: "Enterprise pillars" },
  { value: "01", label: "Operating layer" },
  { value: "360", label: "Workflow visibility" }
];

export const systemNodesV2 = [
  { label: "Design", Icon: DraftingCompass },
  { label: "Build", Icon: HardHat },
  { label: "Assets", Icon: Building2 },
  { label: "Trade", Icon: Ship },
  { label: "Exchange", Icon: Landmark }
];

export const trustMarkersV2 = [
  { label: "Private mandate control", Icon: ShieldCheck },
  { label: "Cross-pillar workflow", Icon: Network },
  { label: "Executive operating view", Icon: SquareStack }
];
