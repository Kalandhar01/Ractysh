"use client";

import posthog from "posthog-js";

let initialized = false;

export function initPostHog(): void {
  if (initialized || typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (!key) return;

  posthog.init(key, {
    api_host: host,
    capture_pageview: false,
    persistence: "localStorage+cookie"
  });
  initialized = true;
}

export function captureAdminEvent(event: string, properties?: Record<string, unknown>): void {
  if (!initialized) initPostHog();
  if (!initialized) return;
  posthog.capture(event, properties);
}
