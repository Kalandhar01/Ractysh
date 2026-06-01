import { CalendarDays, Check, Hourglass, LockKeyhole, ShieldCheck, Star, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  eyebrow: string;
  status: string;
  description: string;
  iconText: string;
  assignee: string;
  progress: string;
  due: string;
  className?: string;
  index?: number;
  floating?: boolean;
  compact?: boolean;
}

function OperationBadge({ label, compact = false }: { label: string; compact?: boolean }) {
  const sizeClasses = compact ? "h-[3.05rem] w-[3.05rem] rounded-lg" : "h-[4rem] w-[4rem] rounded-xl";
  const normalized = label.toLowerCase();

  if (normalized.includes("pci")) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center border border-[#ece8e4] bg-white text-center font-semibold text-[#303030] shadow-[0_12px_24px_rgba(48,48,48,0.10)]",
          sizeClasses,
          compact ? "text-[0.95rem]" : "text-[1.1rem]"
        )}
      >
        PCI
        <Check className={cn("absolute text-[#26b873]", compact ? "bottom-2 right-2 h-3 w-3" : "bottom-3 right-3 h-4 w-4")} strokeWidth={3} />
      </div>
    );
  }

  if (normalized.includes("soc")) {
    return (
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-center border border-[#ece8e4] bg-white text-center font-semibold leading-none text-[#303030] shadow-[0_12px_24px_rgba(48,48,48,0.10)]",
          sizeClasses
        )}
      >
        <ShieldCheck className={cn("mb-1", compact ? "h-4 w-4" : "h-5 w-5")} strokeWidth={1.8} />
        <span className={compact ? "text-[0.54rem]" : "text-[0.62rem]"}>SOC 2</span>
        <span className={compact ? "text-[0.45rem]" : "text-[0.52rem]"}>TYPE II</span>
      </div>
    );
  }

  if (normalized.includes("gdpr")) {
    return (
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-center border border-[#ece8e4] bg-white text-center font-semibold leading-none text-[#303030] shadow-[0_12px_24px_rgba(48,48,48,0.10)]",
          sizeClasses
        )}
      >
        <span className="mb-0.5 flex items-center gap-0.5">
          <Star className={compact ? "h-2 w-2" : "h-2.5 w-2.5"} fill="currentColor" />
          <Star className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} fill="currentColor" />
          <Star className={compact ? "h-2 w-2" : "h-2.5 w-2.5"} fill="currentColor" />
        </span>
        <LockKeyhole className={cn("mb-1", compact ? "h-4 w-4" : "h-5 w-5")} strokeWidth={1.8} />
        <span className={compact ? "text-[0.56rem]" : "text-[0.68rem]"}>GDPR</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border border-[#ece8e4] bg-white text-center font-bold leading-none text-[#303030] shadow-[0_12px_24px_rgba(48,48,48,0.10)]",
        sizeClasses,
        compact ? "text-[0.76rem]" : "text-base"
      )}
    >
      {label}
    </div>
  );
}

export function DashboardCard({
  title,
  eyebrow,
  status,
  description,
  iconText,
  assignee,
  progress,
  due,
  className,
  index = 0,
  floating = false,
  compact = false
}: DashboardCardProps) {
  return (
    <article
      data-floating-stack-card={floating ? "" : undefined}
      data-card-index={index}
      className={cn(
        "overflow-hidden border border-[#e8e6e3] bg-white text-left backdrop-blur-xl will-change-transform",
        compact
          ? "relative min-h-[15.45rem] w-full rounded-md shadow-none"
          : "absolute min-h-[22rem] w-[19.5rem] rounded-[0.72rem] shadow-[0_22px_64px_rgba(48,48,48,0.10)]",
        floating && "w-[20rem] border-[#e7e3df] shadow-[0_30px_82px_rgba(48,48,48,0.12),0_0_0_1px_rgba(255,255,255,0.86)_inset]",
        className
      )}
    >
      <div
        className={cn(
          "flex border-b border-[#eeeae6]",
          compact ? "min-h-[4.8rem] gap-3 px-3.5 py-3" : "min-h-[6.35rem] gap-4 px-[1.125rem] py-4"
        )}
      >
        <OperationBadge label={iconText} compact={compact} />
        <div className="pt-1">
          <p className={cn("leading-5 text-[#555]", compact ? "text-[0.63rem]" : "text-[0.83rem]")}>{eyebrow}</p>
          <h3
            className={cn(
              "mt-1 font-display font-medium leading-[1.17] tracking-normal text-[#303030]",
              compact ? "text-[0.92rem]" : "text-[1.22rem]"
            )}
          >
            {title}
          </h3>
        </div>
      </div>
      <div className={cn(compact ? "px-3.5 py-3" : "px-[1.125rem] py-4")}>
        <p className={cn("font-semibold", compact ? "text-[0.72rem]" : "text-sm", status === "Ongoing" ? "text-[#178b61]" : "text-[#5967d9]")}>
          {status}
        </p>
        <p className={cn("mt-2 text-[#5c5b58]", compact ? "min-h-[2.95rem] text-[0.68rem] leading-4" : "min-h-[3.9rem] text-sm leading-6")}>
          {description}
        </p>
        <div className={cn("divide-y divide-[#efebe7]", compact ? "mt-2" : "mt-4")}>
          <div className={cn("flex items-center justify-between gap-4", compact ? "py-2 text-[0.66rem]" : "py-2.5 text-sm")}>
            <span className="flex items-center gap-3 text-[#9c9994]">
              <UserRound className={cn("text-[#303030]", compact ? "h-3.5 w-3.5" : "h-[1.125rem] w-[1.125rem]")} />
              Assigned to
            </span>
            <span className="font-medium text-[#303030]">{assignee}</span>
          </div>
          <div className={cn("flex items-center justify-between gap-4", compact ? "py-2 text-[0.66rem]" : "py-2.5 text-sm")}>
            <span className="flex items-center gap-3 text-[#9c9994]">
              <Hourglass className={cn("text-[#303030]", compact ? "h-3.5 w-3.5" : "h-[1.125rem] w-[1.125rem]")} />
              Open work
            </span>
            <span className="font-medium text-[#303030]">{progress}</span>
          </div>
          <div className={cn("flex items-center justify-between gap-4 opacity-60", compact ? "py-2 text-[0.66rem]" : "py-2.5 text-sm")}>
            <span className="flex items-center gap-3 text-[#9c9994]">
              <CalendarDays className={cn("text-[#303030]", compact ? "h-3.5 w-3.5" : "h-[1.125rem] w-[1.125rem]")} />
              Due on
            </span>
            <span className="font-medium text-[#303030]">{due}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
