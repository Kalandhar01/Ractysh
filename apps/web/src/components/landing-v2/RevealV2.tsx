"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

interface RevealV2Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}

export function RevealV2({ children, className, delay = 0, amount = 0.22 }: RevealV2Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.82, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
