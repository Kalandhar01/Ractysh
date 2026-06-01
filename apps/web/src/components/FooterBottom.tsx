"use client";

import { ArrowUpRight, Check, CornerRightUp, Instagram, Linkedin, Mail } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { EnterpriseBriefingSubscribe, subscribedStorageKey, type SubscribeInteractionStatus } from "@/components/EnterpriseBriefingSubscribe";
import type { NavItem, SocialLink } from "@/lib/types";

const ecosystemMarks = [
  { label: "Architecture", detail: "Spatial intelligence" },
  { label: "Construction", detail: "Delivery control" },
  { label: "Real Estate", detail: "Asset strategy" },
  { label: "Export & Import", detail: "Global trade" },
  { label: "OTC Exchange", detail: "Private deals" }
];

const fallbackLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Disclosure", href: "/disclosure" },
  { label: "Copyright Policy", href: "/copyright-policy" },
  { label: "Sitemap", href: "/sitemap" }
];

const labelOverrides: Record<string, string> = {
  "Company Stage": "Stages",
  Resources: "FAQ"
};

const footerSubscribeEase = [0.16, 1, 0.3, 1] as const;
const footerSuccessParticles = [
  { left: "17%", top: "34%", delay: 0.08, x: -18, y: -18 },
  { left: "29%", top: "70%", delay: 0.2, x: -8, y: -26 },
  { left: "48%", top: "22%", delay: 0.14, x: 4, y: -24 },
  { left: "68%", top: "66%", delay: 0.24, x: 14, y: -28 },
  { left: "83%", top: "36%", delay: 0.18, x: 18, y: -20 }
];

type FooterSubscribePhase = "form" | "success" | "hidden";

function isHiddenFooterLink(link: NavItem) {
  const label = link.label.toLowerCase();
  const href = link.href.toLowerCase();

  return label === "admin" || label === "book consultation" || label.includes("trademark") || href.includes("trademark");
}

function normalizeFooterLink(link: NavItem): NavItem {
  if (link.label.toLowerCase() === "sitemap" && link.href === "/sitemap.xml") {
    return { ...link, href: "/sitemap" };
  }

  return link;
}

function FooterEnterpriseHeading() {
  return (
    <div className="relative mt-4 max-w-[50rem] py-0.5 sm:mt-5 md:mt-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 top-1/2 h-36 w-[22rem] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(224,197,121,0.18),rgba(224,197,121,0.075)_38%,transparent_72%)] blur-[2px] sm:w-[28rem] md:h-40 md:w-[34rem]"
      />
      <h2 className="relative font-display text-[2.25rem] font-medium leading-[0.94] text-[#fff8ec] drop-shadow-[0_18px_42px_rgba(0,0,0,0.34)] sm:text-[2.85rem] md:text-[3.45rem] lg:text-[3.8rem]">
        <span className="block">Five pillars.</span>
        <span className="block text-[#f8efe0]/78">One ecosystem.</span>
      </h2>
    </div>
  );
}

function SocialLinkIcon({ label }: { label: string }) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("linkedin")) {
    return <Linkedin className="h-3.5 w-3.5" strokeWidth={2.1} />;
  }

  if (normalizedLabel.includes("instagram")) {
    return <Instagram className="h-3.5 w-3.5" strokeWidth={2.1} />;
  }

  return <Mail className="h-3.5 w-3.5" strokeWidth={2.1} />;
}

