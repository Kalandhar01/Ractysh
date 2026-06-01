import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const workflowStages = [
  {
    key: "consultation_submitted",
    title: "Consultation Submitted",
    description: "The client request and supporting documents have been received."
  },
  {
    key: "internal_review",
    title: "Internal Review",
    description: "Ractysh reviews scope, service fit, documentation and first-response priority."
  },
  {
    key: "approval_verification",
    title: "Approval & Verification",
    description: "The request is approved, verified and moved into strategy discussion."
  },
  {
    key: "strategy_discussion",
    title: "Strategy Discussion",
    description: "The client and Ractysh team align on commercial, design or execution strategy."
  },
  {
    key: "execution_planning",
    title: "Execution Planning",
    description: "Timeline, operating model, delivery owners and documentation are prepared."
  },
  {
    key: "project_kickoff",
    title: "Project Kickoff",
    description: "The approved engagement moves into execution."
  }
] as const;

const companies = [
  {
    slug: "ractysh-infra",
    name: "Ractysh Infra",
    legalName: "Ractysh Infra Pvt Ltd",
    summary: "Construction execution, structural systems and turnkey delivery.",
    description:
      "Execution-first infrastructure company delivering premium construction, renovation, MEP and turnkey project delivery.",
    metric: "Project delivery",
    brandColor: "#8b1118",
    accentColor: "#5b5650",
    position: 1
  },
  {
    slug: "ractysh-design",
    name: "Ractysh Design",
    legalName: "Ractysh Design Pvt Ltd",
    summary: "Architecture, planning, visualization and premium spatial systems.",
    description:
      "Architecture and design studio creating refined spatial experiences from master planning to cinematic visualization.",
    metric: "Design intelligence",
    brandColor: "#8b1118",
    accentColor: "#b89642",
    position: 2
  },
  {
    slug: "ractysh-import-export",
    name: "Ractysh Import & Export",
    legalName: "Ractysh Import & Export Pvt Ltd",
    summary: "Global import, export and enterprise trade coordination systems.",
    description:
      "Global import, export and enterprise trade coordination systems designed for modern commercial operations.",
    metric: "Global trade",
    brandColor: "#8b1118",
    accentColor: "#d6b45f",
    position: 3
  }
] satisfies Prisma.CompanyDivisionCreateManyInput[];

const serviceSeeds = [
  {
    companySlug: "ractysh-import-export",
    slug: "import-export-operations",
    title: "Import & Export",
    summary: "Enterprise-grade import, export and international logistics coordination for modern business ecosystems.",
    category: "Import & Export Operations",
    href: "/import-export",
    tags: ["Global Trade", "Logistics", "Supply Infrastructure"],
    position: 1
  },
  {
    companySlug: "ractysh-import-export",
    slug: "global-trade-coordination",
    title: "Global Trade Coordination",
    summary: "Cross-border commerce, cargo planning and supplier coordination handled through one enterprise layer.",
    category: "Enterprise Logistics",
    href: "/import-export",
    tags: ["Cross-Border Commerce", "Cargo Routes", "Trade Coordination"],
    position: 2
  },
  {
    companySlug: "ractysh-design",
    slug: "signature-architecture",
    title: "Signature Architecture",
    summary: "Premium residential, commercial and mixed-use design systems with enterprise documentation.",
    category: "Architecture",
    href: "/architecture-design",
    tags: ["Architecture", "Planning", "BIM"],
    position: 1
  },
  {
    companySlug: "ractysh-design",
    slug: "cinematic-visualization",
    title: "Cinematic Visualization",
    summary: "Photorealistic 3D renders, walkthrough-ready concepts and decision-grade presentation outputs.",
    category: "Visualization",
    href: "/3d-visualization",
    tags: ["3D", "Rendering", "Spatial Storytelling"],
    position: 2
  },
  {
    companySlug: "ractysh-infra",
    slug: "turnkey-delivery",
    title: "Turnkey Delivery",
    summary: "Construction, interiors, MEP, sourcing and finishing handled through one accountable channel.",
    category: "Infrastructure",
    href: "/turnkey-projects",
    tags: ["Infra", "Execution", "Turnkey"],
    position: 1
  },
  {
    companySlug: "ractysh-infra",
    slug: "premium-renovation",
    title: "Premium Renovation",
    summary: "High-control renovation and interiors for clients who expect speed, finish and discretion.",
    category: "Infrastructure",
    href: "/interior-design",
    tags: ["Renovation", "Interiors", "MEP"],
    position: 2
  }
];

