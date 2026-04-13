import { prisma } from '@/server/db';

export default async function AdminPage() {
  const [users, submissions, generations, failedGenerations, payments] = await Promise.all([
    prisma.user.count(),
    prisma.intakeSubmission.count(),
    prisma.generation.count(),
    prisma.generation.count({ where: { status: 'FAILED' } }),
    prisma.payment.count()
  ]);

  const cards = [
    { title: 'Usuários', value: users },
    { title: 'Submissões', value: submissions },
    { title: 'Gerações', value: generations },
    { title: 'Falhas', value: failedGenerations },
    { title: 'Pagamentos', value: payments }
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Admin MVP</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {cards.map((card) => (
          <article key={card.title} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{card.title}</p>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
