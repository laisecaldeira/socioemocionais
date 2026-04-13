# LinkedIn Positioning AI — MVP Architecture Proposal (Refactored)

## 1) Executive summary

Build the MVP as a **modular monolith in TypeScript**:
- **One deployable web app** (Next.js) for marketing, dashboard, and API.
- **One worker process** for AI generation/PDF jobs.
- **Managed services** for DB, queue, storage, analytics, and monitoring.

This is the best speed-to-revenue architecture for phase 1:
- **Fast launch:** one codebase, one language, low coordination overhead.
- **Low cost:** managed infra, no Kubernetes, no microservices.
- **Scalable enough:** async queue, stateless app nodes, relational data model with versioning.

---

## 2) Product modules

| Module | MVP Scope | Notes |
|---|---|---|
| Marketing Site | Landing, pricing, FAQ, CTA | SEO-focused PT-BR pages |
| Authentication | Email login/signup, session, role | `user` and `admin` |
| Onboarding/Intake | Multi-step structured form | Autosave draft |
| Payment | Checkout + webhook confirmation | BR-focused methods |
| AI Generation Engine | Queue-based generation pipeline | Retry-safe + validated outputs |
| Results Dashboard | Show generation status + final content | Copy actions, clear hierarchy |
| PDF Export | Generate polished downloadable report | Async generation recommended |
| Admin Panel | Users, jobs, failures, payments | Manual retry + notes |
| Analytics | Funnel + activation + revenue events | Product + business tracking |
| Notifications | Email confirmations and status updates | WhatsApp later |
| Background Jobs | AI, PDF, webhook reconciliation | Backoff + dead-letter logic |

---

## 3) Suggested tech stack

### Core stack (recommended)
- **Frontend/App shell:** Next.js + TypeScript + Tailwind + shadcn/ui
- **Backend pattern:** Next.js API routes + domain service modules
- **Database:** Managed PostgreSQL (Neon/Supabase)
- **ORM:** Prisma
- **Auth:** Clerk (speed-first) or Auth.js (control-first)
- **Payments (Brazil):** Mercado Pago
- **Queue:** Redis + BullMQ
- **Storage:** Cloudflare R2 (or S3)
- **PDF:** React-pdf (deterministic) or Playwright (visual fidelity)
- **Analytics:** PostHog
- **Monitoring:** Sentry + structured JSON logs
- **Hosting:** Vercel (app/api) + Railway/Render (worker)

### Why this stack for MVP
- Minimizes custom infrastructure work.
- Handles Brazil payment reality (PIX/boleto/cards).
- Keeps AI and report generation out of request/response path.
- Enables gradual scaling without re-architecture.

---

## 4) System architecture

### Layered architecture

1. **Client layer**
   - Marketing pages and authenticated dashboard.
   - Uses optimistic UI and status polling for async jobs.

2. **API layer**
   - Public routes (health/webhooks) + authenticated routes.
   - Zod validation + standardized error contract.

3. **Domain/services layer**
   - `AuthService`, `IntakeService`, `PaymentService`, `GenerationService`, `ReportService`, `AdminService`.
   - Business rules live here, not in controllers.

4. **AI orchestration layer**
   - Input normalization → prompt assembly → model call → schema validation → persistence.

5. **Persistence layer**
   - Postgres schema + JSONB for generated payload details.
   - Idempotency keys for critical write endpoints.

6. **Integrations layer**
   - Mercado Pago, LLM provider, email provider, object storage.

7. **Async processing layer**
   - BullMQ queues for generation/PDF/reconciliation.
   - Retries with backoff and max-attempt policy.

8. **Observability layer**
   - Error tracking, traces, job metrics, business KPIs.

---

## 5) Data model proposal

## Core entities

### users
- `id`, `email`, `name`, `locale`, `role`, `auth_provider_id`, timestamps

### profiles
- `id`, `user_id`, `linkedin_url`, `target_role`, `industry`, `seniority`, `raw_profile_text`

### intake_submissions
- `id`, `user_id`, `profile_id`, `form_version`, `answers_json`, `status`, `submitted_at`

### ai_generations
- `id`, `user_id`, `intake_submission_id`, `status`, `prompt_version_id`, `model_name`, `retry_count`, `idempotency_key`, timestamps, error fields

### reports
- `id`, `generation_id`, `diagnosis_text`, `optimized_headline`, `about_section`, `experience_rewrites_json`, `positioning_angle`, `post_suggestions_json`, `quality_score`, `pdf_file_key`, `version`

### payments
- `id`, `user_id`, `provider`, `provider_payment_id`, `status`, `amount_cents`, `currency`, `product_type`, `metadata_json`, `paid_at`

### plans
- `id`, `code`, `name`, `billing_type`, `price_cents`, `features_json`, `active`

### prompt_versions
- `id`, `name`, `version`, `template_text`, `schema_json`, `is_active`, `created_by`, `created_at`

### generation_logs
- `id`, `generation_id`, `step`, `status`, `message`, `latency_ms`, `tokens_in`, `tokens_out`, `created_at`

### admin_notes
- `id`, `user_id`, `admin_user_id`, `note`, `category`, `created_at`

## Key relationships
- User 1:N profiles, intake_submissions, ai_generations, payments, admin_notes
- intake_submissions 1:N ai_generations
- ai_generations 1:N reports (versioned)
- prompt_versions 1:N ai_generations

---

## 6) AI architecture

## Generation pipeline (MVP)
1. **Normalize input**
   - Clean text, enforce minimum completeness.
