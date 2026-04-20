import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getDocs, listTopics, searchTopics } from '../core/getDocs.js';
import { listServices } from '../registry/services.js';

const server = new Server(
  { name: 'quickdocs', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_docs',
      description:
        'Fetch documentation for a service and topic. Returns clean markdown content from official docs.',
      inputSchema: {
        type: 'object',
        properties: {
          service: {
            type: 'string',
            description:
              'Service name (e.g. "stripe", "nextjs", "supabase", "vercel", "react", "tailwind")',
          },
          topic: {
            type: 'string',
            description:
              'Topic or feature to look up (e.g. "webhooks", "authentication", "app-router", "useEffect")',
          },
          fresh: {
            type: 'boolean',
            description: 'Skip cache and fetch fresh docs (default: false)',
          },
        },
        required: ['service', 'topic'],
      },
    },
    {
      name: 'list_services',
      description: 'List all services supported by quickdocs.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'list_topics',
      description:
        'List all available documentation topics for a service (only works for services with llms.txt).',
      inputSchema: {
        type: 'object',
        properties: {
          service: { type: 'string', description: 'Service name' },
        },
        required: ['service'],
      },
    },
    {
      name: 'search_topics',
      description: 'Search documentation topics for a service by keyword.',
      inputSchema: {
        type: 'object',
        properties: {
          service: { type: 'string', description: 'Service name' },
          query: { type: 'string', description: 'Search query' },
        },
        required: ['service', 'query'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  try {
    switch (name) {
      case 'get_docs': {
        const { service, topic, fresh } = args as {
          service: string;
          topic: string;
          fresh?: boolean;
        };
        const result = await getDocs(service, topic, { fresh });
        return {
          content: [
            {
              type: 'text',
              text: [
                `# ${result.service} — ${result.topic}`,
                `> Source: ${result.url}`,
                '',
                result.content,
              ].join('\n'),
            },
          ],
        };
      }

      case 'list_services': {
        const svcs = listServices();
        const text = svcs
          .map((s) => `- **${s.name}** (\`${s.aliases[0]}\`) — ${s.description}`)
          .join('\n');
        return { content: [{ type: 'text', text }] };
      }

      case 'list_topics': {
        const { service } = args as { service: string };
        const topics = await listTopics(service);
        const text = topics
          .map((t) => `- [${t.title}](${t.url})${t.description ? ': ' + t.description : ''}`)
          .join('\n');
        return { content: [{ type: 'text', text }] };
      }

      case 'search_topics': {
        const { service, query } = args as { service: string; query: string };
        const matches = await searchTopics(service, query);
        if (matches.length === 0) {
          return { content: [{ type: 'text', text: `No topics found for "${query}"` }] };
        }
        const text = matches
          .map((t) => `- [${t.title}](${t.url})${t.description ? ': ' + t.description : ''}`)
          .join('\n');
        return { content: [{ type: 'text', text }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
      isError: true,
    };
  }
});

export async function startMcpServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Auto-start when run directly
startMcpServer().catch((err) => {
  process.stderr.write(`quickdocs MCP error: ${err.message}\n`);
  process.exit(1);
});
