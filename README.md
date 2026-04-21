# quickdocs

> Instant documentation fetcher for any developer service. One command — get the docs.

Powered by [llms.txt](https://llmstxt.org/). Works as a **CLI**, **MCP server** (Claude Code, Cursor, Windsurf), and **Claude Code hook** (`/docs`).

---

## Install

```bash
npm install -g quickdocs
```

Or without installing:

```bash
npx quickdocs stripe webhooks
```

---

## CLI Usage

```bash
quickdocs stripe webhooks           # fetch docs — trimmed to relevant sections
quickdocs nextjs app-router
quickdocs supabase auth
quickdocs react useEffect
quickdocs vercel environment-variables
```

### Interactive mode

```bash
quickdocs
```

Arrow-key picker → select service → select topic → docs printed.

### Options

```bash
quickdocs stripe webhooks --full    # full doc, no trimming
quickdocs stripe webhooks --fresh   # skip cache, fetch live
quickdocs stripe --list             # browse all topics for a service
quickdocs list                      # list all supported services
quickdocs cache:clear               # clear ~/.quickdocs/cache/
```

---

## Smart Trimming

By default, quickdocs returns only the **relevant sections** for your topic — not the entire doc page.

Splits the page by headings → scores each section against your query → returns top matches (~4000 chars).

```bash
quickdocs stripe webhooks           # relevant sections only
quickdocs stripe webhooks --full    # full page
```

---

## Claude Code Hook (`/docs`)

Type `/docs` directly in Claude Code input. The hook pre-fetches docs and injects them into context — no AI tool calls needed.

**Setup:**

1. Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "^/docs",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"/path/to/quickdocs/plugin/hooks/on-prompt.sh\"",
            "timeout": 20
          }
        ]
      }
    ]
  }
}
```

2. Copy skill:

```bash
cp -r plugin/skill ~/.claude/skills/docs
```

**Usage:**

```
/docs stripe webhooks        → fetches + injects docs instantly
/docs nextjs app-router
/docs                        → shows all services
/docs stripe                 → shows all stripe topics
```

---

## MCP Server (Claude Code / Cursor / Windsurf)

```bash
claude mcp add-json quickdocs '{"command":"npx","args":["-y","quickdocs","mcp"]}'
```

Or add to `.mcp.json`:

```json
{
  "mcpServers": {
    "quickdocs": {
      "command": "npx",
      "args": ["-y", "quickdocs", "mcp"]
    }
  }
}
```

**Cursor** → `~/.cursor/mcp.json` | **Windsurf** → `~/.codeium/windsurf/mcp_config.json`

### MCP Tools

| Tool | Description |
|------|-------------|
| `get_docs(service, topic)` | Fetch docs — trimmed by default, `full=true` for complete |
| `list_services()` | List all supported services |
| `list_topics(service)` | Browse all topics for a service |
| `search_topics(service, query)` | Search topics by keyword |

---

## Supported Services

All services use the official `llms.txt` standard — no scraping.

| Service | Aliases |
|---------|---------|
| Stripe | `stripe` |
| Vercel | `vercel` |
| Next.js | `nextjs`, `next` |
| Supabase | `supabase` |
| Anthropic | `anthropic`, `claude` |
| GitHub | `github`, `gh` |
| Drizzle ORM | `drizzle` |
| Cloudflare | `cloudflare`, `cf` |
| Docker | `docker` |
| Astro | `astro` |
| Svelte / SvelteKit | `svelte`, `sveltekit` |
| Hono | `hono` |
| Bun | `bun` |
| Deno | `deno` |
| Prisma | `prisma` |
| Clerk | `clerk` |
| Neon | `neon`, `neondb` |
| Upstash | `upstash` |
| Turso | `turso` |
| shadcn/ui | `shadcn`, `shadcn-ui` |
| Model Context Protocol | `mcp` |
| Vercel AI SDK | `ai-sdk`, `aisdk` |
| LangChain | `langchain` |
| Turborepo | `turborepo`, `turbo` |
| Replicate | `replicate` |
| PostHog | `posthog` |
| Cursor | `cursor` |
| Better Auth | `better-auth` |

### How it works

Fetch official `llms.txt` index → fuzzy-match topic → fetch `.md` doc directly.

---

## Caching

Cached at `~/.quickdocs/cache/` for 24h. Use `--fresh` to bypass.

---

## Contributing

Add a service — one object in [`src/registry/services.ts`](src/registry/services.ts):

```typescript
myservice: {
  name: 'My Service',
  aliases: ['myservice', 'ms'],
  baseUrl: 'https://docs.myservice.com',
  llmsTxtUrl: 'https://docs.myservice.com/llms.txt',
  strategy: 'llmstxt',
  description: 'What this service does',
},
```

PRs welcome.

---

## License

MIT
