"use client";

import { type MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  CalendarCheck,
  Compass,
  DraftingCompass,
  Eye,
  FileCheck2,
  FileText,
  Layers3,
  Map,
  Ruler,
  ShieldCheck,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import * as THREE from "three";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const philosophyCards = [
  {
    title: "Vision",
    description: "A clear spatial direction shaped around identity, context and the long-term value of the asset."
  },
  {
    title: "Precision",
    description: "Measured plans, resolved details and disciplined documentation that make premium execution possible."
  },
  {
    title: "Function",
    description: "Every room, threshold and circulation path is planned for real use, comfort and operational clarity."
  },
  {
    title: "Luxury",
    description: "Material restraint, proportion and atmosphere create spaces that feel composed without excess."
  }
] as const;

const serviceCards: {
  title: string;
  description: string;
  image: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Architecture Design",
    description: "Concept architecture, facade language, spatial planning and premium design direction.",
    image: "/visualization/gallery-exterior.webp",
    Icon: DraftingCompass
  },
  {
    title: "Interior Design",
    description: "Interior environments planned through material hierarchy, lighting rhythm and daily usability.",
    image: "/visualization/gallery-interior.webp",
    Icon: Sparkles
  },
  {
    title: "Master Planning",
    description: "Site logic, movement, zoning and long-range development structure for larger properties.",
    image: "/services/design-systems-premium-bg.webp",
    Icon: Map
  },
  {
    title: "3D Visualization",
    description: "Cinematic views, presentation scenes and decision-ready spatial previews before execution.",
    image: "/visualization/hero-studio.webp",
    Icon: Eye
  },
  {
    title: "Documentation",
    description: "Execution-ready drawings, schedules and design information prepared for delivery teams.",
    image: "/visualization/presentation-standards.webp",
    Icon: FileText
  },
  {
    title: "Site Consultation",
    description: "On-site design review, coordination support and detail direction through project progress.",
    image: "/contact/enterprise-architecture-workspace.webp",
    Icon: Ruler
  }
];

const featuredProjects = [
  {
    title: "Courtyard Residence",
    category: "Private residential architecture",
    summary:
      "A calm villa concept organized around light, privacy and a sequence of interior courtyards that soften the transition between built form and landscape.",
    phases: [
      {
        label: "Concept",
        image: "/visualization/gallery-exterior.webp",
        note: "Massing, light orientation and privacy lines."
      },
      {
        label: "Development",
        image: "/visualization/systems-model.webp",
        note: "Facade rhythm, structure and circulation refinement."
      },
      {
        label: "Final Outcome",
        image: "/visualization/gallery-lobby.webp",
        note: "A composed arrival experience with premium interior continuity."
      }
    ]
  },
  {
    title: "Executive Interior Suite",
    category: "Business interior environment",
    summary:
      "A work-focused premium interior system designed for executive meetings, private consultation and calm daily decision-making.",
    phases: [
      {
        label: "Concept",
        image: "/contact/enterprise-architecture-workspace.webp",
        note: "Atmosphere, meeting flow and leadership privacy."
      },
      {
        label: "Development",
        image: "/visualization/presentation-standards.webp",
        note: "Material palette, lighting and presentation standards."
      },
      {
        label: "Final Outcome",
        image: "/visualization/gallery-interior.webp",
        note: "A finished interior language with warmth and control."
      }
    ]
  },
  {
    title: "Urban Commercial Gallery",
    category: "Commercial spatial strategy",
    summary:
      "A public-facing architectural environment shaped for display, movement and premium brand presence without visual noise.",
    phases: [
      {
        label: "Concept",
        image: "/services/design-systems-premium-bg.webp",
        note: "Program zoning and visitor route planning."
      },
      {
        label: "Development",
        image: "/visualization/hero-studio.webp",
        note: "Scene studies, scale testing and focal point control."
      },
      {
        label: "Final Outcome",
        image: "/visualization/gallery-exterior.webp",
        note: "A memorable exterior identity with refined spatial sequence."
      }
    ]
  }
];

