import { prisma } from '@/server/db';
import { generateLinkedInReport } from '@/lib/ai/service';

export async function runGeneration(generationId: string) {
  const generation = await prisma.generation.findUniqueOrThrow({
    where: { id: generationId },
    include: { intakeSubmission: true }
  });

  if (!generation.intakeSubmission) {
    throw new Error('Intake submission not found for generation');
  }

  await prisma.generation.update({ where: { id: generationId }, data: { status: 'PROCESSING' } });

  try {
    const output = await generateLinkedInReport(generation.intakeSubmission);

    await prisma.$transaction([
      prisma.generation.update({
        where: { id: generationId },
        data: { status: 'COMPLETED', rawOutput: output }
      }),
      prisma.report.create({
        data: {
          userId: generation.userId,
          generationId,
          diagnosisSummary: output.diagnosis_summary,
          positioningAngle: output.positioning_angle,
          headline: output.headline,
          about: output.about,
          experienceRewrites: output.experience_rewrites,
          starterPosts: output.starter_posts,
          improvementPriorities: output.improvement_priorities
        }
      })
    ]);
  } catch (error) {
    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown generation error',
        retryCount: { increment: 1 }
      }
    });
    throw error;
  }
}
