import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { reportToPlainText } from '@/lib/pdf/report-template';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const report = await prisma.report.findUnique({ where: { id: params.id } });
  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const content = reportToPlainText(report);

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=relatorio-${params.id}.pdf`
    }
  });
}