function FooterBriefingSuccess({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  return (
    <motion.div
      key="footer-briefing-success"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.985, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.985, filter: "blur(8px)" }}
      transition={{ duration: 0.82, ease: footerSubscribeEase }}
      className="relative min-h-[14.5rem] overflow-hidden rounded-[8px] border border-[#E0C579]/24 bg-white/[0.045] p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,0.26),0_0_82px_rgba(224,197,121,0.13)]"
      role="status"
      aria-live="polite"
    >
      <motion.div
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { opacity: [0.22, 0.5, 0.22], scale: [0.96, 1.05, 0.96] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(224,197,121,0.22),transparent_12rem),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_58%)]"
      />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#E0C579]/45 to-transparent" />
      {footerSuccessParticles.map((particle) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 0, y: 8, scale: 0.72 }}
          animate={
            shouldReduceMotion
              ? { opacity: 0.42 }
              : { opacity: [0, 0.76, 0], x: particle.x, y: particle.y, scale: [0.72, 1, 0.82] }
          }
          transition={{ duration: 2.2, delay: particle.delay, repeat: Infinity, repeatDelay: 1.8, ease: "easeOut" }}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-[#E0C579] shadow-[0_0_16px_rgba(224,197,121,0.78)]"
          style={{ left: particle.left, top: particle.top }}
        />
      ))}
      <div className="relative flex min-h-[11rem] flex-col items-center justify-center">
        <motion.span
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.78, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.66, ease: footerSubscribeEase }}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#E0C579]/45 bg-[#E0C579] text-[#14100b] shadow-[0_0_0_8px_rgba(224,197,121,0.1),0_0_44px_rgba(224,197,121,0.32)]"
        >
          <motion.span
            aria-hidden="true"
            animate={shouldReduceMotion ? undefined : { opacity: [0.42, 0, 0.42], scale: [1, 1.55, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-[#E0C579]/45"
          />
          <Check className="relative h-5 w-5" strokeWidth={2.6} />
        </motion.span>
        <p className="mt-6 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#E0C579]">
          ECOSYSTEM CONNECTED
        </p>
        <h3 className="mt-3 max-w-[25rem] font-display text-[1.45rem] font-semibold leading-[1.12] tracking-normal text-white sm:text-[1.72rem]">
          You're now subscribed
          <span className="block text-white/62">to the Ractysh briefing layer.</span>
        </h3>
      </div>
    </motion.div>
  );
}

interface FooterBottomProps {
  headline: string;
  description: string;
  links: NavItem[];
  socialLinks?: SocialLink[];
}

export function FooterBottom({ headline, description, links, socialLinks = [] }: FooterBottomProps) {
  const [briefingStatus, setBriefingStatus] = useState<SubscribeInteractionStatus>("idle");
  const [briefingPhase, setBriefingPhase] = useState<FooterSubscribePhase>("form");
  const shouldReduceMotion = useReducedMotion();
  const footerLinks = links.filter((link) => !isHiddenFooterLink(link)).map(normalizeFooterLink);
  const displayLinks = footerLinks.length > 0 ? footerLinks : fallbackLinks;

  useEffect(() => {
    try {
      if (window.localStorage.getItem(subscribedStorageKey) === "true") {
        setBriefingPhase("hidden");
      }
    } catch {
      // The footer can still complete the current subscribe flow without persisted state.
    }
  }, []);

  useEffect(() => {
    if (briefingPhase !== "success") return;

    const timer = window.setTimeout(() => setBriefingPhase("hidden"), 5600);
    return () => window.clearTimeout(timer);
  }, [briefingPhase]);

  function handleBriefingStatusChange(nextStatus: SubscribeInteractionStatus) {
    setBriefingStatus(nextStatus);
    if (nextStatus === "success") {
      setBriefingPhase("success");
    }
  }

  return (
    <section className="relative">
      <div className="grid gap-7 border-y border-white/[0.12] py-5 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.46fr)] md:gap-8 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[45rem]"
        >
          <div>
            <Link
              href="#hero"
              className="inline-flex flex-col items-start gap-3 text-[#fff8ec] transition duration-300 hover:text-[#E0C579]"
              aria-label="Ractysh home"
            >
              <BrandLogo size="footer" decorative />
              <span className="font-display text-[2rem] font-semibold leading-none md:text-[2.35rem]">{headline}</span>
            </Link>
            <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#E0C579]/82">
              PRIVATE ENTERPRISE GROUP
            </p>
          </div>

          <FooterEnterpriseHeading />

          <p className="mt-4 max-w-[35rem] text-[1rem] leading-7 text-[#f8efe0]/78 md:mt-5 md:text-[1.06rem]">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between gap-4"
        >
          <AnimatePresence mode="wait" initial={false}>
            {briefingPhase === "form" ? (
              <motion.div
                key="footer-briefing-form"
                initial={{ opacity: 0, y: 22, filter: "blur(0px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: 20, filter: "blur(10px)", transition: { duration: 0.8, ease: footerSubscribeEase } }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.72, delay: 0.1, ease: footerSubscribeEase }}
                className={`relative overflow-hidden rounded-[8px] border p-3 transition duration-500 md:p-4 ${
                  briefingStatus === "loading"
                    ? "border-[#E0C579]/26 bg-white/[0.05] shadow-[0_26px_84px_rgba(0,0,0,0.25),0_0_56px_rgba(224,197,121,0.1)]"
                    : "border-white/[0.08] bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
                }`}
              >
                <div className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full bg-[#E0C579]/[0.12] blur-3xl" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E0C579]/35 to-transparent" />

                <div className="relative">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#E0C579]/70">
                    Enterprise Briefing
                  </p>
                  <h3 className="mt-2 font-display text-[1.22rem] font-semibold leading-tight tracking-[-0.035em] text-[#fff8ec]">
                    Subscribe for ecosystem updates.
                  </h3>
                  <p className="mt-1.5 max-w-[24rem] text-[0.78rem] leading-5 text-[#f8efe0]/68">
                    Receive premium updates on architecture, construction, real estate, export-import, OTC exchange and enterprise systems.
                  </p>

                  <EnterpriseBriefingSubscribe onStatusChange={handleBriefingStatusChange} />
                </div>
              </motion.div>
            ) : null}
            {briefingPhase === "success" ? <FooterBriefingSuccess shouldReduceMotion={shouldReduceMotion} /> : null}
          </AnimatePresence>

          <nav aria-label="Footer navigation" className="grid gap-x-5 md:grid-cols-2">
            {displayLinks.map((link, index) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="group flex items-center justify-between border-b border-white/[0.09] py-3 text-[#f8efe0]/82 transition duration-300 hover:border-[#E0C579]/55 hover:text-[#fff8ec]"
              >
                <span className="flex items-center gap-4">
                  <span className="text-[0.74rem] font-semibold text-[#E0C579]/70">0{index + 1}</span>
                  <span className="text-[1rem] font-medium">{labelOverrides[link.label] ?? link.label}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 opacity-45 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" strokeWidth={2.2} />
              </Link>
            ))}

            <div className="mt-3 flex justify-start border-t border-[#E0C579]/16 pt-4 md:col-span-2 md:justify-end">
              <Link
                href="/book-consultation"
                className="group inline-flex h-[3rem] w-full items-center justify-center gap-2 whitespace-nowrap rounded-[7px] border border-[#E0C579]/68 bg-[#f2e6cf] px-6 text-[0.9rem] font-semibold text-[#161109] shadow-[0_24px_70px_rgba(0,0,0,0.42),0_0_34px_rgba(224,197,121,0.18),inset_0_1px_0_rgba(255,255,255,0.72)] transition duration-300 hover:-translate-y-0.5 hover:border-[#E0C579]/90 hover:bg-[#fff2dc] hover:shadow-[0_28px_78px_rgba(0,0,0,0.48),0_0_46px_rgba(224,197,121,0.26),inset_0_1px_0_rgba(255,255,255,0.82)] sm:text-[0.95rem]"
              >
                Book Consultation
                <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.3} />
              </Link>
            </div>
          </nav>
        </motion.div>
      </div>

      <div className="flex flex-col gap-3 border-b border-white/[0.08] py-3.5 md:flex-row md:items-center md:justify-between md:py-4">
        <div className="flex flex-wrap gap-2.5">
          {ecosystemMarks.map((mark) => (
            <span
              key={mark.label}
              className="inline-flex items-center gap-2 rounded-full border border-[#E0C579]/25 bg-[#080807]/30 px-3.5 py-1.5 text-[0.78rem] font-medium text-[#fff8ec]/86"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#E0C579]" />
              {mark.label}
              <span className="text-[#f8efe0]/58">{mark.detail}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-3 text-[0.82rem] font-medium text-[#f8efe0]/62 md:flex-row md:items-center md:justify-between">
        <p className="leading-5">
          <span className="block">© 2026 Ractysh Group Private Limited.</span>
          <span className="block">All rights reserved.</span>
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 text-[#f8efe0]/68 transition duration-300 hover:text-[#fff8ec]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-[#E0C579]/68 transition duration-300 group-hover:border-[#E0C579]/34 group-hover:bg-[#E0C579]/[0.08] group-hover:text-[#E0C579]">
                <SocialLinkIcon label={link.label} />
              </span>
              <span>{link.label}</span>
            </a>
          ))}
          <Link href="/#hero" className="group inline-flex items-center gap-1.5 text-[#f8efe0]/72 transition duration-300 hover:text-[#fff8ec]">
            Back to top
            <CornerRightUp className="h-3.5 w-3.5 transition duration-300 group-hover:-translate-y-0.5" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
