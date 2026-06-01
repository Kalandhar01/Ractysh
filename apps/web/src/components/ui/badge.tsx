import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-[0.68rem] font-semibold uppercase leading-none tracking-[0.14em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-black/10 bg-black text-white",
        secondary: "border-black/10 bg-black/[0.04] text-black/60",
        gold: "border-[#d6b45f]/40 bg-[#d6b45f]/12 text-[#8b6f25]",
        outline: "border-black/12 bg-transparent text-black/58"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
