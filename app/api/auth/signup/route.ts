import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const passwordHash = await hash(body.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash
      }
    });

    return NextResponse.json({ userId: user.id });
  } catch {
    return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
  }
}
