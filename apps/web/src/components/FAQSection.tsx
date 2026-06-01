"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  FileCheck2,
  Globe2,
  Layers3,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumFAQ {
  question: string;
  answer: string;
  signal: string;
  Icon: LucideIcon;
}

const ease = [0.22, 1, 0.36, 1] as const;

const faqs: PremiumFAQ[] = [
  {
    question: "How does Ractysh coordinate multi-division enterprise requirements?",
    answer:
      "Ractysh routes architecture, construction, real estate, export-import and OTC exchange requirements through one controlled intake. Each mandate is reviewed for scope, priority, documentation, delivery ownership and the right operating layer before execution begins.",
    signal: "Ecosystem intake",
    Icon: Layers3
  },
  {
    question: "Can the group support premium architecture and infrastructure execution together?",
    answer:
      "Yes. The ecosystem is designed for connected planning, visualization, structural coordination, site execution, procurement visibility and handover governance, so design intent and delivery discipline remain aligned across the project lifecycle.",
    signal: "Built environment",
    Icon: Building2
  },
  {
    question: "What makes the engagement model suitable for founders and enterprise teams?",
    answer:
      "The process is built around senior review, concise decision records, measured communication and clear next actions. Ractysh keeps the engagement focused on commercially relevant details instead of fragmented vendor conversations.",
    signal: "Executive control",
    Icon: ShieldCheck
  },
  {
    question: "How are global commerce and import-export workflows handled?",
    answer:
      "Trade workflows are handled with structured intake, supplier or buyer context, documentation expectations, logistics visibility and approval checkpoints. The objective is to keep international movement clear, auditable and commercially disciplined.",
    signal: "Global commerce",
    Icon: Globe2
  },
  {
    question: "What should a client prepare before requesting a consultation?",
    answer:
      "Share the business objective, location or market context, desired timeline, known constraints, available drawings or documents and the decision makers involved. A concise brief helps the Ractysh team identify the correct path faster.",
    signal: "Briefing readiness",
    Icon: FileCheck2
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06
    }
  }
};

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.82, ease }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.74, ease }
  }
};

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative isolate overflow-hidden bg-[#F8F6F1] px-5 py-[86px] text-[#181512] sm:px-6 md:px-8 md:py-[126px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(214,180,95,0.18),transparent_30rem),radial-gradient(circle_at_15%_82%,rgba(139,17,24,0.055),transparent_26rem),linear-gradient(180deg,#FFFCF7_0%,#F8F6F1_46%,#F4F1EA_100%)]" />
      <div className="pointer-events-none absolute -inset-x-10 inset-y-0 opacity-[0.18] [background-image:linear-gradient(rgba(98,78,34,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(98,78,34,0.1)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_64%_38%,black,transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle,rgba(154,116,40,0.46)_1px,transparent_1.4px)] [background-size:36px_36px] [mask-image:linear-gradient(180deg,transparent,black_18%,black_78%,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.48),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(24,21,18,0.1),transparent)]" />
      <div className="pointer-events-none absolute right-[7%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.74),rgba(214,180,95,0.16)_38%,transparent_70%)] opacity-80" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22, margin: "-8% 0px" }}
        className="relative z-10 mx-auto w-full max-w-[1240px]"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:items-end">
          <motion.div variants={revealVariants}>
            <div className="flex items-center gap-4">
              <span className="h-px w-9 bg-[#d6b45f]" />
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#9a7428]">
                Frequently Asked Questions
              </p>
            </div>
            <h2 className="mt-7 max-w-[660px] [font-family:var(--font-cormorant)] text-[clamp(3.05rem,5.6vw,5.85rem)] font-semibold leading-[0.94] tracking-[0] text-[#181512]">
              Clarity before the enterprise conversation.
            </h2>
            <p className="mt-7 max-w-[610px] text-[1rem] font-medium leading-8 text-[#665f55] md:text-[1.08rem]">
              A refined briefing layer for clients entering the Ractysh Group ecosystem across built environments,
              infrastructure delivery and global commerce.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden rounded-[8px] border border-[#d6b45f]/22 bg-[#fffdf8]/68 p-5 shadow-[0_26px_80px_rgba(98,78,34,0.11),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur md:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(255,255,255,0.2)_48%,rgba(214,180,95,0.12))]" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full border border-[#d6b45f]/22" />
            <div className="pointer-events-none absolute -right-12 top-12 h-28 w-28 rounded-full border border-[#181512]/8" />
            <div className="relative grid gap-5 sm:grid-cols-[1fr_0.88fr] sm:items-end">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#8b1118]">
                  Ractysh Group
                </p>
                <h3 className="mt-3 font-display text-[2rem] font-[650] leading-none tracking-[-0.035em] text-[#221b16]">
                  Enterprise readiness desk
                </h3>
                <p className="mt-4 max-w-[25rem] text-[0.92rem] font-medium leading-7 text-[#6c6257]">
                  Questions are organized around scope control, division alignment, documentation and senior decision flow.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["05", "Operating pillars"],
                  ["01", "Connected intake"],
                  ["24h", "Priority review"],
                  ["360", "Project context"]
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[8px] border border-[#d6b45f]/18 bg-white/48 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
                  >
                    <p className="font-display text-[1.7rem] font-[650] leading-none tracking-[-0.03em] text-[#181512]">
                      {value}
                    </p>
                    <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#8b7a64]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:items-start">
          <motion.aside
            variants={cardVariants}
            className="relative overflow-hidden rounded-[8px] border border-[#181512]/10 bg-[#17120f] p-6 text-[#fff8ec] shadow-[0_34px_100px_rgba(24,21,18,0.22)] md:p-7"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_12%,rgba(214,180,95,0.24),transparent_19rem),linear-gradient(150deg,rgba(255,255,255,0.09),transparent_44%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(214,180,95,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(214,180,95,0.14)_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#d6b45f]/28 bg-[#fff8ec]/8">
                <ShieldCheck className="h-5 w-5 text-[#f0cf82]" strokeWidth={1.8} />
              </div>
              <h3 className="mt-8 max-w-[18rem] font-display text-[2.3rem] font-[650] leading-[0.95] tracking-[-0.035em]">
                Designed for disciplined entry.
              </h3>
              <p className="mt-5 text-[0.94rem] leading-7 text-[rgba(232,221,199,0.78)]">
                The FAQ answers the first operational questions before a private consultation, reducing ambiguity around
                governance, execution and commercial readiness.
              </p>

              <div className="mt-8 space-y-3">
                {["Architecture and infrastructure", "Real estate and execution control", "Import-export and enterprise trade"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-4 border-t border-[#d6b45f]/18 pt-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[rgba(245,234,214,0.82)]"
                    >
                      <span>{item}</span>
                      <ArrowRight className="h-4 w-4 text-[#d6b45f]" strokeWidth={1.8} />
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.aside>

          <motion.div variants={containerVariants} className="space-y-3">
            {faqs.map((faq, index) => (
              <PremiumFAQItem
                key={faq.question}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                shouldReduceMotion={Boolean(shouldReduceMotion)}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function PremiumFAQItem({
  faq,
  index,
  isOpen,
  onToggle,
  shouldReduceMotion
}: {
  faq: PremiumFAQ;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  shouldReduceMotion: boolean;
}) {
  const answerId = `premium-home-faq-answer-${index}`;
  const Icon = faq.Icon;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      className={cn(
        "group relative overflow-hidden rounded-[8px] border bg-[#fffdf8]/70 shadow-[0_20px_62px_rgba(98,78,34,0.08),inset_0_1px_0_rgba(255,255,255,0.88)] backdrop-blur transition-colors duration-300",
        isOpen ? "border-[#d6b45f]/38" : "border-[#d8cfbd]/72 hover:border-[#d6b45f]/30"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.74),transparent_52%,rgba(214,180,95,0.09))] opacity-90" />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-[#d6b45f] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      />

      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
        className="relative flex w-full items-start justify-between gap-5 p-5 text-left md:p-6"
      >
        <span className="flex min-w-0 gap-4">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border transition duration-300",
              isOpen
                ? "border-[#d6b45f]/48 bg-[#181512] text-[#f2d489]"
                : "border-[#d6b45f]/20 bg-white/56 text-[#9a7428] group-hover:border-[#d6b45f]/38"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.66rem] font-bold uppercase tracking-[0.19em] text-[#9a7428]">
              {faq.signal}
            </span>
            <span className="mt-2 block font-display text-[1.36rem] font-[650] leading-[1.08] tracking-[-0.03em] text-[#261f1a] md:text-[1.65rem]">
              {faq.question}
            </span>
          </span>
        </span>

        <span
          className={cn(
            "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#d8cfbd] bg-white/48 text-[#342f2a] transition duration-300",
            isOpen && "rotate-180 border-[#d6b45f]/42 bg-[#fff8ea] text-[#9a7428]"
          )}
        >
          <ChevronDown className="h-4 w-4" strokeWidth={2.1} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={answerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.42, ease }}
            className="relative overflow-hidden"
          >
            <div className="px-5 pb-6 pl-[5.25rem] pr-8 md:px-6 md:pb-7 md:pl-[5.75rem]">
              <div className="h-px w-full bg-[linear-gradient(90deg,rgba(214,180,95,0.38),transparent)]" />
              <p className="mt-5 max-w-[720px] text-[0.95rem] font-medium leading-8 text-[#6b6258]">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
