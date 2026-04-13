import Link from 'next/link';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';

export default function CancelPage() {
  return (
    <PageShell title="Pagamento não concluído" description="Sem problemas. Quando quiser, você pode retomar exatamente deste ponto.">
      <Link href="/checkout">
        <Button>Tentar novamente e continuar</Button>
      </Link>
    </PageShell>
  );
}
