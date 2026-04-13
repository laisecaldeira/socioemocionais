import Link from 'next/link';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  return (
    <PageShell title="Pagamento confirmado com sucesso" description="Perfeito. Seu próximo passo é responder o formulário guiado para gerar seu diagnóstico.">
      <Link href="/onboarding">
        <Button>Iniciar meu diagnóstico agora</Button>
      </Link>
    </PageShell>
  );
}
