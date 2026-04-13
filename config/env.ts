import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(10),
  NEXTAUTH_URL: z.string().url(),
  AI_MODE: z.enum(['mock', 'live']).default('mock'),
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID: z.string().optional(),
  APP_BASE_URL: z.string().url().default('http://localhost:3000')
});

export const env = envSchema.parse(process.env);
