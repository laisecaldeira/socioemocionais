# MVP Architecture Note

This MVP uses a modular monolith with asynchronous-like generation behavior.

- Next.js App Router hosts marketing, auth, checkout, intake, loading, results, and admin pages.
- API routes handle intake submission, generation triggering, auth signup, and payment session initiation.
- Prisma + PostgreSQL store users, submissions, generations, reports, and payments.
- AI service layer is isolated in `lib/ai/*` with prompt builder, schema validation, and mock/live mode.
- Generation processing currently runs in-process (`runGeneration`) for MVP simplicity.

## Upgrade path
- Move `runGeneration` to a queue worker when volume increases.
- Replace mock checkout with Stripe Checkout Session + webhook verification.
- Replace text-based PDF fallback with a true PDF renderer (e.g., React-PDF or Playwright).
