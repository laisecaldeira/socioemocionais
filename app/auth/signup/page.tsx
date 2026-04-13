'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageShell } from '@/components/layout/page-shell';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      setLoading(false);
      setError('Não foi possível criar sua conta agora. Tente novamente em instantes.');
      return;
    }

    await signIn('credentials', { email, password, redirect: false });
    router.push('/checkout');
  };

  return (
    <PageShell title="Crie sua conta" description="Leva menos de 1 minuto. Em seguida, você já inicia seu diagnóstico.">
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Seu nome</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Seu melhor e-mail</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Crie uma senha</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <p className="mt-1 text-xs text-muted-foreground">Use pelo menos 6 caracteres.</p>
        </div>

        {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Criando sua conta...' : 'Criar conta e ir para o pagamento'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">Próximo passo: confirmar pagamento e começar o formulário guiado.</p>
      </form>
    </PageShell>
  );
}