const projectSeeds = [
  {
    companySlug: "ractysh-import-export",
    slug: "global-trade-coordination-suite",
    title: "Global Trade Coordination Suite",
    category: "Import & Export Operations",
    location: "Global",
    summary: "A structured operating environment for cargo routes, supplier coordination and trade documentation.",
    year: "2026",
    status: "active",
    serviceSlugs: ["import-export-operations", "global-trade-coordination"]
  },
  {
    companySlug: "ractysh-design",
    slug: "luxury-villa-design-system",
    title: "Luxury Villa Design System",
    category: "Architecture",
    location: "South India",
    summary: "Architecture, interiors, landscape and visualization unified into one premium design language.",
    year: "2026",
    status: "concept",
    serviceSlugs: ["signature-architecture", "cinematic-visualization"]
  },
  {
    companySlug: "ractysh-infra",
    slug: "turnkey-commercial-interior",
    title: "Turnkey Commercial Interior",
    category: "Infrastructure",
    location: "India",
    summary: "End-to-end construction, MEP, furnishing and premium finish delivery.",
    year: "2025",
    status: "completed",
    serviceSlugs: ["turnkey-delivery", "premium-renovation"]
  }
] as const;

async function seedSiteConfig() {
  const site = await prisma.siteConfig.upsert({
    where: { key: "default" },
    update: {
      logoText: "Ractysh",
      seoTitle: "Ractysh Group | Infrastructure, Design and Enterprise Operations",
      seoDescription:
        "Ractysh Group unifies infrastructure, architecture, design and global import export operations across one enterprise ecosystem.",
      seoKeywords: ["Ractysh", "architecture", "infrastructure", "import export", "enterprise ecosystem"],
      themeMode: "light",
      themeAccent: "#8b1118",
      footerHeadline: "Ractysh",
      footerDescription: "Infrastructure, design and global import export operations for premium enterprise clients.",
      footerLinks: [
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Contact", href: "/contact" },
        { label: "Book Consultation", href: "/book-consultation" }
      ],
      socialLinks: []
    },
    create: {
      key: "default",
      logoText: "Ractysh",
      seoTitle: "Ractysh Group | Infrastructure, Design and Enterprise Operations",
      seoDescription:
        "Ractysh Group unifies infrastructure, architecture, design and global import export operations across one enterprise ecosystem.",
      seoKeywords: ["Ractysh", "architecture", "infrastructure", "import export", "enterprise ecosystem"],
      themeMode: "light",
      themeAccent: "#8b1118",
      footerHeadline: "Ractysh",
      footerDescription: "Infrastructure, design and global import export operations for premium enterprise clients.",
      footerLinks: [
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Contact", href: "/contact" },
        { label: "Book Consultation", href: "/book-consultation" }
      ],
      socialLinks: []
    }
  });

  await prisma.navItem.deleteMany({ where: { siteConfigId: site.id } });

  const navItems = [
    { label: "Ecosystem", href: "/business", position: 1 },
    { label: "Services", href: "/services", position: 2 },
    { label: "Our Work", href: "/our-projects", position: 3 },
    { label: "About Us", href: "/about", position: 4 },
    { label: "Careers", href: "/careers", position: 5 },
    { label: "Blog", href: "/blog", position: 6 },
    { label: "Book Consultation", href: "/book-consultation", position: 7 },
    { label: "Contact", href: "/contact", position: 8 },
    { label: "Founder", href: "/founder", position: 9 }
  ];

  await prisma.navItem.createMany({
    data: navItems.map((item) => ({ ...item, siteConfigId: site.id })),
    skipDuplicates: true
  });

  await prisma.heroSection.upsert({
    where: { siteConfigId_pageSlug: { siteConfigId: site.id, pageSlug: "home" } },
    update: {
      eyebrow: "Ractysh Group Enterprise Ecosystem",
      headline: "Build, design and coordinate global enterprise operations through one ecosystem",
      subheadline:
        "Infrastructure, architecture, interiors, turnkey delivery and import export operations delivered through one premium operating layer.",
      primaryCta: "Book Consultation",
      primaryHref: "/book-consultation",
      secondaryCta: "Know More",
      secondaryHref: "/about",
      trustLine: "Built for premium clients who need clarity, discretion and accountable delivery."
    },
    create: {
      siteConfigId: site.id,
      pageSlug: "home",
      eyebrow: "Ractysh Group Enterprise Ecosystem",
      headline: "Build, design and coordinate global enterprise operations through one ecosystem",
      subheadline:
        "Infrastructure, architecture, interiors, turnkey delivery and import export operations delivered through one premium operating layer.",
      primaryCta: "Book Consultation",
      primaryHref: "/book-consultation",
      secondaryCta: "Know More",
      secondaryHref: "/about",
      trustLine: "Built for premium clients who need clarity, discretion and accountable delivery."
    }
  });

  const sections = [
    { pageSlug: "home", key: "ecosystem", label: "Enterprise Ecosystem", position: 1, content: { theme: "premium enterprise" } },
    { pageSlug: "about", key: "who-we-are", label: "Who We Are", position: 1, content: { visual: "cinematic architecture" } },
    { pageSlug: "services", key: "core-services", label: "Core Services", position: 1, content: { layout: "bento" } }
  ];

  for (const section of sections) {
    await prisma.pageSection.upsert({
      where: { siteConfigId_pageSlug_key: { siteConfigId: site.id, pageSlug: section.pageSlug, key: section.key } },
      update: {
        label: section.label,
        position: section.position,
        content: section.content
      },
      create: {
        siteConfigId: site.id,
        pageSlug: section.pageSlug,
        key: section.key,
        label: section.label,
        position: section.position,
        content: section.content
      }
    });
  }

  await prisma.contentRevision.deleteMany({
    where: {
      siteConfigId: site.id,
      label: "Initial enterprise ecosystem seed"
    }
  });

  await prisma.contentRevision.create({
    data: {
      siteConfigId: site.id,
      label: "Initial enterprise ecosystem seed",
      published: true,
      content: {
        seededAt: new Date().toISOString(),
        sections: sections.map((section) => section.key)
      }
    }
  });

  return site;
}

