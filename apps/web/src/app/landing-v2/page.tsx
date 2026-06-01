import type { Metadata } from "next";
import { LandingPageV2 } from "@/components/landing-v2/LandingPageV2";

export const metadata: Metadata = {
  title: "Landing Page V2 | Ractysh Group",
  description:
    "A premium enterprise landing page concept for Ractysh Group across architecture, construction, real estate, import-export and OTC exchange."
};

export default function LandingV2Route() {
  return <LandingPageV2 />;
}
