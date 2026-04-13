/*
  Lightweight in-memory data layer for MVP scaffolding.
  Swap this file to real Prisma client in production environments.
*/

type UserRole = 'USER' | 'ADMIN';
type GenerationStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

type User = {
  id: string;
  name?: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

type IntakeSubmission = {
  id: string;
  userId: string;
  goal: string;
  targetRole: string;
  currentHeadline?: string;
  linkedinUrl?: string;
  proudAchievements: string;
  audience: string;
  niche: string;
  tone: string;
  avoidWords?: string;
  status: string;
  createdAt: Date;
};

type PromptVersion = {
  id: string;
  code: string;
  version: string;
  template: string;
  schema: unknown;
  active: boolean;
  createdAt: Date;
};

type Generation = {
  id: string;
  userId: string;
  intakeSubmissionId: string;
  promptVersionId: string;
  status: GenerationStatus;
  model: string;
  retryCount: number;
  rawOutput?: unknown;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
};

type Report = {
  id: string;
  userId: string;
  generationId: string;
  diagnosisSummary: string;
  positioningAngle: string;
  headline: string;
  about: string;
  experienceRewrites: unknown;
  starterPosts: unknown;
  improvementPriorities: unknown;
  createdAt: Date;
};

type Payment = {
  id: string;
  userId: string;
  provider: string;
  providerRef?: string;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  createdAt: Date;
  paidAt?: Date;
  metadata?: unknown;
};

type DBState = {
  users: User[];
  intakeSubmissions: IntakeSubmission[];
  promptVersions: PromptVersion[];
  generations: Generation[];
  reports: Report[];
  payments: Payment[];
};

const createId = () => Math.random().toString(36).slice(2, 12);

const defaultState: DBState = {
  users: [],
  intakeSubmissions: [],
  promptVersions: [
    {
      id: createId(),
      code: 'linkedin-positioning-default',
      version: '1.0.0',
      template: 'prompts/linkedin-positioning-v1.md',
      schema: {},
      active: true,
      createdAt: new Date()
    }
  ],
  generations: [],
  reports: [],
  payments: []
};

declare global {
  var __dbState: DBState | undefined;
}

const state = global.__dbState ?? defaultState;
if (!global.__dbState) global.__dbState = state;

export const prisma = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) =>
      state.users.find((u) => (where.email ? u.email === where.email : u.id === where.id)) ?? null,
    create: async ({ data }: { data: { name?: string; email: string; passwordHash?: string } }) => {
      const user: User = {
        id: createId(),
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data
      };
      state.users.push(user);
      return user;
    },
    count: async () => state.users.length
  },

  intakeSubmission: {
    create: async ({ data }: { data: Omit<IntakeSubmission, 'id' | 'createdAt' | 'status'> & Partial<Pick<IntakeSubmission, 'status'>> }) => {
      const item: IntakeSubmission = {
        id: createId(),
        createdAt: new Date(),
        status: 'SUBMITTED',
        ...data
      };
      state.intakeSubmissions.push(item);
      return item;
    },
    count: async () => state.intakeSubmissions.length
  },

  promptVersion: {
    findFirst: async ({ where }: { where?: { active?: boolean } } = {}) =>
      state.promptVersions.find((p) => (where?.active === undefined ? true : p.active === where.active)) ?? null,
    upsert: async ({ where, create }: { where: { code: string }; update: Record<string, unknown>; create: Omit<PromptVersion, 'id' | 'createdAt'> }) => {
      const existing = state.promptVersions.find((p) => p.code === where.code);
      if (existing) return existing;
      const item: PromptVersion = { id: createId(), createdAt: new Date(), ...create };
      state.promptVersions.push(item);
      return item;
    }
  },

  generation: {
    create: async ({ data }: { data: Omit<Generation, 'id' | 'createdAt' | 'updatedAt' | 'retryCount'> & Partial<Pick<Generation, 'retryCount'>> }) => {
      const item: Generation = {
        id: createId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        retryCount: 0,
        ...data
      };
      state.generations.push(item);
      return item;
    },
    findUnique: async ({ where, include }: { where: { id: string }; include?: { report?: boolean; intakeSubmission?: boolean } }) => {
      const generation = state.generations.find((g) => g.id === where.id);
      if (!generation) return null;
      return {
        ...generation,
        report: include?.report ? state.reports.find((r) => r.generationId === generation.id) ?? null : undefined,
        intakeSubmission: include?.intakeSubmission ? state.intakeSubmissions.find((s) => s.id === generation.intakeSubmissionId) ?? null : undefined
      };
    },
    findUniqueOrThrow: async ({ where, include }: { where: { id: string }; include?: { intakeSubmission?: boolean } }) => {
      const generation = await prisma.generation.findUnique({ where, include: { intakeSubmission: include?.intakeSubmission } });
      if (!generation) throw new Error('Generation not found');
      return generation;
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const idx = state.generations.findIndex((g) => g.id === where.id);
      if (idx === -1) throw new Error('Generation not found');

      const current = state.generations[idx];
      const nextRetry =
        data?.retryCount && typeof data.retryCount === 'object' ? current.retryCount + data.retryCount.increment : (typeof data?.retryCount === 'number' ? data.retryCount : current.retryCount);

      const updated = {
        ...current,
        ...data,
        retryCount: nextRetry,
        updatedAt: new Date()
      } as Generation;
      state.generations[idx] = updated;
      return updated;
    },
    count: async ({ where }: { where?: { status?: GenerationStatus } } = {}) =>
      where?.status ? state.generations.filter((g) => g.status === where.status).length : state.generations.length
  },

  report: {
    create: async ({ data }: { data: Omit<Report, 'id' | 'createdAt'> }) => {
      const item: Report = { id: createId(), createdAt: new Date(), ...data };
      state.reports.push(item);
      return item;
    },
    findUnique: async ({ where }: { where: { id: string } }) => state.reports.find((r) => r.id === where.id) ?? null
  },

  payment: {
    create: async ({ data }: { data: Omit<Payment, 'id' | 'createdAt' | 'status' | 'currency'> & Partial<Pick<Payment, 'status' | 'currency'>> }) => {
      const item: Payment = {
        id: createId(),
        createdAt: new Date(),
        status: 'PENDING',
        currency: 'BRL',
        ...data
      };
      state.payments.push(item);
      return item;
    },
    count: async () => state.payments.length
  },

  $transaction: async (actions: Promise<unknown>[]) => Promise.all(actions)
};
