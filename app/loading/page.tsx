'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const statusSteps = [
  'Entendendo seu objetivo profissional',
  'Analisando seu posicionamento atual',
  'Identificando oportunidades de destaque',
  'Escrevendo recomendações estratégicas',
  'Finalizando seu plano de aplicação no LinkedIn'
];

export default function GenerationLoadingPage() {
  const router = useRouter();
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [failed, setFailed] = useState(false);

  const stageIndex = tick % statusSteps.length;
  const stageText = useMemo(() => statusSteps[stageIndex], [stageIndex]);
  const progress = Math.min(95, 20 + tick * 12);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGenerationId(params.get('generationId'));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
      setSeconds((s) => s + 2);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!generationId) return;

    const poll = setInterval(async () => {
      const res = await fetch(`/api/generations?id=${generationId}`);
      const data = await res.json();

      if (data?.status === 'COMPLETED') {
        router.push(`/result?generationId=${generationId}`);
      }

      if (data?.status === 'FAILED') {
        setFailed(true);
      }
    }, 2200);

    return () => clearInterval(poll);
  }, [generationId, router]);

  if (failed) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Seu diagnóstico não foi concluído desta vez</h1>
        <p className="mt-3 text-sm text-muted-foreground">Sem problema. Isso pode acontecer por instabilidade momentânea. Tente novamente e continuaremos do mesmo ponto.</p>
        <button onClick={() => window.location.reload()} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Tentar gerar novamente
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Estamos preparando seu diagnóstico profissional</h1>
      <p className="mt-3 text-sm text-muted-foreground">{stageText}</p>

      <div className="mx-auto mt-6 h-2 w-full max-w-lg rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      <p className="mt-2 text-xs text-muted-foreground">Tempo médio: 60 a 120 segundos • {seconds}s decorridos</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-4 text-left">
        <p className="text-sm font-semibold">O que você vai receber:</p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
          <li>Diagnóstico estratégico do seu perfil atual</li>
          <li>Headline e seção Sobre otimizadas</li>
          <li>Reescrita de experiências com foco em impacto</li>
          <li>5 ideias de posts para ganhar visibilidade</li>
        </ul>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">Dica: você pode manter esta tela aberta. Vamos te levar automaticamente para o resultado.</p>
    </main>
  );
}