async function seedCompanies() {
  const records = new Map<string, { id: string }>();

  for (const company of companies) {
    const record = await prisma.companyDivision.upsert({
      where: { slug: company.slug },
      update: company,
      create: company
    });
    records.set(company.slug, record);
  }

  return records;
}

async function seedServices(companyBySlug: Map<string, { id: string }>) {
  const services = new Map<string, { id: string }>();

  for (const service of serviceSeeds) {
    const company = companyBySlug.get(service.companySlug);
    if (!company) throw new Error(`Missing company for ${service.slug}`);

    const { companySlug: _companySlug, ...data } = service;
    const record = await prisma.serviceOffer.upsert({
      where: { slug: service.slug },
      update: { ...data, companyId: company.id },
      create: { ...data, companyId: company.id }
    });
    services.set(service.slug, record);
  }

  return services;
}

async function seedProjects(companyBySlug: Map<string, { id: string }>, serviceBySlug: Map<string, { id: string }>) {
  for (const seed of projectSeeds) {
    const company = companyBySlug.get(seed.companySlug);
    if (!company) throw new Error(`Missing company for project ${seed.slug}`);

    const project = await prisma.project.upsert({
      where: { slug: seed.slug },
      update: {
        companyId: company.id,
        title: seed.title,
        category: seed.category,
        location: seed.location,
        summary: seed.summary,
        year: seed.year,
        status: seed.status
      },
      create: {
        companyId: company.id,
        slug: seed.slug,
        title: seed.title,
        category: seed.category,
        location: seed.location,
        summary: seed.summary,
        year: seed.year,
        status: seed.status
      }
    });

    for (const serviceSlug of seed.serviceSlugs) {
      const service = serviceBySlug.get(serviceSlug);
      if (!service) throw new Error(`Missing service ${serviceSlug}`);

      await prisma.projectService.upsert({
        where: {
          projectId_serviceOfferId: {
            projectId: project.id,
            serviceOfferId: service.id
          }
        },
        update: {},
        create: {
          projectId: project.id,
          serviceOfferId: service.id
        }
      });
    }
  }
}

