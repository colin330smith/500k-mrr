import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
      },
      capture_pageview: false, // We capture manually for Next.js
      persistence: "localStorage",
    });
  }
  return posthog;
}

// Analytics events for MANUS products
export const analytics = {
  // Core product events
  signupCompleted: (properties?: Record<string, unknown>) => {
    posthog.capture("signup_completed", properties);
  },

  coreActionStarted: (actionName: string, properties?: Record<string, unknown>) => {
    posthog.capture("core_action_started", { action: actionName, ...properties });
  },

  coreActionCompleted: (actionName: string, properties?: Record<string, unknown>) => {
    posthog.capture("core_action_completed", { action: actionName, ...properties });
  },

  // Subscription events
  subscriptionStarted: (plan: string, properties?: Record<string, unknown>) => {
    posthog.capture("subscription_started", { plan, ...properties });
  },

  subscriptionCancelled: (plan: string, reason?: string) => {
    posthog.capture("subscription_cancelled", { plan, reason });
  },

  trialStarted: (plan: string) => {
    posthog.capture("trial_started", { plan });
  },

  trialEnded: (plan: string, converted: boolean) => {
    posthog.capture("trial_ended", { plan, converted });
  },

  // Engagement events
  featureUsed: (feature: string, properties?: Record<string, unknown>) => {
    posthog.capture("feature_used", { feature, ...properties });
  },

  pageViewed: (pageName: string) => {
    posthog.capture("$pageview", { page: pageName });
  },

  // User identification
  identify: (userId: string, properties?: Record<string, unknown>) => {
    posthog.identify(userId, properties);
  },

  reset: () => {
    posthog.reset();
  },
};

export { posthog };
