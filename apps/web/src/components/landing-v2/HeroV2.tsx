"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownUp,
  ArrowUpRight,
  Building2,
  CalendarDays,
  ChevronDown,
  HardHat,
  Landmark,
  LayoutGrid,
  Ship,
  SquareAsterisk,
  UserRound,
  Waypoints
} from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const dashboardCards = [
  {
    title: "Architecture & Real Estate Mandate",
    label: "Spatial + Asset Strategy",
    status: "In Progress",
    statusClass: "text-[#8b1118]",
    code: "ARE",
    owner: "Ractysh A",
    progress: "9 out of 14",
    due: "Active cycle",
    description: "Coordinate planning logic, property positioning, investor material and stakeholder approvals",
    Icon: Building2
  },
  {
    title: "Construction Delivery Control",
    label: "Construction Command",
    status: "In Progress",
    statusClass: "text-[#8b1118]",
    code: "CON",
    owner: "Ractysh C",
    progress: "18 out of 26",
    due: "Live lane",
    description: "Track site execution, structural work, MEP coordination, procurement and premium handover",
    Icon: HardHat
  },
  {
    title: "Export-Import & OTC Exchange Desk",
    label: "Trade + Private Deals",
    status: "Ongoing",
    statusClass: "text-[#14845f]",
    code: "OTC",
    owner: "Ractysh E",
    progress: "11 out of 18",
    due: "Private desk",
    description: "Manage supplier movement, documentation, counterparty intake and private transaction readiness",
    Icon: Ship
  }
];

const sidebarIcons = [LayoutGrid, Waypoints, ArrowDownUp, Landmark, UserRound];

