"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") posthog.debug();
        },
        capture_pageview: false,
        persistence: "localStorage",
      });
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Analytics helper functions
export const analytics = {
  signupCompleted: (properties?: Record<string, unknown>) => {
    posthog.capture("signup_completed", properties);
  },
  coreActionStarted: (actionName: string, properties?: Record<string, unknown>) => {
    posthog.capture("core_action_started", { action: actionName, ...properties });
  },
  coreActionCompleted: (actionName: string, properties?: Record<string, unknown>) => {
    posthog.capture("core_action_completed", { action: actionName, ...properties });
  },
  subscriptionStarted: (plan: string, properties?: Record<string, unknown>) => {
    posthog.capture("subscription_started", { plan, ...properties });
  },
  subscriptionCancelled: (plan: string, reason?: string) => {
    posthog.capture("subscription_cancelled", { plan, reason });
  },
  pageView: (pageName: string) => {
    posthog.capture("$pageview", { page: pageName });
  },
  identify: (userId: string, properties?: Record<string, unknown>) => {
    posthog.identify(userId, properties);
  },
  reset: () => {
    posthog.reset();
  },
};
