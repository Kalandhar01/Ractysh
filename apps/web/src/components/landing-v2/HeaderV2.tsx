import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { navItemsV2 } from "@/components/landing-v2/data";

export function HeaderV2() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between border border-white/14 bg-[#14100f]/82 px-4 text-[#fffaf0] shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:px-5">
        <Link href="/landing-v2" className="flex items-center gap-3" aria-label="Ractysh Landing V2">
          <BrandLogo size="sm" priority decorative />
          <span className="font-display text-[1.7rem] font-semibold leading-none tracking-normal">Ractysh</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[0.78rem] font-semibold uppercase leading-none tracking-[0.08em] text-[#f8efe0]/76 lg:flex">
          {navItemsV2.map((item) => (
            <Link key={item.href} href={item.href} className="transition duration-300 hover:text-[#e0c579]">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/book-consultation"
          className="inline-flex h-10 items-center gap-2 border border-[#c6a45b]/54 bg-[#8b1118] px-4 text-[0.78rem] font-semibold uppercase leading-none tracking-[0.06em] text-[#fffaf0] shadow-[0_14px_34px_rgba(139,17,24,0.28)] transition duration-300 hover:border-[#efd28a] hover:bg-[#9a151d]"
        >
          Consult
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
        </Link>
      </div>
    </header>
  );
}
