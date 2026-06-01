"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { EnterpriseBriefingSubscribe, subscribedStorageKey, type SubscribeInteractionStatus } from "@/components/EnterpriseBriefingSubscribe";
import type { SubscriptionPopupContent } from "@/lib/types";

interface SubscriptionPopupProps {
  popup?: SubscriptionPopupContent;
}

const popupDelayMs = 15_000;
const autoCloseDelayMs = 24_000;
const sessionStorageKey = "ractysh-subscription-popup-shown-session";
const emailStorageKey = "ractysh-subscription-email";
const popupTitle = "Subscribe for premium ecosystem updates.";
const popupDescription =
  "Receive updates on architecture, construction, real estate, export-import, OTC exchange and enterprise systems.";
const popupEase = [0.16, 1, 0.3, 1] as const;

const popupSparkles = [
  { left: "18%", top: "38%", delay: 0.12, x: -14, y: -18 },
  { left: "34%", top: "72%", delay: 0.24, x: -4, y: -24 },
  { left: "58%", top: "28%", delay: 0.18, x: 10, y: -20 },
  { left: "78%", top: "62%", delay: 0.3, x: 16, y: -26 }
];

function hasStoredSubscription() {
  try {
    return window.localStorage.getItem(subscribedStorageKey) === "true";
  } catch {
    return false;
  }
}

function hasSeenPopupThisSession() {
  try {
    return window.sessionStorage.getItem(sessionStorageKey) === "true";
  } catch {
    return false;
  }
}

function rememberPopupSeen() {
  try {
    window.sessionStorage.setItem(sessionStorageKey, "true");
  } catch {
    // Session persistence is optional for the visual interaction.
  }
}

