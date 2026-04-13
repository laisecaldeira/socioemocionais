'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageShell } from '@/components/layout/page-shell';

export default function SignInPage() {
  const router = useRouter();
  const callbackUrl = '/checkout';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', { email, password, redirect: false, callbackUrl });

    if (result?.error) {
      setLoading(false);
      setError('Não encontramos essa combinação de e-mail e senha. Confira e tente novamente.');
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <PageShell title="Entrar na sua conta" description="Acesse para continuar seu diagnóstico de posicionamento.">
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">E-mail profissional</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Senha</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Validando acesso...' : 'Entrar e seguir para o pagamento'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">Próximo passo: confirmar pagamento e iniciar o diagnóstico.</p>
      </form>
    </PageShell>
  );
}
