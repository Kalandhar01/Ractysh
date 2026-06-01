"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const filters = ["Architecture", "Construction", "Real Estate", "Import & Export", "OTC Exchange"] as const;
const heroTitleLines = ["Five Enterprise Divisions.", "One Operating Ecosystem."] as const;

type ServiceFilter = (typeof filters)[number];

interface EnterpriseServicePillar {
  filter: ServiceFilter;
  number: string;
  name: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  scale: "large" | "medium" | "standard";
}

const cinemaEase = [0.22, 1, 0.36, 1] as const;

const services: EnterpriseServicePillar[] = [
  {
    filter: "Architecture",
    number: "01",
    name: "Architecture",
    description: "Luxury building concepts, master planning, facade language and execution-ready design documentation.",
    href: "/architecture",
    image: "/services/showcase-architecture-4k.jpg",
    alt: "Ultra-high-resolution luxury modern architectural residence with refined exterior lighting",
    scale: "large"
  },
  {
    filter: "Construction",
    number: "02",
    name: "Construction",
    description: "Modern construction delivery, structural coordination, site control and turnkey execution systems.",
    href: "/construction",
    image: "/services/showcase-construction-4k.jpg",
    alt: "Ultra-high-resolution active premium construction site with structural teams and site control",
    scale: "medium"
  },
  {
    filter: "Real Estate",
    number: "03",
    name: "Real Estate",
    description: "Premium commercial assets, development positioning, investor readiness and market-facing presentation.",
    href: "/real-estate",
    image: "/services/showcase-real-estate-4k.jpg",
    alt: "Ultra-high-resolution premium real estate interior with luxury living and executive finish",
    scale: "standard"
  },
  {
    filter: "Import & Export",
    number: "04",
    name: "Import & Export",
    description: "Global trade coordination, port movement, supplier lanes and cross-border enterprise logistics.",
    href: "/import-export",
    image: "/services/showcase-import-export-4k.jpg",
    alt: "Ultra-high-resolution container ship and port operations for import and export logistics",
    scale: "standard"
  },
  {
    filter: "OTC Exchange",
    number: "05",
    name: "OTC Exchange",
    description: "Private transaction coordination, counterparty intake, deal-room readiness and financial execution workflows.",
    href: "/otc-exchange",
    image: "/services/showcase-otc-exchange-4k.jpg",
    alt: "Ultra-high-resolution enterprise trading chart visualization for OTC exchange workflows",
    scale: "standard"
  }
];

