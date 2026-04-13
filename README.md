# LinkedIn Positioning AI (MVP)

Production-minded MVP scaffold for a Brazilian SaaS that transforms LinkedIn profiles with AI.

## Tech stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- NextAuth (credentials)
- Prisma + PostgreSQL
- AI service layer (OpenAI-ready + mock mode)

## Core flows implemented
- Landing page with value proposition and CTA
- Authentication (signup + signin)
- Checkout initiation flow (mock provider)
- Guided multi-step intake flow
- AI generation trigger + status lifecycle
- Results dashboard with actionable output
- Report export endpoint
- Basic admin metrics page

## Project structure
```txt
app/
  api/
  auth/
  checkout/
  onboarding/
  intake/
  loading/
  result/
  admin/
components/
features/
lib/
services/
server/
prisma/
prompts/
docs/
```

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure env:
   ```bash
   cp .env.example .env
   ```
3. Run database migration and seed:
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```
4. Start app:
   ```bash
   npm run dev
   ```

## Important env vars
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `AI_MODE` (`mock` or `live`)
- `OPENAI_API_KEY` (required when `AI_MODE=live`)

## Manual integration TODOs
- Configure real Stripe checkout + webhook signature verification
- Configure real PDF generator implementation
- Add analytics provider (PostHog/Segment)
- Add error monitoring provider (Sentry)

## Useful scripts
- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run prisma:migrate`
- `npm run prisma:seed`
