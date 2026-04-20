# quickdocs

> Instant documentation fetcher for any developer service. One command — get the docs.

Powered by [llms.txt](https://llmstxt.org/). Works as a **CLI**, **MCP server** (Claude Code, Cursor, Windsurf), and **Claude Code skill** (`/docs`).

---

## Install

```bash
npm install -g quickdocs
```

Or run without installing:

```bash
npx quickdocs stripe webhooks
```

---

## CLI Usage

### Fetch docs directly

```bash
quickdocs stripe webhooks
quickdocs nextjs app-router
quickdocs supabase auth
quickdocs react useEffect
quickdocs vercel environment-variables
```

### Interactive mode (no args → pick service + topic)

```bash
quickdocs
```

Shows a list of all services → pick one → shows all topics → pick one → prints docs.

### Browse topics for a service

```bash
quickdocs stripe --list
quickdocs nextjs --list routing
```

### List all supported services

```bash
quickdocs list
```

### Options

```bash
quickdocs stripe webhooks --fresh   # skip cache, fetch live
quickdocs cache:clear               # clear ~/.quickdocs/cache/
```

---

## MCP Server (Claude Code / Cursor / Windsurf)

Add to your project's `.mcp.json` or global MCP config:

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

**Claude Code:**

```bash
claude mcp add-json quickdocs '{"command":"npx","args":["-y","quickdocs","mcp"]}'
```

**Cursor** (`~/.cursor/mcp.json`), **Windsurf** (`~/.codeium/windsurf/mcp_config.json`):

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

### MCP Tools exposed

| Tool | Description |
|------|-------------|
| `get_docs(service, topic)` | Fetch docs for a service + topic |
| `list_services()` | List all supported services |
| `list_topics(service)` | Browse all topics for a service |
| `search_topics(service, query)` | Search topics by keyword |

Once configured, your AI assistant will automatically call `get_docs` when you ask questions like *"how do Stripe webhooks work?"*

---

## Claude Code Skill (`/docs`)

Install the skill for `/docs` slash command support:

```bash
# Copy skill to your Claude skills directory
cp -r skill ~/.claude/skills/docs
```

Then in Claude Code:

```
/docs stripe webhooks
/docs nextjs app-router
/docs                    ← interactive mode
```

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

1. **llms.txt strategy** — fetches official `llms.txt` index, fuzzy-matches topic against page titles, fetches the markdown URL directly (no scraping)
2. **scrape strategy** — fetches HTML from the docs URL, extracts main content with cheerio, converts to markdown

---

## Caching

Docs are cached locally at `~/.quickdocs/cache/` for 24 hours. Use `--fresh` to bypass.

---

## Contributing

Adding a new service is one object in [`src/registry/services.ts`](src/registry/services.ts):

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

---

## License

MIT