export function PremiumServicesPage() {
  const [activeFilter, setActiveFilter] = useState<ServiceFilter | null>(null);
  const visibleServices = useMemo(
    () => (activeFilter ? services.filter((service) => service.filter === activeFilter) : services),
    [activeFilter]
  );

  return (
    <main className="services-enterprise-page">
      <HeroSection />
      <ServiceShowcase services={visibleServices} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <EnterpriseDesk />
    </main>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const section = heroRef.current;
    if (!section) {
      return;
    }

    const reduceMotion = Boolean(shouldReduceMotion);

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-services-hero-reveal]");
      const titleChars = gsap.utils.toArray<HTMLElement>("[data-services-hero-char]");
      const ecosystemLabels = gsap.utils.toArray<HTMLElement>("[data-services-ecosystem-label]");
      const imageReveals = gsap.utils.toArray<HTMLElement>("[data-services-image-reveal]");
      const visualLayers = gsap.utils.toArray<HTMLElement>("[data-services-visual-layer]");
      const depthLayers = gsap.utils.toArray<HTMLElement>("[data-services-hero-depth]");
      const goldPaths = gsap.utils.toArray<SVGPathElement>("[data-services-gold-path]");

      if (reduceMotion) {
        gsap.set([...revealItems, ...titleChars, ...ecosystemLabels, ...imageReveals, ...visualLayers], {
          clearProps: "all"
        });
        gsap.set(goldPaths, { strokeDashoffset: 0 });
        return;
      }

      goldPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length
        });
      });

      gsap.set(revealItems, { opacity: 0, y: 26, filter: "blur(10px)", force3D: true });
      gsap.set(titleChars, {
        opacity: 0,
        yPercent: 112,
        rotateX: -20,
        transformOrigin: "50% 100%",
        force3D: true
      });
      gsap.set(ecosystemLabels, { opacity: 0, y: 20, scale: 0.96, force3D: true });
      gsap.set(imageReveals, {
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
        scale: 1.035,
        y: 18,
        force3D: true
      });
      gsap.set(visualLayers, { opacity: 0, y: 18, force3D: true });

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro
        .to(revealItems, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.08
        })
        .to(
          titleChars,
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.72,
            stagger: 0.014
          },
          0.12
        )
        .to(
          visualLayers,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.08
          },
          0.22
        )
        .to(
          goldPaths,
          {
            strokeDashoffset: 0,
            duration: 1.35,
            stagger: 0.08,
            ease: "power2.out"
          },
          0.35
        )
        .to(
          imageReveals,
          {
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
            scale: 1,
            y: 0,
            duration: 1,
            stagger: 0.12
          },
          0.46
        )
        .to(
          ecosystemLabels,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            stagger: 0.055
          },
          0.78
        );

      depthLayers.forEach((layer, index) => {
        const depth = Number(layer.dataset.servicesHeroDepth || 1);
        gsap.to(layer, {
          yPercent: -4.5 * depth,
          xPercent: index % 2 === 0 ? -1.8 * depth : 1.8 * depth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.2
          }
        });
      });
    }, section);

    return () => context.revert();
  }, [shouldReduceMotion]);

  return (
    <section ref={heroRef} className="services-enterprise-hero" aria-labelledby="services-page-title">
      <div className="services-enterprise-atmosphere" aria-hidden="true">
        <span className="services-enterprise-atmosphere-grid" data-services-hero-depth="0.7" />
        <span className="services-enterprise-atmosphere-lines" data-services-hero-depth="1" />
        <span className="services-enterprise-atmosphere-glow" data-services-hero-depth="0.45" />
      </div>
      <div className="services-enterprise-shell services-enterprise-hero-grid">
        <div className="services-enterprise-hero-copy">
          <p className="services-enterprise-badge" data-services-hero-reveal>
            RACTYSH SERVICES
          </p>

          <h1
            id="services-page-title"
            className="services-enterprise-title"
            aria-label="Five Enterprise Divisions. One Operating Ecosystem."
          >
            <AnimatedHeroTitle />
          </h1>

          <p className="services-enterprise-subtext" data-services-hero-reveal>
            Five enterprise divisions connected through one operating layer.
          </p>

          <span className="services-enterprise-copy-rule" aria-hidden="true" data-services-hero-reveal />
        </div>

        <ArchitecturalOpeningVisual />
      </div>

    </section>
  );
}

function AnimatedHeroTitle() {
  return (
    <>
      {heroTitleLines.map((line) => {
        const words = line.split(" ");

        return (
          <span key={line} className="services-enterprise-title-line" aria-hidden="true">
            {words.map((word, wordIndex) => (
              <Fragment key={`${line}-${word}-${wordIndex}`}>
                <span className="services-enterprise-title-word">
                  {word.split("").map((char, charIndex) => (
                    <span key={`${word}-${char}-${charIndex}`} className="services-enterprise-title-char" data-services-hero-char>
                      {char}
                    </span>
                  ))}
                </span>
                {wordIndex < words.length - 1 ? <span className="services-enterprise-title-space">&nbsp;</span> : null}
              </Fragment>
            ))}
          </span>
        );
      })}
    </>
  );
}

function ArchitecturalOpeningVisual() {
  return (
    <div className="services-enterprise-opening-visual" aria-hidden="true" data-services-hero-reveal data-services-hero-depth="0.8">
      <div className="services-enterprise-visual-plate" data-services-visual-layer>
        <span className="services-enterprise-blueprint-grid" data-services-visual-layer />
        <span className="services-enterprise-visual-glow" data-services-visual-layer />

        <svg className="services-enterprise-blueprint-diagram" viewBox="0 0 640 520" role="presentation" focusable="false">
          <path className="services-enterprise-blueprint-line" d="M72 404H246V252h148v-96h174" />
          <path className="services-enterprise-blueprint-line" d="M108 118h156v92h94v178h164" />
          <path className="services-enterprise-blueprint-line" d="M154 438V302h114V168h236" />
          <path className="services-enterprise-blueprint-line muted" d="M84 82h472v354H84z" />
          <path className="services-enterprise-blueprint-line muted" d="M140 82v354M276 82v354M412 82v354M84 168h472M84 302h472" />
          <path className="services-enterprise-blueprint-gold" data-services-gold-path d="M112 388c68-78 126-124 174-138 64-18 112 15 168-20 32-20 54-58 76-112" />
          <path className="services-enterprise-blueprint-gold fine" data-services-gold-path d="M154 118c58 48 96 88 114 120 26 46 20 94 62 126 34 26 88 30 162 12" />
        </svg>

        <div className="services-enterprise-image-slab slab-one" data-services-image-reveal data-services-hero-depth="1.2">
          <Image
            src="/visualization/gallery-exterior.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 20vw, 46vw"
            quality={88}
            priority
            className="services-enterprise-visual-image"
          />
        </div>
        <div className="services-enterprise-image-slab slab-two" data-services-image-reveal data-services-hero-depth="0.65">
          <Image
            src="/visualization/gallery-lobby.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 15vw, 36vw"
            quality={88}
            className="services-enterprise-visual-image"
          />
        </div>
        <div className="services-enterprise-image-slab slab-three" data-services-image-reveal data-services-hero-depth="1">
          <Image
            src="/services/global-trade-transport.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 16vw, 40vw"
            quality={88}
            className="services-enterprise-visual-image"
          />
        </div>
      </div>
    </div>
  );
}

