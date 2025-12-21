// Mock Prisma client for Storybook browser environment
// This prevents better-sqlite3 from being loaded in the browser

export const prisma = {
  app: {
    create: async () => ({}),
    update: async () => ({}),
    findUnique: async () => null,
    findMany: async () => [],
    delete: async () => ({}),
  },
  survey: {
    create: async () => ({}),
    update: async () => ({}),
    findUnique: async () => null,
    findMany: async () => [],
    delete: async () => ({}),
  },
  question: {
    create: async () => ({}),
    update: async () => ({}),
    findUnique: async () => null,
    findMany: async () => [],
    delete: async () => ({}),
  },
  response: {
    create: async () => ({}),
    findMany: async () => [],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
