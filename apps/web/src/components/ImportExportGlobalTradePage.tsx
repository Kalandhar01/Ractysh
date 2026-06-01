"use client";

import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  ArrowRight,
  FileCheck2,
  Globe2,
  Network,
  PackageCheck,
  RadioTower,
  Route as RouteIcon,
  ShieldCheck,
  Ship,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { ServiceRequestCTA } from "@/components/ServiceRequestCTA";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

interface OperationSection {
  eyebrow: string;
  title: string;
  body: string;
  Icon: LucideIcon;
  visual: "coordination" | "logistics" | "compliance" | "supply";
  points: string[];
}

const operationSections: OperationSection[] = [
  {
    eyebrow: "International Coordination",
    title: "Regional teams, vendors and buyers aligned through one operating cadence.",
    body: "Coordinate sourcing, dispatch windows, document readiness and commercial updates without losing the calm control expected in enterprise trade.",
    Icon: Network,
    visual: "coordination",
    points: ["Origin to destination planning", "Vendor and buyer alignment", "Lane status rhythm"]
  },
  {
    eyebrow: "Enterprise Logistics",
    title: "Movement planning built for premium cargo confidence.",
    body: "Structure freight, container visibility, port coordination and handover checkpoints around dependable execution rather than fragmented updates.",
    Icon: Ship,
    visual: "logistics",
    points: ["Ocean and inland movement", "Dispatch checkpointing", "Operational exception review"]
  },
  {
    eyebrow: "Trade Compliance",
    title: "Documentation clarity before cargo reaches a critical point.",
    body: "Prepare the operational layer around invoices, packing lists, certificates and trade requirements so decisions stay clean and accountable.",
    Icon: FileCheck2,
    visual: "compliance",
    points: ["Document readiness", "Certificate coordination", "Compliance status control"]
  },
  {
    eyebrow: "Global Supply Systems",
    title: "A calmer operating layer for complex international supply flows.",
    body: "Give enterprise teams a shared view of routes, partners, risks and updates across modern import-export workflows.",
    Icon: PackageCheck,
    visual: "supply",
    points: ["Supply network mapping", "Partner status visibility", "Executive reporting cadence"]
  }
];

const heroNodes = [
  { label: "EU Hub", className: "left-[16%] top-[38%]" },
  { label: "GCC", className: "left-[52%] top-[49%]" },
  { label: "APAC", className: "left-[73%] top-[43%]" },
  { label: "Americas", className: "left-[25%] top-[58%]" }
];

const syncRows = [
  { label: "Origin readiness", value: "Synced" },
  { label: "Trade documents", value: "Verified" },
  { label: "Route operations", value: "Live" }
];

const globalLanes = [
  { origin: "Rotterdam", destination: "Dubai", status: "Coordinated" },
  { origin: "Mumbai", destination: "Singapore", status: "In review" },
  { origin: "Houston", destination: "Jebel Ali", status: "Cleared" }
];

