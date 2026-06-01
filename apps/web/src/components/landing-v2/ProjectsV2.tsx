import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { projectSignalsV2 } from "@/components/landing-v2/data";
import { RevealV2 } from "@/components/landing-v2/RevealV2";

const deliveryStandards = [
  "Executive brief discipline",
  "Design-to-build continuity",
  "Trade and procurement control",
  "Private reporting cadence"
];

export function ProjectsV2() {
  return (
    <section id="projects-v2" className="bg-[#fbf7ef] px-5 py-24 text-[#181512] sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <RevealV2>
            <p className="text-[0.72rem] font-semibold uppercase leading-none tracking-[0.14em] text-[#8b1118]">
              Project direction
            </p>
            <h2 className="mt-5 max-w-[42rem] font-display text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.92] tracking-normal">
              Built for mandates that cross disciplines.
            </h2>
          </RevealV2>
          <RevealV2 delay={0.08}>
            <p className="max-w-[42rem] text-[1rem] font-medium leading-8 text-[#3b3028]/72 md:text-[1.1rem]">
              The V2 positioning shows Ractysh as a premium control room for projects where architecture, construction,
              assets, trade and private exchange activity cannot operate in silos.
            </p>
          </RevealV2>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {projectSignalsV2.map((project, index) => (
            <RevealV2 key={project.title} delay={index * 0.05}>
              <article className="group overflow-hidden border border-[#dfcfad] bg-[#fffaf0] shadow-[0_28px_90px_rgba(82,61,31,0.09)]">
                <div className="relative h-[22rem] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} visual`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(24,21,18,0.72)_100%)]" />
                  <span className="absolute left-5 top-5 bg-[#8b1118] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#fffaf0]">
                    Signal 0{index + 1}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#8b1118]">{project.meta}</p>
                  <h3 className="mt-3 font-display text-[2.25rem] font-semibold leading-none text-[#181512]">{project.title}</h3>
                </div>
              </article>
            </RevealV2>
          ))}
        </div>

        <RevealV2 className="mt-8">
          <div className="grid gap-6 border border-[#8b1118]/24 bg-[#181512] p-5 text-[#fffaf0] shadow-[0_30px_100px_rgba(24,21,18,0.2)] lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {deliveryStandards.map((standard) => (
                <div key={standard} className="flex items-center gap-3 border border-[#e0c579]/14 bg-[#fffaf0]/6 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#e0c579]" strokeWidth={1.7} />
                  <span className="text-[0.76rem] font-semibold uppercase leading-5 tracking-[0.08em] text-[#fffaf0]/78">
                    {standard}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/our-projects"
              className="inline-flex h-12 items-center justify-center gap-2 border border-[#e0c579]/40 px-5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#fffaf0] transition duration-300 hover:border-[#efd28a] hover:bg-[#fffaf0]/8"
            >
              View projects
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </RevealV2>
      </div>
    </section>
  );
}
