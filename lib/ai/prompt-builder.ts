type IntakeForPrompt = {
  goal: string;
  targetRole: string;
  currentHeadline?: string | null;
  proudAchievements: string;
  audience: string;
  niche: string;
  tone: string;
  avoidWords?: string | null;
};

export function buildPrompt(input: IntakeForPrompt) {
  return `Você é especialista em posicionamento profissional no LinkedIn.
Responda SOMENTE em JSON válido e em português brasileiro.
Dados do usuário:
- Objetivo: ${input.goal}
- Cargo alvo: ${input.targetRole}
- Headline atual: ${input.currentHeadline ?? 'não informado'}
- Conquistas: ${input.proudAchievements}
- Audiência: ${input.audience}
- Nicho: ${input.niche}
- Tom desejado: ${input.tone}
- Palavras a evitar: ${input.avoidWords ?? 'nenhuma'}
`;}
