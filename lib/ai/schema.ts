import { z } from 'zod';

export const aiOutputSchema = z.object({
  diagnosis_summary: z.string().min(20),
  positioning_angle: z.string().min(10),
  headline: z.string().min(10),
  about: z.string().min(40),
  experience_rewrites: z.array(z.string().min(10)).min(2),
  starter_posts: z.array(z.string().min(10)).length(5),
  improvement_priorities: z.array(z.string().min(6)).min(3)
});

export type AiOutput = z.infer<typeof aiOutputSchema>;