function PopupSubscriptionSuccess() {
  return (
    <motion.div
      key="popup-subscription-success"
      initial={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 12, scale: 0.985, filter: "blur(8px)" }}
      transition={{ duration: 0.72, ease: popupEase }}
      className="relative flex min-h-[15rem] flex-col items-center justify-center overflow-hidden rounded-[16px] border border-[#d6b45f]/24 bg-[#fffaf0]/72 px-5 py-7 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]"
      role="status"
      aria-live="polite"
    >
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.18, 0.48, 0.18], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(214,180,95,0.28),transparent_9rem)]"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: [0, 0.44, 0], scaleX: [0.2, 1, 1.16] }}
        transition={{ duration: 1.55, repeat: Infinity, repeatDelay: 1.4, ease: "easeOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[78%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d6b45f]/70 to-transparent"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{ opacity: [0.22, 0, 0.22], scale: [0.82, 1.42, 0.82] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        className="pointer-events-none absolute h-28 w-28 rounded-full border border-[#d6b45f]/28"
      />
      {popupSparkles.map((particle) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          aria-hidden="true"
          initial={{ opacity: 0, x: 0, y: 8, scale: 0.72 }}
          animate={{ opacity: [0, 0.74, 0], x: particle.x, y: particle.y, scale: [0.72, 1, 0.78] }}
          transition={{ duration: 2, delay: particle.delay, repeat: Infinity, repeatDelay: 1.75, ease: "easeOut" }}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-[#d6b45f] shadow-[0_0_14px_rgba(214,180,95,0.72)]"
          style={{ left: particle.left, top: particle.top }}
        />
      ))}
      <motion.span
        initial={{ opacity: 0, scale: 0.78, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.62, ease: popupEase }}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#d6b45f]/45 bg-[#d6b45f] text-[#1c150e] shadow-[0_0_0_8px_rgba(214,180,95,0.12),0_0_42px_rgba(214,180,95,0.34)]"
      >
        <Check className="h-5 w-5" strokeWidth={2.7} />
      </motion.span>
      <p className="relative mt-5 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#9d7625]">
        Ecosystem Synced
      </p>
      <h2 className="relative mt-3 font-display text-[1.42rem] font-semibold leading-tight tracking-normal text-[#1f1710]">
        Subscription synchronized.
      </h2>
    </motion.div>
  );
}

export function SubscriptionPopup({ popup }: SubscriptionPopupProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeInteractionStatus>("idle");

  const close = useCallback(() => {
    rememberPopupSeen();
    setVisible(false);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setVisible(false);
      return;
    }

    if (popup && !popup.enabled) {
      setVisible(false);
      return;
    }
    if (hasStoredSubscription()) {
      setVisible(false);
      return;
    }
    if (hasSeenPopupThisSession()) return;

    const timer = window.setTimeout(() => {
      if (hasStoredSubscription()) return;
      rememberPopupSeen();
      setVisible(true);
    }, popupDelayMs);
    return () => window.clearTimeout(timer);
  }, [pathname, popup]);

  useEffect(() => {
    if (!visible || interacted) return;

    const timer = window.setTimeout(() => setVisible(false), autoCloseDelayMs);
    return () => window.clearTimeout(timer);
  }, [interacted, visible]);

  useEffect(() => {
    if (subscribeStatus !== "success") return;

    const timer = window.setTimeout(() => close(), 4600);
    return () => window.clearTimeout(timer);
  }, [close, subscribeStatus]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.97, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: popupEase }}
          className="fixed inset-x-4 bottom-4 z-[9999] w-auto sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-[7.75rem] sm:w-[360px] lg:right-6 lg:top-[8rem]"
          role="dialog"
          aria-live="polite"
          aria-label="Ractysh subscription"
          onMouseEnter={() => setInteracted(true)}
          onFocusCapture={() => setInteracted(true)}
        >
          <motion.div
            className={`relative overflow-hidden rounded-[18px] border bg-[rgba(255,251,241,0.9)] p-4 text-[#21180f] shadow-[0_28px_90px_rgba(0,0,0,0.24),0_0_54px_rgba(214,180,95,0.14)] backdrop-blur-xl transition duration-500 sm:p-5 ${
              subscribeStatus === "success" ? "border-[#d6b45f]/42 shadow-[0_32px_96px_rgba(0,0,0,0.24),0_0_84px_rgba(214,180,95,0.2)]" : "border-[#d6b45f]/22"
            }`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(214,180,95,0.24),transparent_13rem),linear-gradient(135deg,rgba(255,255,255,0.62),transparent_48%,rgba(214,180,95,0.09))]" />
            <AnimatePresence>
              {subscribeStatus === "success" ? (
                <motion.div
                  key="popup-success-glow"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.75, ease: popupEase }}
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(214,180,95,0.24),transparent_14rem),linear-gradient(135deg,rgba(214,180,95,0.12),transparent_58%)]"
                />
              ) : null}
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#d6b45f]/50 to-transparent" />

            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {subscribeStatus === "success" ? (
                  <PopupSubscriptionSuccess />
                ) : (
                  <motion.div
                    key="popup-subscription-form"
                    initial={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    transition={{ duration: 0.36, ease: popupEase }}
                  >
                    <button
                      type="button"
                      aria-label="Dismiss subscription popup"
                      onClick={close}
                      className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[#21180f]/[0.08] bg-white/45 text-[#21180f]/45 transition duration-300 hover:border-[#d6b45f]/45 hover:bg-white/75 hover:text-[#21180f]/82"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="flex items-start gap-3 pr-10">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-[#d6b45f]/28 bg-white/55 text-[#b58b30] shadow-[0_16px_34px_rgba(64,42,12,0.14)]">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#9d7625]">
                          Enterprise Briefing
                        </p>
                        <h2 className="mt-2 font-display text-[1.18rem] font-semibold leading-tight tracking-normal text-[#21180f]">
                          {popupTitle}
                        </h2>
                      </div>
                    </div>

                    <p className="mt-4 text-[0.86rem] leading-6 text-[#5f5344]">{popupDescription}</p>

                    <EnterpriseBriefingSubscribe
                      variant="popup"
                      storageKey={emailStorageKey}
                      onInteract={() => setInteracted(true)}
                      onStatusChange={setSubscribeStatus}
                    />
                    <motion.button
                      key="popup-close-action"
                      type="button"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.28, ease: popupEase }}
                      onClick={close}
                      className="mt-3 h-10 rounded-full px-3 text-[0.8rem] font-semibold text-[#5f5344]/72 transition duration-300 hover:text-[#21180f]"
                    >
                      Close
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
