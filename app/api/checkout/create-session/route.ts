import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      provider: 'mock_stripe',
      amountCents: 4700,
      status: 'PAID',
      paidAt: new Date(),
      metadata: { flow: 'mock' }
    }
  });

  return NextResponse.json({ url: '/checkout/success' });
}