export function ImportExportGlobalTradePage() {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.to("[data-trade-bg]", {
        backgroundPosition: "62% 14%, 18% 70%, 50% 50%",
        duration: 26,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to("[data-trade-grid]", {
        x: -16,
        y: 18,
        duration: 28,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to("[data-trade-parallax]", {
        y: -34,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-trade-hero]",
          start: "top top",
          end: "bottom top",
          scrub: 1.35
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-trade-reveal]").forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            delay: Math.min(index * 0.025, 0.16),
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 84%",
              once: true
            }
          }
        );
      });
    }, root);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [lenis]);

  const handleExploreOperations = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();

      if (lenis) {
        lenis.scrollTo("#trade-operations", { offset: -74 });
        return;
      }

      document.getElementById("trade-operations")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [lenis]
  );

  return (
    <article ref={rootRef} className="trade-page relative isolate overflow-hidden bg-[#F8F6F1] text-[#1f1b16]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          data-trade-bg
          className="absolute -inset-x-20 -top-28 bottom-0 opacity-95"
          style={{
            background:
              "radial-gradient(ellipse at 68% 18%, rgba(198,164,91,0.18), transparent 34rem), radial-gradient(ellipse at 18% 68%, rgba(255,253,252,0.86), transparent 32rem), linear-gradient(135deg, #FFFDFC 0%, #F8F6F1 44%, #F5F2EB 100%)",
            backgroundSize: "120% 120%, 110% 110%, 100% 100%",
            backgroundPosition: "52% 12%, 14% 72%, 50% 50%"
          }}
        />
        <div data-trade-grid className="trade-world-grid absolute inset-0 opacity-[0.28]" />
      </div>

      <HeroSection onExploreOperations={handleExploreOperations} />
      <OperationsSection />
      <GlobalMapSection />
      <FinalCtaSection />

      <style>{`
        .trade-world-grid {
          background-image:
            linear-gradient(rgba(31, 27, 22, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 27, 22, 0.04) 1px, transparent 1px),
            radial-gradient(circle at center, rgba(31, 27, 22, 0.075) 1px, transparent 1.5px);
          background-size: 86px 86px, 86px 86px, 34px 34px;
          mask-image: radial-gradient(ellipse at 50% 20%, black 0%, rgba(0, 0, 0, 0.78) 48%, transparent 88%);
        }

        .trade-hero-visual::before {
          content: "";
          position: absolute;
          inset: 0;
          border: 1px solid rgba(31, 27, 22, 0.11);
          border-radius: 8px;
          pointer-events: none;
        }

        .trade-hero-visual::after {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: 7px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.16) 46%, rgba(198, 164, 91, 0.09)),
            radial-gradient(ellipse at 64% 38%, rgba(198, 164, 91, 0.14), transparent 24rem);
          pointer-events: none;
        }

        .trade-continent {
          fill: rgba(31, 27, 22, 0.115);
          stroke: rgba(31, 27, 22, 0.16);
          stroke-width: 1;
        }

        .trade-map-dark .trade-continent {
          fill: rgba(255, 253, 252, 0.15);
          stroke: rgba(255, 253, 252, 0.2);
        }

        .trade-map-line {
          fill: none;
          stroke: rgba(31, 27, 22, 0.09);
          stroke-width: 1;
        }

        .trade-map-dark .trade-map-line {
          stroke: rgba(255, 253, 252, 0.12);
        }

        .trade-route-base,
        .trade-route-line {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .trade-route-base {
          stroke: rgba(31, 27, 22, 0.12);
          stroke-width: 1.15;
        }

        .trade-map-dark .trade-route-base {
          stroke: rgba(255, 253, 252, 0.15);
        }

        .trade-route-line {
          stroke: rgba(142, 111, 48, 0.62);
          stroke-width: 1.6;
          stroke-dasharray: 5 11;
          animation: trade-route-flow 7s linear infinite;
        }

        .trade-map-dark .trade-route-line {
          stroke: rgba(218, 184, 111, 0.82);
        }

        .trade-moving-signal {
          filter: drop-shadow(0 0 10px rgba(198, 164, 91, 0.46));
        }

        .trade-node-pin {
          animation: trade-node-pulse 3.4s ease-in-out infinite;
        }

        .trade-sync-line::after {
          content: "";
          position: absolute;
          inset-block: 0;
          left: 0;
          width: 34%;
          background: linear-gradient(90deg, transparent, rgba(198, 164, 91, 0.56), transparent);
          transform: translateX(-115%);
          animation: trade-sync-flow 4.8s ease-in-out infinite;
        }

        .trade-section-visual {
          background:
            linear-gradient(135deg, rgba(255, 253, 252, 0.8), rgba(245, 242, 235, 0.6)),
            radial-gradient(ellipse at 80% 18%, rgba(198, 164, 91, 0.14), transparent 20rem);
        }

        .trade-section-visual::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(31, 27, 22, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 27, 22, 0.04) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(120deg, transparent, black 22%, black 74%, transparent);
          pointer-events: none;
        }

        .trade-mini-flow {
          animation: trade-mini-flow 4.6s ease-in-out infinite;
        }

        .trade-global-map {
          background:
            radial-gradient(ellipse at 52% 48%, rgba(198, 164, 91, 0.16), transparent 28rem),
            linear-gradient(135deg, #12100d 0%, #191612 58%, #0f0e0c 100%);
        }

        @keyframes trade-route-flow {
          to {
            stroke-dashoffset: -96;
          }
        }

        @keyframes trade-node-pulse {
          0%,
          100% {
            opacity: 0.64;
            transform: scale(0.92);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes trade-sync-flow {
          0% {
            transform: translateX(-115%);
            opacity: 0;
          }

          20%,
          70% {
            opacity: 1;
          }

          100% {
            transform: translateX(305%);
            opacity: 0;
          }
        }

        @keyframes trade-mini-flow {
          0%,
          100% {
            opacity: 0.45;
            transform: translate3d(-6px, 0, 0);
          }

          50% {
            opacity: 1;
            transform: translate3d(8px, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trade-route-line,
          .trade-node-pin,
          .trade-sync-line::after,
          .trade-mini-flow {
            animation: none !important;
          }
        }
      `}</style>
    </article>
  );
}

