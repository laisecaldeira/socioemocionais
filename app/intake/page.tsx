'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { intakeSteps } from '@/features/intake/questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function IntakePage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({ tone: 'Estratégico e objetivo' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const step = intakeSteps[stepIndex];
  const isLast = stepIndex === intakeSteps.length - 1;

  const progress = useMemo(() => Math.round(((stepIndex + 1) / intakeSteps.length) * 100), [stepIndex]);

  const stepHasRequiredMissing = step.fields.some((field) => field.required && !(form[field.name] ?? '').trim());

  const onBack = () => {
    if (stepIndex > 0) setStepIndex((v) => v - 1);
  };

  const onNext = async () => {
    setError('');

    if (stepHasRequiredMissing) {
      setError('Preencha os campos obrigatórios para avançar.');
      return;
    }

    if (!isLast) {
      setStepIndex((v) => v + 1);
      return;
    }

    setSubmitting(true);

    const intakeRes = await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (!intakeRes.ok) {
      setSubmitting(false);
      setError('Não conseguimos salvar suas respostas agora. Tente novamente em instantes.');
      return;
    }

    const intakeData = await intakeRes.json();

    const generationRes = await fetch('/api/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intakeSubmissionId: intakeData.id })
    });

    if (!generationRes.ok) {
      setSubmitting(false);
      setError('Seu diagnóstico não pôde ser iniciado agora. Tente novamente em instantes.');
      return;
    }

    const generationData = await generationRes.json();
    router.push(`/loading?generationId=${generationData.id}`);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-sm font-medium text-primary">Etapa {stepIndex + 1} de {intakeSteps.length} • {progress}% concluído</p>
      <h1 className="mt-2 text-2xl font-bold">{step.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

      <div className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
        {step.fields.map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-sm font-medium">
              {field.label}
              {field.required ? ' *' : ''}
            </label>
            <Input
              required={field.required}
              placeholder={field.placeholder}
              value={form[field.name] ?? ''}
              onChange={(e) => setForm((old) => ({ ...old, [field.name]: e.target.value }))}
            />
            {field.helper ? <p className="mt-1 text-xs text-muted-foreground">{field.helper}</p> : null}
          </div>
        ))}

        {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        <Button onClick={onNext} className="w-full" disabled={submitting}>
          {isLast ? (submitting ? 'Gerando seu diagnóstico...' : 'Gerar meu diagnóstico profissional') : 'Salvar e ir para a próxima etapa'}
        </Button>

        <button onClick={onBack} disabled={stepIndex === 0 || submitting} className="w-full text-xs text-muted-foreground disabled:opacity-50">
          {stepIndex === 0 ? 'Você está na primeira etapa' : 'Voltar para etapa anterior'}
        </button>
      </div>
    </main>
  );
}
