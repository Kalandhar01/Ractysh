"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Building2, DraftingCompass, HardHat, Layers3, Network, Sparkles, UsersRound, Workflow } from "lucide-react";
import { CareerApplicationModal } from "@/components/CareerApplicationModal";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const whyCards = [
  {
    title: "Enterprise Innovation",
    text: "Work on premium operational systems and modern enterprise experiences.",
    Icon: Sparkles
  },
  {
    title: "Growth & Learning",
    text: "Collaborate with architecture, construction, real estate, trade and OTC operation teams.",
    Icon: Layers3
  },
  {
    title: "Premium Work Culture",
    text: "Designed for focus, creativity and long-term professional growth.",
    Icon: Building2
  }
];

const openRoles = [
  { title: "Frontend Developer", meta: "Full Time — Chennai" },
  { title: "UI/UX Designer", meta: "Full Time — Hybrid" },
  { title: "Enterprise Operations Associate", meta: "Full Time — Chennai" },
  { title: "Architecture Visualization Designer", meta: "Full Time — Remote" }
];

const lifeExperiences = [
  {
    title: "Operational Precision",
    eyebrow: "01 / Operating Culture",
    body:
      "Every team works inside clear ownership, documented cadence and calm execution loops so ambitious enterprise work stays controlled from idea to delivery.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1500&q=86",
    alt: "Premium enterprise office with warm architectural lighting",
    signal: "Execution Control",
    metric: "Daily",
    metricLabel: "review cadence",
    modules: ["Ownership maps", "Quality checkpoints", "Client-ready reporting"],
    Icon: DraftingCompass
  },
  {
    title: "Creative Intelligence",
    eyebrow: "02 / Design Systems",
    body:
      "Creative decisions are shaped through research, visual discipline and operational context, giving every interface, space and presentation a sharper business purpose.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1500&q=86",
    alt: "Bright premium creative studio workspace with modern desks",
    signal: "Concept Studio",
    metric: "4D",
    metricLabel: "creative review",
    modules: ["Spatial systems", "Interface craft", "Presentation intelligence"],
    Icon: Sparkles
  },
  {
    title: "Enterprise Collaboration",
    eyebrow: "03 / Connected Teams",
    body:
      "Architecture, construction, real estate, export-import, OTC exchange and client teams move as one connected ecosystem, reducing handoffs and keeping decisions aligned.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1500&q=86",
    alt: "Enterprise team collaborating in a modern meeting space",
    signal: "Team Network",
    metric: "One",
    metricLabel: "connected system",
    modules: ["Division sync", "Shared context", "Leadership visibility"],
    Icon: UsersRound
  },
  {
    title: "Calm Execution Standards",
    eyebrow: "04 / Delivery Philosophy",
    body:
      "High standards do not require noise. Ractysh teams prioritize measured communication, strong documentation and focused delivery windows.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1500&q=86",
    alt: "Operational dashboards and enterprise analytics on screens",
    signal: "Standards Room",
    metric: "Zero",
    metricLabel: "noise execution",
    modules: ["Risk clarity", "Documentation depth", "Decision discipline"],
    Icon: Layers3
  },
  {
    title: "Modern Workplace Culture",
    eyebrow: "05 / Professional Growth",
    body:
      "The workplace is designed for long-term craft, thoughtful autonomy and premium presentation standards across the full Ractysh ecosystem.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1500&q=86",
    alt: "Modern warm workplace lounge with premium interiors",
    signal: "Culture System",
    metric: "360",
    metricLabel: "growth exposure",
    modules: ["Mentorship", "Focused autonomy", "Cross-domain learning"],
    Icon: Building2
  }
];

const connectedLifeIndex = lifeExperiences.findIndex(({ title }) => title === "Enterprise Collaboration");

const connectedTeamNodes = [
  {
    title: "Architecture Team",
    detail: "Design intelligence",
    Icon: DraftingCompass,
    x: 20,
    y: 22,
    mobileX: 20,
    mobileY: 23,
    phase: 0,
    duration: 10,
    delay: -1.4
  },
  {
    title: "Construction Systems",
    detail: "Built environment sync",
    Icon: HardHat,
    x: 61,
    y: 20,
    mobileX: 80,
    mobileY: 27,
    phase: 1,
    duration: 11.4,
    delay: -3.1
  },
  {
    title: "Trade Operations",
    detail: "Workflow command",
    Icon: Layers3,
    x: 40,
    y: 48,
    mobileX: 50,
    mobileY: 48,
    phase: 2,
    duration: 8.8,
    delay: -0.8
  },
  {
    title: "Client Coordination",
    detail: "Decision alignment",
    Icon: UsersRound,
    x: 74,
    y: 66,
    mobileX: 80,
    mobileY: 69,
    phase: 3,
    duration: 12,
    delay: -4.2
  },
  {
    title: "Execution Layer",
    detail: "Delivery control",
    Icon: Workflow,
    x: 20,
    y: 70,
    mobileX: 20,
    mobileY: 73,
    phase: 3,
    duration: 9.6,
    delay: -2.4
  }
];

const connectedTeamRoutes = [
  {
    id: "architecture-construction",
    d: "M20 22 C30 13 48 13 61 20",
    mobileD: "M20 23 C35 15 65 17 80 27",
    phase: 1
  },
  {
    id: "architecture-trade",
    d: "M20 22 C23 36 30 43 40 48",
    mobileD: "M20 23 C24 36 35 44 50 48",
    phase: 2
  },
  {
    id: "construction-trade",
    d: "M61 20 C59 36 51 44 40 48",
    mobileD: "M80 27 C72 38 61 45 50 48",
    phase: 2
  },
  {
    id: "trade-client",
    d: "M40 48 C54 49 64 56 74 66",
    mobileD: "M50 48 C64 54 73 61 80 69",
    phase: 3
  },
  {
    id: "trade-execution",
    d: "M40 48 C31 55 24 62 20 70",
    mobileD: "M50 48 C37 55 25 63 20 73",
    phase: 3
  },
  {
    id: "execution-client",
    d: "M20 70 C37 82 60 80 74 66",
    mobileD: "M20 73 C38 82 65 80 80 69",
    phase: 4
  }
];

const processSteps = [
  {
    title: "Apply",
    description: "Submit your professional profile."
  },
  {
    title: "Review",
    description: "Operational and creative evaluation."
  },
  {
    title: "Interview",
    description: "Executive and technical discussion."
  },
  {
    title: "Selection",
    description: "Final leadership approval."
  },
  {
    title: "Welcome to Ractysh",
    description: "Enter the premium ecosystem."
  }
];

