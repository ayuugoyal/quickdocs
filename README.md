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

| Service | Strategy | Aliases |
|---------|----------|---------|
| Stripe | llms.txt | `stripe` |
| Vercel | llms.txt | `vercel` |
| Next.js | llms.txt | `nextjs`, `next` |
| Supabase | llms.txt | `supabase` |
| Anthropic | llms.txt | `anthropic`, `claude` |
| GitHub | llms.txt | `github`, `gh` |
| Tailwind CSS | scrape | `tailwind`, `tw` |
| React | scrape | `react`, `reactjs` |
| Prisma | scrape | `prisma` |
| Twilio | scrape | `twilio` |
| MDN Web Docs | scrape | `mdn` |
| AWS | scrape | `aws` |
| Firebase | scrape | `firebase` |
| OpenAI | scrape | `openai`, `gpt` |
| Drizzle ORM | scrape | `drizzle` |
| Clerk | scrape | `clerk` |
| Resend | scrape | `resend` |
| Neon | scrape | `neon` |
| Upstash | scrape | `upstash` |
| PlanetScale | scrape | `planetscale` |

### How it works

1. **llms.txt** — fetch official `llms.txt` index → fuzzy-match topic → fetch `.md` URL directly (no scraping)
2. **scrape** — fetch HTML → extract main content via cheerio → convert to markdown

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
  llmsTxtUrl: 'https://docs.myservice.com/llms.txt', // if available
  strategy: 'llmstxt', // or 'scrape'
  description: 'What this service does',
},
```

PRs welcome.

---

## License

MIT