const processSteps = [
  {
    title: "Discovery",
    description: "Understand the client, site, commercial intent, lifestyle needs and project constraints."
  },
  {
    title: "Concept",
    description: "Shape the architectural direction through massing, mood, function and identity."
  },
  {
    title: "Visualization",
    description: "Translate the idea into cinematic views, spatial studies and decision-ready presentations."
  },
  {
    title: "Documentation",
    description: "Prepare drawings, schedules and execution information with clarity for delivery teams."
  },
  {
    title: "Execution Support",
    description: "Support construction coordination, site questions and design integrity through delivery."
  }
] as const;

const trustItems = [
  {
    title: "Luxury Design Standards",
    description: "Quiet material hierarchy, proportion control and presentation quality across every design layer.",
    Icon: ShieldCheck
  },
  {
    title: "Execution Ready Documentation",
    description: "Drawings and schedules are structured to help consultants, vendors and site teams move with clarity.",
    Icon: FileCheck2
  },
  {
    title: "Client Focused Planning",
    description: "Spaces are planned around the way clients live, work, host, decide and maintain long-term value.",
    Icon: Compass
  },
  {
    title: "Modern Spatial Systems",
    description: "Architecture, interiors, visualization and execution support operate as one connected design system.",
    Icon: Layers3
  }
];

