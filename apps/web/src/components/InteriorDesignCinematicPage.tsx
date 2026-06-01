"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Armchair,
  Gem,
  LampDesk,
  PanelsTopLeft,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { ServiceRequestCTA } from "@/components/ServiceRequestCTA";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const interiorImages = {
  hero: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1800&q=88",
  living: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1700&q=88",
  material: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1700&q=88",
  lighting: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1700&q=88",
  hospitality: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1700&q=88"
};

const storySections = [
  {
    eyebrow: "Living Spaces",
    title: "Quiet rooms shaped for daily ritual.",
    body:
      "Layered seating, warm daylight, refined objects and controlled sightlines create interiors that feel calm without becoming plain.",
    image: interiorImages.living,
    stats: ["Residential", "Soft zoning", "Warm daylight"],
    Icon: Armchair
  },
  {
    eyebrow: "Material Language",
    title: "A curated palette of texture, light and touch.",
    body:
      "Stone, timber, textile, metal and glass are treated as a single material system, not separate decorative decisions.",
    image: interiorImages.material,
    stats: ["Stone", "Timber", "Brushed metal"],
    Icon: Gem
  },
  {
    eyebrow: "Lighting Systems",
    title: "Cinematic lighting that changes how space feels.",
    body:
      "Ambient, task and accent lighting are mapped into a premium atmosphere for morning clarity, evening warmth and display moments.",
    image: interiorImages.lighting,
    stats: ["Ambient", "Accent", "Scene logic"],
    Icon: LampDesk
  },
  {
    eyebrow: "Premium Hospitality",
    title: "Interiors with the presence of private hospitality.",
    body:
      "Lounges, suites, entry moments and commercial environments are composed with rhythm, discretion and tactile luxury.",
    image: interiorImages.hospitality,
    stats: ["Hospitality", "Arrival", "Private lounge"],
    Icon: Sparkles
  }
] satisfies Array<{
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  stats: string[];
  Icon: LucideIcon;
}>;

export function InteriorDesignCinematicPage() {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 78, damping: 28, mass: 0.8 });
  const smoothY = useSpring(pointerY, { stiffness: 78, damping: 28, mass: 0.8 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-interior-reveal]", root);
      const parallaxLayers = gsap.utils.toArray<HTMLElement>("[data-interior-parallax]", root);
      const imageLayers = gsap.utils.toArray<HTMLElement>("[data-interior-image]", root);
      const glowLayers = gsap.utils.toArray<HTMLElement>("[data-interior-glow]", root);

      if (reduceMotion) {
        gsap.set(revealItems, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
        gsap.set(parallaxLayers, { yPercent: 0, xPercent: 0 });
        gsap.set(imageLayers, { yPercent: 0, scale: 1 });
        return;
      }

      gsap.set(revealItems, { opacity: 0, y: 70, scale: 0.985, filter: "blur(8px)", force3D: true });

      revealItems.forEach((item, index) => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.1,
          delay: Math.min(index * 0.04, 0.18),
          ease: "power4.out",
          scrollTrigger: {
            trigger: item,
            start: "top 84%",
            once: true
          }
        });
      });

      parallaxLayers.forEach((layer) => {
        const speed = Number(layer.dataset.speed || 8);
        gsap.to(layer, {
          yPercent: -speed,
          ease: "none",
          scrollTrigger: {
            trigger: layer.closest("section") || root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.15
          }
        });
      });

      imageLayers.forEach((image) => {
        gsap.fromTo(
          image,
          { yPercent: 4, scale: 1 },
          {
            yPercent: -6,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: image.closest("section") || image,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.25
            }
          }
        );
      });

      glowLayers.forEach((glow, index) => {
        gsap.to(glow, {
          xPercent: index % 2 === 0 ? 8 : -7,
          yPercent: index % 2 === 0 ? -5 : 6,
          opacity: index % 2 === 0 ? 0.9 : 0.72,
          duration: 12 + index * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    }, root);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [lenis, reduceMotion]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <article
      ref={rootRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="relative isolate overflow-hidden bg-[#F8F6F1] text-[#191511]"
    >
      <InteriorBackground />
      <InteriorHero pointerX={smoothX} pointerY={smoothY} reduceMotion={Boolean(reduceMotion)} />
      <InteriorStoryIntro />
      <div className="relative z-10">
        {storySections.map((section, index) => (
          <InteriorStorySection key={section.eyebrow} section={section} index={index} />
        ))}
      </div>
      <InteriorFinalCTA />
    </article>
  );
}

function InteriorBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFFDFC_0%,#F8F6F1_46%,#F5F1E9_100%)]" />
      <div
        data-interior-glow
        className="absolute right-[-10rem] top-[8rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.2),rgba(255,253,252,0.34)_42%,transparent_70%)] opacity-80"
      />
      <div
        data-interior-glow
        className="absolute bottom-[8rem] left-[-12rem] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,17,24,0.08),rgba(245,241,233,0.48)_42%,transparent_72%)] opacity-70"
      />
      <div className="interior-ambient-grid absolute -inset-16 opacity-[0.5]" />
      <div className="interior-luxury-grain absolute inset-0 opacity-[0.28]" />
    </div>
  );
}