function HeroSection({ onExploreOperations }: { onExploreOperations: (event: ReactMouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <section
      id="import-export-hero"
      data-trade-hero
      className="relative z-10 flex min-h-[100svh] items-center px-5 pb-16 pt-32 sm:px-6 md:px-8 lg:pt-28"
    >
      <div className="mx-auto grid w-full max-w-[1240px] gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(30rem,1.1fr)] lg:items-center xl:gap-20">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease }}
            className="text-[12px] font-semibold uppercase leading-none text-[#7d6b46] tracking-[0]"
          >
            GLOBAL TRADE OPERATIONS
          </motion.p>

          <h1
            aria-label="Connecting global trade with premium execution."
            className="mt-6 max-w-[720px] font-display text-[46px] font-semibold leading-[1] text-[#191510] tracking-[0] sm:text-[64px] lg:text-[76px] xl:text-[86px]"
          >
            {["Connecting global", "trade with premium", "execution."].map((line, index) => (
              <motion.span
                key={line}
                aria-hidden="true"
                initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.08 + index * 0.1, ease }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.38, ease }}
            className="mt-7 max-w-[620px] text-[17px] font-medium leading-8 text-[#51483c] tracking-[0] sm:text-[18px]"
          >
            Import, export and enterprise coordination systems designed for reliable international operations and modern logistics workflows.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.52, ease }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/book-consultation"
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] border border-[#11100e] bg-[#11100e] px-5 text-[15px] font-semibold text-[#FFFDFC] shadow-[0_18px_48px_rgba(17,16,14,0.18),inset_0_1px_0_rgba(255,255,255,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8e6f30]"
            >
              Start Trade Inquiry
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.2} />
            </Link>
            <ServiceRequestCTA showLabel={false} />
            <a
              href="#trade-operations"
              onClick={onExploreOperations}
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] border border-white/70 bg-[#FFFDFC]/58 px-5 text-[15px] font-semibold text-[#1f1b16] shadow-[0_16px_44px_rgba(78,67,49,0.08),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#d6c8ac] hover:bg-white/74 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8e6f30]"
            >
              Explore Operations
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.2} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.62, ease }}
            className="mt-12 grid max-w-[560px] gap-3 border-y border-[#1f1b16]/10 py-5 sm:grid-cols-3"
          >
            {["Ports coordinated", "Docs reviewed", "Routes monitored"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[13px] font-semibold text-[#5b5143] tracking-[0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8e6f30]" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        <HeroTradeVisual />
      </div>
    </section>
  );
}

function HeroTradeVisual() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { damping: 36, stiffness: 110, mass: 0.75 });
  const smoothY = useSpring(pointerY, { damping: 36, stiffness: 110, mass: 0.75 });
  const visualX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const visualY = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [1.5, -1.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-2, 2]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      data-trade-parallax
      initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1, delay: 0.26, ease }}
      className="relative mx-auto w-full max-w-[680px] lg:max-w-none"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
        className="trade-hero-visual relative min-h-[440px] overflow-hidden rounded-[8px] bg-[#F5F2EB]/80 shadow-[0_44px_120px_rgba(72,61,43,0.14)] sm:min-h-[550px] lg:min-h-[620px]"
        style={
          reduceMotion
            ? undefined
            : {
                x: visualX,
                y: visualY,
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
              }
        }
      >
        <div className="absolute inset-0 z-10">
          <VectorWorldMap idPrefix="hero-trade" variant="light" className="absolute inset-x-3 top-14 h-[68%] w-[calc(100%-1.5rem)] sm:inset-x-8 sm:top-20 sm:w-[calc(100%-4rem)]" />

          {heroNodes.map((node, index) => (
            <div
              key={node.label}
              className={`absolute z-20 flex items-center gap-2 text-[11px] font-semibold text-[#34302a] tracking-[0] ${node.className}`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <span className="trade-node-pin relative h-2.5 w-2.5 rounded-full bg-[#11100e] shadow-[0_0_0_5px_rgba(198,164,91,0.14)]" />
              <span className="hidden rounded-[6px] border border-white/70 bg-[#FFFDFC]/70 px-2 py-1 shadow-[0_8px_22px_rgba(31,27,22,0.08)] backdrop-blur-md sm:inline">
                {node.label}
              </span>
            </div>
          ))}

          <div className="absolute left-4 top-4 z-30 rounded-[8px] border border-white/70 bg-[#FFFDFC]/66 px-3 py-3 shadow-[0_12px_32px_rgba(31,27,22,0.08)] backdrop-blur-xl sm:left-7 sm:top-7">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#8e6f30]" strokeWidth={2.1} />
              <p className="text-[11px] font-semibold uppercase text-[#6e604c] tracking-[0]">Operational Sync</p>
            </div>
            <p className="mt-1 font-display text-[22px] font-semibold leading-none text-[#181512] tracking-[0]">Live lanes</p>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-30 rounded-[8px] border border-white/68 bg-[#FFFDFC]/72 p-4 shadow-[0_18px_46px_rgba(31,27,22,0.1)] backdrop-blur-xl sm:bottom-7 sm:left-auto sm:right-7 sm:w-[330px]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[12px] font-semibold text-[#26221d] tracking-[0]">Trade control</p>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6d614f] tracking-[0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6e7d5e]" />
                Synced
              </span>
            </div>
            <div className="space-y-3">
              {syncRows.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between gap-3 text-[12px] font-medium text-[#5c5143] tracking-[0]">
                    <span>{row.label}</span>
                    <span className="text-[#1f1b16]">{row.value}</span>
                  </div>
                  <div className="trade-sync-line relative mt-2 h-px overflow-hidden bg-[#1f1b16]/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OperationsSection() {
  return (
    <section id="trade-operations" className="relative z-10 px-5 py-20 sm:px-6 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div data-trade-reveal className="max-w-[760px]">
          <p className="text-[12px] font-semibold uppercase text-[#7d6b46] tracking-[0]">Operational Layers</p>
          <h2 className="mt-5 font-display text-[34px] font-semibold leading-[1.05] text-[#191510] tracking-[0] sm:text-[46px] lg:text-[58px]">
            Simple systems for serious international trade.
          </h2>
          <p className="mt-5 max-w-[650px] text-[16px] leading-8 text-[#5f5548] tracking-[0] sm:text-[17px]">
            A premium import-export workflow should feel measured, structured and accountable from inquiry to handover.
          </p>
        </div>

        <div className="mt-16 space-y-20 lg:space-y-28">
          {operationSections.map((section, index) => (
            <OperationalSection key={section.eyebrow} section={section} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OperationalSection({ section, index }: { section: OperationSection; index: number }) {
  const Icon = section.Icon;
  const reverse = index % 2 === 1;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div data-trade-reveal className={reverse ? "lg:order-2" : ""}>
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#d7ccb8] bg-[#FFFDFC]/70 text-[#8e6f30] shadow-[0_12px_28px_rgba(31,27,22,0.07)]">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </div>
        <p className="mt-7 text-[12px] font-semibold uppercase text-[#7d6b46] tracking-[0]">{section.eyebrow}</p>
        <h3 className="mt-4 max-w-[560px] font-display text-[28px] font-semibold leading-[1.08] text-[#1b1712] tracking-[0] sm:text-[36px] lg:text-[42px]">
          {section.title}
        </h3>
        <p className="mt-5 max-w-[570px] text-[16px] leading-8 text-[#62584a] tracking-[0]">{section.body}</p>
        <div className="mt-8 space-y-3">
          {section.points.map((point) => (
            <div key={point} className="flex items-center gap-3 text-[14px] font-semibold text-[#3c352c] tracking-[0]">
              <ShieldCheck className="h-4 w-4 text-[#8e6f30]" strokeWidth={2} />
              {point}
            </div>
          ))}
        </div>
      </div>

      <SectionScene section={section} className={reverse ? "lg:order-1" : ""} />
    </div>
  );
}

function SectionScene({ section, className = "" }: { section: OperationSection; className?: string }) {
  return (
    <div
      data-trade-reveal
      className={`trade-section-visual relative min-h-[360px] overflow-hidden rounded-[8px] border border-[#dfd5c4] shadow-[0_26px_80px_rgba(74,63,45,0.1)] sm:min-h-[430px] ${className}`}
    >
      <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-between p-5 sm:min-h-[430px] sm:p-7">
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="text-[12px] font-semibold uppercase text-[#7d6b46] tracking-[0]">{section.eyebrow}</p>
            <p className="mt-2 font-display text-[24px] font-semibold leading-none text-[#17130f] tracking-[0]">Trade desk</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-[8px] border border-[#d8cdbb] bg-[#FFFDFC]/68 px-3 py-2 text-[12px] font-semibold text-[#4f4538] tracking-[0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6e7d5e]" />
            Active
          </span>
        </div>

        <div className="mx-auto my-8 w-full max-w-[440px]">
          {section.visual === "coordination" ? <CoordinationScene /> : null}
          {section.visual === "logistics" ? <LogisticsScene /> : null}
          {section.visual === "compliance" ? <ComplianceScene /> : null}
          {section.visual === "supply" ? <SupplyScene /> : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {section.points.map((point) => (
            <div key={point} className="rounded-[8px] border border-[#ded4c2] bg-[#FFFDFC]/58 p-3 backdrop-blur-md">
              <p className="text-[12px] font-semibold leading-5 text-[#51483c] tracking-[0]">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoordinationScene() {
  return (
    <div className="relative h-[190px]">
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[8px] border border-[#bda76f]/45 bg-[#FFFDFC]/72 p-4 shadow-[0_16px_40px_rgba(31,27,22,0.08)]">
        <Globe2 className="h-6 w-6 text-[#8e6f30]" strokeWidth={1.8} />
        <p className="mt-3 text-[11px] font-semibold text-[#393229] tracking-[0]">Global desk</p>
      </div>
      {[
        "left-[4%] top-[10%]",
        "right-[4%] top-[16%]",
        "left-[11%] bottom-[12%]",
        "right-[12%] bottom-[8%]"
      ].map((position, index) => (
        <div key={position} className={`absolute ${position}`}>
          <div className="trade-node-pin h-3 w-3 rounded-full bg-[#15120f] shadow-[0_0_0_8px_rgba(198,164,91,0.12)]" style={{ animationDelay: `${index * 0.2}s` }} />
        </div>
      ))}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 440 190" aria-hidden="true">
        <path className="trade-route-base" d="M70 38 C150 58 160 90 220 94" />
        <path className="trade-route-line" d="M70 38 C150 58 160 90 220 94" />
        <path className="trade-route-base" d="M360 48 C286 62 276 96 220 94" />
        <path className="trade-route-line" d="M360 48 C286 62 276 96 220 94" />
        <path className="trade-route-base" d="M82 154 C144 126 170 104 220 94" />
        <path className="trade-route-line" d="M82 154 C144 126 170 104 220 94" />
        <path className="trade-route-base" d="M354 158 C292 130 270 104 220 94" />
        <path className="trade-route-line" d="M354 158 C292 130 270 104 220 94" />
      </svg>
    </div>
  );
}

function LogisticsScene() {
  return (
    <div className="relative h-[190px] overflow-hidden rounded-[8px] border border-[#d8cdbb] bg-[#f7f4ee]/72 p-5">
      <div className="absolute inset-x-5 top-12 h-px bg-[#1f1b16]/12" />
      <div className="absolute inset-x-5 top-24 h-px bg-[#1f1b16]/12" />
      <div className="absolute inset-x-5 top-36 h-px bg-[#1f1b16]/12" />
      <div className="trade-mini-flow absolute left-8 top-[78px] flex items-center gap-3">
        <Ship className="h-9 w-9 text-[#181512]" strokeWidth={1.7} />
        <div className="h-px w-32 bg-gradient-to-r from-[#8e6f30] to-transparent" />
      </div>
      <div className="absolute bottom-5 right-5 grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className="h-7 w-10 rounded-[4px] border border-[#cdbf9d] bg-[#FFFDFC]/72 shadow-[0_8px_18px_rgba(31,27,22,0.06)]" />
        ))}
      </div>
      <div className="absolute left-5 top-5 flex items-center gap-2 text-[11px] font-semibold text-[#5f5548] tracking-[0]">
        <RouteIcon className="h-4 w-4 text-[#8e6f30]" strokeWidth={1.9} />
        Port to destination
      </div>
    </div>
  );
}

function ComplianceScene() {
  return (
    <div className="grid h-[190px] grid-cols-[1fr_0.8fr] gap-4">
      <div className="space-y-3">
        {["Invoice", "Packing list", "Certificate"].map((item, index) => (
          <div
            key={item}
            className="rounded-[8px] border border-[#d8cdbb] bg-[#FFFDFC]/72 p-4 shadow-[0_12px_28px_rgba(31,27,22,0.06)]"
            style={{ transform: `translateX(${index * 8}px)` }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-semibold text-[#3e372e] tracking-[0]">{item}</span>
              <ShieldCheck className="h-4 w-4 text-[#6e7d5e]" strokeWidth={2} />
            </div>
            <div className="mt-3 h-px w-full bg-[#1f1b16]/10" />
          </div>
        ))}
      </div>
      <div className="relative rounded-[8px] border border-[#bda76f]/42 bg-[#17130f] p-5 text-[#FFFDFC] shadow-[0_18px_46px_rgba(31,27,22,0.14)]">
        <FileCheck2 className="h-7 w-7 text-[#d9bd77]" strokeWidth={1.8} />
        <p className="mt-5 font-display text-[22px] font-semibold leading-none tracking-[0]">Clear</p>
        <p className="mt-2 text-[11px] font-medium leading-5 text-[#e8decb]/76 tracking-[0]">Documents aligned before dispatch.</p>
      </div>
    </div>
  );
}

function SupplyScene() {
  return (
    <div className="relative h-[190px] rounded-[8px] border border-[#d8cdbb] bg-[#FFFDFC]/62 p-5">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 440 190" aria-hidden="true">
        <path className="trade-route-base" d="M60 136 C112 72 178 64 218 96 C266 134 314 116 378 54" />
        <path className="trade-route-line" d="M60 136 C112 72 178 64 218 96 C266 134 314 116 378 54" />
        <path className="trade-route-base" d="M72 52 C126 110 184 124 238 92 C292 60 328 88 370 132" />
        <path className="trade-route-line" d="M72 52 C126 110 184 124 238 92 C292 60 328 88 370 132" />
      </svg>
      {[
        "left-[12%] top-[65%]",
        "left-[29%] top-[32%]",
        "left-[50%] top-[47%]",
        "left-[68%] top-[55%]",
        "left-[83%] top-[24%]"
      ].map((position, index) => (
        <span
          key={position}
          className={`trade-node-pin absolute h-3 w-3 rounded-full bg-[#15120f] shadow-[0_0_0_8px_rgba(198,164,91,0.12)] ${position}`}
          style={{ animationDelay: `${index * 0.2}s` }}
        />
      ))}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-[8px] border border-[#d8cdbb] bg-[#FFFDFC]/72 px-4 py-3 text-[12px] font-semibold text-[#4d4337] tracking-[0] backdrop-blur-md">
        <span>Network health</span>
        <span className="text-[#6e7d5e]">Stable</span>
      </div>
    </div>
  );
}

function GlobalMapSection() {
  return (
    <section className="relative z-10 overflow-hidden bg-[#11100e] px-5 py-20 text-[#FFFDFC] sm:px-6 md:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="trade-global-map absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,16,14,0)_0%,rgba(17,16,14,0.55)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px]">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div data-trade-reveal>
            <p className="text-[12px] font-semibold uppercase text-[#d9bd77] tracking-[0]">Global Map</p>
            <h2 className="mt-5 max-w-[570px] font-display text-[34px] font-semibold leading-[1.05] text-[#FFFDFC] tracking-[0] sm:text-[46px] lg:text-[58px]">
              Trade routes that feel visible, calm and controlled.
            </h2>
          </div>
          <p data-trade-reveal className="max-w-[540px] text-[16px] leading-8 text-[#e8decb]/72 tracking-[0] lg:justify-self-end">
            A minimal operating map for leaders who need confidence across origin, shipping lane, compliance and delivery milestones.
          </p>
        </div>

        <div data-trade-reveal className="mt-12 overflow-hidden rounded-[8px] border border-[#FFFDFC]/12 bg-[#FFFDFC]/[0.035] p-4 shadow-[0_38px_120px_rgba(0,0,0,0.28)] sm:p-7">
          <div className="relative min-h-[420px] overflow-hidden rounded-[8px] border border-[#FFFDFC]/10 bg-[#15130f] sm:min-h-[560px]">
            <VectorWorldMap idPrefix="global-trade" variant="dark" className="absolute inset-0 h-full w-full p-4 sm:p-8" />

            <div className="absolute left-4 top-4 rounded-[8px] border border-[#FFFDFC]/12 bg-[#14110e]/72 p-4 backdrop-blur-xl sm:left-7 sm:top-7">
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase text-[#d9bd77] tracking-[0]">
                <RadioTower className="h-4 w-4" strokeWidth={1.9} />
                Route Signal
              </div>
              <p className="mt-2 font-display text-[26px] font-semibold leading-none tracking-[0]">Global operations</p>
            </div>

            <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:bottom-7 sm:left-7 sm:right-7 sm:grid-cols-3">
              {globalLanes.map((lane) => (
                <div key={`${lane.origin}-${lane.destination}`} className="rounded-[8px] border border-[#FFFDFC]/12 bg-[#FFFDFC]/[0.06] p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase text-[#d9bd77] tracking-[0]">
                    <span>{lane.origin}</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>{lane.destination}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 text-[13px] font-semibold text-[#FFFDFC] tracking-[0]">
                    <span>{lane.status}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d9bd77] shadow-[0_0_14px_rgba(217,189,119,0.45)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="relative z-10 px-5 py-20 sm:px-6 md:px-8 lg:py-28">
      <div data-trade-reveal className="mx-auto max-w-[860px] text-center">
        <p className="text-[12px] font-semibold uppercase text-[#7d6b46] tracking-[0]">Enterprise Trade Inquiry</p>
        <h2 className="mx-auto mt-5 max-w-[760px] font-display text-[36px] font-semibold leading-[1.05] text-[#191510] tracking-[0] sm:text-[50px] lg:text-[64px]">
          Expand enterprise operations globally.
        </h2>
        <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-8 text-[#62584a] tracking-[0] sm:text-[17px]">
          Start a structured conversation for import, export, sourcing, logistics and compliance coordination.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/book-consultation"
            className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] border border-[#11100e] bg-[#11100e] px-5 text-[15px] font-semibold text-[#FFFDFC] shadow-[0_18px_48px_rgba(17,16,14,0.18),inset_0_1px_0_rgba(255,255,255,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8e6f30]"
          >
            Start Trade Inquiry
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function VectorWorldMap({
  idPrefix,
  variant,
  className
}: {
  idPrefix: string;
  variant: "light" | "dark";
  className?: string;
}) {
  const signalColor = variant === "dark" ? "#d9bd77" : "#8e6f30";

  const routes = [
    { id: "a", d: "M134 244 C244 122 382 148 464 222 C548 300 640 236 766 168", begin: "0s" },
    { id: "b", d: "M178 318 C292 258 392 280 500 248 C596 218 688 262 786 332", begin: "1.4s" },
    { id: "c", d: "M286 182 C390 118 488 130 548 188 C626 264 704 246 812 214", begin: "2.3s" },
    { id: "d", d: "M118 214 C242 234 308 342 430 352 C560 364 644 306 748 386", begin: "3s" }
  ];

  return (
    <svg className={`${variant === "dark" ? "trade-map-dark" : ""} ${className || ""}`} viewBox="0 0 900 520" role="img" aria-label="Animated global trade map">
      <defs>
        <radialGradient id={`${idPrefix}-signal`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={signalColor} stopOpacity="0.98" />
          <stop offset="100%" stopColor={signalColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      <path className="trade-map-line" d="M74 260 H826" />
      <path className="trade-map-line" d="M450 54 V466" />
      <path className="trade-map-line" d="M128 160 C300 118 598 118 772 160" />
      <path className="trade-map-line" d="M128 360 C300 404 598 404 772 360" />
      <path className="trade-map-line" d="M248 88 C194 172 194 348 248 432" />
      <path className="trade-map-line" d="M652 88 C706 172 706 348 652 432" />

      <path className="trade-continent" d="M122 182 C156 128 250 112 306 142 C342 160 350 198 318 222 C282 250 236 234 202 258 C170 280 124 264 112 226 C108 210 112 194 122 182Z" />
      <path className="trade-continent" d="M272 276 C314 290 332 332 314 374 C300 408 278 446 242 448 C218 420 226 376 242 344 C254 320 248 292 272 276Z" />
      <path className="trade-continent" d="M424 170 C462 144 522 148 552 178 C580 206 562 240 526 248 C492 256 458 240 424 252 C392 236 394 194 424 170Z" />
      <path className="trade-continent" d="M484 258 C528 248 574 266 592 312 C610 360 584 408 540 420 C506 396 494 354 478 318 C466 292 462 270 484 258Z" />
      <path className="trade-continent" d="M568 166 C642 120 746 136 798 198 C828 234 804 276 752 276 C704 276 674 248 626 260 C586 270 548 242 548 208 C548 190 556 176 568 166Z" />
      <path className="trade-continent" d="M704 344 C748 328 810 346 828 382 C804 412 746 416 704 398 C678 386 680 358 704 344Z" />

      {routes.map((route) => (
        <g key={route.id}>
          <path id={`${idPrefix}-${route.id}`} className="trade-route-base" d={route.d} />
          <path className="trade-route-line" d={route.d} />
          <circle className="trade-moving-signal" r="4.2" fill={signalColor}>
            <animateMotion dur="8s" repeatCount="indefinite" begin={route.begin}>
              <mpath href={`#${idPrefix}-${route.id}`} />
            </animateMotion>
          </circle>
          <circle r="14" fill={`url(#${idPrefix}-signal)`} opacity="0.34">
            <animateMotion dur="8s" repeatCount="indefinite" begin={route.begin}>
              <mpath href={`#${idPrefix}-${route.id}`} />
            </animateMotion>
          </circle>
        </g>
      ))}

      {[
        [134, 244],
        [464, 222],
        [766, 168],
        [500, 248],
        [786, 332],
        [430, 352]
      ].map(([cx, cy], index) => (
        <g key={`${cx}-${cy}`} className="trade-node-pin" style={{ animationDelay: `${index * 0.18}s` }}>
          <circle cx={cx} cy={cy} r="4.8" fill={signalColor} />
          <circle cx={cx} cy={cy} r="13" fill="none" stroke={signalColor} strokeOpacity="0.22" />
        </g>
      ))}
    </svg>
  );
}
