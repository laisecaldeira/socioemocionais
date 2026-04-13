import Link from 'next/link';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  return (
    <PageShell title="Vamos construir seu diagnóstico profissional" description="Você vai responder um formulário guiado, simples e objetivo.">
      <ul className="mb-6 list-disc space-y-2 pl-6 text-sm text-muted-foreground">
        <li>Tempo médio: 4 a 6 minutos.</li>
        <li>Perguntas diretas, sem respostas “certas” ou “erradas”.</li>
        <li>No final, você recebe recomendações prontas para aplicar.</li>
      </ul>

      <div className="rounded-lg bg-muted p-4 text-xs text-muted-foreground">
        Como usamos seus dados: apenas para gerar seu diagnóstico e recomendações personalizadas.
      </div>

      <Link href="/intake" className="mt-6 inline-block">
        <Button>Começar formulário guiado</Button>
      </Link>
    </PageShell>
  );
}
