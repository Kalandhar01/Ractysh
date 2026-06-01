import type { Metadata } from "next";
import { ArchitectureDesignExperience } from "@/components/ArchitectureDesignExperience";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Ractysh Architecture | Designing Spaces. Creating Identity.",
  description:
    "Premium architectural planning and spatial experiences crafted for modern living and business environments."
};

export default async function ArchitecturePage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <ArchitectureDesignExperience />
    </MarketingChrome>
  );
}
