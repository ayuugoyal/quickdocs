import { Command } from 'commander';
import chalk from 'chalk';
import { getDocs, listTopics, searchTopics } from '../core/getDocs.js';
import { listServices, findService } from '../registry/services.js';
import { startMcpServer } from '../mcp/server.js';
import { clear as clearCache } from '../cache/index.js';

// Lazy-load inquirer only when interactive mode is needed
async function getInquirer() {
  const { default: inquirer } = await import('inquirer');
  return inquirer;
}

const program = new Command();

program
  .name('quickdocs')
  .description('Instant documentation fetcher. Powered by llms.txt.')
  .version('0.1.0');

// ─── quickdocs <service> <topic> ─────────────────────────────────────────────
program
  .command('get [service] [topic]', { isDefault: true })
  .description('Fetch documentation for a service and topic')
  .option('-f, --fresh', 'Skip cache, fetch fresh docs')
  .option('-l, --list', 'List/search available topics for this service')
  .option('--full', 'Show full doc, no trimming')
  .action(async (service?: string, topic?: string, opts?: { fresh?: boolean; list?: boolean; full?: boolean }) => {
    // ── Interactive mode: no args ──
    if (!service) {
      await interactiveMode();
      return;
    }

    // ── List topics mode ──
    if (opts?.list) {
      await listTopicsCmd(service, topic);
      return;
    }

    // ── Topic required for fetch ──
    if (!topic) {
      // No topic: show interactive topic picker for this service
      await interactiveTopic(service);
      return;
    }

    await fetchAndPrint(service, topic, { fresh: opts?.fresh, full: opts?.full });
  });

// ─── quickdocs list ───────────────────────────────────────────────────────────
program
  .command('list')
  .description('List all supported services')
  .action(() => {
    const svcs = listServices();
    console.log(chalk.bold('\nSupported services:\n'));
    svcs.forEach((s) => {
      console.log(
        `  ${chalk.cyan(s.aliases[0].padEnd(16))} ${chalk.dim(s.name.padEnd(20))} ${s.description}`
      );
    });
    console.log();
  });

// ─── quickdocs mcp ───────────────────────────────────────────────────────────
program
  .command('mcp')
  .description('Start quickdocs as an MCP server (stdio transport)')
  .action(async () => {
    await startMcpServer();
  });

// ─── quickdocs cache:clear ───────────────────────────────────────────────────
program
  .command('cache:clear')
  .description('Clear the local documentation cache')
  .action(() => {
    clearCache();
    console.log(chalk.green('Cache cleared.'));
  });

// ─────────────────────────────────────────────────────────────────────────────

async function fetchAndPrint(service: string, topic: string, opts: { fresh?: boolean; full?: boolean } = {}) {
  const spinner = startSpinner(`Fetching ${service} docs for "${topic}"...`);
  try {
    const result = await getDocs(service, topic, { fresh: opts.fresh, full: opts.full });
    stopSpinner(spinner);

    console.log(
      chalk.bold.cyan(`\n${result.service}`) + chalk.dim(` › ${result.topic}`)
    );
    console.log(chalk.dim(`Source: ${result.url}`));
    if (result.fromCache) console.log(chalk.dim('(cached)'));
    console.log('\n' + result.content + '\n');
  } catch (err) {
    stopSpinner(spinner);
    console.error(chalk.red(`\nError: ${(err as Error).message}`));
    process.exit(1);
  }
}

async function listTopicsCmd(service: string, query?: string) {
  const spinner = startSpinner(`Loading topics for ${service}...`);
  try {
    const entries = query
      ? await searchTopics(service, query)
      : await listTopics(service);
    stopSpinner(spinner);

    const config = findService(service);
    console.log(chalk.bold(`\n${config?.name ?? service} topics:\n`));
    entries.slice(0, 30).forEach((e) => {
      console.log(`  ${chalk.cyan(e.title)}`);
      if (e.description) console.log(`  ${chalk.dim(e.description)}`);
    });
    console.log();
  } catch (err) {
    stopSpinner(spinner);
    console.error(chalk.red(`\nError: ${(err as Error).message}`));
    process.exit(1);
  }
}

async function interactiveMode() {
  const inquirer = await getInquirer();
  const svcs = listServices();

  const { service } = await inquirer.prompt([
    {
      type: 'list',
      name: 'service',
      message: 'Select a service:',
      choices: svcs.map((s) => ({
        name: `${s.name.padEnd(20)} ${chalk.dim(s.description)}`,
        value: s.aliases[0],
        short: s.name,
      })),
      pageSize: 15,
    },
  ]);

  await interactiveTopic(service);
}

async function interactiveTopic(service: string) {
  const config = findService(service);
  if (!config) {
    console.error(chalk.red(`Unknown service: "${service}"`));
    process.exit(1);
  }

  const inquirer = await getInquirer();

  if (config.llmsTxtUrl) {
    // Service has llms.txt → show searchable topic list
    const spinner = startSpinner(`Loading ${config.name} topics...`);
    let allEntries: Awaited<ReturnType<typeof listTopics>>;
    try {
      allEntries = await listTopics(service);
      stopSpinner(spinner);
    } catch {
      stopSpinner(spinner);
      // Fallback to free-text
      await freeTextTopic(service, inquirer);
      return;
    }

    const { topic } = await inquirer.prompt([
      {
        type: 'list',
        name: 'topic',
        message: `Select a ${config.name} topic:`,
        choices: allEntries.map((e) => ({
          name: e.description ? `${e.title} — ${chalk.dim(e.description)}` : e.title,
          value: e.title,
          short: e.title,
        })),
        pageSize: 20,
      },
    ]);

    await fetchAndPrint(service, topic);
  } else {
    await freeTextTopic(service, inquirer);
  }
}

async function freeTextTopic(service: string, inquirer: Awaited<ReturnType<typeof getInquirer>>) {
  const { topic } = await inquirer.prompt([
    {
      type: 'input',
      name: 'topic',
      message: `Enter topic for ${service}:`,
      validate: (v: string) => v.trim().length > 0 || 'Topic cannot be empty',
    },
  ]);
  await fetchAndPrint(service, topic.trim());
}

// Simple terminal spinner
function startSpinner(msg: string): NodeJS.Timeout {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  process.stdout.write(chalk.dim(msg));
  return setInterval(() => {
    process.stdout.write(`\r${chalk.cyan(frames[i++ % frames.length])} ${chalk.dim(msg)}`);
  }, 80);
}

function stopSpinner(t: NodeJS.Timeout) {
  clearInterval(t);
  process.stdout.write('\r\x1b[K');
}

program.parseAsync(process.argv).catch((err) => {
  console.error(chalk.red(err.message));
  process.exit(1);
});
