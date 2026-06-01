export type EnterprisePillarKey = "architecture" | "construction" | "real-estate" | "import-export" | "otc-exchange";

export interface EnterprisePillarMetric {
  label: string;
  value: string;
}

export interface EnterprisePillarBlock {
  title: string;
  body: string;
}

export interface EnterprisePillarWorkflowStep {
  label: string;
  title: string;
  body: string;
}

export interface EnterprisePillar {
  key: EnterprisePillarKey;
  shortTitle: string;
  title: string;
  divisionName: string;
  eyebrow: string;
  category: string;
  href: string;
  image: string;
  imageAlt: string;
  headline: [string, string, string];
  summary: string;
  overviewTitle: string;
  overview: string;
  businessValue: string;
  metrics: EnterprisePillarMetric[];
  capabilities: EnterprisePillarBlock[];
  workflow: EnterprisePillarWorkflowStep[];
  consultation: EnterprisePillarBlock;
  ecosystemConnection: EnterprisePillarBlock[];
  visualNodes: string[];
  tags: string[];
}

export const enterprisePillars: EnterprisePillar[] = [
  {
    key: "architecture",
    shortTitle: "Architecture",
    title: "Architecture Division",
    divisionName: "Ractysh Architecture",
    eyebrow: "Pillar 01 / Architecture",
    category: "Spatial Intelligence",
    href: "/architecture",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=84",
    imageAlt: "Premium architecture studio with refined planning workspace",
    headline: ["Architecture that", "turns intent into", "buildable intelligence."],
    summary:
      "Concept architecture, spatial planning, interiors, visualization and documentation structured for premium residential, commercial and mixed-use programs.",
    overviewTitle: "Design intelligence before capital is committed.",
    overview:
      "The Architecture Division gives every Ractysh mandate a disciplined spatial foundation. It converts business intent, lifestyle needs, site potential and brand presence into planning systems that downstream construction, real estate and trade teams can execute with less ambiguity.",
    businessValue:
      "Clients receive a clearer approval path, stronger project storytelling and technical handoff material that supports investment, sales and delivery decisions.",
    metrics: [
      { label: "Planning layers", value: "18+" },
      { label: "Review mode", value: "BIM-ready" },
      { label: "Handoff", value: "Buildable" }
    ],
    capabilities: [
      {
        title: "Concept architecture",
        body: "Site logic, massing, circulation and facade language shaped into a premium architectural direction."
      },
      {
        title: "Interior and experience systems",
        body: "Material, lighting, furniture and spatial atmosphere aligned with the operating purpose of the property."
      },
      {
        title: "Visualization and approvals",
        body: "Decision-grade renderings, presentation packages and stakeholder views prepared before execution begins."
      },
      {
        title: "Execution documentation",
        body: "Drawing packs and coordination notes prepared for construction, consultants and procurement teams."
      }
    ],
    workflow: [
      { label: "01", title: "Mandate reading", body: "Business goals, site conditions, usage needs and approval pressure are translated into a design brief." },
      { label: "02", title: "Spatial strategy", body: "Planning grids, zones, circulation and visual identity are developed into a coherent direction." },
      { label: "03", title: "Decision visualization", body: "Renders, material studies and review documents help the client approve with confidence." },
      { label: "04", title: "Execution handoff", body: "Construction and procurement teams receive controlled design information for downstream delivery." }
    ],
    consultation: {
      title: "Architecture consultation path",
      body: "The first consultation maps site context, expected use, budget sensitivity, approval timeline and whether the project should connect into construction, real estate or trade support."
    },
    ecosystemConnection: [
      { title: "Feeds construction", body: "Design decisions become scope, sequence, procurement and site execution requirements." },
      { title: "Strengthens real estate", body: "Spatial quality supports asset positioning, buyer confidence and premium market storytelling." },
      { title: "Informs sourcing", body: "Material and specification choices can move into import, export and supplier coordination." }
    ],
    visualNodes: ["Brief", "Massing", "Visualize", "Document"],
    tags: ["Master planning", "Interiors", "3D visualization", "Documentation"]
  },
  {
    key: "construction",
    shortTitle: "Construction",
    title: "Construction Division",
    divisionName: "Ractysh Construction",
    eyebrow: "Pillar 02 / Construction",
    category: "Delivery Control",
    href: "/construction",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=84",
    imageAlt: "Premium construction site with structural execution in progress",
    headline: ["Construction built", "around control,", "finish and trust."],
    summary:
      "Civil execution, structural coordination, MEP integration, renovation, fit-out and turnkey delivery managed through a premium operating cadence.",
    overviewTitle: "A construction layer for clients who need visible control.",
    overview:
      "The Construction Division turns approved concepts into real delivery. It organizes site work, vendors, procurement, schedule movement, quality checkpoints and handover details into one accountable execution environment.",
    businessValue:
      "Clients gain fewer scattered handoffs, cleaner progress visibility and a delivery structure that protects quality, cost decisions and finish standards.",
    metrics: [
      { label: "Site rhythm", value: "Live" },
      { label: "QA gates", value: "Multi" },
      { label: "Delivery model", value: "Turnkey" }
    ],
    capabilities: [
      {
        title: "Construction execution",
        body: "Civil works, renovation, fit-out and site delivery coordinated through clear ownership and reporting."
      },
      {
        title: "Structural and MEP coordination",
        body: "Structural interfaces, electrical, plumbing and service lanes reviewed before they create expensive site friction."
      },
      {
        title: "Vendor and procurement control",
        body: "Material requirements, vendor dependencies and approval windows kept visible to the client and project team."
      },
      {
        title: "Turnkey handover",
        body: "Snag tracking, finishing, documentation and operational readiness closed through a premium completion path."
      }
    ],
    workflow: [
      { label: "01", title: "Scope lock", body: "Approved drawings, finish expectations, budget bands and execution boundaries are confirmed." },
      { label: "02", title: "Mobilization plan", body: "Vendors, materials, manpower, site dependencies and reporting cadence are sequenced." },
      { label: "03", title: "Controlled execution", body: "Daily site progress, quality gates, decisions and procurement movement are tracked." },
      { label: "04", title: "Premium handover", body: "Final finish, corrections, documents and client transition are handled under one owner." }
    ],
    consultation: {
      title: "Construction consultation path",
      body: "The consultation reviews current drawings, site condition, completion urgency, vendor complexity and whether the work should become a turnkey Ractysh-managed program."
    },
    ecosystemConnection: [
      { title: "Receives architecture", body: "Plans, visual direction and documentation become execution instructions." },
      { title: "Supports real estate", body: "Delivery quality and timeline certainty strengthen asset value and buyer confidence." },
      { title: "Uses export-import", body: "Special materials, fixtures and equipment can be sourced through the trade operating layer." }
    ],
    visualNodes: ["Scope", "Mobilize", "Build", "Handover"],
    tags: ["Civil works", "MEP", "Fit-out", "Turnkey delivery"]
  },
  {
    key: "real-estate",
    shortTitle: "Real Estate",
    title: "Real Estate Division",
    divisionName: "Ractysh Real Estate",
    eyebrow: "Pillar 03 / Real Estate",
    category: "Asset Strategy",
    href: "/real-estate",
    image: "/visualization/gallery-lobby.webp",
    imageAlt: "Premium real estate development and urban property frontage",
    headline: ["Real estate shaped", "as a premium", "asset platform."],
    summary:
      "Development advisory, asset positioning, sales readiness, leasing strategy and investor presentation for premium residential, commercial and mixed-use opportunities.",
    overviewTitle: "Property decisions connected to design, delivery and market value.",
    overview:
      "The Real Estate Division frames property as an enterprise asset. It connects site potential, development feasibility, buyer perception, leasing readiness and investment presentation with the design and construction layers that create value.",
    businessValue:
      "Clients can move from land or property opportunity to a more credible development story, clearer market positioning and better prepared transaction conversations.",
    metrics: [
      { label: "Asset view", value: "360" },
      { label: "Market layer", value: "Premium" },
      { label: "Readiness", value: "Investor" }
    ],
    capabilities: [
      {
        title: "Asset positioning",
        body: "Property identity, target buyer logic, pricing narrative and development intent shaped into a premium market position."
      },
      {
        title: "Development advisory",
        body: "Site potential, program mix, phasing and business priorities reviewed before design or build spend accelerates."
      },
      {
        title: "Sales and leasing readiness",
        body: "Presentation assets, buyer journeys, leasing narratives and space logic prepared for commercial conversations."
      },
      {
        title: "Investor presentation",
        body: "Concept, numbers, visuals and execution path organized into decision-ready enterprise material."
      }
    ],
    workflow: [
      { label: "01", title: "Asset intake", body: "Property, location, legal readiness, current condition and commercial objectives are mapped." },
      { label: "02", title: "Positioning strategy", body: "Target segment, product logic, design standard and revenue narrative are defined." },
      { label: "03", title: "Readiness package", body: "Visuals, floor logic, offer structure and stakeholder materials are prepared." },
      { label: "04", title: "Market support", body: "Sales, leasing, investor or partner conversations are supported with structured presentation." }
    ],
    consultation: {
      title: "Real estate consultation path",
      body: "The consultation identifies asset type, ownership status, market objective, development ambition and whether architecture, construction or private transaction support should be attached."
    },
    ecosystemConnection: [
      { title: "Directs architecture", body: "Market positioning informs planning, amenity logic, facade presence and buyer experience." },
      { title: "Activates construction", body: "Delivery sequencing protects launch windows, leasing commitments and investor expectations." },
      { title: "Links OTC exchange", body: "Qualified private property or business transaction conversations can move through a documented OTC pathway." }
    ],
    visualNodes: ["Asset", "Position", "Present", "Transact"],
    tags: ["Asset positioning", "Development advisory", "Sales readiness", "Investor material"]
  },
  {
    key: "import-export",
    shortTitle: "Export & Import",
    title: "Export & Import Division",
    divisionName: "Ractysh Import & Export",
    eyebrow: "Pillar 04 / Export & Import",
    category: "Global Trade",
    href: "/import-export",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1800&q=84",
    imageAlt: "Global shipping port with containers and cranes",
    headline: ["Export and import", "operations for", "enterprise movement."],
    summary:
      "Supplier coordination, cargo planning, document readiness and logistics visibility for businesses moving goods across regions.",
    overviewTitle: "Global trade handled as an operating system.",
    overview:
      "The Export & Import Division supports commercial movement with structured supplier coordination, route planning, cargo status, documentation discipline and reporting. It can serve external trade clients or strengthen Ractysh construction and real estate procurement.",
    businessValue:
      "Clients get calmer movement visibility, stronger document readiness and a single coordination layer across suppliers, logistics partners and business stakeholders.",
    metrics: [
      { label: "Network", value: "Global" },
      { label: "Documents", value: "Controlled" },
      { label: "Movement", value: "Tracked" }
    ],
    capabilities: [
      {
        title: "Supplier coordination",
        body: "Vendor readiness, commercial expectations and product movement organized before logistics pressure rises."
      },
      {
        title: "Cargo and route planning",
        body: "Freight lanes, dispatch windows, inland movement and handover checkpoints structured with operational visibility."
      },
      {
        title: "Trade documentation",
        body: "Invoices, packing lists, certificates and support documents coordinated around the movement schedule."
      },
      {
        title: "Enterprise reporting",
        body: "Stakeholders receive clearer updates on route, status, risk and next action."
      }
    ],
    workflow: [
      { label: "01", title: "Trade requirement", body: "Commodity, origin, destination, timing, quantity and commercial priority are clarified." },
      { label: "02", title: "Partner alignment", body: "Suppliers, freight partners and route options are reviewed around the operating goal." },
      { label: "03", title: "Document control", body: "Trade documents and status checkpoints are prepared before critical movement windows." },
      { label: "04", title: "Logistics sync", body: "Cargo movement, handover and executive updates are coordinated through one rhythm." }
    ],
    consultation: {
      title: "Export & import consultation path",
      body: "The consultation maps product category, route, Incoterms context, timing, documentation status and whether the movement supports a Ractysh construction or real estate mandate."
    },
    ecosystemConnection: [
      { title: "Supports construction", body: "Imported materials, equipment and fixtures can be coordinated around project schedules." },
      { title: "Improves real estate delivery", body: "Premium finishes and specialist supply chains can support property differentiation." },
      { title: "Feeds OTC confidence", body: "Documented commercial movement improves private counterparty diligence." }
    ],
    visualNodes: ["Source", "Verify", "Move", "Report"],
    tags: ["Global trade", "Supplier coordination", "Cargo routes", "Documentation"]
  },
  {
    key: "otc-exchange",
    shortTitle: "OTC Exchange",
    title: "OTC Exchange Division",
    divisionName: "Ractysh OTC Exchange",
    eyebrow: "Pillar 05 / OTC Exchange",
    category: "Private Market Desk",
    href: "/otc-exchange",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=84",
    imageAlt: "Private finance and transaction documentation workspace",
    headline: ["OTC exchange", "coordination for", "qualified deals."],
    summary:
      "Private counterparty coordination, deal documentation, verification workflow and settlement-readiness support for qualified over-the-counter business transactions.",
    overviewTitle: "A private transaction layer connected to the enterprise group.",
    overview:
      "The OTC Exchange Division is positioned as a controlled coordination desk for qualified counterparties. It focuses on intake, counterparty matching, diligence information, documentation flow and transaction readiness under appropriate written engagement and compliance review.",
    businessValue:
      "Clients gain a more structured private-market pathway for large business, commodity, asset or property-linked conversations that require discretion and documentation control.",
    metrics: [
      { label: "Counterparty", value: "Qualified" },
      { label: "Workflow", value: "Private" },
      { label: "Records", value: "Verified" }
    ],
    capabilities: [
      {
        title: "Private counterparty intake",
        body: "Buyer, seller, asset, commodity or transaction intent reviewed before any sensitive conversation is advanced."
      },
      {
        title: "Documentation workflow",
        body: "Mandates, proof records, commercial documents and communication trails organized for controlled review."
      },
      {
        title: "Deal-room coordination",
        body: "Qualified parties, advisors and internal stakeholders aligned around next steps, verification and decision gates."
      },
      {
        title: "Settlement-readiness support",
        body: "Operational readiness, handover requirements and post-agreement coordination prepared after formal engagement."
      }
    ],
    workflow: [
      { label: "01", title: "Private intake", body: "The opportunity, parties, role, documents and expected transaction path are screened." },
      { label: "02", title: "Qualification review", body: "Counterparty fit, records, commercial seriousness and compliance requirements are reviewed." },
      { label: "03", title: "Deal-room sequence", body: "Communication, documentation, advisor inputs and decision checkpoints are coordinated." },
      { label: "04", title: "Transaction readiness", body: "Qualified opportunities move toward written terms, operational handover and settlement support." }
    ],
    consultation: {
      title: "OTC exchange consultation path",
      body: "The consultation is private and suitability-based. Ractysh reviews the transaction category, counterparty role, documentation maturity, compliance needs and appropriate next step before any introduction or workflow begins."
    },
    ecosystemConnection: [
      { title: "Connects real estate", body: "Private property, development or asset transactions can be supported with structured documentation." },
      { title: "Connects trade", body: "Large commodity or supply conversations can benefit from verified counterparty workflow." },
      { title: "Connects group value", body: "Architecture and construction evidence can improve confidence around asset-backed opportunities." }
    ],
    visualNodes: ["Intake", "Verify", "Coordinate", "Ready"],
    tags: ["Private deals", "Counterparty workflow", "Documentation", "Deal-room coordination"]
  }
];

export function getEnterprisePillar(key: EnterprisePillarKey) {
  return enterprisePillars.find((pillar) => pillar.key === key);
}