function DashboardCardV2({ card, index }: { card: (typeof dashboardCards)[number]; index: number }) {
  const Icon = card.Icon;

  return (
    <div className="min-h-[15.4rem] border border-[#eadbc0] bg-white/82 shadow-[0_18px_52px_rgba(88,62,33,0.07)]">
      <div className="border-b border-[#eadbc0] p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#eadbc0] bg-white text-[0.82rem] font-semibold text-[#181512] shadow-[0_12px_26px_rgba(82,61,31,0.08)]">
            {card.code}
          </span>
          <div>
            <p className="text-[0.68rem] font-semibold leading-none text-[#8b7d69]">{card.label}</p>
            <h3 className="mt-3 font-display text-[1.28rem] font-semibold leading-[1.02] tracking-normal text-[#181512]">
              {card.title}
            </h3>
          </div>
          <Icon className="ml-auto hidden h-4 w-4 text-[#c6a45b] sm:block" strokeWidth={1.6} />
        </div>
      </div>
      <div className="p-4">
        <p className={cn("text-[0.78rem] font-semibold leading-none", card.statusClass)}>{card.status}</p>
        <p className="mt-4 min-h-[3.4rem] text-[0.82rem] font-medium leading-5 text-[#4c443b]">{card.description}</p>
        <div className="mt-4 space-y-3 text-[0.74rem] font-medium text-[#81786f]">
          {[
            { icon: UserRound, label: "Assigned to", value: card.owner },
            { icon: ArrowDownUp, label: "Open work", value: card.progress },
            { icon: CalendarDays, label: "Due on", value: card.due }
          ].map((row) => {
            const RowIcon = row.icon;
            return (
              <div key={row.label} className="grid grid-cols-[1rem_1fr_auto] items-center gap-3 border-t border-[#efe4d3] pt-3">
                <RowIcon className="h-3.5 w-3.5 text-[#181512]" strokeWidth={1.7} />
                <span>{row.label}</span>
                <span className="font-semibold text-[#4c443b]">{row.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeroDashboardV2() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.34, ease }}
      className="mx-auto mt-10 grid w-full max-w-[67rem] grid-cols-[3.4rem_1fr] overflow-hidden border border-[#eadbc0] bg-white/86 text-left shadow-[0_28px_92px_rgba(82,61,31,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]"
    >
      <aside className="flex flex-col items-center gap-5 border-r border-[#eadbc0] bg-white/62 px-2 py-6">
        <span className="relative h-7 w-7">
          <span className="absolute left-0 top-0 h-[1.125rem] w-[1.125rem] rounded-[0.22rem] bg-[#c6a45b]" />
          <span className="absolute bottom-0 right-0 h-[1.125rem] w-[1.125rem] rounded-[0.22rem] bg-[#8b1118]" />
        </span>
        {sidebarIcons.map((Icon, index) => (
          <span key={index} className="relative flex h-5 w-5 items-center justify-center text-[#8d867b]">
            {index === 1 ? <span className="absolute -left-[1rem] h-[3.8rem] w-[2px] bg-[#181512]" /> : null}
            <Icon className={cn("h-5 w-5", index === 1 && "text-[#181512]")} strokeWidth={1.7} />
          </span>
        ))}
      </aside>

      <div className="px-4 py-6 sm:px-7">
        <div className="mb-5">
          <h2 className="font-display text-[1.55rem] font-semibold leading-none tracking-normal text-[#181512]">
            Dashboard
          </h2>
          <p className="mt-2 text-[0.78rem] font-medium leading-none text-[#4c443b]">
            Five-pillar enterprise operations in one place
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <button className="flex h-9 w-[15rem] items-center gap-2 border border-[#eadbc0] bg-white/76 px-3 text-[0.78rem] font-medium tracking-[0.03em] text-[#756b5f] shadow-[0_8px_22px_rgba(82,61,31,0.04)]">
            <SquareAsterisk className="h-3.5 w-3.5 text-[#8b7d69]" strokeWidth={1.7} />
            Entity: All companies
            <ChevronDown className="ml-auto h-3.5 w-3.5 text-[#c6a45b]" strokeWidth={1.7} />
          </button>
          <button className="flex h-9 w-[17rem] items-center gap-2 border border-[#eadbc0] bg-white/76 px-3 text-[0.78rem] font-medium tracking-[0.03em] text-[#756b5f] shadow-[0_8px_22px_rgba(82,61,31,0.04)]">
            <ArrowDownUp className="h-3.5 w-3.5 text-[#8b7d69]" strokeWidth={1.7} />
            Sort by: Executive priority
            <ChevronDown className="ml-auto h-3.5 w-3.5 text-[#c6a45b]" strokeWidth={1.7} />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {dashboardCards.map((card, index) => (
            <DashboardCardV2 key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function HeroV2() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[max(56rem,100svh)] overflow-hidden bg-[#fbf7ef] px-5 pb-14 pt-28 text-[#181512] sm:px-8 lg:pt-24">
      <Image
        src="/landing-v2-hero-bg.png"
        alt="Premium Ractysh enterprise ecosystem background with architecture on the left and global trade visuals on the right."
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: -9, backgroundColor: "rgba(24, 21, 18, 0.1)" }}
      />

      <div className="relative z-10 mx-auto max-w-[80rem] text-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease }}
          className="mx-auto inline-flex items-center gap-4 text-[0.86rem] font-semibold text-[#8b1118]"
        >
          <span>Ractysh Group Enterprise Ecosystem</span>
          <span className="h-5 w-px bg-[#d9c8aa]" />
          <Link href="/about" className="inline-flex items-center gap-1.5">
            Know More
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </motion.div>

        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease }}
          className="mx-auto mt-7 max-w-[72rem] font-display text-[calc(2.35rem-1px)] font-semibold leading-[1.03] tracking-normal text-[#181512] sm:text-[calc(3rem-1px)] md:text-[calc(3.7rem-1px)] lg:text-[calc(4.7rem-1px)]"
        >
          <span className="block">
            Build, design and <span className="text-[#c6a45b]">trade</span>
          </span>
          <span className="block">
            <span className="text-[#8b1118]">global commerce</span> through one ecosystem
          </span>
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 0.2, ease }}
          className="mx-auto mt-7 max-w-[47rem] text-[1rem] font-medium leading-7 text-[#302924] md:text-[1.06rem]"
        >
          <span className="block">Ractysh Group operates across five private enterprise pillars.</span>
          <span className="block">One premium ecosystem for spatial, delivery, asset, trade and private exchange workflows.</span>
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scaleX: 0.72 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.72, delay: 0.28, ease }}
          className="mx-auto mt-8 flex max-w-[18rem] items-center justify-center gap-5"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-[#d6b45f]" />
          <span className="h-2 w-2 rotate-45 bg-[#c6a45b]" />
          <span className="h-px flex-1 bg-[#d6b45f]" />
        </motion.div>

        <HeroDashboardV2 />
      </div>
    </section>
  );
}
