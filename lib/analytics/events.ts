export function track(event: string, payload?: Record<string, unknown>) {
  // Foundation for analytics integration (PostHog, Segment, etc.)
  console.log(`[ANALYTICS] ${event}`, payload ?? {});
}