function ServiceShowcase({
  services: visibleServices,
  activeFilter,
  setActiveFilter
}: {
  services: EnterpriseServicePillar[];
  activeFilter: ServiceFilter | null;
  setActiveFilter: (filter: ServiceFilter | null) => void;
}) {
  return (
    <section className="services-enterprise-showcase" aria-label="Premium service pillars">
      <div className="services-enterprise-shell">
        <div className="services-enterprise-showcase-nav" role="group" aria-label="Service divisions">
          {services.map((service) => {
            const isActive = activeFilter === service.filter;

            return (
              <button
                key={service.filter}
                type="button"
                className="services-enterprise-showcase-pill"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(isActive ? null : service.filter)}
              >
                <span>{service.name}</span>
              </button>
            );
          })}
        </div>
        <motion.div className="services-enterprise-grid" data-filtered={activeFilter ? "true" : "false"} layout>
          {visibleServices.map((service, index) => (
            <ServicePillarCard key={service.name} service={service} index={index} isFiltered={Boolean(activeFilter)} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ServicePillarCard({
  service,
  index,
  isFiltered
}: {
  service: EnterpriseServicePillar;
  index: number;
  isFiltered: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["-3%", "3%"]);

  return (
    <motion.article
      ref={cardRef}
      className="services-enterprise-card"
      data-pillar={service.filter.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}
      data-scale={isFiltered ? "large" : service.scale}
      layout
      initial={shouldReduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -6 }}
      viewport={{ once: true, amount: 0.22, margin: "-8% 0px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.78, delay: shouldReduceMotion ? 0 : index * 0.07, ease: cinemaEase }}
    >
      <Link href={service.href} className="services-enterprise-card-link" aria-label={`Open ${service.name}`}>
        <motion.div className="services-enterprise-card-media" style={{ y: imageY }}>
          <Image
            src={service.image}
            alt={service.alt}
            fill
            sizes={
              isFiltered || service.scale === "large"
                ? "(min-width: 1536px) 76vw, (min-width: 1280px) 72vw, (min-width: 768px) 92vw, 100vw"
                : "(min-width: 1536px) 31vw, (min-width: 1280px) 30vw, (min-width: 768px) 46vw, 100vw"
            }
            quality={95}
            priority={index < 2}
            className="services-enterprise-card-image"
          />
        </motion.div>
        <span className="services-enterprise-card-shade" aria-hidden="true" />
        <span className="services-enterprise-card-frame" aria-hidden="true" />
        <span className="services-enterprise-card-number">{service.number}</span>
        <span className="services-enterprise-card-content">
          <span className="services-enterprise-card-line" aria-hidden="true" />
          <span className="services-enterprise-card-kicker">{service.filter}</span>
          <span className="services-enterprise-card-title">{service.name}</span>
          <span className="services-enterprise-card-description">{service.description}</span>
          <span className="services-enterprise-card-action" aria-hidden="true">
            Open division
            <ArrowRight className="h-4 w-4" />
          </span>
        </span>
      </Link>
    </motion.article>
  );
}

function EnterpriseDesk() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="services-enterprise-desk-section" aria-label="Service desk">
      <div className="services-enterprise-shell">
        <motion.div
          className="services-enterprise-desk"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease: cinemaEase }}
        >
          <p>Private Enterprise Desk</p>
          <h2>Coordinate your next mandate through one Ractysh operating layer.</h2>
          <div className="services-enterprise-desk-actions">
            <Link href="/book-consultation" className="services-enterprise-button primary">
              Book Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="services-enterprise-button secondary">
              Connect With Division
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
