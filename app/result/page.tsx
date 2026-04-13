import Link from 'next/link';
import { EmptyState } from '@/components/states/empty-state';
import { prisma } from '@/server/db';

export default async function ResultPage({ searchParams }: { searchParams: { generationId?: string } }) {
  const generationId = searchParams.generationId;

  if (!generationId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="Ainda não encontramos seu diagnóstico" description="Volte para a etapa anterior e gere seu diagnóstico profissional." />
      </main>
    );
  }

  const generation = await prisma.generation.findUnique({ where: { id: generationId }, include: { report: true } });

  if (!generation) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="Diagnóstico não localizado" description="Confira se o link está correto ou gere um novo diagnóstico." />
      </main>
    );
  }

  if (generation.status === 'FAILED') {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="Não conseguimos concluir sua análise" description="Isso pode acontecer por instabilidade momentânea. Tente gerar novamente em instantes." />
      </main>
    );
  }

  const report = generation.report;

  if (!report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="Seu diagnóstico ainda está sendo finalizado" description="Atualize esta página em alguns segundos para ver seu resultado completo." />
      </main>
    );
  }

  const posts = report.starterPosts as string[];
  const priorities = report.improvementPriorities as string[];
  const experiences = report.experienceRewrites as string[];

  return (
    <main className="mx-auto max-w-4xl space-y-5 px-4 py-10">
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Resultado pronto</p>
        <h1 className="mt-2 text-2xl font-bold">Seu novo posicionamento está aqui</h1>
        <p className="mt-2 text-sm text-muted-foreground">Comece pelo título e pela seção Sobre para gerar impacto rápido no seu perfil.</p>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Leitura estratégica do seu perfil</h2>
        <p className="mt-2 text-sm text-muted-foreground">{report.diagnosisSummary}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Aplique primeiro</p>
          <h2 className="mt-1 font-semibold">Headline otimizada</h2>
          <p className="mt-2 text-sm">{report.headline}</p>
        </article>
        <article className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Direção estratégica</p>
          <h2 className="mt-1 font-semibold">Ângulo de posicionamento</h2>
          <p className="mt-2 text-sm">{report.positioningAngle}</p>
        </article>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Seção Sobre (versão recomendada)</h2>
        <p className="mt-2 text-sm">{report.about}</p>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Experiências reescritas com foco em impacto</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
          {experiences.map((exp) => (
            <li key={exp}>{exp}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">5 ideias de posts para começar hoje</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
          {posts.map((post) => (
            <li key={post}>{post}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Prioridades de melhoria</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
          {priorities.map((priority) => (
            <li key={priority}>{priority}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Próximo passo recomendado</h2>
        <p className="mt-2 text-sm text-muted-foreground">Baixe seu relatório para aplicar com calma e acompanhar sua evolução.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/api/reports/${report.id}/pdf`} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Baixar meu relatório profissional
          </Link>
          <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold">Quero revisão premium com especialista</button>
        </div>
      </section>
    </main>
  );
}
