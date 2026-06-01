import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ecosystemStepsV2, pillarsV2, trustMarkersV2 } from "@/components/landing-v2/data";
import { RevealV2 } from "@/components/landing-v2/RevealV2";

export function EcosystemV2() {
  return (
    <section id="ecosystem-v2" className="relative isolate overflow-hidden bg-[#fbf7ef] px-5 py-24 text-[#181512] sm:px-8 lg:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(139,17,24,0.06)_0,transparent_28%,transparent_72%,rgba(198,164,91,0.12)_100%)]" />
      <div className="mx-auto max-w-[90rem]">
        <RevealV2 className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase leading-none tracking-[0.14em] text-[#8b1118]">
              Enterprise ecosystem
            </p>
            <h2 className="mt-5 max-w-[42rem] font-display text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.92] tracking-normal text-[#181512]">
              One operating layer across five premium verticals.
            </h2>
          </div>
          <p className="max-w-[42rem] text-[1rem] font-medium leading-8 text-[#3b3028]/72 md:text-[1.1rem]">
            V2 frames Ractysh as an executive command environment: design intelligence, site execution, asset
            development, global movement and private exchange workflows connected in one controlled system.
          </p>
        </RevealV2>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_27rem]">
          <RevealV2 className="relative min-h-[38rem] overflow-hidden border border-[#dfcfad] bg-[#fffaf0] p-5 shadow-[0_30px_110px_rgba(82,61,31,0.1)] lg:min-h-[44rem]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(198,164,91,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(198,164,91,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
            <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border border-[#c6a45b]/50 bg-[#181512] text-center text-[#fffaf0] shadow-[0_30px_90px_rgba(24,21,18,0.24)]">
              <BrandLogo size="lg" decorative className="mb-3" />
              <p className="font-display text-[2rem] font-semibold leading-none">Ractysh</p>
              <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e0c579]">Command layer</span>
            </div>

            <div className="relative z-10 grid h-full gap-4 sm:grid-cols-2">
              {pillarsV2.map((pillar, index) => {
                const Icon = pillar.Icon;
                const alignClass =
                  index === 0
                    ? "self-start"
                    : index === 1
                      ? "self-start sm:justify-self-end"
                      : index === 2
                        ? "self-center sm:col-span-2 sm:justify-self-center"
                        : index === 3
                          ? "self-end"
                          : "self-end sm:justify-self-end";

                return (
                  <div key={pillar.title} className={`w-full max-w-[18rem] border border-[#dfcfad] bg-[#fbf7ef]/92 p-4 shadow-[0_20px_60px_rgba(82,61,31,0.08)] backdrop-blur-sm ${alignClass}`}>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center bg-[#8b1118] text-[#fffaf0]">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8b1118]">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-[1.65rem] font-semibold leading-none text-[#181512]">{pillar.title}</h3>
                    <p className="mt-3 text-[0.9rem] font-medium leading-6 text-[#3b3028]/70">{pillar.description}</p>
                  </div>
                );
              })}
            </div>
          </RevealV2>

          <div className="space-y-4">
            {ecosystemStepsV2.map((step, index) => (
              <RevealV2 key={step.label} delay={index * 0.05}>
                <div className="border border-[#dfcfad] bg-[#fffaf0] p-5 shadow-[0_20px_70px_rgba(82,61,31,0.07)]">
                  <div className="flex items-start gap-4">
                    <span className="font-display text-[2rem] font-semibold leading-none text-[#8b1118]">{step.value}</span>
                    <div>
                      <h3 className="font-display text-[1.8rem] font-semibold leading-none text-[#181512]">{step.label}</h3>
                      <p className="mt-3 text-[0.93rem] font-medium leading-6 text-[#3b3028]/70">{step.detail}</p>
                    </div>
                  </div>
                </div>
              </RevealV2>
            ))}

            <RevealV2 delay={0.22}>
              <div className="border border-[#8b1118]/22 bg-[#181512] p-5 text-[#fffaf0]">
                {trustMarkersV2.map((marker) => {
                  const Icon = marker.Icon;
                  return (
                    <div key={marker.label} className="flex items-center justify-between border-b border-[#e0c579]/16 py-3 last:border-b-0">
                      <span className="inline-flex items-center gap-3 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#fffaf0]/78">
                        <Icon className="h-4 w-4 text-[#e0c579]" strokeWidth={1.6} />
                        {marker.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-[#e0c579]" strokeWidth={1.6} />
                    </div>
                  );
                })}
              </div>
            </RevealV2>
          </div>
        </div>
      </div>
    </section>
  );
}
