type IntakeField = {
  name: string;
  label: string;
  required: boolean;
  placeholder: string;
  helper?: string;
};

type IntakeStep = {
  id: string;
  title: string;
  description: string;
  fields: IntakeField[];
};

export const intakeSteps: IntakeStep[] = [
  {
    id: 'goal',
    title: 'Qual resultado você quer alcançar no LinkedIn?',
    description: 'Com isso, adaptamos o diagnóstico para seu objetivo real.',
    fields: [
      {
        name: 'goal',
        label: 'Objetivo principal',
        required: true,
        placeholder: 'Ex.: Atrair recrutadores para posições de liderança',
        helper: 'Seja direto. Uma frase já é suficiente.'
      }
    ]
  },
  {
    id: 'profile',
    title: 'Agora, vamos entender seu contexto atual',
    description: 'Essas informações ajudam a IA a propor uma evolução realista do seu perfil.',
    fields: [
      {
        name: 'targetRole',
        label: 'Cargo/posição que você quer atrair',
        required: true,
        placeholder: 'Ex.: Coordenador de Operações'
      },
      {
        name: 'currentHeadline',
        label: 'Título atual no LinkedIn',
        required: false,
        placeholder: 'Ex.: Analista Sênior de Processos'
      },
      {
        name: 'linkedinUrl',
        label: 'URL do seu LinkedIn (opcional)',
        required: false,
        placeholder: 'https://linkedin.com/in/seunome'
      }
    ]
  },
  {
    id: 'proof',
    title: 'Quais resultados mostram seu diferencial?',
    description: 'Aqui está a base para criar textos que transmitam autoridade e impacto.',
    fields: [
      {
        name: 'proudAchievements',
        label: 'Conquistas e resultados que você mais se orgulha',
        required: true,
        placeholder: 'Ex.: Reduzi custos em 18% ao redesenhar o fluxo operacional.',
        helper: 'Se puder, inclua números (percentual, tempo, economia, crescimento).'
      },
      {
        name: 'audience',
        label: 'Quem você quer atrair?',
        required: true,
        placeholder: 'Ex.: Recrutadores e líderes de área'
      },
      {
        name: 'niche',
        label: 'Qual é seu nicho/setor?',
        required: true,
        placeholder: 'Ex.: Logística, SaaS B2B, Finanças'
      },
      {
        name: 'tone',
        label: 'Tom desejado para o perfil',
        required: true,
        placeholder: 'Ex.: Estratégico e objetivo'
      },
      {
        name: 'avoidWords',
        label: 'Palavras que você prefere evitar (opcional)',
        required: false,
        placeholder: 'Ex.: apaixonado, resiliente'
      }
    ]
  }
];
