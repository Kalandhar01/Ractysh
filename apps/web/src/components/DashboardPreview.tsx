import {
  ArrowDownUp,
  ChartNoAxesColumn,
  ChevronDown,
  LayoutGrid,
  Shield,
  Sparkle,
  SquareAsterisk,
  UsersRound,
  Waypoints
} from "lucide-react";
import type { Division } from "@/lib/types";
import { DashboardCard } from "@/components/DashboardCard";
import { cn } from "@/lib/utils";

interface DashboardPreviewProps {
  divisions: Division[];
}

export function DashboardPreview({ divisions }: DashboardPreviewProps) {
  void divisions;

  const miniCards = [
    {
      title: "Architecture & Real Estate Mandate",
      eyebrow: "Spatial + Asset Strategy",
      status: "In Progress",
      description: "Coordinate planning logic, property positioning, investor material and stakeholder approvals",
      iconText: "ARE",
      assignee: "Ractysh A",
      progress: "9 out of 14",
      due: "Active cycle"
    },
    {
      title: "Construction Delivery Control",
      eyebrow: "Construction Command",
      status: "In Progress",
      description: "Track site execution, structural work, MEP coordination, procurement and premium handover",
      iconText: "CON",
      assignee: "Ractysh C",
      progress: "18 out of 26",
      due: "Live lane"
    },
    {
      title: "Export-Import & OTC Exchange Desk",
      eyebrow: "Trade + Private Deals",
      status: "Ongoing",
      description: "Manage supplier movement, documentation, counterparty intake and private transaction readiness",
      iconText: "OTC",
      assignee: "Ractysh E",
      progress: "11 out of 18",
      due: "Private desk"
    }
  ];

  const sidebarIcons = [LayoutGrid, Waypoints, ChartNoAxesColumn, Sparkle, UsersRound, Shield];

  return (
    <div
      data-main-dashboard
      className="home-dashboard-frame absolute left-1/2 top-[30rem] z-20 h-[27rem] w-[min(54rem,97vw)] -translate-x-1/2 md:top-[20.35rem]"
    >
      <div className="home-dashboard-scaler h-full w-full">
        <div className="home-dashboard-surface h-full w-full overflow-hidden rounded-lg border border-[#eeece8] bg-white/96 shadow-[0_28px_80px_rgba(48,48,48,0.055),0_1px_0_rgba(255,255,255,0.92)_inset] backdrop-blur-2xl">
          <div className="grid h-full grid-cols-[3.45rem_1fr]">
            <aside className="flex flex-col items-center gap-5 border-r border-[#efeee9] bg-[#fbfbf8] py-6">
              <div className="relative h-6 w-6">
                <span className="absolute left-0 top-0 h-4 w-4 rounded-[0.22rem] bg-[#C6A45B]" />
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-[0.22rem] bg-[#17243a] shadow-[0_8px_16px_rgba(23,36,58,0.16)]" />
              </div>
              {sidebarIcons.map((Icon, index) => (
                <div key={index} className="relative flex h-5 w-5 items-center justify-center text-[#9a9894]">
                  {index === 1 ? <span className="absolute -left-[1.1rem] h-[3.95rem] w-[2px] rounded-full bg-[#303030]" /> : null}
                  <Icon className={cn("h-5 w-5", index === 1 && "text-[#303030]")} strokeWidth={1.75} />
                </div>
              ))}
            </aside>

            <div className="relative overflow-hidden px-5 py-6 md:px-8">
              <div className="mb-5">
                <h2 className="font-display text-[1.2rem] font-semibold leading-none tracking-normal text-[#303030]">Dashboard</h2>
                <p className="mt-2 text-[0.72rem] leading-none text-[#54524e]">Five-pillar enterprise operations in one place</p>
              </div>
              <div className="mb-5 flex flex-wrap gap-2.5">
                <button data-dashboard-filter className="flex h-8 w-[12.4rem] items-center gap-1.5 whitespace-nowrap rounded-md border border-[#ebe8e2] bg-white/90 px-2.5 text-[0.78rem] font-medium leading-[1.4] tracking-[0.04em] text-[rgba(32,20,15,0.58)] shadow-[0_6px_18px_rgba(48,48,48,0.014)]">
                  <SquareAsterisk className="h-3.5 w-3.5 text-[rgba(32,20,15,0.46)]" strokeWidth={1.75} />
                  Entity: All companies
                  <ChevronDown className="ml-auto h-3 w-3 text-[rgba(32,20,15,0.42)]" />
                </button>
                <button data-dashboard-filter className="flex h-8 w-[15.1rem] items-center gap-1.5 whitespace-nowrap rounded-md border border-[#ebe8e2] bg-white/90 px-2.5 text-[0.78rem] font-medium leading-[1.4] tracking-[0.04em] text-[rgba(32,20,15,0.58)] shadow-[0_6px_18px_rgba(48,48,48,0.014)]">
                  <ArrowDownUp className="h-3.5 w-3.5 text-[rgba(32,20,15,0.46)]" strokeWidth={1.75} />
                  Sort by: Executive priority
                  <ChevronDown className="ml-auto h-3 w-3 text-[rgba(32,20,15,0.42)]" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-5">
                {miniCards.map((card, index) => (
                  <div key={card.title} className="relative min-h-[15.45rem]">
                    <div data-dashboard-placeholder className="absolute inset-0 rounded-md border border-[#e8e6e3] bg-white/38 shadow-[0_14px_40px_rgba(48,48,48,0.018)]" />
                    <div data-dashboard-slot-card className="absolute inset-0 opacity-0">
                      <DashboardCard {...card} index={index} compact />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/72 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
