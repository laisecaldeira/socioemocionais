import Link from 'next/link';

const steps = [
  {
    title: '1) Você responde um formulário guiado',
    description: 'Leva de 4 a 6 minutos. Fazemos perguntas objetivas para entender seu momento profissional.'
  },
  {
    title: '2) A IA analisa seu posicionamento',
    description: 'Transformamos suas respostas em um diagnóstico estratégico, com foco em clareza e valor de mercado.'
  },
  {
    title: '3) Você recebe textos prontos para aplicar',
    description: 'Headline, Sobre, experiências e ideias de post para atualizar seu LinkedIn hoje mesmo.'
  }
];

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <section className="rounded-2xl border border-border bg-card p-8 md:p-14">
        <p className="text-sm font-semibold text-primary">LinkedIn Positioning AI</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          Seu LinkedIn mais estratégico, claro e competitivo.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Receba um diagnóstico profissional com sugestões prontas para aplicar e aumentar sua visibilidade com confiança.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Próximo passo: criar sua conta e iniciar em menos de 2 minutos.
        </p>

        <div className="mt-8">
          <Link href="/auth/signup" className="inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Quero meu diagnóstico profissional
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <article key={step.title} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-primary">{step.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Exemplo de transformação</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          <strong>Antes:</strong> “Profissional dedicado em busca de oportunidades.”<br />
          <strong>Depois:</strong> “Especialista em operações com foco em eficiência e crescimento sustentável, ajudando empresas a reduzir custos e escalar processos.”
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold">Transparência e confiança</h3>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-muted-foreground">
          <li>Seus dados são usados apenas para gerar seu diagnóstico.</li>
          <li>Você recebe recomendações práticas, não promessas irreais.</li>
          <li>O resultado final depende da aplicação das sugestões no seu perfil.</li>
        </ul>
      </section>
    </main>
  );
}
