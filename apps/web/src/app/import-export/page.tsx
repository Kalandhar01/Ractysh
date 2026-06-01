import type { Metadata } from "next";
import { ImportExportGlobalTradePage } from "@/components/ImportExportGlobalTradePage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Export & Import | Global Trade Operations",
  description:
    "Premium export, import and enterprise coordination systems for reliable international operations and modern logistics workflows."
};

export default async function ImportExportPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <ImportExportGlobalTradePage />
    </MarketingChrome>
  );
}
