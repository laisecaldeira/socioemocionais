import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';
import { runGeneration } from '@/services/generation-service';

const schema = z.object({ intakeSubmissionId: z.string() });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sua sessão expirou. Faça login novamente para continuar.' }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Não conseguimos iniciar o diagnóstico com esses dados.' }, { status: 400 });
  }

  const prompt = await prisma.promptVersion.findFirst({ where: { active: true } });
  if (!prompt) {
    return NextResponse.json({ error: 'Configuração de diagnóstico indisponível no momento.' }, { status: 500 });
  }

  const generation = await prisma.generation.create({
    data: {
      userId: session.user.id,
      intakeSubmissionId: parsed.data.intakeSubmissionId,
      promptVersionId: prompt.id,
      model: process.env.AI_MODE === 'live' ? 'gpt-4.1-mini' : 'mock-v1',
      status: 'QUEUED'
    }
  });

  runGeneration(generation.id).catch(() => undefined);

  return NextResponse.json({ id: generation.id });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Identificador da geração não informado.' }, { status: 400 });

  const generation = await prisma.generation.findUnique({
    where: { id },
    include: { report: true }
  });

  return NextResponse.json(generation);
}
