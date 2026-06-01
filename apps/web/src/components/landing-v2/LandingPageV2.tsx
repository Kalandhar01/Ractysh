import { AboutV2 } from "@/components/landing-v2/AboutV2";
import { EcosystemV2 } from "@/components/landing-v2/EcosystemV2";
import { FooterV2 } from "@/components/landing-v2/FooterV2";
import { HeaderV2 } from "@/components/landing-v2/HeaderV2";
import { HeroV2 } from "@/components/landing-v2/HeroV2";
import { ProjectsV2 } from "@/components/landing-v2/ProjectsV2";
import { ServicesV2 } from "@/components/landing-v2/ServicesV2";

export function LandingPageV2() {
  return (
    <div className="landing-v2-page relative isolate min-h-screen overflow-hidden bg-[#fbf7ef] text-[#181512] [font-family:var(--font-manrope)]">
      <HeaderV2 />
      <main>
        <HeroV2 />
        <EcosystemV2 />
        <ServicesV2 />
        <ProjectsV2 />
        <AboutV2 />
      </main>
      <FooterV2 />
    </div>
  );
}
