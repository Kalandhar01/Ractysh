import type { Metadata } from "next";
import { EnterprisePillarLandingPage } from "@/components/EnterprisePillarLandingPage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getEnterprisePillar } from "@/data/enterprisePillars";
import { getSiteContent } from "@/lib/api";

const pillar = getEnterprisePillar("real-estate")!;

export const metadata: Metadata = {
  title: `${pillar.title} | Ractysh Group`,
  description: pillar.summary
};

export default async function RealEstateDivisionPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <EnterprisePillarLandingPage pillar={pillar} />
    </MarketingChrome>
  );
}