function InteriorHero({
  pointerX,
  pointerY,
  reduceMotion
}: {
  pointerX: ReturnType<typeof useSpring>;
  pointerY: ReturnType<typeof useSpring>;
  reduceMotion: boolean;
}) {
  const visualX = useTransform(pointerX, [-0.5, 0.5], [-14, 14]);
  const visualY = useTransform(pointerY, [-0.5, 0.5], [-10, 10]);
  const rotateX = useTransform(pointerY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(pointerX, [-0.5, 0.5], [-3, 3]);

  return (
    <section className="relative z-10 flex min-h-[100svh] items-center overflow-hidden px-5 pb-20 pt-28 sm:px-6 md:px-8 lg:pt-32">
      <div
        data-interior-parallax
        data-speed="6"
        className="pointer-events-none absolute left-[6%] top-[18%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.18),transparent_68%)]"
      />
      <div className="relative mx-auto grid w-full max-w-[1320px] gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] lg:items-center xl:gap-16">
        <div className="relative z-20">
          <motion.p
            data-interior-reveal
            className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9A7428]"
          >
            Luxury Interior Systems
          </motion.p>
          <h1
            aria-label="Crafting interiors with spatial emotion."
            className="mt-6 max-w-[46rem] font-display text-[3.25rem] font-[650] leading-[0.94] tracking-[-0.045em] text-[#181512] sm:text-[4.6rem] lg:text-[clamp(4.9rem,6.2vw,6.8rem)] lg:leading-[0.88] lg:tracking-[-0.055em]"
          >
            {["Crafting interiors", "with spatial emotion."].map((line, index) => (
              <motion.span
                key={line}
                data-interior-reveal
                aria-hidden="true"
                className={index === 1 ? "block text-[#74675b]" : "block"}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p
            data-interior-reveal
            className="mt-7 max-w-[38rem] text-[1rem] font-medium leading-7 text-[#665f55] md:text-[1.08rem]"
          >
            Luxury interiors, premium materials, cinematic lighting and spatial storytelling designed for modern
            residential and commercial environments.
          </motion.p>
          <motion.div data-interior-reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#interior-stories"
              className="group inline-flex min-h-[3.05rem] items-center justify-center gap-2.5 rounded-[0.62rem] border border-[#181512]/10 bg-[#090807] px-5 text-[0.9rem] font-semibold text-[#fff8ec] shadow-[0_18px_48px_rgba(24,21,18,0.18),0_0_30px_rgba(214,180,95,0.16),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(24,21,18,0.24),0_0_40px_rgba(214,180,95,0.24)]"
            >
              Explore Interiors
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#spatial-concepts"
              className="group inline-flex min-h-[3.05rem] items-center justify-center gap-2.5 rounded-[0.62rem] border border-[#d6b45f]/30 bg-[#fffdf8]/62 px-5 text-[0.9rem] font-semibold text-[#181512] shadow-[0_16px_44px_rgba(98,78,34,0.08),inset_0_1px_0_rgba(255,255,255,0.88)] transition-[box-shadow,background-color,transform] duration-300 hover:-translate-y-1 hover:bg-white/78 hover:shadow-[0_22px_56px_rgba(98,78,34,0.12),0_0_30px_rgba(214,180,95,0.12)]"
            >
              View Spatial Concepts
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative min-h-[560px] overflow-hidden rounded-[1.65rem] border border-[#d8c99d]/52 bg-[#fffaf0]/58 p-3 shadow-[0_42px_140px_rgba(89,66,35,0.16),inset_0_1px_0_rgba(255,255,255,0.86)] sm:min-h-[650px] sm:p-5"
          style={reduceMotion ? undefined : { x: visualX, y: visualY, rotateX, rotateY, perspective: 1600 }}
        >
          <InteriorHeroVisual reduceMotion={reduceMotion} />
        </motion.div>
      </div>
    </section>
  );
}

function InteriorHeroVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const sceneMotion = reduceMotion
    ? undefined
    : {
        y: [0, -10, 0],
        scale: [1, 1.008, 1],
        rotateZ: [-0.35, 0.25, -0.35]
      };
  const materialCards = [
    { label: "Travertine", tone: "#d8c2a0", x: "8%", y: "14%", rotate: "-7deg" },
    { label: "Smoked Glass", tone: "#8f8a80", x: "68%", y: "16%", rotate: "6deg" },
    { label: "Walnut", tone: "#7a563a", x: "10%", y: "68%", rotate: "5deg" },
    { label: "Ivory Boucle", tone: "#eee5d5", x: "66%", y: "70%", rotate: "-6deg" }
  ];
  const signals = [
    ["Light", "Champagne"],
    ["Palette", "Ivory"],
    ["Mood", "Calm"]
  ];

  return (
    <div
      data-interior-hero-visual
      className="relative h-full min-h-[530px] overflow-hidden rounded-[1.28rem] bg-[#eadfcd] sm:min-h-[610px]"
    >
      <Image
        priority
        src={interiorImages.hero}
        alt=""
        fill
        sizes="(min-width: 1024px) 48vw, 92vw"
        quality={75}
        className="object-cover opacity-[0.86] saturate-[0.9] contrast-[1.05]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,246,0.48),rgba(245,234,216,0.12)_44%,rgba(32,24,18,0.2)),radial-gradient(circle_at_68%_16%,rgba(255,247,222,0.48),transparent_26rem),linear-gradient(180deg,rgba(255,253,252,0.04),rgba(44,31,21,0.22))]" />
      <div className="interior-penthouse-depth absolute inset-0 opacity-[0.34]" />
      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(72,58,39,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(72,58,39,0.18)_1px,transparent_1px)] [background-size:54px_54px]" />

      <motion.div
        aria-hidden="true"
        data-interior-room-stage
        animate={sceneMotion}
        transition={{ duration: 9.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-[4%] top-[6%] z-10 h-[76%] [perspective:1500px] sm:inset-x-[7%] sm:top-[7%]"
      >
        <div className="relative h-full [transform-style:preserve-3d]">
          <div className="absolute left-[11%] top-[8%] h-[56%] w-[76%] overflow-hidden rounded-[1.35rem] border border-white/40 bg-[#efe1cf]/82 shadow-[0_38px_110px_rgba(66,47,28,0.22),inset_0_1px_0_rgba(255,255,255,0.76)] [transform:translateZ(-70px)]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.76] saturate-[0.9] contrast-[1.04]"
              style={{
                backgroundImage: `linear-gradient(90deg,rgba(255,253,246,0.28),rgba(255,253,246,0.04)_54%,rgba(54,35,22,0.18)),url(${interiorImages.living})`
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,246,0.34),rgba(255,253,246,0.06)_54%,rgba(92,64,38,0.12)),linear-gradient(180deg,rgba(255,255,255,0.16),rgba(214,180,95,0.04))]" />
            <div className="absolute left-[8%] top-[12%] h-[76%] w-[18%] rounded-[0.7rem] border border-white/46 bg-[linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,246,226,0.12))] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]" />
            <div className="absolute left-[31%] top-[10%] h-[78%] w-[24%] rounded-[0.72rem] border border-[#d6b45f]/24 bg-[linear-gradient(90deg,rgba(111,77,47,0.2),rgba(87,57,35,0.05)),linear-gradient(180deg,rgba(255,247,230,0.2),rgba(88,60,39,0.08))]" />
            <div className="absolute right-[8%] top-[14%] h-[70%] w-[24%] rounded-[0.8rem] border border-white/34 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,246,226,0.08)),linear-gradient(90deg,rgba(214,180,95,0.1),transparent)]" />
            <div className="absolute bottom-[18%] left-[7%] h-px w-[86%] bg-[linear-gradient(90deg,transparent,rgba(142,103,52,0.34),transparent)]" />
            <div className="absolute left-[8%] top-[46%] h-px w-[80%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.56),transparent)]" />
          </div>

          <div className="absolute bottom-[7%] left-[7%] h-[42%] w-[84%] rounded-[1.2rem] border border-white/24 bg-[linear-gradient(116deg,rgba(233,214,184,0.88),rgba(187,148,98,0.18)_56%,rgba(92,62,38,0.18)),repeating-linear-gradient(92deg,rgba(96,63,36,0.14)_0_1px,transparent_1px_48px)] shadow-[0_34px_100px_rgba(58,40,26,0.24)] [transform:rotateX(64deg)_translateZ(62px)] [transform-origin:50%_0%]" />
          <div className="absolute bottom-[24%] left-[28%] h-[16%] w-[44%] rounded-[999px] border border-white/24 bg-[linear-gradient(90deg,rgba(244,233,218,0.96),rgba(255,250,242,0.86),rgba(224,205,181,0.9))] shadow-[0_28px_70px_rgba(59,43,30,0.24),inset_0_1px_0_rgba(255,255,255,0.88)] [transform:translateZ(150px)]" />
          <div className="absolute bottom-[33%] left-[30%] h-[16%] w-[40%] rounded-[1.2rem] border border-white/32 bg-[linear-gradient(180deg,rgba(255,252,246,0.96),rgba(231,218,203,0.9))] shadow-[0_24px_62px_rgba(59,43,30,0.18)] [transform:translateZ(134px)]" />
          <div className="absolute bottom-[25%] left-[21%] h-[17%] w-[16%] rounded-[1.05rem] border border-white/28 bg-[#eee3d5] shadow-[0_22px_58px_rgba(59,43,30,0.18)] [transform:translateZ(166px)]" />
          <div className="absolute bottom-[29%] right-[21%] h-[18%] w-[15%] rounded-[1rem] border border-white/24 bg-[#ead9c7] shadow-[0_22px_58px_rgba(59,43,30,0.17)] [transform:translateZ(162px)]" />
          <div className="absolute bottom-[43%] left-[36%] h-[9%] w-[10%] rounded-[0.55rem] bg-[#caa878] shadow-[0_16px_36px_rgba(66,47,28,0.16)] [transform:translateZ(188px)_rotate(-4deg)]" />
          <div className="absolute bottom-[41%] left-[48%] h-[9%] w-[10%] rounded-[0.55rem] bg-[#f7efe5] shadow-[0_16px_36px_rgba(66,47,28,0.14)] [transform:translateZ(190px)_rotate(5deg)]" />
          <div className="absolute bottom-[15%] left-[39%] h-[8%] w-[27%] rounded-[999px] border border-[#fff8ec]/34 bg-[linear-gradient(180deg,rgba(117,77,45,0.94),rgba(78,48,27,0.9))] shadow-[0_20px_48px_rgba(42,27,17,0.24),inset_0_1px_0_rgba(255,255,255,0.18)] [transform:translateZ(210px)]" />
          <div className="absolute bottom-[18%] left-[44%] h-[5%] w-[17%] rounded-[999px] border border-white/30 bg-[linear-gradient(180deg,rgba(255,251,238,0.86),rgba(214,190,154,0.82))] shadow-[0_18px_42px_rgba(42,27,17,0.18)] [transform:translateZ(226px)]" />
          <div className="absolute left-[21%] top-[3%] h-[28%] w-px bg-[linear-gradient(180deg,rgba(255,246,216,0),rgba(255,246,216,0.76),rgba(255,246,216,0))] [transform:translateZ(190px)]" />
          <div className="absolute left-[18%] top-[28%] h-[5%] w-[7%] rounded-[999px] border border-[#fff8ec]/36 bg-[linear-gradient(180deg,rgba(255,237,183,0.9),rgba(198,147,74,0.72))] shadow-[0_0_28px_rgba(255,225,155,0.32)] [transform:translateZ(214px)]" />
        </div>
      </motion.div>

      <div className="absolute inset-0 z-20 [perspective:1400px] [transform-style:preserve-3d]">
        {materialCards.map((layer, index) => (
          <motion.div
            key={layer.label}
            animate={reduceMotion ? undefined : { opacity: [0.72, 0.95, 0.72] }}
            transition={{ duration: 6.4 + index * 0.65, delay: index * 0.25, repeat: Infinity, ease: "easeInOut" }}
            className={`interior-material-card absolute z-20 rounded-[0.95rem] border border-[#f8f5ef]/38 bg-[#090807]/34 px-2.5 py-2.5 text-[#F8F5EF] shadow-[0_22px_58px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-[12px] sm:px-3.5 sm:py-3 ${
              index > 1 ? "hidden sm:block" : ""
            }`}
            style={{ left: layer.x, top: layer.y, transform: `translateZ(${92 + index * 18}px) rotate(${layer.rotate})` }}
          >
            <span className="block h-7 w-20 rounded-[0.55rem] sm:h-8 sm:w-24" style={{ backgroundColor: layer.tone }} />
            <span className="mt-2 block text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-[#F8F5EF] [text-shadow:0_2px_12px_rgba(0,0,0,0.26),0_8px_24px_rgba(0,0,0,0.12)] sm:text-[0.58rem]">
              {layer.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="interior-light-rail absolute left-[14%] top-[7%] z-30 h-px w-[62%] bg-[linear-gradient(90deg,transparent,rgba(255,246,216,0.92),transparent)] opacity-70" />
      <motion.div
        animate={reduceMotion ? undefined : { x: ["-85%", "230%"], opacity: [0, 0.22, 0] }}
        transition={{ duration: 8.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }}
        className="pointer-events-none absolute -left-1/3 top-[-18%] z-30 h-[150%] w-[34%] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,244,209,0.58),transparent)]"
      />

      <div className="absolute bottom-5 left-5 right-5 z-40 grid gap-3 rounded-[1rem] border border-[#f8f5ef]/34 bg-[#090807]/38 p-4 shadow-[0_22px_74px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-[12px] sm:grid-cols-3">
        {signals.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <p className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#EFE4C4] [text-shadow:0_2px_12px_rgba(0,0,0,0.26),0_8px_24px_rgba(0,0,0,0.12)]">
              {label}
            </p>
            <p className="mt-1 text-[0.95rem] font-semibold text-[#F8F5EF] [text-shadow:0_2px_12px_rgba(0,0,0,0.26),0_8px_24px_rgba(0,0,0,0.12)]">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InteriorStoryIntro() {
  return (
    <section id="interior-stories" className="relative z-10 px-5 py-16 sm:px-6 md:px-8 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <div data-interior-reveal className="max-w-[48rem]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9A7428]">
            Spatial Concepts
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,5vw,5.6rem)] font-[650] leading-[0.92] tracking-[-0.052em] text-[#181512]">
            A cinematic interior language for modern living.
          </h2>
          <p className="mt-6 max-w-[40rem] text-[1rem] leading-7 text-[#665f55] md:text-[1.08rem]">
            Every room is treated as a sequence of atmosphere, proportion, material and light, designed to feel effortless
            while remaining technically controlled.
          </p>
        </div>
      </div>
    </section>
  );
}

function InteriorStorySection({
  index,
  section
}: {
  index: number;
  section: (typeof storySections)[number];
}) {
  const reverse = index % 2 === 1;
  const Icon = section.Icon;

  return (
    <section className="relative isolate px-5 py-10 sm:px-6 md:px-8 lg:py-16">
      <div
        data-interior-glow
        className={`pointer-events-none absolute top-[10%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.16),transparent_70%)] ${
          reverse ? "left-[-12rem]" : "right-[-12rem]"
        }`}
      />
      <div
        className={`relative mx-auto grid max-w-[1240px] gap-8 lg:min-h-[660px] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.82fr)] lg:items-center lg:gap-14 ${
          reverse ? "lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.02fr)]" : ""
        }`}
      >
        <div className={reverse ? "lg:order-2" : ""}>
          <motion.div
            data-interior-reveal
            whileHover={{ y: -8, scale: 1.006 }}
            transition={{ duration: 0.45, ease }}
            className="group relative min-h-[420px] overflow-hidden rounded-[1.55rem] border border-[#d8c99d]/54 bg-[#efe5d7] shadow-[0_34px_110px_rgba(82,61,32,0.13),inset_0_1px_0_rgba(255,255,255,0.78)] lg:min-h-[620px]"
          >
            <div
              data-interior-image
              className="absolute inset-[-4%] bg-cover bg-center will-change-transform"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,253,252,0.08),rgba(20,15,10,0.18)),url(${section.image})`
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,248,224,0.16),transparent_22rem),linear-gradient(to_top,rgba(0,0,0,0.48),rgba(0,0,0,0.12)_42%,rgba(0,0,0,0.03)_68%,transparent_86%)]" />
            <div className="interior-reflection absolute -left-1/3 top-[-22%] h-[150%] w-[34%] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,253,252,0.3),transparent)] opacity-0" />
            <div className="absolute bottom-5 left-5 right-5 grid gap-3 rounded-[1rem] border border-[#f8f5ef]/36 bg-[#090807]/40 p-4 shadow-[0_22px_74px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-[16px] sm:grid-cols-3">
              {section.stats.map((stat) => (
                <span
                  key={stat}
                  className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#F8F5EF] [text-shadow:0_2px_12px_rgba(0,0,0,0.26),0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  {stat}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className={reverse ? "lg:order-1" : ""}>
          <div data-interior-reveal className="max-w-[35rem]">
            <div className="flex h-12 w-12 items-center justify-center rounded-[0.9rem] border border-[#d6b45f]/24 bg-[#fffdf8]/72 text-[#9A7428] shadow-[0_14px_34px_rgba(98,78,34,0.09)]">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <p className="mt-7 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#9A7428]">
              {section.eyebrow}
            </p>
            <h3 className="mt-4 font-display text-[clamp(2rem,4vw,4.35rem)] font-[650] leading-[0.95] tracking-[-0.048em] text-[#181512]">
              {section.title}
            </h3>
            <p className="mt-6 text-[1rem] leading-7 text-[#665f55] md:text-[1.06rem]">{section.body}</p>
            <div id={index === 0 ? "spatial-concepts" : undefined} className="mt-8 grid gap-3">
              {["Atmosphere", "Material", "Execution"].map((item, itemIndex) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-[0.9rem] border border-[#d8c99d]/50 bg-[#fffdf8]/58 px-4 py-3 shadow-[0_12px_34px_rgba(98,78,34,0.055)]"
                >
                  <span className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#74675b]">
                    {item}
                  </span>
                  <span className="h-px w-[38%] bg-[linear-gradient(90deg,transparent,#d6b45f)]" />
                  <span className="text-[0.74rem] font-semibold text-[#9A7428]">0{itemIndex + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InteriorFinalCTA() {
  return (
    <section className="relative z-10 isolate overflow-hidden px-5 py-20 sm:px-6 md:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(214,180,95,0.22),transparent_34rem),linear-gradient(180deg,transparent,#F5F1E9)]" />
      <div className="interior-ambient-grid pointer-events-none absolute inset-0 opacity-[0.34]" />
      <div
        data-interior-reveal
        className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[1.7rem] border border-[#d8c99d]/58 bg-[#fffdf8]/70 px-6 py-16 text-center shadow-[0_34px_110px_rgba(82,61,32,0.13),inset_0_1px_0_rgba(255,255,255,0.88)] md:px-10 md:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,180,95,0.2),transparent_26rem),linear-gradient(135deg,rgba(255,255,255,0.78),rgba(214,180,95,0.06))]" />
        <div className="relative z-10 mx-auto max-w-[46rem]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[0.95rem] border border-[#d6b45f]/26 bg-[#181512] text-[#fff8ec]">
            <PanelsTopLeft className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <p className="mt-7 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9A7428]">
            Interior Design Studio
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,5.8rem)] font-[650] leading-[0.9] tracking-[-0.052em] text-[#181512]">
            Design spaces that feel timeless.
          </h2>
          <p className="mx-auto mt-6 max-w-[38rem] text-[1rem] leading-7 text-[#665f55] md:text-[1.08rem]">
            Build a refined interior direction with material intelligence, cinematic lighting and execution clarity from
            concept to handoff.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/book-consultation" className="premium-cta group min-w-[12rem]">
              Start Interior Workflow
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <ServiceRequestCTA className="items-center" showLabel={false} />
            <Link href="/contact" className="premium-cta-secondary group min-w-[12rem]">
              Contact Studio
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
