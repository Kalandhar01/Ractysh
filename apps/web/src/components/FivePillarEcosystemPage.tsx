"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  DraftingCompass,
  Globe2,
  HardHat,
  Network,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { ServiceRequestCTA } from "@/components/ServiceRequestCTA";
import { enterprisePillars, type EnterprisePillarKey } from "@/data/enterprisePillars";

const ease = [0.22, 1, 0.36, 1] as const;

const iconMap: Record<EnterprisePillarKey, LucideIcon> = {
  architecture: DraftingCompass,
  construction: HardHat,
  "real-estate": Building2,
  "import-export": Globe2,
  "otc-exchange": ShieldCheck
};

const ecosystemFlow = [
  {
    label: "Mandate",
    title: "Client requirement enters the group desk",
    body: "The enterprise desk classifies whether the opportunity is design-led, build-led, asset-led, trade-led or private transaction-led."
  },
  {
    label: "Architecture",
    title: "Spatial and commercial intent becomes a buildable plan",
    body: "Architecture shapes concept, documentation, visuals and technical clarity for the rest of the ecosystem."
  },
  {
    label: "Construction",
    title: "Execution turns approved decisions into delivery",
    body: "Construction coordinates site control, vendors, MEP, quality gates, procurement and premium handover."
  },
  {
    label: "Real Estate",
    title: "Asset value and market readiness are framed",
    body: "Real estate connects property positioning, investor material, sales readiness and development strategy."
  },
  {
    label: "Export & Import",
    title: "Materials, products and trade movement are coordinated",
    body: "Export and import operations support suppliers, cargo routes, documentation and logistics visibility."
  },
  {
    label: "OTC Exchange",
    title: "Qualified private opportunities move through a controlled desk",
    body: "OTC exchange supports private counterparty intake, documentation flow and transaction-readiness coordination."
  }
];

function revealProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.78, delay, ease }
  };
}