export function ArchitectureDesignExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const projectSectionRef = useRef<HTMLElement>(null);
  const projectTrackRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const processProgressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const shouldReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-arch-reveal]");
      const maskItems = gsap.utils.toArray<HTMLElement>("[data-arch-mask]");
      const textLines = gsap.utils.toArray<HTMLElement>("[data-arch-text-line]");
      const processItems = gsap.utils.toArray<HTMLElement>("[data-arch-process-step]");

      if (shouldReduce) {
        processProgressRef.current = 1;
        root.style.setProperty("--architecture-project-progress", "1");
        root.style.setProperty("--architecture-process-progress", "1");
        gsap.set([...revealItems, ...maskItems, ...textLines], { clearProps: "all" });
        processItems.forEach((item, index) => {
          item.dataset.active = index === processItems.length - 1 ? "true" : "false";
        });
        return;
      }

      gsap.to("[data-arch-grid]", {
        x: 72,
        y: 72,
        duration: 32,
        repeat: -1,
        ease: "none"
      });

      gsap.to("[data-arch-float]", {
        y: -16,
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.28
      });

      gsap.fromTo(
        textLines,
        { opacity: 0, yPercent: 112, rotateX: -12, transformOrigin: "50% 100%" },
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 1.18,
          ease: "power4.out",
          stagger: 0.1,
          delay: 0.12
        }
      );

      revealItems.forEach((element, index) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 54 },
          {
            opacity: 1,
            y: 0,
            duration: 1.05,
            delay: Math.min(index * 0.06, 0.22),
            ease: "power4.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%"
            }
          }
        );
      });

      maskItems.forEach((element) => {
        gsap.fromTo(
          element,
          { clipPath: "inset(0 0 100% 0)", scale: 1.035 },
          {
            clipPath: "inset(0 0 0% 0)",
            scale: 1,
            duration: 1.25,
            ease: "power4.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%"
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-arch-parallax]").forEach((element) => {
        const depth = Number(element.dataset.archDepth ?? "1");
        gsap.to(element, {
          yPercent: -10 * depth,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4
          }
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-arch-image-stack]").forEach((stack) => {
        const slides = gsap.utils.toArray<HTMLElement>("[data-arch-stack-slide]", stack);
        if (slides.length < 2) return;

        gsap.set(slides, { opacity: 0, scale: 1.08 });
        gsap.set(slides[0], { opacity: 1, scale: 1.02 });

        const timeline = gsap.timeline({ repeat: -1 });
        slides.forEach((slide, index) => {
          const next = slides[(index + 1) % slides.length];
          timeline
            .to(slide, { opacity: 0, scale: 1.02, duration: 1.6, ease: "power2.inOut" }, "+=3.4")
            .fromTo(
              next,
              { opacity: 0, scale: 1.08 },
              { opacity: 1, scale: 1.02, duration: 1.6, ease: "power2.inOut", immediateRender: false },
              "<"
            );
        });
      });

      if (projectSectionRef.current && projectTrackRef.current) {
        const section = projectSectionRef.current;
        const track = projectTrackRef.current;
        const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth + 48);

        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(getDistance(), window.innerHeight * 1.25)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              root.style.setProperty("--architecture-project-progress", self.progress.toFixed(3));
            }
          }
        });
      }

      if (processRef.current) {
        ScrollTrigger.create({
          trigger: processRef.current,
          start: "top 62%",
          end: "bottom 42%",
          scrub: 1,
          onUpdate: (self) => {
            const progress = Number(self.progress.toFixed(3));
            const activeStep = Math.min(processItems.length - 1, Math.floor(progress * processItems.length));
            processProgressRef.current = progress;
            root.style.setProperty("--architecture-process-progress", String(progress));
            processItems.forEach((item, index) => {
              item.dataset.active = index === activeStep ? "true" : "false";
            });
          }
        });
      }
    }, root);

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [lenis]);

  return (
    <article ref={rootRef} className="architecture-page overflow-hidden text-[#15110d]">
      <section className="architecture-division-hero relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pb-12 pt-28 md:px-8 md:pb-16 lg:pt-32">
        <ArchitecturalAtmosphere />

        <div className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(40rem,1.28fr)] lg:items-center">
          <div className="max-w-[45rem]">
            <motion.p
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#8b1118]"
            >
              RACTYSH ARCHITECTURE
            </motion.p>

            <h1
              aria-label="Architecture that shapes identity, value and calm."
              className="mt-6 font-display text-[clamp(3.05rem,7.4vw,8.05rem)] font-semibold leading-[0.88] tracking-[0] text-[#15110d]"
            >
              <strong data-arch-text-line className="block font-[inherit]">
                Architecture that shapes
              </strong>
              <strong data-arch-text-line className="block font-[inherit] text-[#8b1118]">
                identity, value and calm.
              </strong>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 42 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.34, ease }}
              className="mt-7 max-w-[37rem] text-[15px] leading-[1.85] text-[#5f5548] md:text-[17px]"
            >
              A premium architecture division for villas, commercial spaces, interiors, master plans and cinematic
              visualization, built around clarity from first sketch to execution support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 42 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.48, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link href="#featured-works" className="premium-cta">
                View Portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#design-process" className="premium-cta-secondary">
                Design Process
                <ArrowDown className="h-4 w-4" />
              </Link>
            </motion.div>

            <div data-arch-reveal className="mt-12 hidden max-w-[34rem] grid-cols-3 border-y border-[#d7bd7a]/44 py-5 md:grid">
              {["Architecture", "Interior", "Visualization"].map((item) => (
                <div key={item} className="border-r border-[#d7bd7a]/34 last:border-r-0 last:pl-5 [&:not(:first-child)]:pl-5">
                  <p className="text-[0.63rem] font-semibold uppercase leading-none tracking-[0.18em] text-[#8b1118]/70">Division</p>
                  <p className="mt-3 font-display text-[1.35rem] font-semibold leading-none tracking-[0] text-[#221611]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.figure
            data-arch-mask
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease }}
            className="architecture-cinematic-frame relative min-h-[34rem] overflow-hidden rounded-[1.35rem] border border-[#d6b45f]/36 bg-[#15110d] shadow-[0_50px_150px_rgba(38,28,15,0.2),inset_0_1px_0_rgba(255,255,255,0.16)] md:min-h-[42rem] lg:min-h-[48rem]"
          >
            <img
              data-arch-parallax
              data-arch-depth="1.25"
              src="/visualization/gallery-exterior.webp"
              alt="Cinematic luxury architecture exterior with refined facade and landscape atmosphere"
              className="absolute inset-0 h-[112%] w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,10,9,0.18),transparent_46%),linear-gradient(180deg,rgba(16,10,9,0.04),rgba(16,10,9,0.72))]" />
            <BlueprintTrace className="opacity-45" />
            <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-wrap items-end justify-between gap-5 border-t border-white/18 pt-5 text-[#fff8ec]">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#d6b45f]">Premium spatial systems</p>
                <figcaption className="mt-2 max-w-[28rem] font-display text-[1.65rem] font-semibold leading-[1.02] tracking-[0] text-[#fff8ec]">
                  Architecture, interiors and visualization composed as one design language.
                </figcaption>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d6b45f]/48 bg-white/[0.08] text-[#d6b45f] backdrop-blur-xl">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
          </motion.figure>
        </div>
      </section>

      <section className="relative px-5 py-20 md:px-8 lg:py-28">
        <ArchitecturalAtmosphere compact />
        <div className="relative z-10 mx-auto max-w-[1380px]">
          <div data-arch-reveal className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,0.62fr)_minmax(28rem,0.38fr)] lg:items-end">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#8b1118]">Design Philosophy</p>
              <h2 className="mt-5 max-w-[48rem] font-display text-[clamp(2.6rem,5vw,5.9rem)] font-semibold leading-[0.92] tracking-[0] text-[#15110d]">
                Four principles behind every Ractysh space.
              </h2>
            </div>
            <p className="max-w-[32rem] text-[15px] font-medium leading-[1.85] text-[#6a5d50] md:text-[16px]">
              The division is built around a simple promise: make architecture memorable, usable and ready for real
              execution.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {philosophyCards.map((item, index) => (
              <motion.article
                key={item.title}
                data-arch-reveal
                data-arch-float
                whileHover={{ y: -10, scale: 1.01 }}
                transition={{ duration: 0.5, ease }}
                className="architecture-division-card group min-h-[19rem]"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#8b1118]/72">0{index + 1}</p>
                <h3 className="mt-14 font-display text-[clamp(2.35rem,4.2vw,4.4rem)] font-semibold leading-none tracking-[0] text-[#15110d]">
                  {item.title}
                </h3>
                <p className="mt-5 text-[14px] font-medium leading-[1.75] text-[#6b5f52]">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture-services" className="relative bg-[#fffaf0] px-5 py-20 md:px-8 lg:py-28">
        <div className="mx-auto max-w-[1380px]">
          <div data-arch-reveal className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(28rem,0.42fr)] lg:items-end">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#8b1118]">Architecture Services</p>
              <h2 className="mt-5 max-w-[47rem] font-display text-[clamp(2.6rem,5vw,5.7rem)] font-semibold leading-[0.92] tracking-[0] text-[#15110d]">
                A complete design desk for premium spaces.
              </h2>
            </div>
            <p className="max-w-[31rem] text-[15px] font-medium leading-[1.85] text-[#6a5d50] md:text-[16px]">
              Each service is designed to stand alone, but the strongest work happens when concept, interior,
              visualization and documentation move together.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceCards.map(({ title, description, image, Icon }, index) => (
              <motion.article
                key={title}
                data-arch-reveal
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease }}
                className="architecture-service-card group"
              >
                <div className="relative h-56 overflow-hidden rounded-[0.8rem] bg-[#15110d]">
                  <img src={image} alt={`${title} by Ractysh Architecture`} className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.07]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,17,13,0.02),rgba(21,17,13,0.54))]" />
                  <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#d6b45f]/42 bg-[#fff8ec]/12 text-[#f5d98d] backdrop-blur-xl">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8b1118]/72">0{index + 1}</p>
                  <h3 className="mt-4 font-display text-[1.85rem] font-semibold leading-none tracking-[0] text-[#17110d]">{title}</h3>
                  <p className="mt-4 text-[14px] font-medium leading-[1.75] text-[#665b50]">{description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="featured-works"
        ref={projectSectionRef}
        className="architecture-project-showcase relative min-h-[100svh] overflow-hidden bg-[#15110d] px-5 py-20 text-[#fff8ec] md:px-8 lg:py-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(214,180,95,0.16),transparent_28rem),radial-gradient(circle_at_80%_62%,rgba(139,17,24,0.28),transparent_32rem)]" />
        <div className="architecture-project-progress absolute left-5 right-5 top-6 h-px bg-white/12 md:left-8 md:right-8" aria-hidden />
        <div ref={projectTrackRef} data-arch-project-track className="architecture-project-track relative z-10 flex w-max items-stretch gap-6">
          <div className="architecture-project-intro flex shrink-0 flex-col justify-between rounded-[1.1rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl md:p-8">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#d6b45f]">Featured Projects</p>
              <h2 className="mt-6 font-display text-[clamp(2.9rem,6vw,6.5rem)] font-semibold leading-[0.88] tracking-[0] text-[#fff8ec]">
                Concept to final outcome.
              </h2>
              <p className="mt-6 max-w-[28rem] text-[15px] font-medium leading-[1.85] text-[#fff8ec]/68">
                A horizontal portfolio sequence showing how Ractysh architecture moves from idea to developed spatial
                language and finished presentation.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#d6b45f]/86">
              <span>Scroll</span>
              <ArrowRight className="h-4 w-4" />
              <span>Portfolio</span>
            </div>
          </div>

          {featuredProjects.map((project, index) => (
            <article key={project.title} className="architecture-project-panel shrink-0 overflow-hidden rounded-[1.1rem] border border-white/12 bg-[#fff8ec] text-[#15110d] shadow-[0_34px_120px_rgba(0,0,0,0.38)]">
              <div className="grid h-full min-h-[39rem] lg:grid-cols-[minmax(0,0.58fr)_minmax(25rem,0.42fr)]">
                <div data-arch-image-stack className="architecture-project-image-stack relative min-h-[28rem] overflow-hidden bg-[#111]">
                  {project.phases.map((phase, phaseIndex) => (
                    <figure
                      key={phase.label}
                      data-arch-stack-slide
                      className="absolute inset-0 opacity-0 first:opacity-100"
                    >
                      <img src={phase.image} alt={`${project.title} ${phase.label.toLowerCase()} architecture image`} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.46))]" />
                      <figcaption className="absolute bottom-5 left-5 rounded-full border border-white/18 bg-black/26 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#fff8ec] backdrop-blur-xl">
                        0{phaseIndex + 1} {phase.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <div className="flex flex-col justify-between p-6 md:p-8">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]/72">
                      0{index + 1} / {project.category}
                    </p>
                    <h3 className="mt-5 font-display text-[clamp(2.4rem,4vw,4.8rem)] font-semibold leading-[0.92] tracking-[0] text-[#15110d]">
                      {project.title}
                    </h3>
                    <p className="mt-6 text-[15px] font-medium leading-[1.85] text-[#62564c]">{project.summary}</p>
                  </div>

                  <div className="mt-9">
                    <div className="mb-5 flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8b1118]">
                      <span>Concept</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#d6b45f]" />
                      <span>Development</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#d6b45f]" />
                      <span>Final Outcome</span>
                    </div>
                    <div className="grid gap-3">
                      {project.phases.map((phase) => (
                        <div key={phase.label} className="border-t border-[#d8c188]/48 pt-3">
                          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#9a7428]">{phase.label}</p>
                          <p className="mt-1 text-[13px] font-medium leading-[1.65] text-[#6a5d50]">{phase.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="design-process" ref={processRef} className="architecture-process-section relative px-5 py-20 md:px-8 lg:py-32">
        <ArchitecturalAtmosphere compact />
        <div className="relative z-10 mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(26rem,0.72fr)] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <div data-arch-reveal>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#8b1118]">Design Process</p>
              <h2 className="mt-5 max-w-[44rem] font-display text-[clamp(2.65rem,5vw,5.85rem)] font-semibold leading-[0.92] tracking-[0] text-[#15110d]">
                From discovery to execution support.
              </h2>
              <p className="mt-6 max-w-[35rem] text-[15px] font-medium leading-[1.85] text-[#6a5d50] md:text-[16px]">
                The process is structured so creative ambition and practical delivery stay connected from the first
                conversation.
              </p>
            </div>

            <div data-arch-mask className="architecture-process-visual relative mt-10 min-h-[28rem] overflow-hidden rounded-[1.2rem] border border-[#d6b45f]/32 bg-[#101010] shadow-[0_34px_120px_rgba(38,28,15,0.2)] md:min-h-[34rem]">
              <div className="architecture-story-glow absolute inset-0" aria-hidden />
              <BlueprintTrace dark />
              <Canvas
                className="relative z-10 h-full w-full"
                style={{ width: "100%", height: "100%" }}
                camera={{ position: [4.4, 3, 7], fov: 41 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
              >
                <color attach="background" args={["#101010"]} />
                <ambientLight intensity={0.92} />
                <directionalLight position={[5, 7, 4]} intensity={2.15} color="#fff0c5" />
                <pointLight position={[-3.4, 2.3, 3.8]} intensity={1.15} color="#d6b45f" />
                <ArchitectureScene pointerRef={pointerRef} progressRef={processProgressRef} reduceMotion={Boolean(reduceMotion)} dark />
              </Canvas>
            </div>
          </div>

          <div className="architecture-process-list relative">
            <div className="architecture-process-rail" aria-hidden />
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                data-arch-reveal
                data-arch-process-step
                data-active={index === 0 ? "true" : "false"}
                className="architecture-process-step"
              >
                <div className="architecture-process-index">0{index + 1}</div>
                <div>
                  <h3 className="font-display text-[2.05rem] font-semibold leading-none tracking-[0] text-[#15110d] md:text-[2.45rem]">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-[15px] font-medium leading-[1.8] text-[#6a5d50]">{step.description}</p>
                </div>
                {index < processSteps.length - 1 ? <ArrowDown className="architecture-process-arrow h-5 w-5" /> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#fffaf0] px-5 py-20 md:px-8 lg:py-28">
        <div className="mx-auto max-w-[1380px]">
          <div data-arch-reveal className="mb-12 max-w-[52rem]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#8b1118]">Architecture Trust</p>
            <h2 className="mt-5 font-display text-[clamp(2.55rem,5vw,5.55rem)] font-semibold leading-[0.92] tracking-[0] text-[#15110d]">
              Credibility built into the working method.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trustItems.map(({ title, description, Icon }) => (
              <article key={title} data-arch-reveal className="architecture-trust-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d6b45f]/38 bg-[#fff4d8] text-[#8b1118]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-8 font-display text-[1.7rem] font-semibold leading-[1.02] tracking-[0] text-[#15110d]">{title}</h3>
                <p className="mt-4 text-[14px] font-medium leading-[1.75] text-[#665b50]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-5 pb-24 pt-6 md:px-8 lg:pb-32">
        <div data-arch-mask className="architecture-consultation-panel relative mx-auto min-h-[34rem] max-w-[1380px] overflow-hidden rounded-[1.25rem] border border-[#d6b45f]/26 bg-[#15110d] px-6 py-10 text-[#fff8ec] shadow-[0_42px_140px_rgba(38,28,15,0.24)] md:px-10 md:py-14 lg:px-14">
          <img
            data-arch-parallax
            data-arch-depth="0.9"
            src="/visualization/gallery-interior.webp"
            alt="Premium interior architecture consultation setting"
            className="absolute inset-0 h-[112%] w-full object-cover opacity-[0.62]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,9,8,0.9),rgba(12,9,8,0.54)_48%,rgba(12,9,8,0.78)),radial-gradient(circle_at_74%_24%,rgba(214,180,95,0.2),transparent_30rem)]" />
          <div className="relative z-10 flex min-h-[26rem] max-w-[44rem] flex-col justify-end">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#d6b45f]">Architecture Consultation</p>
            <h2 className="mt-5 font-display text-[clamp(2.7rem,5vw,5.8rem)] font-semibold leading-[0.9] tracking-[0] text-[#fff8ec]">
              Begin with a disciplined design conversation.
            </h2>
            <p className="mt-6 max-w-[35rem] text-[15px] font-medium leading-[1.85] text-[#fff8ec]/72 md:text-[16px]">
              Share the site, intent and spatial ambition. Ractysh Architecture will frame the right path for concept,
              visualization, documentation or execution support.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/book-consultation" className="premium-cta">
                Request Architecture Consultation
                <CalendarCheck className="h-4 w-4" />
              </Link>
              <Link href="#architecture-services" className="premium-cta-secondary border-white/18 bg-white/[0.08] text-[#fff8ec] hover:bg-white/[0.14]">
                Review Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function ArchitecturalAtmosphere({ compact = false }: { compact?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className={compact ? "architecture-atmosphere architecture-atmosphere-compact absolute inset-[-10%]" : "architecture-atmosphere absolute inset-[-10%]"} />
      <div data-arch-grid className="architecture-grid absolute inset-[-10%]" />
      <div className="architecture-blueprint absolute inset-0" />
    </div>
  );
}

function BlueprintTrace({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <svg
      className={`architecture-trace pointer-events-none absolute inset-0 z-20 ${className}`}
      viewBox="0 0 1000 700"
      preserveAspectRatio="none"
      aria-hidden
    >
      <g className={dark ? "architecture-trace-dark" : "architecture-trace-light"}>
        <path d="M112 552 L326 196 L518 552 Z" />
        <path d="M318 552 L566 112 L812 552 Z" />
        <path d="M454 552 L454 298 L672 298 L672 552" />
        <path d="M176 552 H872" />
        <path d="M216 468 H810" />
        <path d="M264 384 H762" />
        <path d="M342 298 H684" />
      </g>
    </svg>
  );
}

function ArchitectureScene({
  pointerRef,
  progressRef,
  reduceMotion,
  auto = false,
  dark = false
}: {
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  progressRef: MutableRefObject<number>;
  reduceMotion: boolean;
  auto?: boolean;
  dark?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Group>(null);
  const floorRefs = useRef<THREE.Mesh[]>([]);
  const columnRefs = useRef<THREE.Mesh[]>([]);
  const facadeRefs = useRef<THREE.Mesh[]>([]);
  const layerRefs = useRef<THREE.Mesh[]>([]);
  const groundRef = useRef<THREE.Group>(null);
  const floors = useMemo(() => Array.from({ length: 9 }, (_, index) => index), []);
  const columns = useMemo(
    () => [
      [-1.24, 0.58],
      [1.24, 0.58],
      [-1.24, -0.62],
      [1.24, -0.62],
      [0, -0.68]
    ],
    []
  );
  const facadePanels = useMemo(() => [-0.9, -0.45, 0, 0.45, 0.9], []);
  const floatingLayers = useMemo(
    () => [
      [-1.82, 0.18, 0.18, 1.2, 2.7],
      [1.82, 0.5, -0.12, 1.1, 2.2],
      [0, 1.52, -0.48, 2.5, 0.82]
    ],
    []
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    let progress = reduceMotion ? 1 : progressRef.current;

    if (auto && !reduceMotion) {
      const cycle = elapsed % 9.4;
      const build = Math.min(cycle / 5.8, 1);
      const fade = cycle > 7.4 ? Math.max(0, 1 - (cycle - 7.4) / 2) : 1;
      progress = THREE.MathUtils.smoothstep(build * fade, 0, 1);
    }

    const structure = THREE.MathUtils.smoothstep(progress, 0.14, 0.66);
    const finish = THREE.MathUtils.smoothstep(progress, 0.58, 1);
    const blueprint = THREE.MathUtils.clamp(1 - progress * 1.25, 0.16, 1);

    if (groupRef.current) {
      const targetY = reduceMotion ? -0.18 : -0.18 + pointerRef.current.x * 0.16 + Math.sin(elapsed * 0.36) * 0.06;
      const targetX = reduceMotion ? 0.1 : 0.1 + pointerRef.current.y * 0.08;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.045);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.045);
      groupRef.current.position.y = reduceMotion ? -0.08 : -0.08 + Math.sin(elapsed * 0.42) * 0.12;
    }

    if (wireRef.current) {
      wireRef.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = dark ? 0.22 + blueprint * 0.42 : 0.16 + blueprint * 0.34;
      });
      wireRef.current.rotation.y = reduceMotion ? 0 : Math.sin(elapsed * 0.25) * -0.05;
    }

    if (groundRef.current) {
      groundRef.current.rotation.z = reduceMotion ? 0 : Math.sin(elapsed * 0.18) * 0.025;
      groundRef.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.08 + blueprint * (dark ? 0.2 : 0.14);
      });
    }

    floorRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const reveal = THREE.MathUtils.smoothstep(progress, 0.1 + index * 0.045, 0.36 + index * 0.055);
      const material = mesh.material as THREE.MeshStandardMaterial;
      mesh.scale.set(0.28 + reveal * 0.72, 0.34 + reveal * 0.66, 0.3 + reveal * 0.7);
      mesh.position.y = -1.34 + index * 0.36;
      material.opacity = 0.08 + reveal * (dark ? 0.7 : 0.76) + finish * 0.08;
      material.color.set(index % 2 ? (dark ? "#fff3d7" : "#fff7e8") : dark ? "#d6b45f" : "#ead29a");
      material.emissive.set(dark ? "#24170b" : "#000000");
      material.emissiveIntensity = dark ? finish * 0.08 : 0;
    });

    columnRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const reveal = THREE.MathUtils.smoothstep(progress, 0.2 + index * 0.025, 0.72);
      const height = 3.45;
      const material = mesh.material as THREE.MeshStandardMaterial;
      mesh.scale.y = Math.max(0.001, reveal);
      mesh.position.y = -1.34 + (height * reveal) / 2;
      material.opacity = 0.08 + reveal * 0.82;
    });

    facadeRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const reveal = THREE.MathUtils.smoothstep(progress, 0.54 + index * 0.025, 0.96);
      const material = mesh.material as THREE.MeshStandardMaterial;
      mesh.position.z = 0.82 + reveal * 0.14 + (reduceMotion ? 0 : Math.sin(elapsed * 0.52 + index) * 0.018);
      mesh.position.y = -0.04 + reveal * 0.06;
      material.opacity = reveal * (dark ? 0.54 : 0.48);
    });

    layerRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const material = mesh.material as THREE.MeshBasicMaterial;
      const float = reduceMotion ? 0 : Math.sin(elapsed * 0.5 + index * 1.1) * 0.05;
      mesh.position.y = Number(floatingLayers[index][1]) + float;
      material.opacity = (0.08 + finish * 0.18) * (dark ? 1.1 : 0.9);
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.08, 0]} rotation={[0.1, -0.18, 0]}>
      <group ref={groundRef} position={[0, -1.52, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[6.6, 5.1, 18, 14]} />
          <meshBasicMaterial color={dark ? "#d6b45f" : "#9a7428"} wireframe transparent opacity={0.18} />
        </mesh>
        {[1.2, 1.85, 2.5].map((size, index) => (
          <mesh key={size} position={[0, 0, index * 0.025]}>
            <ringGeometry args={[size, size + 0.012, 96]} />
            <meshBasicMaterial color={index === 1 ? "#d6b45f" : "#8b1118"} transparent opacity={0.18} />
          </mesh>
        ))}
      </group>

      <group ref={wireRef} position={[0, 0.06, -0.28]}>
        <mesh>
          <boxGeometry args={[3.35, 3.82, 1.72]} />
          <meshBasicMaterial color="#d6b45f" wireframe transparent opacity={0.34} />
        </mesh>
        <mesh position={[0.36, 0.32, -0.34]}>
          <boxGeometry args={[2.5, 3.14, 1.22]} />
          <meshBasicMaterial color={dark ? "#fff0c5" : "#8b1118"} wireframe transparent opacity={0.18} />
        </mesh>
      </group>

      <group>
        {floors.map((floor) => (
          <mesh
            key={floor}
            ref={(node) => {
              if (node) floorRefs.current[floor] = node;
            }}
            position={[0, -1.34 + floor * 0.36, 0]}
          >
            <boxGeometry args={[2.76 - floor * 0.045, 0.095, 1.68 - floor * 0.026]} />
            <meshStandardMaterial color="#ead29a" metalness={0.24} roughness={0.34} transparent opacity={0.1} />
          </mesh>
        ))}

        {columns.map(([x, z], index) => (
          <mesh
            key={`${x}-${z}`}
            ref={(node) => {
              if (node) columnRefs.current[index] = node;
            }}
            position={[x, -1.34, z]}
          >
            <boxGeometry args={[0.13, 3.45, 0.13]} />
            <meshStandardMaterial color={dark ? "#d6b45f" : "#241a13"} metalness={0.36} roughness={0.3} transparent opacity={0.12} />
          </mesh>
        ))}
      </group>

      <group position={[0, 0.08, 0.74]}>
        {facadePanels.map((x, index) => (
          <mesh
            key={x}
            ref={(node) => {
              if (node) facadeRefs.current[index] = node;
            }}
            position={[x, -0.04, 0.82]}
            rotation={[0, index % 2 ? 0.035 : -0.035, 0]}
          >
            <boxGeometry args={[0.32, 3.24, 0.04]} />
            <meshStandardMaterial
              color={dark ? "#fff6de" : "#d8ebf2"}
              metalness={0.12}
              roughness={0.08}
              transparent
              opacity={0}
            />
          </mesh>
        ))}
      </group>

      <group>
        {floatingLayers.map(([x, y, z, width, height], index) => (
          <mesh
            key={`${x}-${z}`}
            ref={(node) => {
              if (node) layerRefs.current[index] = node;
            }}
            position={[x, y, z]}
            rotation={[0, index === 1 ? -0.12 : 0.12, 0]}
          >
            <planeGeometry args={[width, height, 1, 1]} />
            <meshBasicMaterial color={index === 2 ? "#8b1118" : "#d6b45f"} transparent opacity={0.12} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
