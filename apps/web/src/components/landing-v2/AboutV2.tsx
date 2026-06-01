import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { RevealV2 } from "@/components/landing-v2/RevealV2";

export function AboutV2() {
  return (
    <section id="about-v2" className="relative isolate overflow-hidden bg-[#f4eadb] px-5 py-24 text-[#181512] sm:px-8 lg:py-32">
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[45vw] bg-[#8b1118] lg:block" />
      <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
        <RevealV2 className="flex flex-col justify-between bg-[#181512] p-6 text-[#fffaf0] shadow-[0_30px_100px_rgba(24,21,18,0.2)] lg:p-8">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase leading-none tracking-[0.14em] text-[#e0c579]">
              Company story
            </p>
            <h2 className="mt-5 font-display text-[clamp(3rem,5.5vw,5.8rem)] font-semibold leading-[0.92] tracking-normal">
              A private enterprise group built for composed execution.
            </h2>
            <p className="mt-7 text-[1rem] font-medium leading-8 text-[#f8efe0]/74 md:text-[1.08rem]">
              Ractysh V2 presents the group as a premium operating ecosystem: part architecture office, part construction
              command, part asset development platform, part global trade desk and part private exchange environment.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {["Enterprise discipline", "Premium spatial intelligence", "Global business movement"].map((item) => (
              <div key={item} className="flex items-center gap-3 border border-[#e0c579]/18 bg-[#fffaf0]/6 px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-[#e0c579]" strokeWidth={1.7} />
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#fffaf0]/78">{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-10 inline-flex h-12 w-fit items-center gap-2 border border-[#e0c579]/42 bg-[#8b1118] px-5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#fffaf0] transition duration-300 hover:border-[#efd28a] hover:bg-[#9b151e]"
          >
            About Ractysh
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </RevealV2>

        <RevealV2 delay={0.08}>
          <div className="relative min-h-[34rem] overflow-hidden border border-[#dfcfad] shadow-[0_34px_110px_rgba(82,61,31,0.16)] lg:h-full">
            <Image
              src="/contact/enterprise-architecture-workspace.webp"
              alt="Premium executive architecture workspace overlooking a modern city."
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.02)_0%,rgba(24,21,18,0.68)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 grid gap-px bg-[#e0c579]/22 sm:grid-cols-3">
              {[
                ["Architecture", "Design authority"],
                ["Construction", "Delivery control"],
                ["Trade", "Global reach"]
              ].map(([title, detail]) => (
                <div key={title} className="bg-[#181512]/86 p-5 text-[#fffaf0] backdrop-blur-md">
                  <p className="font-display text-[1.7rem] font-semibold leading-none">{title}</p>
                  <span className="mt-2 block text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#e0c579]">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </RevealV2>
      </div>
    </section>
  );
}
