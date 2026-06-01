"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How quickly can we start?",
    answer:
      "Most demo requests can be reviewed within one business day after the intake is submitted. Priority enterprise requests can move directly into a strategy session once the scope is clear."
  },
  {
    question: "Do you handle enterprise-scale projects?",
    answer:
      "Yes. Ractysh is structured for multi-stakeholder enterprise requirements across architecture, construction, real estate, export-import operations, OTC exchange coordination and turnkey execution."
  },
  {
    question: "Can consultations include export-import or OTC exchange workflows?",
    answer:
      "Yes. The consultation can include export-import planning, logistics coordination, private counterparty intake, documentation readiness and enterprise supply workflows."
  },
  {
    question: "Do you provide site visits?",
    answer:
      "Yes. Site visits can be arranged when the project requires physical inspection, construction review, interior scope validation or infrastructure feasibility assessment."
  },
  {
    question: "Can Ractysh manage turnkey execution?",
    answer:
      "Yes. When the scope fits the Ractysh ecosystem, the demo can progress into a full execution roadmap with partners, milestones, delivery governance and handover planning."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative px-5 py-[4.5rem] md:px-8 md:py-24" id="consultation-faq">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ded6c6] to-transparent" />
      <div className="mx-auto grid max-w-[86rem] gap-9 lg:grid-cols-[0.45fr_0.55fr] lg:gap-12">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9a7428]">FAQ</p>
          <h2 className="mt-3 [font-family:var(--font-cormorant)] text-[2.45rem] font-semibold leading-[0.98] tracking-[0] text-[#17243a] md:text-[3.15rem] lg:text-[3.65rem]">
            Clear answers before the first private session.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-[#68645b]/80 md:text-[16px]">
            The intake is designed to reduce ambiguity before a senior Ractysh team member reviews your requirement.
          </p>
        </motion.div>

        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[1.75rem] border border-[#e4ddcf] bg-white/62 shadow-[0_20px_72px_rgba(23,36,58,0.07)] backdrop-blur-xl"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className="border-b border-[#e8e0d2] last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left text-[15px] font-medium text-[#17243a] transition hover:bg-[#fff8e7]/62 md:px-7"
                >
                  <span>{faq.question}</span>
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8d0c1] bg-white text-[#9a7428] transition duration-300",
                      isOpen && "rotate-180 border-[#c6a45b]/65 bg-[#fff7dc]"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-[14px] leading-[1.7] text-[#6b665d]/80 md:px-7">{faq.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
