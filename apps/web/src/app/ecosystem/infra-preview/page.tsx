import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ractysh Group Business Ecosystem | Ractysh",
  description:
    "The Ractysh five-pillar enterprise ecosystem across architecture, construction, real estate, export-import and OTC exchange."
};

export default function InfraPreviewPage() {
  redirect("/business");
}
