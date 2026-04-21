export type Strategy = 'llmstxt';

export interface ServiceConfig {
  name: string;
  aliases: string[];
  baseUrl: string;
  llmsTxtUrl: string;
  strategy: Strategy;
  description: string;
}

export const services: Record<string, ServiceConfig> = {
  stripe: {
    name: 'Stripe',
    aliases: ['stripe', 'stripe-payments'],
    baseUrl: 'https://docs.stripe.com',
    llmsTxtUrl: 'https://docs.stripe.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Payment processing APIs and SDKs',
  },
  vercel: {
    name: 'Vercel',
    aliases: ['vercel'],
    baseUrl: 'https://vercel.com/docs',
    llmsTxtUrl: 'https://vercel.com/docs/llms.txt',
    strategy: 'llmstxt',
    description: 'Frontend cloud deployment platform',
  },
  nextjs: {
    name: 'Next.js',
    aliases: ['next', 'nextjs', 'next.js'],
    baseUrl: 'https://nextjs.org/docs',
    llmsTxtUrl: 'https://nextjs.org/docs/llms.txt',
    strategy: 'llmstxt',
    description: 'React framework for production',
  },
  supabase: {
    name: 'Supabase',
    aliases: ['supabase'],
    baseUrl: 'https://supabase.com/docs',
    llmsTxtUrl: 'https://supabase.com/docs/llms.txt',
    strategy: 'llmstxt',
    description: 'Open source Firebase alternative',
  },
  anthropic: {
    name: 'Anthropic',
    aliases: ['anthropic', 'claude', 'claude-api'],
    baseUrl: 'https://docs.anthropic.com',
    llmsTxtUrl: 'https://docs.anthropic.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Claude AI API documentation',
  },
  github: {
    name: 'GitHub',
    aliases: ['github', 'gh'],
    baseUrl: 'https://docs.github.com',
    llmsTxtUrl: 'https://docs.github.com/llms.txt',
    strategy: 'llmstxt',
    description: 'GitHub platform and APIs',
  },
  drizzle: {
    name: 'Drizzle ORM',
    aliases: ['drizzle', 'drizzle-orm'],
    baseUrl: 'https://orm.drizzle.team/docs',
    llmsTxtUrl: 'https://orm.drizzle.team/llms.txt',
    strategy: 'llmstxt',
    description: 'TypeScript ORM with SQL-like syntax',
  },
  cloudflare: {
    name: 'Cloudflare',
    aliases: ['cloudflare', 'cf'],
    baseUrl: 'https://developers.cloudflare.com',
    llmsTxtUrl: 'https://developers.cloudflare.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Cloudflare developer platform and Workers',
  },
  docker: {
    name: 'Docker',
    aliases: ['docker'],
    baseUrl: 'https://docs.docker.com',
    llmsTxtUrl: 'https://docs.docker.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Container platform documentation',
  },
  astro: {
    name: 'Astro',
    aliases: ['astro'],
    baseUrl: 'https://docs.astro.build',
    llmsTxtUrl: 'https://docs.astro.build/llms.txt',
    strategy: 'llmstxt',
    description: 'Content-focused web framework',
  },
  svelte: {
    name: 'Svelte',
    aliases: ['svelte', 'sveltekit'],
    baseUrl: 'https://svelte.dev',
    llmsTxtUrl: 'https://svelte.dev/llms.txt',
    strategy: 'llmstxt',
    description: 'Cybernetically enhanced web apps',
  },
  hono: {
    name: 'Hono',
    aliases: ['hono'],
    baseUrl: 'https://hono.dev',
    llmsTxtUrl: 'https://hono.dev/llms.txt',
    strategy: 'llmstxt',
    description: 'Ultrafast web framework for edge runtimes',
  },
  bun: {
    name: 'Bun',
    aliases: ['bun'],
    baseUrl: 'https://bun.com/docs',
    llmsTxtUrl: 'https://bun.com/docs/llms.txt',
    strategy: 'llmstxt',
    description: 'Fast all-in-one JavaScript runtime',
  },
  deno: {
    name: 'Deno',
    aliases: ['deno'],
    baseUrl: 'https://docs.deno.com',
    llmsTxtUrl: 'https://docs.deno.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Secure JavaScript and TypeScript runtime',
  },
  prisma: {
    name: 'Prisma',
    aliases: ['prisma'],
    baseUrl: 'https://www.prisma.io/docs',
    llmsTxtUrl: 'https://www.prisma.io/docs/llms.txt',
    strategy: 'llmstxt',
    description: 'Next-generation Node.js and TypeScript ORM',
  },
  clerk: {
    name: 'Clerk',
    aliases: ['clerk'],
    baseUrl: 'https://clerk.com/docs',
    llmsTxtUrl: 'https://clerk.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Authentication and user management',
  },
  neon: {
    name: 'Neon',
    aliases: ['neon', 'neondb'],
    baseUrl: 'https://neon.com/docs',
    llmsTxtUrl: 'https://neon.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Serverless Postgres database',
  },
  upstash: {
    name: 'Upstash',
    aliases: ['upstash'],
    baseUrl: 'https://upstash.com/docs',
    llmsTxtUrl: 'https://upstash.com/docs/llms.txt',
    strategy: 'llmstxt',
    description: 'Serverless Redis and Kafka',
  },
  turso: {
    name: 'Turso',
    aliases: ['turso'],
    baseUrl: 'https://docs.turso.tech',
    llmsTxtUrl: 'https://docs.turso.tech/llms.txt',
    strategy: 'llmstxt',
    description: 'Edge SQLite database platform',
  },
  shadcn: {
    name: 'shadcn/ui',
    aliases: ['shadcn', 'shadcn-ui'],
    baseUrl: 'https://ui.shadcn.com',
    llmsTxtUrl: 'https://ui.shadcn.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Beautifully designed React components',
  },
  mcp: {
    name: 'Model Context Protocol',
    aliases: ['mcp', 'modelcontextprotocol'],
    baseUrl: 'https://modelcontextprotocol.io',
    llmsTxtUrl: 'https://modelcontextprotocol.io/llms.txt',
    strategy: 'llmstxt',
    description: 'Open protocol for LLM tool integration',
  },
  aisdk: {
    name: 'Vercel AI SDK',
    aliases: ['ai-sdk', 'aisdk', 'vercel-ai'],
    baseUrl: 'https://sdk.vercel.ai',
    llmsTxtUrl: 'https://sdk.vercel.ai/llms.txt',
    strategy: 'llmstxt',
    description: 'TypeScript toolkit for building AI applications',
  },
  langchain: {
    name: 'LangChain',
    aliases: ['langchain'],
    baseUrl: 'https://python.langchain.com',
    llmsTxtUrl: 'https://python.langchain.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Framework for building LLM applications',
  },
  turborepo: {
    name: 'Turborepo',
    aliases: ['turborepo', 'turbo'],
    baseUrl: 'https://turbo.build',
    llmsTxtUrl: 'https://turbo.build/llms.txt',
    strategy: 'llmstxt',
    description: 'High-performance build system for monorepos',
  },
  replicate: {
    name: 'Replicate',
    aliases: ['replicate'],
    baseUrl: 'https://replicate.com/docs',
    llmsTxtUrl: 'https://replicate.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Run and fine-tune open-source AI models',
  },
  posthog: {
    name: 'PostHog',
    aliases: ['posthog'],
    baseUrl: 'https://posthog.com/docs',
    llmsTxtUrl: 'https://posthog.com/llms.txt',
    strategy: 'llmstxt',
    description: 'Open-source product analytics platform',
  },
  cursor: {
    name: 'Cursor',
    aliases: ['cursor'],
    baseUrl: 'https://docs.cursor.com',
    llmsTxtUrl: 'https://docs.cursor.com/llms.txt',
    strategy: 'llmstxt',
    description: 'AI-powered code editor',
  },
  betterauth: {
    name: 'Better Auth',
    aliases: ['better-auth', 'betterauth'],
    baseUrl: 'https://better-auth.com',
    llmsTxtUrl: 'https://better-auth.com/llms.txt',
    strategy: 'llmstxt',
    description: 'TypeScript authentication framework',
  },
};

export function findService(input: string): ServiceConfig | null {
  const key = input.toLowerCase().trim();

  // exact key match
  if (services[key]) return services[key];

  // alias match
  for (const config of Object.values(services)) {
    if (config.aliases.includes(key)) return config;
  }

  return null;
}

export function listServices(): ServiceConfig[] {
  return Object.values(services);
}
