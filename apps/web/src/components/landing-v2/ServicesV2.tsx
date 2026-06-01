import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pillarsV2 } from "@/components/landing-v2/data";
import { RevealV2 } from "@/components/landing-v2/RevealV2";

export function ServicesV2() {
  return (
    <section id="services-v2" className="bg-[#181512] px-5 py-24 text-[#fffaf0] sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[90rem]">
        <RevealV2 className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase leading-none tracking-[0.14em] text-[#e0c579]">
              Five content pillars
            </p>
            <h2 className="mt-5 max-w-[48rem] font-display text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.92] tracking-normal">
              Premium verticals with one executive standard.
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex h-12 w-fit items-center gap-2 border border-[#e0c579]/38 bg-[#fffaf0]/8 px-5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#fffaf0] transition duration-300 hover:border-[#efd28a] hover:bg-[#fffaf0]/12"
          >
            Explore services
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </RevealV2>

        <div className="mt-14 grid gap-px bg-[#e0c579]/22 lg:grid-cols-5">
          {pillarsV2.map((pillar, index) => {
            const Icon = pillar.Icon;
            return (
              <RevealV2 key={pillar.title} delay={index * 0.04} className="min-h-[32rem]">
                <Link href={pillar.href} className="group relative flex min-h-[32rem] overflow-hidden bg-[#241b18]">
                  <Image
                    src={pillar.image}
                    alt={`${pillar.title} premium enterprise visual`}
                    fill
                    sizes="(min-width: 1024px) 20vw, 100vw"
                    className="object-cover opacity-[0.58] transition duration-700 group-hover:scale-[1.04] group-hover:opacity-[0.72]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.16)_0%,rgba(24,21,18,0.72)_52%,rgba(24,21,18,0.96)_100%)]" />
                  <div className="relative z-10 flex min-h-full flex-col justify-between p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center border border-[#e0c579]/36 bg-[#181512]/68 text-[#e0c579] backdrop-blur-md">
                        <Icon className="h-5 w-5" strokeWidth={1.55} />
                      </span>
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#e0c579]">
                        0{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#e0c579]">{pillar.label}</p>
                      <h3 className="font-display text-[2.35rem] font-semibold leading-none text-[#fffaf0]">{pillar.title}</h3>
                      <p className="mt-4 text-[0.94rem] font-medium leading-6 text-[#f8efe0]/72">{pillar.description}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[#fffaf0]">
                        Open vertical
                        <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealV2>
            );
          })}
        </div>
      </div>
    </section>
  );
}
