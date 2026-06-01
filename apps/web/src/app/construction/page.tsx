import type { Metadata } from "next";
import { EnterprisePillarLandingPage } from "@/components/EnterprisePillarLandingPage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getEnterprisePillar } from "@/data/enterprisePillars";
import { getSiteContent } from "@/lib/api";

const pillar = getEnterprisePillar("construction")!;

export const metadata: Metadata = {
  title: `${pillar.title} | Ractysh Group`,
  description: pillar.summary
};

export default async function ConstructionDivisionPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <EnterprisePillarLandingPage pillar={pillar} />
    </MarketingChrome>
  );
}
