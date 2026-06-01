import type { Metadata } from "next";
import { BlogEnterprisePage } from "@/components/BlogEnterprisePage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Enterprise Blog | Ractysh Group",
  description:
    "Ractysh articles on Architecture, Construction, Real Estate, Export & Import, OTC Exchange and enterprise coordination."
};

export default async function BlogPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <BlogEnterprisePage />
    </MarketingChrome>
  );
}
