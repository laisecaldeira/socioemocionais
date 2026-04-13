import { prisma } from '../server/db';

async function main() {
  await prisma.promptVersion.upsert({
    where: { code: 'linkedin-positioning-default' },
    update: {},
    create: {
      code: 'linkedin-positioning-default',
      version: '1.0.0',
      template: 'See prompts/linkedin-positioning-v1.md',
      schema: {
        diagnosis_summary: 'string',
        positioning_angle: 'string',
        headline: 'string',
        about: 'string',
        experience_rewrites: ['string'],
        starter_posts: ['string'],
        improvement_priorities: ['string']
      }
    }
  });

  console.log('Seed complete');
}

main().finally(async () => prisma.$disconnect());
