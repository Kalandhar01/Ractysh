import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { navItemsV2, pillarsV2 } from "@/components/landing-v2/data";

export function FooterV2() {
  return (
    <footer
      className="relative isolate overflow-hidden bg-[#120d0c] px-5 py-14 text-[#fffaf0] sm:px-8"
      style={{
        backgroundImage: "linear-gradient(rgba(8,8,7,0.2),rgba(8,8,7,0.2)),url('/footer-background.png')",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <div className="relative z-10 mx-auto max-w-[90rem]">
        <div className="grid gap-10 border-b border-[#e0c579]/16 pb-10 lg:grid-cols-[1fr_0.72fr_0.72fr]">
          <div>
            <Link href="/landing-v2" className="inline-flex items-center gap-3">
              <BrandLogo size="lg" decorative />
              <span className="font-display text-[2.2rem] font-semibold leading-none">Ractysh</span>
            </Link>
            <p className="mt-5 max-w-[28rem] text-[0.95rem] font-medium leading-7 text-[#f8efe0]/64">
              A premium enterprise ecosystem across architecture, construction, real estate, import-export and OTC exchange.
            </p>
          </div>

          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#e0c579]">Page</p>
            <div className="mt-5 grid gap-3">
              {navItemsV2.map((item) => (
                <Link key={item.href} href={item.href} className="text-[0.9rem] font-semibold text-[#fffaf0]/72 transition duration-300 hover:text-[#e0c579]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#e0c579]">Pillars</p>
            <div className="mt-5 grid gap-3">
              {pillarsV2.map((pillar) => (
                <Link key={pillar.href} href={pillar.href} className="text-[0.9rem] font-semibold text-[#fffaf0]/72 transition duration-300 hover:text-[#e0c579]">
                  {pillar.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.78rem] font-medium text-[#fffaf0]/52">Landing Page V2 test route. V1 remains unchanged.</p>
          <Link
            href="/book-consultation"
            className="inline-flex h-11 w-fit items-center gap-2 border border-[#e0c579]/36 px-4 text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[#fffaf0] transition duration-300 hover:border-[#efd28a] hover:bg-[#fffaf0]/8"
          >
            Start a mandate
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
