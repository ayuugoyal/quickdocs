export type Strategy = 'llmstxt' | 'scrape';

export interface ServiceConfig {
  name: string;
  aliases: string[];
  baseUrl: string;
  llmsTxtUrl?: string;
  strategy: Strategy;
  searchSelector?: string;
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
  tailwind: {
    name: 'Tailwind CSS',
    aliases: ['tailwind', 'tailwindcss', 'tw'],
    baseUrl: 'https://tailwindcss.com/docs',
    strategy: 'scrape',
    searchSelector: '#content-wrapper, article, .prose',
    description: 'Utility-first CSS framework',
  },
  react: {
    name: 'React',
    aliases: ['react', 'reactjs', 'react.js'],
    baseUrl: 'https://react.dev',
    strategy: 'scrape',
    searchSelector: 'article',
    description: 'UI component library by Meta',
  },
  prisma: {
    name: 'Prisma',
    aliases: ['prisma'],
    baseUrl: 'https://www.prisma.io/docs',
    strategy: 'scrape',
    searchSelector: 'article, .docContent, main',
    description: 'Next-generation Node.js ORM',
  },
  twilio: {
    name: 'Twilio',
    aliases: ['twilio'],
    baseUrl: 'https://www.twilio.com/docs',
    strategy: 'scrape',
    searchSelector: '.content-area, article, main',
    description: 'Communications APIs (SMS, Voice, etc.)',
  },
  mdn: {
    name: 'MDN Web Docs',
    aliases: ['mdn', 'mozilla', 'mdn-web', 'webdocs'],
    baseUrl: 'https://developer.mozilla.org/en-US/docs/Web',
    strategy: 'scrape',
    searchSelector: 'article.main-page-content',
    description: 'Web platform documentation (HTML, CSS, JS)',
  },
  aws: {
    name: 'AWS',
    aliases: ['aws', 'amazon-web-services', 'amazon'],
    baseUrl: 'https://docs.aws.amazon.com',
    strategy: 'scrape',
    searchSelector: '#main-content, .main-content, article',
    description: 'Amazon Web Services documentation',
  },
  firebase: {
    name: 'Firebase',
    aliases: ['firebase'],
    baseUrl: 'https://firebase.google.com/docs',
    strategy: 'scrape',
    searchSelector: 'article, devsite-content, .devsite-article-body',
    description: 'Google app development platform',
  },
  planetscale: {
    name: 'PlanetScale',
    aliases: ['planetscale', 'ps'],
    baseUrl: 'https://planetscale.com/docs',
    strategy: 'scrape',
    searchSelector: 'article, main',
    description: 'Serverless MySQL database platform',
  },
  resend: {
    name: 'Resend',
    aliases: ['resend'],
    baseUrl: 'https://resend.com/docs',
    strategy: 'scrape',
    searchSelector: 'article, main',
    description: 'Email API for developers',
  },
  clerk: {
    name: 'Clerk',
    aliases: ['clerk'],
    baseUrl: 'https://clerk.com/docs',
    strategy: 'scrape',
    searchSelector: 'article, main',
    description: 'Authentication and user management',
  },
  upstash: {
    name: 'Upstash',
    aliases: ['upstash'],
    baseUrl: 'https://upstash.com/docs',
    strategy: 'scrape',
    searchSelector: 'article, main',
    description: 'Serverless Redis and Kafka',
  },
  neon: {
    name: 'Neon',
    aliases: ['neon', 'neondb'],
    baseUrl: 'https://neon.tech/docs',
    strategy: 'scrape',
    searchSelector: 'article, main',
    description: 'Serverless Postgres',
  },
  openai: {
    name: 'OpenAI',
    aliases: ['openai', 'gpt', 'chatgpt'],
    baseUrl: 'https://platform.openai.com/docs',
    strategy: 'scrape',
    searchSelector: 'article, main, .docs-body',
    description: 'OpenAI API (GPT, DALL-E, Whisper)',
  },
  drizzle: {
    name: 'Drizzle ORM',
    aliases: ['drizzle', 'drizzle-orm'],
    baseUrl: 'https://orm.drizzle.team/docs',
    strategy: 'scrape',
    searchSelector: 'article, main',
    description: 'TypeScript ORM with SQL-like syntax',
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