async function seedSupportingData(companyBySlug: Map<string, { id: string }>) {
  const founder = await prisma.teamMember.upsert({
    where: { slug: "ractysh-founder" },
    update: {
      name: "Ractysh Founder",
      role: "Founder",
      position: "Founder & Enterprise Lead",
      biography:
        "Founder profile for the initial enterprise database seed. Replace with approved public biography before production launch.",
      leadershipStatement:
        "Ractysh is built around premium execution, operational clarity and durable enterprise systems.",
      isFounder: true,
      positionOrder: 1
    },
    create: {
      slug: "ractysh-founder",
      name: "Ractysh Founder",
      role: "Founder",
      position: "Founder & Enterprise Lead",
      biography:
        "Founder profile for the initial enterprise database seed. Replace with approved public biography before production launch.",
      leadershipStatement:
        "Ractysh is built around premium execution, operational clarity and durable enterprise systems.",
      isFounder: true,
      positionOrder: 1
    }
  });

  await prisma.blogPost.upsert({
    where: { slug: "premium-infrastructure-single-accountable-delivery-system" },
    update: {
      authorId: founder.id,
      title: "Why premium infrastructure needs a single accountable delivery system",
      category: "Infrastructure",
      excerpt: "A practical look at how turnkey models reduce ambiguity in high-value projects.",
      body:
        "Premium delivery depends on clarity, documented ownership and direct execution paths across design, procurement and site operations.",
      status: "published",
      publishedAt: new Date("2026-05-01T00:00:00.000Z"),
      readingTime: "4 min read",
      tags: ["Infrastructure", "Execution", "Turnkey"]
    },
    create: {
      authorId: founder.id,
      slug: "premium-infrastructure-single-accountable-delivery-system",
      title: "Why premium infrastructure needs a single accountable delivery system",
      category: "Infrastructure",
      excerpt: "A practical look at how turnkey models reduce ambiguity in high-value projects.",
      body:
        "Premium delivery depends on clarity, documented ownership and direct execution paths across design, procurement and site operations.",
      status: "published",
      publishedAt: new Date("2026-05-01T00:00:00.000Z"),
      readingTime: "4 min read",
      tags: ["Infrastructure", "Execution", "Turnkey"]
    }
  });

  for (const stat of [
    { scope: "global", label: "Business verticals", value: 3, suffix: "", position: 1 },
    { scope: "global", label: "Service capabilities", value: 21, suffix: "+", position: 2 },
    { scope: "global", label: "Enterprise workflows", value: 12, suffix: "+", position: 3 },
    { scope: "global", label: "Unified delivery model", value: 1, suffix: "", position: 4 }
  ]) {
    await prisma.statistic.upsert({
      where: { scope_label: { scope: stat.scope, label: stat.label } },
      update: stat,
      create: stat
    });
  }

  await prisma.testimonial.deleteMany({ where: { source: "seed" } });
  await prisma.testimonial.createMany({
    data: [
      {
        quote: "Ractysh brings the rare combination of discretion, design taste and operational seriousness.",
        name: "Private Client",
        role: "Real estate investor",
        approved: true,
        source: "seed",
        position: 1
      },
      {
        quote: "The group structure makes it easier to move from concept to execution without losing accountability.",
        name: "Development Partner",
        role: "Commercial project owner",
        approved: true,
        source: "seed",
        position: 2
      }
    ]
  });

  await prisma.location.deleteMany({ where: { name: "Ractysh Enterprise Office" } });
  await prisma.location.create({
    data: {
      name: "Ractysh Enterprise Office",
      address: "Outlook business location, India",
      outlookLocation: "Outlook business location",
      country: "India",
      phone: "+91 00000 00000",
      email: "hello@ractysh.com",
      hours: "Monday to Friday, 10:00 AM - 6:00 PM",
      active: true
    }
  });

  await prisma.legalDocument.upsert({
    where: { slug: "privacy-policy" },
    update: {
      title: "Privacy Policy",
      summary: "How Ractysh handles client information, consultation requests and enterprise communications.",
      body:
        "This initial seed policy is a placeholder for approved legal copy. Replace before production publication.",
      effectiveAt: new Date("2026-05-01T00:00:00.000Z")
    },
    create: {
      slug: "privacy-policy",
      title: "Privacy Policy",
      summary: "How Ractysh handles client information, consultation requests and enterprise communications.",
      body:
        "This initial seed policy is a placeholder for approved legal copy. Replace before production publication.",
      effectiveAt: new Date("2026-05-01T00:00:00.000Z")
    }
  });

  await prisma.partner.upsert({
    where: { name: "Ractysh Enterprise Network" },
    update: {
      description: "Seed partner entry representing the operating network around the Ractysh ecosystem.",
      position: 1
    },
    create: {
      name: "Ractysh Enterprise Network",
      description: "Seed partner entry representing the operating network around the Ractysh ecosystem.",
      position: 1
    }
  });

  const infra = companyBySlug.get("ractysh-infra");
  await prisma.careerJob.upsert({
    where: { slug: "enterprise-project-coordinator" },
    update: {
      companyId: infra?.id,
      title: "Enterprise Project Coordinator",
      location: "India",
      type: "Full-time",
      summary: "Coordinate design, procurement and site execution workflows across premium client engagements.",
      status: "published"
    },
    create: {
      companyId: infra?.id,
      slug: "enterprise-project-coordinator",
      title: "Enterprise Project Coordinator",
      location: "India",
      type: "Full-time",
      summary: "Coordinate design, procurement and site execution workflows across premium client engagements.",
      status: "published"
    }
  });

  await prisma.subscription.upsert({
    where: { email: "briefing@ractysh.com" },
    update: { source: "seed", status: "active" },
    create: { email: "briefing@ractysh.com", source: "seed", status: "active" }
  });

  const adminEmail = process.env.ADMIN_EMAIL || "admin@ractysh.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me-now";
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: "Ractysh Admin",
      role: "admin",
      active: true
    },
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      name: "Ractysh Admin",
      role: "admin",
      active: true
    }
  });
}

