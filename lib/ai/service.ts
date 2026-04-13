import { env } from '@/config/env';
import { buildPrompt } from './prompt-builder';
import { aiOutputSchema, AiOutput } from './schema';
import { mockOutput } from './mock-output';
import { openai } from './client';

type IntakeLike = {
  goal: string;
  proudAchievements: string;
  targetRole: string;
  currentHeadline?: string | null;
  audience: string;
  niche: string;
  tone: string;
  avoidWords?: string | null;
};

export async function generateLinkedInReport(input: IntakeLike): Promise<AiOutput> {
  const normalized: IntakeLike = {
    ...input,
    goal: input.goal.trim(),
    proudAchievements: input.proudAchievements.trim()
  };

  if (env.AI_MODE === 'mock' || !openai) {
    return aiOutputSchema.parse(mockOutput);
  }

  const prompt = buildPrompt(normalized);
  const response = await openai.responses.create({
    model: 'gpt-4.1-mini',
    temperature: 0.3,
    input: `${prompt}\nRetorne JSON com os campos: diagnosis_summary, positioning_angle, headline, about, experience_rewrites, starter_posts, improvement_priorities.`
  });

  const text = response.output_text;
  const parsed = JSON.parse(text);
  return aiOutputSchema.parse(parsed);
}