2. **Assemble prompt**
   - Fixed system rules + user context + output contract.
3. **Request structured output**
   - Require strict JSON schema (no free-form blobs).
4. **Validate and repair**
   - Zod parse; on minor failures run one repair pass.
5. **Quality checks**
   - Completeness, clarity, tone consistency, PT-BR language confidence.
6. **Persist and publish**
   - Save raw + normalized output and update generation status.

## Retry/fallback policy
- Retry transient failures (timeouts/rate-limits) with exponential backoff.
- Max 3 attempts.
- If full generation fails, attempt section-level fallback.
- If still failing, mark `partial` and notify user with ETA/support message.

## Prompt versioning strategy
- Store prompt + schema + model version per generation.
- Treat prompt updates as versioned releases.
- Enable A/B tests later via active prompt routing.

## Determinism for commercial quality
- Lower temperature (0.2–0.4).
- Strict schema output mode.
- Stable prompt templates with explicit constraints.
- Rule-based post-validation and regeneration rules.

---

## 7) API design

## Public
- `GET /api/health`
- `POST /api/webhooks/mercadopago`

## Authenticated user
- `GET /api/me`
- `POST /api/intake`
- `GET /api/intake/:id`
- `POST /api/generations`
- `GET /api/generations/:id`
- `GET /api/generations/:id/report`
- `POST /api/generations/:id/pdf`
- `GET /api/reports/:id/download`
- `POST /api/checkout/session`
- `GET /api/payments`

## Admin
- `GET /api/admin/users`
- `GET /api/admin/generations`
- `POST /api/admin/generations/:id/retry`
- `GET /api/admin/payments`
- `POST /api/admin/users/:id/notes`
- `GET /api/admin/metrics/overview`

## API standards
- Idempotency header on create/charge endpoints.
- Cursor pagination for lists.
- Unified error shape: `code`, `message`, `details`, `request_id`.

---

## 8) Security and privacy

## Security baseline
- Auth/session hardening + RBAC checks server-side.
- Secrets only in provider secret manager.
- Rate limits for auth, generation, and webhook endpoints.
- TLS in transit; managed encryption at rest.
- Audit log for admin and payment lifecycle actions.

## LGPD-conscious practices
- Explicit consent and clear privacy policy in Portuguese.
- Data minimization in forms and logs.
- User self-service data export/delete workflow.
- Retention policy for raw AI payloads.

---

## 9) Deployment architecture

## Environments
- `dev`, `staging`, `production` with isolated keys and DBs.

## CI/CD
- PR checks: lint, typecheck, tests, build, Prisma checks.
- Auto deploy staging; gated deploy production.

## Infra shape
- Vercel for app/API.
- Railway/Render worker for queue consumers.
- Managed Postgres + Redis + object storage.

## Migrations/backups
- Prisma migration files in repo.
- Backward-compatible migrations.
- Daily DB backups + periodic restore drill.

---

## 10) Scalability roadmap

## Scales well immediately
- Stateless app layer.
- Async heavy operations via worker queue.
- Postgres with indexed relational model.

## Keep simple in MVP
- Single queue and worker type.
- One LLM provider.
- Basic admin observability.

## Refactor later
- Split worker responsibilities by job type.
- Add caching/read replicas for analytics-heavy dashboards.
- Add advanced quality evaluator for generated content.

## Likely early bottlenecks
- LLM latency/rate limits.
- Queue concurrency tuning.
- Payment webhook spikes.
- PDF generation throughput.

---

## 11) Recommended folder structure

```txt
linkedin-positioning-ai/
  apps/
    web/
      src/
        app/
          (marketing)/
          (auth)/
          (dashboard)/
          admin/
          api/
        modules/
          auth/
          intake/
          payment/
          generation/
          report/
          admin/
        lib/
          db/
          queue/
          ai/
          analytics/
          storage/
          logger/
      prisma/
      tests/
  workers/
    generation-worker/
      src/
        jobs/
        processors/
  packages/
    ui/
    schemas/
    prompts/
    types/
  docs/
    architecture/
```

---

## 12) Build recommendation

## Best MVP architecture
Adopt a **modular monolith + worker + managed services**.

## Best stack
Next.js + TypeScript + Prisma + Postgres + Redis/BullMQ + Mercado Pago + Clerk + Sentry + PostHog + R2.

## Avoid in phase 1
- Microservices
- Kubernetes
- Multi-provider AI orchestration complexity
- Complex event choreography before PMF validation

---

## A) ASCII architecture diagram

```txt
[Browser]
   |
   v
[Next.js App (UI + API)] -----> [Mercado Pago]
   |   \                         [Email]
   |    \-----> [PostHog/Sentry]
   v
[PostgreSQL] <----> [Worker (BullMQ)] <----> [LLM API]
   ^                     |
   |                     v
   +-------------- [Object Storage (PDF)]

[Redis Queue] <-----------/
```

---

## B) Prioritized implementation order

1. Base project setup (auth + DB + layout shell)
2. Intake form flow with autosave
3. Checkout + payment webhook flow
4. AI queue pipeline + validation
5. Results dashboard rendering
6. PDF export flow
7. Admin operations panel
8. Observability and analytics hardening
9. Security/LGPD polish

---

## C) Founder decisions before coding

1. Entry price and refund policy
2. Single provider vs dual payment setup
3. Auth UX (passwordless vs password + magic link)
4. SLA promise for report generation
5. Upsell offer definition (scope and turnaround)
6. Data retention windows
7. Free preview strategy vs paywall-first
8. KPI focus for first 60 days