async function seedDemoConsultation() {
  const existing = await prisma.consultation.findFirst({
    where: {
      emailAddress: "client.seed@ractysh.com",
      source: "seed"
    }
  });

  if (existing) return;

  const consultation = await prisma.consultation.create({
    data: {
      fullName: "Seed Enterprise Client",
      companyName: "Seed Holdings",
      emailAddress: "client.seed@ractysh.com",
      phoneNumber: "+91 90000 00000",
      serviceType: "Architecture Consultation",
      budgetRange: "Enterprise",
      projectTimeline: "Q3 2026",
      projectDescription: "Initial seeded consultation to verify the workflow tables and relations.",
      preferredConsultationType: "Virtual Meeting",
      source: "seed",
      status: "new",
      currentStageKey: "internal_review"
    }
  });

  const createdStages = await Promise.all(
    workflowStages.map((stage, index) => {
      const isSubmitted = stage.key === "consultation_submitted";
      const isReview = stage.key === "internal_review";
      const status = isSubmitted ? "completed" : isReview ? "active" : "locked";

      return prisma.workflowStage.create({
        data: {
          consultationId: consultation.id,
          key: stage.key,
          title: stage.title,
          description: stage.description,
          position: index + 1,
          status,
          stateLabel: isSubmitted ? "Completed" : isReview ? "Waiting for Approval" : "Locked",
          startedAt: isSubmitted || isReview ? new Date() : undefined,
          unlockedAt: isSubmitted || isReview ? new Date() : undefined,
          completedAt: isSubmitted ? new Date() : undefined
        }
      });
    })
  );

  const submittedStage = createdStages.find((stage) => stage.key === "consultation_submitted");
  const reviewStage = createdStages.find((stage) => stage.key === "internal_review");

  await prisma.workflowLog.create({
    data: {
      consultationId: consultation.id,
      stageId: submittedStage?.id,
      stageKey: "consultation_submitted",
      action: "seeded",
      actorRole: "system",
      note: "Seed consultation inserted to verify Prisma relations."
    }
  });

  await prisma.statusHistory.createMany({
    data: [
      {
        consultationId: consultation.id,
        stageId: submittedStage?.id,
        stageKey: "consultation_submitted",
        toStatus: "completed",
        label: "Consultation Submitted",
        changedBy: "seed"
      },
      {
        consultationId: consultation.id,
        stageId: reviewStage?.id,
        stageKey: "internal_review",
        toStatus: "active",
        label: "Waiting for Approval",
        changedBy: "seed"
      }
    ]
  });
}

async function main() {
  await prisma.$connect();

  const site = await seedSiteConfig();
  const companiesBySlug = await seedCompanies();
  const servicesBySlug = await seedServices(companiesBySlug);
  await seedProjects(companiesBySlug, servicesBySlug);
  await seedSupportingData(companiesBySlug);
  await seedDemoConsultation();

  const counts = await Promise.all([
    prisma.companyDivision.count(),
    prisma.serviceOffer.count(),
    prisma.project.count(),
    prisma.consultation.count()
  ]);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        siteConfig: site.key,
        companies: counts[0],
        services: counts[1],
        projects: counts[2],
        consultations: counts[3]
      },
      null,
      2
    )}\n`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
