"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  DraftingCompass,
  Globe2,
  HardHat,
  Layers3,
  Network,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { ServiceRequestCTA } from "@/components/ServiceRequestCTA";
import { enterprisePillars, type EnterprisePillar, type EnterprisePillarKey } from "@/data/enterprisePillars";

const ease = [0.22, 1, 0.36, 1] as const;

const iconMap: Record<EnterprisePillarKey, LucideIcon> = {
  architecture: DraftingCompass,
  construction: HardHat,
  "real-estate": Building2,
  "import-export": Globe2,
  "otc-exchange": ShieldCheck
};

interface EnterprisePillarLandingPageProps {
  pillar: EnterprisePillar;
}

function revealProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.22 },
    transition: { duration: 0.78, delay, ease }
  };
}

export function EnterprisePillarLandingPage({ pillar }: EnterprisePillarLandingPageProps) {
  const reduceMotion = useReducedMotion();
  const Icon = iconMap[pillar.key];
  const relatedPillars = enterprisePillars.filter((item) => item.key !== pillar.key);
  const isRealEstate = pillar.key === "real-estate";

  return (
    <article
      className={[
        "relative isolate overflow-hidden bg-[#f8f4ea] text-[#1f1712]",
        isRealEstate ? "bg-[linear-gradient(180deg,#fbf5e8_0%,#f4e7d2_48%,#fffaf0_100%)]" : ""
      ].join(" ")}
    >
      <section
        className={[
          "relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#100b09] px-5 pb-20 pt-32 text-[#fffaf0] sm:px-6 md:px-8 lg:pt-36",
          isRealEstate ? "bg-[#0d0907] lg:pb-24" : ""
        ].join(" ")}
      >
        <motion.img
          src={pillar.image}
          alt=""
          initial={reduceMotion ? false : { scale: 1.06 }}
          animate={reduceMotion ? undefined : { scale: 1.015 }}
          transition={{ duration: reduceMotion ? 0 : 2.4, ease }}
          className={[
            "absolute inset-0 h-full w-full object-cover opacity-48",
            isRealEstate ? "opacity-[0.68] saturate-[0.88] contrast-[1.03] [filter:sepia(0.08)_saturate(0.88)_contrast(1.04)]" : ""
          ].join(" ")}
        />
        <div
          className={[
            "absolute inset-0 bg-[linear-gradient(90deg,rgba(14,8,7,0.97),rgba(14,8,7,0.82)_46%,rgba(14,8,7,0.58)),linear-gradient(180deg,rgba(14,8,7,0.64),rgba(14,8,7,0.18)_42%,rgba(14,8,7,0.72)),radial-gradient(circle_at_78%_28%,rgba(214,180,95,0.18),transparent_28rem)]",
            isRealEstate
              ? "bg-[linear-gradient(90deg,rgba(12,8,6,0.98),rgba(18,11,8,0.86)_43%,rgba(18,10,8,0.58)),linear-gradient(180deg,rgba(12,8,6,0.72),rgba(12,8,6,0.22)_44%,rgba(12,8,6,0.84)),radial-gradient(circle_at_74%_24%,rgba(226,191,111,0.26),transparent_30rem),radial-gradient(circle_at_18%_76%,rgba(139,17,24,0.18),transparent_28rem)]"
              : ""
          ].join(" ")}
        />
        <div
          className={[
            "pointer-events-none absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(255,247,224,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,247,224,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_50%_36%,black,transparent_76%)]",
            isRealEstate ? "opacity-[0.16] [background-size:92px_92px] [mask-image:radial-gradient(ellipse_at_52%_42%,black,rgba(0,0,0,0.46)_62%,transparent_84%)]" : ""
          ].join(" ")}
        />
        {isRealEstate ? (
          <>
            <div className="pointer-events-none absolute inset-x-6 top-28 h-px bg-[linear-gradient(90deg,transparent,rgba(226,191,111,0.72),transparent)] md:inset-x-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,#f8f4ea)]" />
          </>
        ) : null}

        <div
          className={[
            "relative z-10 mx-auto grid w-full max-w-[1260px] gap-12 lg:grid-cols-[0.9fr_1fr] lg:items-center",
            isRealEstate ? "max-w-[1320px] gap-14 lg:grid-cols-[0.94fr_1fr] xl:gap-16" : ""
          ].join(" ")}
        >
          <div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.72, ease }}
              className={[
                "inline-flex items-center gap-3 rounded-[8px] border border-[#d6b45f]/[0.52] bg-white/[0.08] px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#f0d58e]",
                isRealEstate
                  ? "border-[#e2bf6f]/60 bg-[#fffaf0]/[0.095] px-4 py-2.5 text-[#f6ddb0] shadow-[0_18px_50px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl"
                  : ""
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {pillar.eyebrow}
            </motion.div>

            <h1
              className={[
                "mt-7 max-w-[52rem] font-display text-[clamp(3.2rem,6vw,6.4rem)] font-semibold leading-[0.9] tracking-normal text-[#fffaf0] [text-shadow:0_20px_60px_rgba(0,0,0,0.58)]",
                isRealEstate
                  ? "mt-8 max-w-[58rem] font-cormorant text-[clamp(3.65rem,6.9vw,7.55rem)] leading-[0.86] [font-family:var(--font-cormorant)!important] [text-shadow:0_28px_82px_rgba(0,0,0,0.7)]"
                  : ""
              ].join(" ")}
            >
              {pillar.headline.map((line, index) => (
                <motion.span
                  key={line}
                  aria-hidden="true"
                  initial={reduceMotion ? false : { opacity: 0, y: 42, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: reduceMotion ? 0 : 1.05, delay: 0.1 + index * 0.1, ease }}
                  className={index === 1 ? "block text-[#f0d58e]" : "block"}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.92, delay: 0.44, ease }}
              className={[
                "mt-7 max-w-[42rem] text-[1rem] font-medium leading-8 text-[rgba(255,255,255,0.84)] [text-shadow:0_10px_32px_rgba(0,0,0,0.42)] md:text-[1.08rem]",
                isRealEstate ? "mt-8 max-w-[45rem] text-[1.08rem] leading-9 text-[#fff8ea]/90 md:text-[1.18rem]" : ""
              ].join(" ")}
            >
              {pillar.summary}
            </motion.p>
            {isRealEstate ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.54, ease }}
                className="mt-8 grid max-w-[38rem] gap-3 border-y border-[#e2bf6f]/22 py-5 sm:grid-cols-3"
                aria-label="Real estate value signals"
              >
                {pillar.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#f6ddb0]/82">
                    {tag}
                  </span>
                ))}
              </motion.div>
            ) : null}

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.86, delay: isRealEstate ? 0.64 : 0.5, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link href="/book-consultation" className="premium-cta group">
                Start Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/business" className="premium-cta-secondary group">
                View Ecosystem
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <ServiceRequestCTA
                showLabel={false}
                buttonLabel={isRealEstate ? "Connect With This Division" : undefined}
                buttonClassName={isRealEstate ? "min-w-[15.5rem] px-5 text-[0.84rem]" : undefined}
              />
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.08, delay: 0.24, ease }}
            className={[
              "relative min-h-[34rem] overflow-hidden rounded-[8px] border border-white/14 bg-white/[0.08] p-4 text-[#fffaf0] shadow-[0_40px_130px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl md:p-6",
              isRealEstate
                ? "min-h-[36rem] border-[#e2bf6f]/24 bg-[#fffaf0]/[0.085] p-5 shadow-[0_48px_150px_rgba(0,0,0,0.48),0_0_0_1px_rgba(226,191,111,0.08),inset_0_1px_0_rgba(255,255,255,0.18)] md:p-7"
                : ""
            ].join(" ")}
          >
            <div
              className={[
                "absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(214,180,95,0.22),transparent_26rem),linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))]",
                isRealEstate ? "bg-[radial-gradient(circle_at_48%_12%,rgba(226,191,111,0.28),transparent_24rem),radial-gradient(circle_at_88%_72%,rgba(139,17,24,0.16),transparent_21rem),linear-gradient(135deg,rgba(255,250,240,0.14),rgba(255,250,240,0.035))]" : ""
              ].join(" ")}
            />
            <div
              className={[
                "absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,247,224,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,247,224,0.1)_1px,transparent_1px)] [background-size:38px_38px]",
                isRealEstate ? "opacity-[0.16] [background-size:46px_46px]" : ""
              ].join(" ")}
            />
            {isRealEstate ? (
              <>
                <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(246,221,176,0.9),transparent)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.24] [background:linear-gradient(112deg,transparent_0%,rgba(255,250,240,0.12)_44%,rgba(226,191,111,0.12)_50%,transparent_58%)]" />
              </>
            ) : null}

            <div className="relative z-10 flex h-full min-h-[31rem] flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#d6b45f]">
                    {pillar.category}
                  </p>
                  <h2
                    className={[
                      "mt-3 max-w-[22rem] font-display text-[2.3rem] font-semibold leading-none text-[#fffaf0] [text-shadow:0_16px_42px_rgba(0,0,0,0.44)]",
                      isRealEstate ? "max-w-[25rem] text-[2.75rem] leading-[0.95] text-[#fff8ea] md:text-[3.1rem]" : ""
                    ].join(" ")}
                  >
                    {pillar.divisionName}
                  </h2>
                </div>
                <span
                  className={[
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] border border-[#d6b45f]/34 bg-[#090807] text-[#f8e7b9]",
                    isRealEstate ? "h-14 w-14 border-[#e2bf6f]/44 bg-[#fffaf0]/10 shadow-[0_20px_54px_rgba(0,0,0,0.25)] backdrop-blur-xl" : ""
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
              </div>

              <div className="relative mx-auto my-8 flex aspect-square w-[min(25rem,72vw)] items-center justify-center">
                <div className="absolute inset-[12%] rounded-full border border-[#d6b45f]/20" />
                <div className="absolute inset-[24%] rounded-full border border-white/12" />
                <div className="absolute left-1/2 top-1/2 h-px w-[88%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.72),transparent)]" />
                <div className="absolute left-1/2 top-1/2 h-[88%] w-px -translate-y-1/2 bg-[linear-gradient(180deg,transparent,rgba(214,180,95,0.42),transparent)]" />
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] }}
                  transition={{ duration: isRealEstate ? 10.5 : 8.4, repeat: Infinity, ease: "easeInOut" }}
                  className={[
                    "relative z-10 flex h-32 w-32 items-center justify-center rounded-[8px] border border-[#d6b45f]/44 bg-[#fff8e8] text-[#241911] shadow-[0_28px_78px_rgba(0,0,0,0.34)]",
                    isRealEstate ? "h-36 w-36 border-[#e2bf6f]/54 bg-[linear-gradient(135deg,#fffaf0,#e9d1a0)] shadow-[0_32px_92px_rgba(0,0,0,0.42),0_0_42px_rgba(226,191,111,0.16)]" : ""
                  ].join(" ")}
                >
                  <div className="text-center">
                    <Icon className="mx-auto h-7 w-7 text-[#8b1118]" strokeWidth={1.7} />
                    <p className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#8a6823]">
                      Pillar Core
                    </p>
                  </div>
                </motion.div>

                {pillar.visualNodes.map((node, index) => {
                  const positions = [
                    "left-0 top-[22%]",
                    "right-0 top-[22%]",
                    "bottom-[18%] left-[3%]",
                    "bottom-[18%] right-[3%]"
                  ];

                  return (
                    <motion.div
                      key={node}
                      animate={reduceMotion ? undefined : { y: [0, -7, 0], opacity: [0.76, 1, 0.76] }}
                      transition={{ duration: 6.8 + index * 0.4, delay: index * 0.18, repeat: Infinity, ease: "easeInOut" }}
                      className={[
                        `absolute ${positions[index] || positions[0]} rounded-[8px] border border-[#d6b45f]/25 bg-[#110d0b]/[0.88] px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-[#f0d58e] shadow-[0_18px_54px_rgba(0,0,0,0.28)]`,
                        isRealEstate ? "border-[#e2bf6f]/34 bg-[#110d0b]/[0.78] px-3.5 py-2.5 text-[#f6ddb0] shadow-[0_20px_58px_rgba(0,0,0,0.34)] backdrop-blur-xl" : ""
                      ].join(" ")}
                    >
                      {node}
                    </motion.div>
                  );
                })}
              </div>

              <div
                className={[
                  "grid grid-cols-3 overflow-hidden rounded-[8px] border border-white/10 bg-[#090807]/70",
                  isRealEstate ? "border-[#e2bf6f]/20 bg-[#090807]/62 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl" : ""
                ].join(" ")}
              >
                {pillar.metrics.map((metric) => (
                  <div key={metric.label} className="border-r border-white/10 px-3 py-4 last:border-r-0">
                    <p className={["text-[1.05rem] font-semibold leading-none text-[#f0d58e]", isRealEstate ? "text-[1.18rem] text-[#f6ddb0]" : ""].join(" ")}>{metric.value}</p>
                    <p className={["mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[#f0d58e]", isRealEstate ? "text-[#fff8ea]/76" : ""].join(" ")}>
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={["relative isolate px-5 py-20 sm:px-6 md:px-8 lg:py-28", isRealEstate ? "lg:py-32" : ""].join(" ")}>
        <div
          className={[
            "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_20%,rgba(214,180,95,0.14),transparent_30rem),linear-gradient(180deg,#fffaf0_0%,#f8f4ea_100%)]",
            isRealEstate
              ? "bg-[radial-gradient(circle_at_86%_18%,rgba(226,191,111,0.18),transparent_32rem),radial-gradient(circle_at_18%_78%,rgba(139,17,24,0.055),transparent_28rem),linear-gradient(180deg,#fffaf0_0%,#f7ebd8_100%)]"
              : ""
          ].join(" ")}
        />
        <div className="relative mx-auto max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <motion.div {...revealProps()} className="max-w-[43rem]">
              <p
                className={[
                  "text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]",
                  isRealEstate ? "flex items-center gap-4 text-[#8b1118]" : ""
                ].join(" ")}
              >
                {isRealEstate ? <span className="h-px w-10 bg-[#c9a14c]" /> : null}
                Business Overview
              </p>
              <h2
                className={[
                  "mt-5 font-display text-[2.45rem] font-semibold leading-[1] tracking-normal text-[#1f1712] md:text-[4rem]",
                  isRealEstate ? "mt-6 max-w-[45rem] text-[2.9rem] leading-[0.96] text-[#1b120e] md:text-[4.7rem]" : ""
                ].join(" ")}
              >
                {pillar.overviewTitle}
              </h2>
            </motion.div>
            <motion.div
              {...revealProps(0.06)}
              className={[
                "max-w-[42rem] lg:justify-self-end",
                isRealEstate ? "rounded-[8px] border border-[#d8c18a]/60 bg-white/60 p-6 shadow-[0_24px_80px_rgba(80,52,24,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl" : ""
              ].join(" ")}
            >
              <p className={["text-[1rem] leading-8 text-[#62564d]", isRealEstate ? "text-[1.04rem] leading-9 text-[#584a3e]" : ""].join(" ")}>{pillar.overview}</p>
              <p className={["mt-5 text-[0.98rem] font-semibold leading-7 text-[#3c3028]", isRealEstate ? "border-t border-[#d8c18a]/58 pt-5 text-[1.02rem] leading-8 text-[#2f241d]" : ""].join(" ")}>
                {pillar.businessValue}
              </p>
            </motion.div>
          </div>

          <div className={["mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4", isRealEstate ? "mt-16 gap-5" : ""].join(" ")}>
            {pillar.capabilities.map((capability, index) => (
              <motion.article
                key={capability.title}
                {...revealProps(index * 0.04)}
                className={[
                  "group min-h-[18rem] rounded-[8px] border border-[#d9c79f]/62 bg-white/76 p-5 shadow-[0_20px_60px_rgba(80,52,24,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#cba757] hover:bg-white",
                  isRealEstate
                    ? "relative overflow-hidden border-[#d8c18a]/72 bg-[#fffdf8]/78 p-6 shadow-[0_24px_78px_rgba(80,52,24,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl duration-500 hover:-translate-y-2 hover:border-[#c9a14c] hover:shadow-[0_34px_96px_rgba(80,52,24,0.16),0_0_34px_rgba(226,191,111,0.12)]"
                    : ""
                ].join(" ")}
              >
                {isRealEstate ? (
                  <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(201,161,76,0.72),transparent)] opacity-80" />
                ) : null}
                <span
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#dfc995] bg-[#fffaf0] text-[#8b1118]",
                    isRealEstate ? "h-12 w-12 border-[#d8c18a] bg-white shadow-[0_16px_42px_rgba(80,52,24,0.08)]" : ""
                  ].join(" ")}
                >
                  <ClipboardCheck className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <p className="mt-7 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#9a7428]">
                  Capability 0{index + 1}
                </p>
                <h3 className={["mt-3 font-display text-[1.45rem] font-semibold leading-tight text-[#211914]", isRealEstate ? "text-[1.72rem] leading-[1.02] text-[#1f1712]" : ""].join(" ")}>
                  {capability.title}
                </h3>
                <p className={["mt-4 text-[0.94rem] leading-6 text-[#665f55]", isRealEstate ? "leading-7 text-[#5b5047]" : ""].join(" ")}>{capability.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={[
          "relative isolate overflow-hidden bg-[#110d0b] px-5 py-20 text-[#fffaf0] sm:px-6 md:px-8 lg:py-28",
          isRealEstate ? "bg-[#0e0a08] lg:py-32" : ""
        ].join(" ")}
      >
        <div
          className={[
            "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(214,180,95,0.18),transparent_28rem),radial-gradient(circle_at_80%_70%,rgba(139,17,24,0.22),transparent_30rem)]",
            isRealEstate
              ? "bg-[radial-gradient(circle_at_22%_18%,rgba(226,191,111,0.2),transparent_30rem),radial-gradient(circle_at_76%_76%,rgba(139,17,24,0.2),transparent_32rem),linear-gradient(135deg,#0e0a08_0%,#1b100d_52%,#090706_100%)]"
              : ""
          ].join(" ")}
        />
        <div
          className={[
            "pointer-events-none absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(255,247,224,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,247,224,0.08)_1px,transparent_1px)] [background-size:64px_64px]",
            isRealEstate ? "opacity-[0.12] [background-size:82px_82px]" : ""
          ].join(" ")}
        />
        {isRealEstate ? (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(226,191,111,0.74),transparent)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(226,191,111,0.42),transparent)]" />
          </>
        ) : null}

        <div className="relative mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <motion.div {...revealProps()} className="lg:sticky lg:top-32 lg:self-start">
            <p className={["text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#f0d58e]", isRealEstate ? "flex items-center gap-4 text-[#f6ddb0]" : ""].join(" ")}>
              {isRealEstate ? <span className="h-px w-10 bg-[#e2bf6f]" /> : null}
              Workflow
            </p>
            <h2
              className={[
                "mt-5 font-display text-[2.45rem] font-semibold leading-[1] tracking-normal text-[#fffaf0] [text-shadow:0_18px_54px_rgba(0,0,0,0.48)] md:text-[4rem]",
                isRealEstate ? "mt-6 text-[2.85rem] leading-[0.96] text-[#fff8ea] [text-shadow:0_24px_72px_rgba(0,0,0,0.62)] md:text-[4.7rem]" : ""
              ].join(" ")}
            >
              From first signal to accountable execution.
            </h2>
            <p className={["mt-6 max-w-[32rem] text-[1rem] leading-8 text-[rgba(255,255,255,0.84)]", isRealEstate ? "text-[1.04rem] leading-9 text-[#fff8ea]/82" : ""].join(" ")}>
              {pillar.consultation.body}
            </p>
          </motion.div>

          <div className="relative">
            <div className={["absolute bottom-0 left-[1.05rem] top-0 w-px bg-[#fff7ea]/12", isRealEstate ? "bg-[linear-gradient(180deg,transparent,rgba(226,191,111,0.52),transparent)]" : ""].join(" ")} />
            <div className={["space-y-5", isRealEstate ? "space-y-6" : ""].join(" ")}>
              {pillar.workflow.map((step, index) => (
                <motion.article key={step.label} {...revealProps(index * 0.04)} className="relative pl-12">
                  <div
                    className={[
                      "absolute left-0 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#d6b45f]/[0.56] bg-[#17100e] text-[0.66rem] font-semibold text-[#f0d58e]",
                      isRealEstate ? "h-10 w-10 border-[#e2bf6f]/70 bg-[#110c0a] text-[#f6ddb0] shadow-[0_12px_32px_rgba(226,191,111,0.12)]" : ""
                    ].join(" ")}
                  >
                    {step.label}
                  </div>
                  <div
                    className={[
                      "rounded-[8px] border border-[#d6b45f]/[0.18] bg-[#fff7ea]/[0.09] p-5 text-[#fffaf0] shadow-[0_24px_72px_rgba(0,0,0,0.22)]",
                      isRealEstate ? "border-[#e2bf6f]/22 bg-[#fff7ea]/[0.085] p-6 shadow-[0_28px_86px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#e2bf6f]/42 hover:bg-[#fff7ea]/[0.105]" : ""
                    ].join(" ")}
                  >
                    <h3 className={["font-display text-[1.45rem] font-semibold leading-tight text-[#fffaf0]", isRealEstate ? "text-[1.82rem] text-[#fff8ea]" : ""].join(" ")}>{step.title}</h3>
                    <p className={["mt-3 text-[0.96rem] leading-7 text-[rgba(255,255,255,0.84)]", isRealEstate ? "mt-4 leading-8 text-[#fff8ea]/78" : ""].join(" ")}>
                      {step.body}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={["relative px-5 py-20 sm:px-6 md:px-8 lg:py-28", isRealEstate ? "bg-[#fffaf0] lg:py-32" : ""].join(" ")}>
        <div className="mx-auto grid max-w-[1240px] gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            {...revealProps()}
            className={[
              "rounded-[8px] border border-[#d8c18a]/70 bg-[#fffaf0]/82 p-6 shadow-[0_24px_70px_rgba(80,52,24,0.08)] md:p-8",
              isRealEstate ? "relative overflow-hidden bg-white/78 p-7 shadow-[0_30px_96px_rgba(80,52,24,0.11),inset_0_1px_0_rgba(255,255,255,0.88)] backdrop-blur-xl md:p-10" : ""
            ].join(" ")}
          >
            {isRealEstate ? <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(201,161,76,0.78),transparent)]" /> : null}
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">Consultation Path</p>
            <h2 className={["mt-4 font-display text-[2.2rem] font-semibold leading-none text-[#1f1712] md:text-[3.2rem]", isRealEstate ? "mt-5 text-[2.55rem] leading-[0.96] md:text-[3.75rem]" : ""].join(" ")}>
              {pillar.consultation.title}
            </h2>
            <p className={["mt-5 text-[1rem] leading-8 text-[#62564d]", isRealEstate ? "mt-6 text-[1.03rem] leading-9 text-[#5a4c41]" : ""].join(" ")}>{pillar.consultation.body}</p>
            {pillar.key === "otc-exchange" ? (
              <p className="mt-5 rounded-[8px] border border-[#d8c18a]/70 bg-white/62 p-4 text-[0.86rem] leading-6 text-[#665f55]">
                OTC Exchange content is presented as business coordination information only. Any private transaction path
                requires appropriate written engagement, verification and professional compliance review.
              </p>
            ) : null}
            <Link href="/book-consultation" className="premium-cta group mt-8">
              Book Division Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.div
            {...revealProps(0.06)}
            className={[
              "rounded-[8px] border border-[#d6b45f]/[0.18] bg-[#17110e] p-6 text-[#fffaf0] shadow-[0_28px_90px_rgba(25,18,12,0.2)] md:p-8",
              isRealEstate ? "relative overflow-hidden border-[#e2bf6f]/22 bg-[linear-gradient(135deg,#17100d,#0d0907_58%,#21130f)] p-7 shadow-[0_36px_110px_rgba(25,18,12,0.28),0_0_48px_rgba(226,191,111,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] md:p-10" : ""
            ].join(" ")}
          >
            {isRealEstate ? (
              <>
                <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(246,221,176,0.78),transparent)]" />
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_14%,rgba(226,191,111,0.16),transparent_24rem)]" />
              </>
            ) : null}
            <p className="relative z-10 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#f0d58e]">Ecosystem Connection</p>
            <h2 className={["relative z-10 mt-4 font-display text-[2.2rem] font-semibold leading-none text-[#fffaf0] [text-shadow:0_16px_48px_rgba(0,0,0,0.42)] md:text-[3.2rem]", isRealEstate ? "mt-5 text-[2.55rem] leading-[0.96] text-[#fff8ea] md:text-[3.75rem]" : ""].join(" ")}>
              How this pillar works inside Ractysh Group.
            </h2>
            <div className={["relative z-10 mt-7 grid gap-3", isRealEstate ? "mt-8 gap-4" : ""].join(" ")}>
              {pillar.ecosystemConnection.map((connection) => (
                <div
                  key={connection.title}
                  className={[
                    "rounded-[8px] border border-[#d6b45f]/[0.16] bg-[#fff7ea]/[0.08] p-4",
                    isRealEstate ? "border-[#e2bf6f]/20 bg-[#fff7ea]/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-500 hover:border-[#e2bf6f]/38 hover:bg-[#fff7ea]/[0.105]" : ""
                  ].join(" ")}
                >
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#d6b45f]" />
                    <div>
                      <h3 className={["font-semibold text-[#fffaf0]", isRealEstate ? "text-[#fff8ea]" : ""].join(" ")}>{connection.title}</h3>
                      <p className={["mt-2 text-[0.92rem] leading-6 text-[rgba(255,255,255,0.84)]", isRealEstate ? "leading-7 text-[#fff8ea]/76" : ""].join(" ")}>{connection.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={["relative z-10 mt-8 border-t border-white/10 pt-6", isRealEstate ? "border-[#e2bf6f]/18 pt-7" : ""].join(" ")}>
              <div className="flex flex-wrap gap-2">
                {enterprisePillars.map((item) => {
                  const ItemIcon = iconMap[item.key];
                  const isActive = item.key === pillar.key;

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={[
                        "inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition duration-300",
                        isActive
                          ? "border-[#d6b45f]/62 bg-[#d6b45f] text-[#1f1712]"
                          : "border-[#d6b45f]/[0.22] bg-white/[0.05] text-[#f0d58e] hover:border-[#d6b45f]/[0.52] hover:text-white"
                      ].join(" ")}
                    >
                      <ItemIcon className="h-3.5 w-3.5" />
                      {item.shortTitle}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        className={[
          "relative overflow-hidden bg-[#f3e8d7] px-5 pb-24 pt-4 sm:px-6 md:px-8 lg:pb-32",
          isRealEstate ? "bg-[linear-gradient(180deg,#fffaf0_0%,#f0dec0_100%)] pt-8 lg:pb-36" : ""
        ].join(" ")}
      >
        {isRealEstate ? (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(226,191,111,0.22),transparent_30rem),radial-gradient(circle_at_16%_76%,rgba(139,17,24,0.055),transparent_24rem)]" />
        ) : null}
        <motion.div
          {...revealProps()}
          className={[
            "mx-auto max-w-[1080px] rounded-[8px] border border-[#d8c18a]/70 bg-white/70 p-6 text-center shadow-[0_28px_90px_rgba(80,52,24,0.1)] md:p-9",
            isRealEstate ? "relative overflow-hidden max-w-[1120px] bg-white/74 p-7 shadow-[0_34px_110px_rgba(80,52,24,0.13),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl md:p-11" : ""
          ].join(" ")}
        >
          {isRealEstate ? (
            <>
              <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(201,161,76,0.8),transparent)]" />
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(226,191,111,0.16),transparent_24rem)]" />
            </>
          ) : null}
          <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#d8c18a] bg-[#fffaf0] text-[#8b1118]">
            <Layers3 className="h-5 w-5" />
          </div>
          <p className="relative z-10 mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#9a7428]">Ractysh Group</p>
          <h2 className={["relative z-10 mx-auto mt-4 max-w-[46rem] font-display text-[2.3rem] font-semibold leading-none text-[#1f1712] md:text-[3.6rem]", isRealEstate ? "max-w-[50rem] text-[2.65rem] leading-[0.96] md:text-[4.15rem]" : ""].join(" ")}>
            One premium brand across five operating pillars.
          </h2>
          <p className={["relative z-10 mx-auto mt-5 max-w-[42rem] text-[1rem] leading-8 text-[#62564d]", isRealEstate ? "mt-6 max-w-[45rem] text-[1.04rem] leading-9 text-[#57493e]" : ""].join(" ")}>
            {pillar.title} connects into Architecture, Construction, Real Estate, Export & Import and OTC Exchange so
            clients can move through a private enterprise ecosystem instead of a scattered vendor chain.
          </p>
          <div className="relative z-10 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/business" className="premium-cta-secondary group">
              Explore Five Pillars
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/contact" className="premium-cta group">
              Contact Ractysh
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-2">
            {relatedPillars.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={[
                  "inline-flex items-center gap-2 rounded-[8px] border border-[#d8c18a]/62 bg-[#fffaf0]/70 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#72531c] transition duration-300 hover:-translate-y-0.5 hover:border-[#9a7428]",
                  isRealEstate ? "bg-white/68 shadow-[0_10px_28px_rgba(80,52,24,0.06)] hover:bg-white" : ""
                ].join(" ")}
              >
                <Network className="h-3.5 w-3.5" />
                {item.shortTitle}
              </Link>
            ))}
          </div>
        </motion.div>
      </section>
    </article>
  );
}