export function FivePillarEcosystemPage() {
  const reduceMotion = useReducedMotion();

  return (
    <article className="relative isolate overflow-hidden bg-[#f8f4ea] text-[#211914]">
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#100b09] px-5 pb-20 pt-32 text-white sm:px-6 md:px-8 lg:pt-36">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=84"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-42"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,8,7,0.96),rgba(12,8,7,0.74)_48%,rgba(12,8,7,0.5)),radial-gradient(circle_at_76%_30%,rgba(214,180,95,0.2),transparent_30rem)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(255,247,224,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,247,224,0.08)_1px,transparent_1px)] [background-size:78px_78px] [mask-image:radial-gradient(ellipse_at_52%_35%,black,transparent_78%)]" />

        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] gap-12 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.72, ease }}
              className="text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[#d6b45f]"
            >
              Ractysh Group / Private Enterprise Ecosystem
            </motion.p>
            <h1 className="mt-6 max-w-[54rem] font-display text-[clamp(3.2rem,6.2vw,6.8rem)] font-semibold leading-[0.9] tracking-normal">
              {["Five pillars.", "One operating", "enterprise group."].map((line, index) => (
                <motion.span
                  key={line}
                  initial={reduceMotion ? false : { opacity: 0, y: 46, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: reduceMotion ? 0 : 0.92, delay: 0.08 + index * 0.08, ease }}
                  className={index === 1 ? "block text-[#dfc178]" : "block"}
                >
                  {line}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, delay: 0.36, ease }}
              className="mt-7 max-w-[43rem] text-[1rem] font-medium leading-8 text-[#f6ead2]/78 md:text-[1.08rem]"
            >
              Ractysh Group operates across Architecture, Construction, Real Estate, Export & Import and OTC Exchange
              through one premium brand, one consultation path and one enterprise operating standard.
            </motion.p>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.78, delay: 0.48, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link href="#pillars" className="premium-cta group">
                Explore Pillars
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/book-consultation" className="premium-cta-secondary group">
                Start Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <ServiceRequestCTA showLabel={false} />
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.95, delay: 0.18, ease }}
            className="relative min-h-[35rem] overflow-hidden rounded-[8px] border border-white/14 bg-white/[0.08] p-5 shadow-[0_40px_130px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(214,180,95,0.24),transparent_26rem),linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))]" />
            <div className="absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(255,247,224,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,247,224,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
            <div className="relative z-10 flex min-h-[32rem] flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#d6b45f]">
                    Enterprise Operating Ecosystem
                  </p>
                  <h2 className="mt-3 max-w-[24rem] font-display text-[2.3rem] font-semibold leading-none">
                    Ractysh Group OS
                  </h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#d6b45f]/34 bg-[#090807] text-[#f8e7b9]">
                  <Network className="h-5 w-5" />
                </span>
              </div>

              <div className="relative mx-auto my-7 flex aspect-square w-[min(27rem,78vw)] items-center justify-center">
                <div className="absolute inset-[6%] rounded-full border border-[#d6b45f]/20" />
                <div className="absolute inset-[19%] rounded-full border border-white/12" />
                <div className="absolute inset-[32%] rounded-full border border-[#d6b45f]/16" />
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [-1, 1, -1] }}
                  transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-20 flex h-32 w-32 items-center justify-center rounded-[8px] border border-[#d6b45f]/44 bg-[#fff8e8] text-[#241911] shadow-[0_28px_78px_rgba(0,0,0,0.34)]"
                >
                  <div className="text-center">
                    <Network className="mx-auto h-7 w-7 text-[#8b1118]" strokeWidth={1.7} />
                    <p className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#8a6823]">
                      Group Core
                    </p>
                  </div>
                </motion.div>

                {enterprisePillars.map((pillar, index) => {
                  const Icon = iconMap[pillar.key];
                  const positions = [
                    "left-[33%] top-0",
                    "right-0 top-[28%]",
                    "right-[12%] bottom-[4%]",
                    "left-[8%] bottom-[4%]",
                    "left-0 top-[28%]"
                  ];

                  return (
                    <Link
                      key={pillar.key}
                      href={pillar.href}
                      className={`absolute z-30 ${positions[index]} rounded-[8px] border border-white/12 bg-[#110d0b]/84 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#f7e4b2] shadow-[0_18px_54px_rgba(0,0,0,0.28)] transition duration-300 hover:border-[#d6b45f]/60 hover:bg-[#d6b45f] hover:text-[#1f1712]`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        {pillar.shortTitle}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 overflow-hidden rounded-[8px] border border-white/10 bg-[#090807]/54">
                {[
                  { label: "Pillars", value: "5" },
                  { label: "Brand layer", value: "Unified" },
                  { label: "Consultation", value: "Routed" }
                ].map((metric) => (
                  <div key={metric.label} className="border-r border-white/10 px-3 py-4 last:border-r-0">
                    <p className="text-[1.05rem] font-semibold leading-none text-white">{metric.value}</p>
                    <p className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[#d6b45f]/82">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="pillars" className="relative isolate px-5 py-20 sm:px-6 md:px-8 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(214,180,95,0.15),transparent_30rem),linear-gradient(180deg,#fffaf0_0%,#f8f4ea_100%)]" />
        <div className="relative mx-auto max-w-[1260px]">
          <motion.div {...revealProps()} className="max-w-[50rem]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">Core Pillars</p>
            <h2 className="mt-5 font-display text-[2.55rem] font-semibold leading-[1] tracking-normal md:text-[4.2rem]">
              A diversified private enterprise group, not a single-service company.
            </h2>
            <p className="mt-5 max-w-[43rem] text-[1rem] leading-8 text-[#62564d]">
              Each pillar has its own landing experience, capabilities, workflow and consultation path, while the group
              connects them into one premium ecosystem for complex enterprise requirements.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {enterprisePillars.map((pillar, index) => {
              const Icon = iconMap[pillar.key];

              return (
                <motion.article
                  key={pillar.key}
                  {...revealProps(index * 0.04)}
                  className="group relative min-h-[25rem] overflow-hidden rounded-[8px] border border-[#d9c79f]/62 bg-white/78 shadow-[0_20px_60px_rgba(80,52,24,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#cba757] hover:bg-white"
                >
                  <img src={pillar.image} alt="" className="absolute inset-x-0 top-0 h-36 w-full object-cover opacity-28 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-38" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,240,0.38),rgba(255,250,240,0.96)_38%,rgba(255,255,255,0.92))]" />
                  <div className="relative z-10 flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#dfc995] bg-[#fffaf0] text-[#8b1118]">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <span className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#9a7428]">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#9a7428]">
                        {pillar.category}
                      </p>
                      <h3 className="mt-3 font-display text-[1.65rem] font-semibold leading-tight text-[#211914]">
                        {pillar.shortTitle}
                      </h3>
                      <p className="mt-4 text-[0.88rem] leading-6 text-[#62564d]">{pillar.summary}</p>
                      <Link
                        href={pillar.href}
                        className="mt-6 inline-flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.13em] text-[#8b1118] transition duration-300 group-hover:text-[#9a7428]"
                      >
                        Open Division
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#110d0b] px-5 py-20 text-[#fff7ea] sm:px-6 md:px-8 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(214,180,95,0.18),transparent_28rem),radial-gradient(circle_at_80%_74%,rgba(139,17,24,0.2),transparent_30rem)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(255,247,224,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,247,224,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="relative mx-auto grid max-w-[1260px] gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <motion.div {...revealProps()} className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#d6b45f]">Operating Ecosystem</p>
            <h2 className="mt-5 font-display text-[2.55rem] font-semibold leading-[1] tracking-normal md:text-[4.1rem]">
              How the five pillars work together.
            </h2>
            <p className="mt-6 max-w-[35rem] text-[1rem] leading-8 text-[#efe4cf]/68">
              The group model lets Ractysh route one requirement through specialized divisions without losing brand
              control, documentation discipline or executive clarity.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute bottom-0 left-[1.05rem] top-0 w-px bg-[#fff7ea]/12" />
            <div className="space-y-5">
              {ecosystemFlow.map((step, index) => (
                <motion.article key={step.label} {...revealProps(index * 0.035)} className="relative pl-12">
                  <div className="absolute left-0 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#d6b45f]/44 bg-[#17100e] text-[0.66rem] font-semibold text-[#d8bd79]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="rounded-[8px] border border-[#fff7ea]/12 bg-[#fff7ea]/7 p-5 shadow-[0_24px_72px_rgba(0,0,0,0.22)]">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#d6b45f]">{step.label}</p>
                    <h3 className="mt-3 font-display text-[1.45rem] font-semibold leading-tight">{step.title}</h3>
                    <p className="mt-3 text-[0.96rem] leading-7 text-[#efe4cf]/66">{step.body}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-20 sm:px-6 md:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1260px] gap-6 lg:grid-cols-[1fr_1fr]">
          <motion.div
            {...revealProps()}
            className="rounded-[8px] border border-[#d8c18a]/70 bg-[#fffaf0]/82 p-6 shadow-[0_24px_70px_rgba(80,52,24,0.08)] md:p-8"
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">Consultation Routing</p>
            <h2 className="mt-4 font-display text-[2.25rem] font-semibold leading-none md:text-[3.2rem]">
              One intake, five possible operating lanes.
            </h2>
            <p className="mt-5 text-[1rem] leading-8 text-[#62564d]">
              The consultation path starts at group level, then routes the mandate to the right pillar or a combined
              stack of pillars. A real estate project may need architecture and construction. A construction program may
              need export-import sourcing. A private asset conversation may require OTC exchange coordination.
            </p>
            <Link href="/book-consultation" className="premium-cta group mt-8">
              Book Group Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.div
            {...revealProps(0.06)}
            className="rounded-[8px] border border-[#211914]/10 bg-[#17110e] p-6 text-white shadow-[0_28px_90px_rgba(25,18,12,0.2)] md:p-8"
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#d6b45f]">Enterprise Value</p>
            <h2 className="mt-4 font-display text-[2.25rem] font-semibold leading-none md:text-[3.2rem]">
              Connected divisions reduce friction.
            </h2>
            <div className="mt-7 grid gap-3">
              {[
                "A single premium brand for diverse business conversations.",
                "Specialized division pages with independent identity and capability depth.",
                "A connected workflow across design, delivery, assets, trade and private exchange.",
                "Clearer storytelling for clients, investors, counterparties and development partners."
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-[8px] border border-white/10 bg-white/[0.06] p-4">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#d6b45f]" />
                  <p className="text-[0.94rem] leading-6 text-[#efe4cf]/72">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </article>
  );
}
