import type { Metadata } from "next";
import { FivePillarEcosystemPage } from "@/components/FivePillarEcosystemPage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Ractysh Group Business Ecosystem | Five Enterprise Pillars",
  description:
    "A premium overview of the Ractysh five-pillar enterprise ecosystem across Architecture, Construction, Real Estate, Export & Import and OTC Exchange."
};

export default async function BusinessPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <FivePillarEcosystemPage />
    </MarketingChrome>
  );
}
