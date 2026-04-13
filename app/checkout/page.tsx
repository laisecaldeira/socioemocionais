'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/layout/page-shell';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch('/api/checkout/create-session', { method: 'POST' });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      return;
    }

    router.push(data.url);
  };

  return (
    <PageShell title="Ative seu acesso" description="Pagamento seguro. Após confirmar, você inicia seu diagnóstico imediatamente.">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Plano Inicial — Diagnóstico + Reescrita Completa</h2>
        <p className="mt-2 text-sm text-muted-foreground">Inclui análise estratégica, headline, Sobre, experiências e 5 ideias de posts.</p>

        <p className="mt-4 text-2xl font-bold">R$ 47,00</p>

        <ul className="mt-4 list-disc space-y-1 pl-6 text-xs text-muted-foreground">
          <li>Tempo médio de geração: 1 a 2 minutos.</li>
          <li>Você recebe conteúdo pronto para aplicar hoje.</li>
          <li>Sem promessa de vaga garantida — foco em posicionamento de alta qualidade.</li>
        </ul>

        <Button className="mt-6 w-full" onClick={handleCheckout} disabled={loading}>
          {loading ? 'Preparando seu acesso...' : 'Confirmar pagamento e começar agora'}
        </Button>
      </section>
    </PageShell>
  );
}