function ApplyLink({
  children,
  className,
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "premium-cta group",
        className
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}

function ConnectedTeamsCopy({
  experience,
  phase
}: {
  experience: (typeof lifeExperiences)[number];
  phase: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const visiblePhase = shouldReduceMotion ? 4 : phase;
  const bodyLines = [
    "Architecture, construction, real estate, trade and OTC teams move as one connected ecosystem,",
    "reducing handoffs and keeping decisions aligned."
  ];
  const reveal = (requiredPhase: number, delay = 0) => ({
    opacity: visiblePhase >= requiredPhase ? 1 : 0,
    y: visiblePhase >= requiredPhase ? 0 : 80,
    scale: visiblePhase >= requiredPhase ? 1 : 0.92,
    filter: visiblePhase >= requiredPhase ? "blur(0px)" : "blur(10px)",
    transition: { duration: shouldReduceMotion ? 0 : 1.2, delay, ease }
  });

  return (
    <motion.div
      key={experience.title}
      initial={{ opacity: 0, y: 80, scale: 0.92, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -26, filter: "blur(8px)" }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease }}
      className="pl-3 will-change-[opacity,transform,filter]"
    >
      <motion.p
        initial={false}
        animate={reveal(0)}
        className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#9a7428]"
      >
        {experience.eyebrow}
      </motion.p>
      <h2 className="mt-5 max-w-[42rem] font-display text-[38px] font-semibold leading-[0.98] tracking-normal text-[#181512] md:text-[52px] lg:text-[64px]">
        {["Enterprise", "Collaboration"].map((line, index) => (
          <motion.span
            key={line}
            initial={false}
            animate={reveal(index, index * 0.04)}
            className="block will-change-[opacity,transform,filter]"
          >
            {line}
          </motion.span>
        ))}
      </h2>
      <div className="mt-6 max-w-[35rem] text-[15px] leading-[1.8] text-[#625747] md:text-[17px]">
        {bodyLines.map((line, index) => (
          <motion.span
            key={line}
            initial={false}
            animate={reveal(index + 2, index * 0.06)}
            className="block will-change-[opacity,transform,filter]"
          >
            {line}
          </motion.span>
        ))}
      </div>
      <motion.div
        initial={false}
        animate={reveal(4, 0.06)}
        className="mt-7 inline-flex items-center gap-3 rounded-full border border-[#d6b45f]/32 bg-[#fff8e8]/72 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7e5f20] shadow-[0_16px_34px_rgba(96,74,35,0.08)]"
      >
        <span className="relative h-2 w-2 rounded-full bg-[#d6b45f] shadow-[0_0_18px_rgba(214,180,95,0.78)]">
          <span className="absolute inset-[-6px] rounded-full border border-[#d6b45f]/34" />
        </span>
        Connected Enterprise Flow
      </motion.div>
    </motion.div>
  );
}

function ConnectedTeamsVisual({ phase }: { phase: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.45 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.45 });
  const systemX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const systemY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const lineX = useTransform(smoothX, [-1, 1], [-5, 5]);
  const lineY = useTransform(smoothY, [-1, 1], [-4, 4]);
  const rotateX = useTransform(smoothY, [-1, 1], [2.2, -2.2]);
  const rotateY = useTransform(smoothX, [-1, 1], [-2.8, 2.8]);
  const visiblePhase = shouldReduceMotion ? 4 : phase;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      ref={rootRef}
      data-connected-teams-visual
      initial={{ opacity: 0, y: 42, scale: 0.96, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -24, filter: "blur(8px)" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="absolute inset-0 overflow-hidden bg-[#15110e] text-[#fff8ec] will-change-[opacity,transform,filter]"
    >
      <style>
        {`
          .connected-teams-grid {
            background-image:
              linear-gradient(rgba(255, 247, 226, 0.11) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 247, 226, 0.08) 1px, transparent 1px);
            background-size: 52px 52px;
            mask-image: radial-gradient(ellipse at center, black 0%, rgba(0, 0, 0, 0.72) 54%, transparent 86%);
            animation: connected-grid-drift 24s linear infinite;
            will-change: transform, opacity;
          }

          .connected-team-particle {
            position: absolute;
            left: var(--connected-particle-left);
            top: var(--connected-particle-top);
            width: 2px;
            height: 2px;
            border-radius: 999px;
            background: rgba(244, 220, 154, 0.78);
            opacity: 0.18;
            animation: connected-particle-drift 8s ease-in-out var(--connected-particle-delay) infinite;
            will-change: transform, opacity;
          }

          .connected-team-anchor {
            transform: translate3d(-50%, -50%, 0);
          }

          .connected-team-float {
            animation: connected-team-float var(--connected-float-duration) ease-in-out var(--connected-float-delay) infinite;
            will-change: transform;
          }

          .connected-team-node-position {
            left: var(--connected-node-left);
            top: var(--connected-node-top);
          }

          .connected-mobile-route {
            display: none;
          }

          .connected-team-card {
            position: relative;
            width: clamp(9.6rem, 22vw, 13rem);
            overflow: hidden;
            border: 1px solid rgba(214, 180, 95, 0.28);
            border-radius: 16px;
            background:
              linear-gradient(145deg, rgba(255, 253, 246, 0.16), rgba(255, 247, 226, 0.07)),
              rgba(25, 19, 14, 0.72);
            box-shadow:
              0 24px 64px rgba(0, 0, 0, 0.24),
              inset 0 1px 0 rgba(255, 255, 255, 0.14);
            backdrop-filter: blur(18px);
            transform: translateZ(0);
          }

          .connected-team-card::before {
            pointer-events: none;
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(120deg, transparent, rgba(255, 236, 186, 0.14), transparent);
            opacity: 0;
            transform: translate3d(-70%, 0, 0);
            transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .connected-team-card.is-synced::before {
            opacity: 1;
            animation: connected-card-sync 4.6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          }

          .connected-sync-orb {
            animation: connected-sync-breathe 5.4s ease-in-out infinite;
            will-change: transform, opacity;
          }

          @keyframes connected-grid-drift {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(52px, 52px, 0); }
          }

          @keyframes connected-particle-drift {
            0%, 100% { opacity: 0.09; transform: translate3d(0, 0, 0); }
            50% { opacity: 0.24; transform: translate3d(12px, -16px, 0); }
          }

          @keyframes connected-team-float {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(0, -8px, 0); }
          }

          @keyframes connected-card-sync {
            0% { transform: translate3d(-85%, 0, 0); }
            44%, 58% { transform: translate3d(22%, 0, 0); }
            100% { transform: translate3d(115%, 0, 0); }
          }

          @keyframes connected-sync-breathe {
            0%, 100% { transform: scale(0.98); opacity: 0.72; }
            50% { transform: scale(1.04); opacity: 1; }
          }

          @media (max-width: 640px) {
            .connected-team-node-position {
              left: var(--connected-node-mobile-left);
              top: var(--connected-node-mobile-top);
            }

            .connected-desktop-route {
              display: none;
            }

            .connected-mobile-route {
              display: block;
            }

            .connected-team-card {
              width: clamp(7.25rem, 34vw, 8.25rem);
              padding: 0.72rem !important;
            }

            .connected-team-detail,
            .connected-team-status {
              display: none !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .connected-teams-grid,
            .connected-team-particle,
            .connected-team-float,
            .connected-team-card.is-synced::before,
            .connected-sync-orb {
              animation: none !important;
            }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,rgba(214,180,95,0.24),transparent_34%),radial-gradient(circle_at_74%_76%,rgba(139,17,24,0.16),transparent_32%),linear-gradient(140deg,rgba(21,17,14,0.2),rgba(21,17,14,0.92))]" />
      <div className="connected-teams-grid pointer-events-none absolute inset-[-8%] opacity-[0.18]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_36%,rgba(0,0,0,0.24))]" />

      {Array.from({ length: 8 }).map((_, index) => (
        <span
          key={index}
          className="connected-team-particle"
          style={
            {
              "--connected-particle-left": `${14 + ((index * 13) % 74)}%`,
              "--connected-particle-top": `${13 + ((index * 19) % 70)}%`,
              "--connected-particle-delay": `${index * -0.62}s`
            } as React.CSSProperties
          }
        />
      ))}

      <div className="absolute left-5 top-5 z-20 flex items-center gap-3 rounded-[18px] border border-white/12 bg-[#1b1511]/72 px-4 py-3 shadow-[0_14px_36px_rgba(0,0,0,0.2)] backdrop-blur-md md:left-7 md:top-7">
        <span className="flex h-10 w-10 items-center justify-center rounded-[13px] border border-[#d6b45f]/34 bg-white/[0.07] text-[#f2d994]">
          <Network className="h-5 w-5" strokeWidth={1.7} />
        </span>
        <span>
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#d6b45f]">
            Team Network
          </span>
          <span className="mt-1 block text-sm font-semibold text-[#fff8ec]">Live collaboration flow</span>
        </span>
      </div>

      <motion.svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ x: lineX, y: lineY }}
        className="pointer-events-none absolute inset-[5%] z-10 h-[90%] w-[90%] overflow-visible"
      >
        <defs>
          <linearGradient id="connectedRouteGold" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 246, 216, 0.2)" />
            <stop offset="46%" stopColor="rgba(214, 180, 95, 0.9)" />
            <stop offset="100%" stopColor="rgba(255, 246, 216, 0.28)" />
          </linearGradient>
          <filter id="connectedRouteGlow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {connectedTeamRoutes.map((route) => {
          const routeActive = visiblePhase >= route.phase;
          const motionState = routeActive
            ? {
                opacity: shouldReduceMotion ? 0.68 : [0.36, 0.78, 0.44],
                pathLength: 1
              }
            : { opacity: 0, pathLength: 0 };
          const motionTransition = {
            pathLength: { duration: shouldReduceMotion ? 0 : 1.2, ease },
            opacity: shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2.8, ease: [0.42, 0, 0.58, 1] as const, repeat: Infinity, repeatType: "mirror" as const }
          };

          return (
            <g key={route.id}>
              <motion.path
                d={route.d}
                fill="none"
                stroke="url(#connectedRouteGold)"
                strokeLinecap="round"
                strokeWidth={visiblePhase >= 4 ? 0.72 : 0.55}
                filter="url(#connectedRouteGlow)"
                initial={false}
                animate={motionState}
                transition={motionTransition}
                className="connected-desktop-route"
              />
              <motion.path
                d={route.mobileD}
                fill="none"
                stroke="url(#connectedRouteGold)"
                strokeLinecap="round"
                strokeWidth={visiblePhase >= 4 ? 0.8 : 0.58}
                filter="url(#connectedRouteGlow)"
                initial={false}
                animate={motionState}
                transition={motionTransition}
                className="connected-mobile-route"
              />
            </g>
          );
        })}
      </motion.svg>

      <motion.div
        style={{ x: systemX, y: systemY, rotateX, rotateY, transformPerspective: 900 }}
        className="absolute inset-[5%] z-20"
      >
        <motion.div
          initial={false}
          animate={{
            opacity: visiblePhase >= 3 ? 1 : 0,
            scale: visiblePhase >= 3 ? 1 : 0.86,
            filter: visiblePhase >= 3 ? "blur(0px)" : "blur(8px)"
          }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="connected-sync-orb flex h-20 w-20 items-center justify-center rounded-full border border-[#d6b45f]/30 bg-[#1c1510]/72 shadow-[0_0_54px_rgba(214,180,95,0.22)] backdrop-blur-md md:h-24 md:w-24">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f2d994]/28 bg-[#d6b45f]/12 text-[#f2d994]">
              <Network className="h-5 w-5" strokeWidth={1.65} />
            </div>
          </div>
        </motion.div>

        {connectedTeamNodes.map(({ Icon, ...node }) => {
          const nodeActive = visiblePhase >= node.phase;

          return (
            <motion.div
              key={node.title}
              initial={false}
              animate={
                nodeActive
                  ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                  : { opacity: 0, y: 80, scale: 0.92, filter: "blur(10px)" }
              }
              transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease }}
              className="connected-team-node-position absolute will-change-[opacity,transform,filter]"
              style={
                {
                  "--connected-node-left": `${node.x}%`,
                  "--connected-node-top": `${node.y}%`,
                  "--connected-node-mobile-left": `${node.mobileX}%`,
                  "--connected-node-mobile-top": `${node.mobileY}%`,
                  "--connected-float-duration": `${node.duration}s`,
                  "--connected-float-delay": `${node.delay}s`
                } as React.CSSProperties
              }
            >
              <div className="connected-team-anchor">
                <div className="connected-team-float">
                  <article className={cn("connected-team-card p-3.5 md:p-4", visiblePhase >= 4 && "is-synced")}>
                    <div className="relative z-10 flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border border-[#d6b45f]/30 bg-[#fff7e5]/10 text-[#f2d994]">
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#f2d994]">
                          {node.title}
                        </span>
                        <span className="connected-team-detail mt-1.5 block text-[12px] font-medium leading-5 text-white/62">
                          {node.detail}
                        </span>
                      </span>
                    </div>
                    <div className="connected-team-status relative z-10 mt-3 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d6b45f] shadow-[0_0_16px_rgba(214,180,95,0.86)]" />
                      Synced
                    </div>
                  </article>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          opacity: visiblePhase >= 4 ? 1 : 0,
          y: visiblePhase >= 4 ? 0 : 18,
          filter: visiblePhase >= 4 ? "blur(0px)" : "blur(8px)"
        }}
        transition={{ duration: shouldReduceMotion ? 0 : 1, ease }}
        className="absolute bottom-5 left-5 right-5 z-30 rounded-[18px] border border-[#d6b45f]/24 bg-[#17120f]/82 p-4 text-[#fff8ec] shadow-[0_16px_42px_rgba(0,0,0,0.22)] backdrop-blur-md md:bottom-7 md:left-auto md:right-7 md:w-[22rem]"
      >
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#d6b45f]">
          Connected Enterprise Flow
        </p>
        <p className="mt-2 hidden text-sm leading-6 text-white/70 sm:block">
          Architecture, construction, real estate, export-import and OTC operations are moving through one synchronized delivery rhythm.
        </p>
      </motion.div>
    </motion.div>
  );
}

const lifeStoryParticles = Array.from({ length: 14 }, (_, index) => ({
  left: 8 + ((index * 17) % 84),
  top: 10 + ((index * 23) % 76),
  delay: index * -0.48,
  drift: 8 + (index % 4) * 4
}));

const lifeNetworkNodes = [
  { label: "Design", x: 22, y: 30 },
  { label: "Build", x: 68, y: 26 },
  { label: "Trade", x: 46, y: 50 },
  { label: "Client", x: 76, y: 70 },
  { label: "Delivery", x: 24, y: 72 }
];

const lifeNetworkRoutes = [
  "M22 30 C35 18 54 18 68 26",
  "M22 30 C25 42 34 48 46 50",
  "M68 26 C65 40 58 48 46 50",
  "M46 50 C58 53 68 61 76 70",
  "M46 50 C36 56 28 64 24 72",
  "M24 72 C40 82 62 82 76 70"
];

function LifeStoryVisual({ activeIndex }: { activeIndex: number }) {
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 72, damping: 26, mass: 0.7 });
  const smoothY = useSpring(pointerY, { stiffness: 72, damping: 26, mass: 0.7 });
  const rotateX = useTransform(smoothY, [-1, 1], [2.4, -2.4]);
  const rotateY = useTransform(smoothX, [-1, 1], [-3.2, 3.2]);
  const depthX = useTransform(smoothX, [-1, 1], [-4, 4]);
  const depthY = useTransform(smoothY, [-1, 1], [-4, 4]);
  const glassX = useTransform(smoothX, [-1, 1], [3, -3]);
  const glassY = useTransform(smoothY, [-1, 1], [3, -3]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      data-life-visual-shell
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="relative h-full min-h-[19.5rem] overflow-hidden rounded-[28px] border border-[#d8c8a9] bg-[#15110e] text-[#fff8ec] shadow-[0_30px_96px_rgba(57,38,17,0.18)] will-change-transform [contain:layout_paint] sm:min-h-[22rem] md:min-h-[34rem] lg:min-h-[42rem]"
    >
      <style>
        {`
          .life-story-grid {
            background-image:
              linear-gradient(rgba(255, 248, 230, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 248, 230, 0.08) 1px, transparent 1px);
            background-size: 62px 62px;
            mask-image: radial-gradient(ellipse at center, black 0%, rgba(0, 0, 0, 0.72) 58%, transparent 88%);
            animation: life-story-grid-drift 28s linear infinite;
            will-change: transform;
          }

          .life-story-particle {
            position: absolute;
            left: var(--life-particle-left);
            top: var(--life-particle-top);
            height: 2px;
            width: 2px;
            border-radius: 999px;
            background: rgba(244, 220, 154, 0.76);
            opacity: 0.18;
            box-shadow: 0 0 14px rgba(214, 180, 95, 0.44);
            animation: life-story-particle-drift 8.8s ease-in-out var(--life-particle-delay) infinite;
            will-change: transform, opacity;
          }

          .life-story-reflection {
            animation: life-story-reflection-sweep 9.6s cubic-bezier(0.42, 0, 0.58, 1) infinite;
            will-change: transform, opacity;
          }

          .life-story-architecture-line {
            animation: life-story-architecture-float 11s ease-in-out var(--life-line-delay) infinite;
            will-change: transform, opacity;
          }

          .life-story-glass {
            box-shadow:
              0 26px 72px rgba(0, 0, 0, 0.28),
              0 10px 34px rgba(214, 180, 95, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.18);
            background:
              linear-gradient(145deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.055)),
              rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.16);
            backdrop-filter: blur(18px) saturate(135%);
            -webkit-backdrop-filter: blur(18px) saturate(135%);
          }

          .life-story-network-node {
            transform: translate3d(-50%, -50%, 0);
          }

          @keyframes life-story-grid-drift {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(62px, 62px, 0); }
          }

          @keyframes life-story-particle-drift {
            0%, 100% { opacity: 0.08; transform: translate3d(0, 0, 0); }
            45% { opacity: 0.28; transform: translate3d(var(--life-particle-drift), -18px, 0); }
          }

          @keyframes life-story-reflection-sweep {
            0%, 18% { opacity: 0; transform: translate3d(-48%, -18%, 0) rotate(15deg); }
            45% { opacity: 0.22; }
            78%, 100% { opacity: 0; transform: translate3d(54%, 18%, 0) rotate(15deg); }
          }

          @keyframes life-story-architecture-float {
            0%, 100% { opacity: 0.32; transform: translate3d(0, 0, 0); }
            50% { opacity: 0.58; transform: translate3d(18px, -12px, 0); }
          }

          @media (prefers-reduced-motion: reduce) {
            .life-story-grid,
            .life-story-particle,
            .life-story-reflection,
            .life-story-architecture-line {
              animation: none !important;
            }
          }
        `}
      </style>

      <motion.div style={{ x: depthX, y: depthY }} className="absolute inset-[-4%]">
        {lifeExperiences.map(({ Icon, ...experience }, index) => (
          <article
            key={experience.title}
            data-life-visual-layer
            data-life-step={index}
            aria-hidden={activeIndex !== index}
            style={
              shouldReduceMotion
                ? {
                    opacity: activeIndex === index ? 1 : 0,
                    visibility: activeIndex === index ? "visible" : "hidden",
                    transform: "none",
                    filter: "blur(0px)"
                  }
                : undefined
            }
            className="absolute inset-0 overflow-hidden opacity-0 will-change-[opacity,transform,filter]"
          >
            <div className="absolute inset-[-5%]">
              <img
                data-life-visual-image
                src={experience.image}
                alt={experience.alt}
                decoding="async"
                loading={index === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover opacity-[0.88] will-change-transform [transform:translateZ(0)]"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,14,10,0.08),rgba(20,14,10,0.62)_62%,rgba(20,14,10,0.9))]" />
            <div
              data-life-ambient-layer
              className={cn(
                "absolute inset-0 opacity-80",
                index === 0 && "bg-[radial-gradient(circle_at_24%_18%,rgba(214,180,95,0.28),transparent_34%),radial-gradient(circle_at_72%_78%,rgba(139,17,24,0.16),transparent_34%)]",
                index === 1 && "bg-[radial-gradient(circle_at_72%_22%,rgba(255,246,216,0.28),transparent_32%),radial-gradient(circle_at_28%_76%,rgba(214,180,95,0.18),transparent_36%)]",
                index === 2 && "bg-[radial-gradient(circle_at_48%_44%,rgba(214,180,95,0.26),transparent_36%),radial-gradient(circle_at_78%_68%,rgba(139,17,24,0.2),transparent_34%)]",
                index === 3 && "bg-[radial-gradient(circle_at_30%_74%,rgba(255,248,230,0.24),transparent_32%),radial-gradient(circle_at_74%_28%,rgba(214,180,95,0.2),transparent_38%)]",
                index === 4 && "bg-[radial-gradient(circle_at_52%_26%,rgba(214,180,95,0.32),transparent_36%),radial-gradient(circle_at_18%_74%,rgba(255,248,230,0.2),transparent_34%)]"
              )}
            />

            <div className="life-story-grid absolute inset-0 opacity-[0.16]" aria-hidden />

            <div className="pointer-events-none absolute inset-0" aria-hidden>
              {Array.from({ length: 5 }).map((_, lineIndex) => (
                <span
                  key={lineIndex}
                  className="life-story-architecture-line absolute h-px bg-gradient-to-r from-transparent via-[#f4dc9a]/44 to-transparent"
                  style={
                    {
                      left: `${8 + lineIndex * 13}%`,
                      top: `${18 + ((lineIndex * 17 + index * 7) % 58)}%`,
                      width: `${26 + lineIndex * 8}%`,
                      transform: `rotate(${lineIndex % 2 === 0 ? -12 : 14}deg)`,
                      "--life-line-delay": `${(lineIndex + index) * -0.72}s`
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            {index === 2 && (
              <div data-life-network className="absolute inset-0 z-10">
                <svg
                  aria-hidden
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-[8%] h-[84%] w-[84%] overflow-visible opacity-80"
                >
                  <defs>
                    <linearGradient id="lifeNetworkGold" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,248,230,0.1)" />
                      <stop offset="48%" stopColor="rgba(214,180,95,0.86)" />
                      <stop offset="100%" stopColor="rgba(255,248,230,0.24)" />
                    </linearGradient>
                  </defs>
                  {lifeNetworkRoutes.map((route) => (
                    <path
                      key={route}
                      data-life-network-route
                      d={route}
                      fill="none"
                      stroke="url(#lifeNetworkGold)"
                      strokeLinecap="round"
                      strokeWidth="0.65"
                      pathLength={1}
                    />
                  ))}
                </svg>
                {lifeNetworkNodes.map((node) => (
                  <div
                    key={node.label}
                    data-life-network-node
                    className="life-story-network-node absolute rounded-full border border-[#d6b45f]/28 bg-[#17120f]/72 px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#f2d994] shadow-[0_16px_42px_rgba(0,0,0,0.22)] backdrop-blur-md"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    {node.label}
                  </div>
                ))}
              </div>
            )}

            <motion.div
              style={{ x: glassX, y: glassY }}
              className="absolute inset-[4%] z-20"
            >
              <div
                data-life-glass
                className="life-story-glass absolute left-5 top-5 flex max-w-[calc(100%-2.5rem)] items-center gap-3 rounded-[20px] px-4 py-3.5 md:left-10 md:top-10 md:max-w-[24rem] md:px-5 md:py-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#d6b45f]/34 bg-white/[0.07] text-[#f2d994]">
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.62rem] font-semibold uppercase leading-[1.35] tracking-[0.18em] text-[#d6b45f]">
                    {experience.signal}
                  </span>
                  <span className="mt-1.5 block text-sm font-semibold leading-5 text-[#fff8ec]">Culture layer</span>
                </span>
              </div>

              <div
                data-life-glass
                className="life-story-glass absolute bottom-5 left-5 right-5 rounded-[24px] p-5 md:bottom-10 md:left-10 md:right-auto md:w-[22rem] md:p-6"
              >
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase leading-[1.35] tracking-[0.18em] text-[#d6b45f]">
                      Active Mode
                    </p>
                    <p className="mt-3 font-display text-[26px] font-semibold leading-none tracking-normal md:text-[30px]">
                      {experience.metric}
                    </p>
                    <p className="mt-2.5 text-xs font-medium uppercase leading-[1.45] tracking-[0.14em] text-white/62">
                      {experience.metricLabel}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d6b45f]/32 bg-[#d6b45f]/12">
                    <span className="h-2 w-2 rounded-full bg-[#f1d58d] shadow-[0_0_22px_rgba(214,180,95,0.86)]" />
                  </div>
                </div>
              </div>

              <div
                data-life-glass
                className="life-story-glass absolute right-10 top-[37%] hidden w-[17rem] rounded-[22px] p-5 text-white md:block"
              >
                <p className="text-[0.62rem] font-semibold uppercase leading-[1.35] tracking-[0.18em] text-[#f2d994]">
                  Culture Modules
                </p>
                <div className="mt-5 space-y-3.5">
                  {experience.modules.map((module, moduleIndex) => (
                    <div key={module} className="flex items-center gap-3.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/14 bg-white/[0.07] text-[11px] font-semibold text-[#f2d994]">
                        {moduleIndex + 1}
                      </span>
                      <span className="text-sm font-medium leading-5 text-white/84">{module}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </article>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_34%,rgba(0,0,0,0.2))]" aria-hidden />
      <div className="life-story-reflection pointer-events-none absolute -left-1/2 top-[-16%] z-30 h-[140%] w-[42%] rotate-[15deg] bg-[linear-gradient(90deg,transparent,rgba(255,248,230,0.22),transparent)]" aria-hidden />
      {lifeStoryParticles.map((particle, index) => (
        <span
          key={index}
          className="life-story-particle z-30"
          style={
            {
              "--life-particle-left": `${particle.left}%`,
              "--life-particle-top": `${particle.top}%`,
              "--life-particle-delay": `${particle.delay}s`,
              "--life-particle-drift": `${particle.drift}px`
            } as React.CSSProperties
          }
        />
      ))}
    </motion.div>
  );
}

export function PremiumCareersPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroArtRef = useRef<HTMLDivElement>(null);
  const lifeSectionRef = useRef<HTMLElement>(null);
  const lifePinRef = useRef<HTMLDivElement>(null);
  const lifeScrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeLifeIndexRef = useRef(0);
  const lastLifeInteractionRef = useRef(0);
  const lifeScrollActiveRef = useRef(false);
  const processJourneyRef = useRef<HTMLDivElement>(null);
  const processLineRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();
  const [activeLifeIndex, setActiveLifeIndex] = useState(0);
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [applicationRole, setApplicationRole] = useState<string | null>(null);

  const openApplicationModal = useCallback((roleTitle: string) => {
    setApplicationRole(roleTitle);
  }, []);

  const closeApplicationModal = useCallback(() => {
    setApplicationRole(null);
  }, []);

  const activateLifeExperience = useCallback((index: number, fromInteraction = false) => {
    const nextIndex = (index + lifeExperiences.length) % lifeExperiences.length;

    if (fromInteraction) {
      lastLifeInteractionRef.current = Date.now();
    }

    activeLifeIndexRef.current = nextIndex;
    setActiveLifeIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
  }, []);

  const scrollToLifeExperience = useCallback(
    (index: number) => {
      const nextIndex = Math.min(lifeExperiences.length - 1, Math.max(0, index));
      const trigger = lifeScrollTriggerRef.current;

      lastLifeInteractionRef.current = Date.now();
      activateLifeExperience(nextIndex, true);

      if (!trigger || shouldReduceMotion) return;

      const targetProgress = nextIndex / Math.max(1, lifeExperiences.length - 1);
      const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress;

      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: 1.15,
          easing: (time: number) => 1 - Math.pow(1 - time, 3)
        });
        return;
      }

      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    },
    [activateLifeExperience, lenis, shouldReduceMotion]
  );

  useEffect(() => {
    lifeExperiences.forEach(({ image }) => {
      const preload = new window.Image();
      preload.decoding = "async";
      preload.src = image;
    });
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const processInterval = window.setInterval(() => {
      setActiveProcessStep((current) => (current + 1) % processSteps.length);
    }, 2700);

    return () => window.clearInterval(processInterval);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set("[data-careers-reveal]", { opacity: 1, y: 0 });
        gsap.set(processLineRef.current, { scaleX: 1 });
        gsap.set("[data-life-progress-fill]", { scaleY: 1, transformOrigin: "top center" });
        return;
      }

      gsap.utils.toArray<HTMLElement>("[data-careers-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
              once: true
            }
          }
        );
      });

      if (heroArtRef.current) {
        gsap.to(heroArtRef.current, {
          y: 44,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1.2
          }
        });
      }

      if (lifeSectionRef.current && lifePinRef.current) {
        const lifeSection = lifeSectionRef.current;
        const lifePin = lifePinRef.current;
        const lifeGrid = lifeSection.querySelector("[data-life-grid]");
        const lifeGlow = lifeSection.querySelector("[data-life-glow]");
        const lifeBackdrop = lifeSection.querySelector("[data-life-backdrop]");
        const copyPanels = gsap.utils.toArray<HTMLElement>("[data-life-copy-panel]", lifeSection);
        const visualLayers = gsap.utils.toArray<HTMLElement>("[data-life-visual-layer]", lifeSection);
        const visualImages = gsap.utils.toArray<HTMLElement>("[data-life-visual-image]", lifeSection);
        const progressFill = lifeSection.querySelector("[data-life-progress-fill]");
        const progressGlow = lifeSection.querySelector("[data-life-progress-glow]");
        const menuButtons = gsap.utils.toArray<HTMLElement>("[data-life-menu-button]", lifeSection);
        const menuLines = gsap.utils.toArray<HTMLElement>("[data-life-menu-line]", lifeSection);
        const menuDots = gsap.utils.toArray<HTMLElement>("[data-life-menu-dot]", lifeSection);
        const allCopyItems = copyPanels.flatMap((panel) =>
          gsap.utils.toArray<HTMLElement>("[data-life-copy-item]", panel)
        );
        const allGlass = visualLayers.flatMap((panel) =>
          gsap.utils.toArray<HTMLElement>("[data-life-glass]", panel)
        );
        const networkRoutes = gsap.utils.toArray<SVGPathElement>("[data-life-network-route]", lifeSection);
        const networkNodes = gsap.utils.toArray<HTMLElement>("[data-life-network-node]", lifeSection);
        const totalSegments = lifeExperiences.length - 1;
        const storyDuration = totalSegments + 0.95;

        gsap.set([lifeGrid, lifeGlow, lifeBackdrop].filter(Boolean), { force3D: true });
        gsap.set(copyPanels, { autoAlpha: 0, y: 46, filter: "blur(10px)", force3D: true });
        gsap.set(allCopyItems, { autoAlpha: 0, y: 40, filter: "blur(10px)", force3D: true });
        gsap.set(visualLayers, { autoAlpha: 0, scale: 1.035, filter: "blur(8px)", force3D: true });
        gsap.set(visualImages, { scale: 1.14, xPercent: 1, yPercent: -1, force3D: true });
        gsap.set(allGlass, { autoAlpha: 0, y: 34, filter: "blur(10px)", force3D: true });
        gsap.set(networkRoutes, { opacity: 0, strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(networkNodes, { autoAlpha: 0, y: 22, scale: 0.92, filter: "blur(8px)", force3D: true });
        gsap.set(progressFill, { scaleY: 0, transformOrigin: "top center", force3D: true });
        gsap.set(progressGlow, { autoAlpha: 0.34, yPercent: 0, force3D: true });
        gsap.set(menuButtons, { opacity: (index) => (index === 0 ? 1 : 0.54), force3D: true });
        gsap.set(menuLines, { scaleY: (index) => (index === 0 ? 1 : 0.18), transformOrigin: "top center" });
        gsap.set(menuDots, { scale: (index) => (index === 0 ? 1 : 0.78), transformOrigin: "50% 50%" });

        if (copyPanels[0]) {
          const firstItems = gsap.utils.toArray<HTMLElement>("[data-life-copy-item]", copyPanels[0]);
          gsap.set(copyPanels[0], { autoAlpha: 1, y: 0, filter: "blur(0px)" });
          gsap.set(firstItems, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
        }

        if (visualLayers[0]) {
          const firstGlass = gsap.utils.toArray<HTMLElement>("[data-life-glass]", visualLayers[0]);
          gsap.set(visualLayers[0], { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
          gsap.set(firstGlass, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
        }

        const lifeTimeline = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            trigger: lifeSection,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight * 4.6, lifeExperiences.length * 760)}`,
            pin: lifePin,
            scrub: 1.28,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => {
              lifeScrollActiveRef.current = true;
            },
            onEnterBack: () => {
              lifeScrollActiveRef.current = true;
            },
            onLeave: () => {
              lifeScrollActiveRef.current = false;
            },
            onLeaveBack: () => {
              lifeScrollActiveRef.current = false;
            },
            onRefresh: (self) => {
              lifeScrollTriggerRef.current = self;
            },
            onUpdate: (self) => {
              const nextIndex = Math.min(
                lifeExperiences.length - 1,
                Math.max(0, Math.round(self.progress * totalSegments))
              );

              if (nextIndex !== activeLifeIndexRef.current) {
                activateLifeExperience(nextIndex);
              }
            }
          }
        });

        lifeScrollTriggerRef.current = lifeTimeline.scrollTrigger ?? null;

        lifeTimeline.to(progressFill, { scaleY: 1, duration: storyDuration, ease: "none" }, 0);
        lifeTimeline.to(progressGlow, { yPercent: 210, duration: storyDuration, ease: "none" }, 0);

        if (lifeGrid) {
          lifeTimeline.to(lifeGrid, { xPercent: -2.4, yPercent: 1.8, duration: storyDuration, ease: "none" }, 0);
        }

        if (lifeGlow) {
          lifeTimeline.to(lifeGlow, { x: 64, y: -42, scale: 1.16, duration: storyDuration, ease: "none" }, 0);
        }

        if (lifeBackdrop) {
          lifeTimeline.to(lifeBackdrop, { y: -34, scale: 1.025, duration: storyDuration, ease: "none" }, 0);
        }

        if (visualImages[0]) {
          lifeTimeline.to(
            visualImages[0],
            { scale: 1.045, xPercent: -1.2, yPercent: 0.8, duration: 1.35, ease: "none" },
            0
          );
        }

        Array.from({ length: totalSegments }).forEach((_, segmentIndex) => {
          const nextIndex = segmentIndex + 1;
          const position = nextIndex;
          const previousCopy = copyPanels[segmentIndex];
          const currentCopy = copyPanels[nextIndex];
          const previousLayer = visualLayers[segmentIndex];
          const currentLayer = visualLayers[nextIndex];
          const currentImage = visualImages[nextIndex];
          const previousItems = previousCopy
            ? gsap.utils.toArray<HTMLElement>("[data-life-copy-item]", previousCopy)
            : [];
          const currentItems = currentCopy
            ? gsap.utils.toArray<HTMLElement>("[data-life-copy-item]", currentCopy)
            : [];
          const previousGlass = previousLayer
            ? gsap.utils.toArray<HTMLElement>("[data-life-glass]", previousLayer)
            : [];
          const currentGlass = currentLayer
            ? gsap.utils.toArray<HTMLElement>("[data-life-glass]", currentLayer)
            : [];

          lifeTimeline.to(
            previousItems,
            {
              autoAlpha: 0,
              y: -26,
              filter: "blur(8px)",
              duration: 0.52,
              stagger: 0.03
            },
            position - 0.56
          );
          lifeTimeline.to(
            previousCopy,
            {
              autoAlpha: 0,
              y: -34,
              filter: "blur(10px)",
              duration: 0.76
            },
            position - 0.52
          );
          lifeTimeline.fromTo(
            currentCopy,
            { autoAlpha: 0, y: 46, filter: "blur(10px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.92
            },
            position - 0.5
          );
          lifeTimeline.fromTo(
            currentItems,
            { autoAlpha: 0, y: 40, filter: "blur(10px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.84,
              stagger: 0.08
            },
            position - 0.46
          );

          lifeTimeline.to(
            previousGlass,
            {
              autoAlpha: 0,
              y: -20,
              filter: "blur(8px)",
              duration: 0.56,
              stagger: 0.04
            },
            position - 0.58
          );
          lifeTimeline.to(
            previousLayer,
            {
              autoAlpha: 0,
              scale: 1.018,
              filter: "blur(8px)",
              duration: 1.05
            },
            position - 0.62
          );
          lifeTimeline.fromTo(
            currentLayer,
            { autoAlpha: 0, scale: 1.035, filter: "blur(8px)" },
            {
              autoAlpha: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.08
            },
            position - 0.62
          );
          lifeTimeline.fromTo(
            currentImage,
            { scale: 1.145, xPercent: 1.4, yPercent: -1 },
            {
              scale: 1.04,
              xPercent: -1.15,
              yPercent: 0.85,
              duration: 1.58,
              ease: "none"
            },
            position - 0.62
          );
          lifeTimeline.fromTo(
            currentGlass,
            { autoAlpha: 0, y: 36, filter: "blur(10px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.92,
              stagger: 0.08
            },
            position - 0.32
          );

          lifeTimeline.to(
            menuButtons,
            {
              opacity: (buttonIndex) => (buttonIndex === nextIndex ? 1 : buttonIndex < nextIndex ? 0.72 : 0.48),
              duration: 0.7
            },
            position - 0.4
          );
          lifeTimeline.to(
            menuLines,
            {
              scaleY: (buttonIndex) => (buttonIndex === nextIndex ? 1 : buttonIndex < nextIndex ? 0.5 : 0.18),
              duration: 0.72
            },
            position - 0.4
          );
          lifeTimeline.to(
            menuDots,
            {
              scale: (buttonIndex) => (buttonIndex === nextIndex ? 1 : buttonIndex < nextIndex ? 0.88 : 0.74),
              duration: 0.72
            },
            position - 0.4
          );
        });

        lifeTimeline.to(
          networkRoutes,
          {
            opacity: 0.88,
            strokeDashoffset: 0,
            duration: 0.95,
            stagger: 0.08
          },
          connectedLifeIndex - 0.18
        );
        lifeTimeline.to(
          networkNodes,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.09
          },
          connectedLifeIndex - 0.02
        );
      }

      if (processLineRef.current) {
        gsap.fromTo(
          processLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: processLineRef.current,
              start: "top 78%",
              end: "bottom 42%",
              scrub: 1.1
            }
          }
        );
      }

      if (processJourneyRef.current) {
        gsap.to("[data-hiring-depth='soft']", {
          y: -26,
          ease: "none",
          scrollTrigger: {
            trigger: processJourneyRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2
          }
        });

        gsap.to("[data-hiring-depth='near']", {
          y: 18,
          ease: "none",
          scrollTrigger: {
            trigger: processJourneyRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4
          }
        });
      }
    }, root);

    return () => {
      lifeScrollActiveRef.current = false;
      lifeScrollTriggerRef.current = null;
      context.revert();
    };
  }, [activateLifeExperience]);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-[#f8f3e8] text-[#1e1814]">
      <section className="relative isolate flex min-h-[78vh] items-center px-5 pt-28 md:px-8 lg:pt-32">
        <div
          ref={heroArtRef}
          className="pointer-events-none absolute inset-0 -z-10 opacity-80 will-change-transform"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(214,180,95,0.22),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(139,17,24,0.08),transparent_35%)]" />
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(30,24,20,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(30,24,20,0.1)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="absolute left-[8%] top-[23%] h-px w-[34vw] rotate-[-12deg] bg-gradient-to-r from-transparent via-[#d6b45f]/55 to-transparent" />
          <div className="absolute right-[10%] top-[34%] h-px w-[28vw] rotate-[16deg] bg-gradient-to-r from-transparent via-[#8b1118]/18 to-transparent" />
        </div>

        <div className="mx-auto flex w-full max-w-[64rem] flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#8b1118]"
          >
            Careers at Ractysh
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease }}
            className="mt-6 max-w-[48rem] font-display text-[34px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#181512] md:text-[44px] lg:text-[56px]"
          >
            Build the <span className="gold-gradient-text">future</span>
            <br />
            of enterprise systems.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.86, delay: 0.16, ease }}
            className="mt-6 max-w-[40rem] text-[15px] leading-[1.7] text-[#625747] md:text-[17px]"
          >
            Join a connected ecosystem focused on architecture, construction, real estate, enterprise operations,
            export-import and OTC exchange innovation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, delay: 0.24, ease }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <a
              href="#open-roles"
              className="premium-cta"
            >
              View Open Roles
            </a>
            <a
              href="#life-at-ractysh"
              className="premium-cta-secondary"
            >
              Life at Ractysh
            </a>
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 lg:py-20">
        <div className="mx-auto max-w-[86rem]">
          <div data-careers-reveal className="max-w-[34rem]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">Enterprise Culture</p>
            <h2 className="mt-4 font-display text-[24px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[30px] lg:text-[36px]">
              Why Ractysh
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {whyCards.map(({ title, text, Icon }) => (
              <motion.article
                key={title}
                data-careers-reveal
                whileHover={{ y: -4 }}
                transition={{ duration: 0.34, ease }}
                className="group relative min-h-[15.5rem] rounded-[24px] border border-[#e1d5bf] bg-white/82 p-6 shadow-[0_22px_64px_rgba(75,52,24,0.07)] backdrop-blur-sm"
              >
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#d6b45f]/80 to-transparent" />
                <span className="flex h-11 w-11 items-center justify-center rounded-[15px] border border-[#d6b45f]/35 bg-[#fff7e5] text-[#9a7428] shadow-[0_12px_28px_rgba(96,74,35,0.08)] transition duration-300 group-hover:shadow-[0_0_26px_rgba(214,180,95,0.22)]">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-8 font-display text-[18px] font-semibold tracking-[-0.03em] md:text-[22px]">{title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#625747]">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="open-roles" className="px-5 py-16 md:px-8 lg:py-20">
        <div className="mx-auto max-w-[86rem]">
          <div data-careers-reveal className="flex flex-col gap-4 border-t border-[#d8c9aa] pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">Hiring</p>
              <h2 className="mt-4 font-display text-[24px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[30px] lg:text-[36px]">
                Open Opportunities
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-[1.7] text-[#625747]">
              Focused roles across product interfaces, design systems, operations and architectural visualization.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            {openRoles.map((role) => (
              <button
                key={role.title}
                type="button"
                data-careers-reveal
                onClick={() => openApplicationModal(role.title)}
                className="group flex cursor-pointer flex-col gap-4 rounded-[22px] border border-[#e0d2b8] bg-white/72 px-5 py-5 text-left shadow-[0_16px_44px_rgba(75,52,24,0.045)] transition duration-300 hover:translate-x-1 hover:border-[#d6b45f]/62 hover:bg-[#fffaf0] hover:shadow-[0_22px_58px_rgba(75,52,24,0.08),0_0_30px_rgba(214,180,95,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b45f]/38 sm:flex-row sm:items-center sm:justify-between sm:px-7"
              >
                <span>
                  <span className="block font-display text-[18px] font-semibold tracking-[-0.03em] text-[#181512] md:text-[22px]">
                    {role.title}
                  </span>
                  <span className="mt-2 block text-sm font-medium text-[#7b7064]">{role.meta}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b1118] transition duration-300 group-hover:translate-x-1">
                  Apply Now
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="life-at-ractysh"
        ref={lifeSectionRef}
        className="relative isolate scroll-mt-28 overflow-hidden px-5 py-10 md:px-8 lg:min-h-screen lg:py-0"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#f7f0e2]" data-life-backdrop aria-hidden />
        <div
          data-life-grid
          className="pointer-events-none absolute inset-[-8%] -z-10 opacity-[0.14] will-change-transform [background-image:linear-gradient(rgba(139,17,24,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(80,60,34,0.09)_1px,transparent_1px)] [background-size:84px_84px]"
          aria-hidden
        />
        <div
          data-life-glow
          className="pointer-events-none absolute left-[42%] top-[16%] -z-10 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(214,180,95,0.22),rgba(214,180,95,0.07)_42%,transparent_70%)] opacity-70 will-change-transform"
          aria-hidden
        />
        <div className="pointer-events-none absolute bottom-[10%] left-[6%] -z-10 h-[16rem] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(139,17,24,0.07),transparent_68%)]" aria-hidden />

        <div ref={lifePinRef} className="mx-auto flex min-h-[100svh] max-w-[86rem] items-center py-6 md:py-10 lg:py-24">
          <div data-careers-reveal className="grid w-full items-center gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="relative flex flex-col justify-center lg:min-h-[42rem]">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">
                    Life at Ractysh
                  </p>
                  <p className="mt-3 max-w-[24rem] text-[14px] leading-6 text-[#776b5b]">
                    A calm operating culture moving through precision, intelligence, collaboration and modern craft.
                  </p>
                </div>

                <div className="hidden items-center gap-3 md:flex" aria-hidden>
                  <span className="font-display text-[18px] font-semibold text-[#8b1118]">
                    {String(activeLifeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="relative h-20 w-px overflow-visible rounded-full bg-[#d6b45f]/26">
                    <span
                      data-life-progress-fill
                      className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 rounded-full bg-[#8b1118] shadow-[0_0_18px_rgba(214,180,95,0.42)]"
                    />
                    <span
                      data-life-progress-glow
                      className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-[#d6b45f]/20 blur-md"
                    />
                  </span>
                  <span className="font-display text-[18px] font-semibold text-[#b4a078]">
                    {String(lifeExperiences.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="relative mt-5 min-h-[18.5rem] md:min-h-[21rem] lg:min-h-[23rem]">
                {lifeExperiences.map((experience, index) => (
                  <article
                    key={experience.title}
                    data-life-copy-panel
                    aria-hidden={activeLifeIndex !== index}
                    style={
                      shouldReduceMotion
                        ? {
                            opacity: activeLifeIndex === index ? 1 : 0,
                            visibility: activeLifeIndex === index ? "visible" : "hidden",
                            transform: "none",
                            filter: "blur(0px)"
                          }
                        : undefined
                    }
                    className="absolute inset-x-0 top-0 pl-3 opacity-0 will-change-[opacity,transform,filter]"
                  >
                    <p
                      data-life-copy-item
                      className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#9a7428]"
                    >
                      {experience.eyebrow}
                    </p>
                    <h2
                      data-life-copy-item
                      className="mt-5 max-w-[42rem] font-display text-[36px] font-semibold leading-[0.98] tracking-normal text-[#181512] md:text-[52px] lg:text-[64px]"
                    >
                      {experience.title}
                    </h2>
                    <p
                      data-life-copy-item
                      className="mt-6 max-w-[35rem] text-[15px] leading-[1.8] text-[#625747] md:text-[17px]"
                    >
                      {experience.body}
                    </p>
                    <div data-life-copy-item className="mt-6 hidden flex-wrap gap-2 sm:flex">
                      {experience.modules.map((module) => (
                        <span
                          key={module}
                          className="rounded-full border border-[#d6b45f]/28 bg-[#fff8e8]/66 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#806224]"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="relative mt-7 hidden md:block" role="tablist" aria-label="Life at Ractysh culture themes">
                <motion.span
                  aria-hidden
                  animate={{ y: activeLifeIndex * 60 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.82, ease }}
                  className="absolute left-0 top-0 h-12 w-full rounded-[16px] border border-[#d6b45f]/28 bg-[#fff8e8]/72 shadow-[0_18px_42px_rgba(89,62,28,0.07)]"
                />
                <div className="relative flex flex-col gap-3">
                  {lifeExperiences.map((experience, index) => {
                    const isActive = index === activeLifeIndex;

                    return (
                      <button
                        key={experience.title}
                        type="button"
                        data-life-menu-button
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => scrollToLifeExperience(index)}
                        className={cn(
                          "group grid h-12 grid-cols-[2rem_1fr] items-center gap-3 rounded-[16px] px-2 text-left transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b45f]/35",
                          isActive ? "text-[#181512]" : "text-[#7b7064] hover:text-[#2f261f]"
                        )}
                      >
                        <span className="relative flex h-10 w-2 items-center justify-center">
                          <span className="absolute h-10 w-px bg-[#d6b45f]/24" />
                          <span
                            data-life-menu-line
                            className="absolute h-10 w-px origin-top bg-[#8b1118] shadow-[0_0_18px_rgba(214,180,95,0.42)]"
                          />
                          <span
                            data-life-menu-dot
                            className={cn(
                              "relative h-2 w-2 rounded-full border transition duration-500",
                              isActive
                                ? "border-[#8b1118] bg-[#8b1118] shadow-[0_0_18px_rgba(214,180,95,0.52)]"
                                : "border-[#d6b45f]/46 bg-[#fff8e8]"
                            )}
                          />
                        </span>
                        <span className="truncate text-[13px] font-semibold uppercase tracking-[0.16em]">
                          {experience.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative min-h-[19.5rem] sm:min-h-[22rem] md:min-h-[34rem] lg:min-h-[42rem]">
              <div className="pointer-events-none absolute -right-6 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(214,180,95,0.16),transparent_68%)]" aria-hidden />
              <LifeStoryVisual activeIndex={activeLifeIndex} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 lg:py-20">
        <div className="mx-auto max-w-[86rem]">
          <div
            ref={processJourneyRef}
            data-careers-reveal
            className="hiring-journey relative isolate overflow-hidden rounded-[30px] border border-[#ddcfb6] px-5 py-12 shadow-[0_28px_90px_rgba(88,58,22,0.09)] md:px-8 lg:px-10 lg:py-14"
          >
            <div className="hiring-journey-grid absolute inset-0" aria-hidden />
            <div className="hiring-journey-glow absolute inset-0" data-hiring-depth="soft" aria-hidden />
            <div className="hiring-journey-flow-bg absolute inset-0" data-hiring-depth="near" aria-hidden />
            <div className="hiring-journey-particles absolute inset-0" aria-hidden>
              {Array.from({ length: 9 }).map((_, index) => (
                <span
                  key={index}
                  className="hiring-journey-particle"
                  style={
                    {
                      "--particle-left": `${12 + ((index * 11) % 78)}%`,
                      "--particle-top": `${16 + ((index * 17) % 68)}%`,
                      "--particle-delay": `${index * -0.55}s`
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[42rem]">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">
                  Application Process
                </p>
                <h2 className="mt-4 font-display text-[25px] font-semibold leading-[1.04] tracking-[-0.04em] text-[#181512] md:text-[32px] lg:text-[40px]">
                  A cinematic hiring journey into the Ractysh ecosystem.
                </h2>
              </div>

              <div className="hiring-active-panel w-full max-w-[24rem] rounded-[18px] border border-[#d6b45f]/28 bg-[#fffaf0]/70 p-4 shadow-[0_18px_48px_rgba(80,52,24,0.07)]">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#9a7428]">
                  Active workflow stage
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={processSteps[activeProcessStep].title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.55, ease }}
                    className="mt-3"
                  >
                    <p className="font-display text-[20px] font-semibold tracking-[-0.03em] text-[#181512]">
                      {processSteps[activeProcessStep].title}
                    </p>
                    <p className="mt-1 text-[13px] leading-6 text-[#6f6252]">
                      {processSteps[activeProcessStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="hiring-workflow relative z-10 mt-12 md:mt-14">
              <div className="hiring-flow-line hidden md:block" aria-hidden>
                <span className="hiring-flow-track" />
                <span ref={processLineRef} className="hiring-flow-scroll-fill" />
                <span
                  className="hiring-flow-active-fill"
                  style={{ transform: `scaleX(${(activeProcessStep + 1) / processSteps.length})` }}
                />
                <span className="hiring-flow-energy" />
              </div>
              <div className="hiring-flow-line-mobile md:hidden" aria-hidden>
                <span className="hiring-flow-track" />
                <span
                  className="hiring-flow-active-fill"
                  style={{ transform: `scaleY(${(activeProcessStep + 1) / processSteps.length})` }}
                />
                <span className="hiring-flow-energy" />
              </div>

              <div className="grid gap-4 md:grid-cols-5 md:gap-5">
                {processSteps.map((step, index) => {
                  const state =
                    index === activeProcessStep ? "active" : index < activeProcessStep ? "complete" : "upcoming";

                  return (
                    <motion.article
                      key={step.title}
                      className={cn("hiring-step-card group", {
                        "is-active": state === "active",
                        "is-complete": state === "complete",
                        "is-upcoming": state === "upcoming"
                      })}
                      animate={{
                        opacity: state === "active" ? 1 : state === "complete" ? 0.82 : 0.56,
                        scale: state === "active" ? 1 : state === "complete" ? 0.98 : 0.94,
                        y: state === "active" ? 0 : state === "complete" ? 4 : 10
                      }}
                      whileHover={{ y: -7, scale: 1 }}
                      transition={{ duration: 0.8, ease }}
                    >
                      <span className="hiring-step-reflection" aria-hidden />
                      <div className="flex items-start gap-4 md:block">
                        <span className="hiring-step-orb">
                          <span>{String(index + 1).padStart(2, "0")}</span>
                        </span>
                        <div className="min-w-0 md:mt-7">
                          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#9a7428]">
                            Stage {String(index + 1).padStart(2, "0")}
                          </p>
                          <h3 className="mt-2 font-display text-[18px] font-semibold tracking-[-0.03em] text-[#181512] md:text-[20px]">
                            {step.title}
                          </h3>
                          <p className="mt-2 text-[13px] leading-6 text-[#6f6252]">{step.description}</p>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate px-5 py-16 md:px-8 lg:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_44%,rgba(214,180,95,0.24),transparent_36%)]" />
        <div data-careers-reveal className="mx-auto max-w-[38rem] text-center">
          <h2 className="font-display text-[24px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[30px] lg:text-[36px]">
            Shape the next generation of enterprise systems.
          </h2>
          <div className="mt-8">
            <ApplyLink onClick={() => openApplicationModal("General Application")}>Apply Today</ApplyLink>
          </div>
        </div>
      </section>

      <CareerApplicationModal
        isOpen={Boolean(applicationRole)}
        roleTitle={applicationRole ?? "General Application"}
        onClose={closeApplicationModal}
      />
    </div>
  );
}
