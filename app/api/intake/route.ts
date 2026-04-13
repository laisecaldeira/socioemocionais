import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';

const schema = z.object({
  goal: z.string().min(3, 'Descreva seu objetivo principal em uma frase.'),
  targetRole: z.string().min(2, 'Informe o cargo que você quer atrair.'),
  currentHeadline: z.string().optional(),
  linkedinUrl: z.string().optional(),
  proudAchievements: z.string().min(10, 'Conte pelo menos um resultado concreto da sua trajetória.'),
  audience: z.string().min(2, 'Informe quem você quer atrair no LinkedIn.'),
  niche: z.string().min(2, 'Informe seu nicho/setor.'),
  tone: z.string().min(2, 'Informe o tom desejado para sua comunicação.'),
  avoidWords: z.string().optional()
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sua sessão expirou. Entre novamente para continuar.' }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }, { status: 400 });
  }

  const submission = await prisma.intakeSubmission.create({
    data: {
      userId: session.user.id,
      ...parsed.data
    }
  });

  return NextResponse.json({ id: submission.id });
}
