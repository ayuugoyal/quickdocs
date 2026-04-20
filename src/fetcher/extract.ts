import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { fetchText } from './fetch.js';

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Preserve code blocks exactly
td.addRule('codeBlocks', {
  filter: ['pre'],
  replacement: (_content, node) => {
    const code = (node as Element).querySelector?.('code');
    const lang = code?.className?.match(/language-(\w+)/)?.[1] ?? '';
    const text = (node as Element).textContent ?? '';
    return `\n\`\`\`${lang}\n${text.trim()}\n\`\`\`\n`;
  },
});

const NOISE_SELECTORS = [
  'nav',
  'header',
  'footer',
  '.sidebar',
  '.navigation',
  '.breadcrumb',
  '.table-of-contents',
  '.toc',
  '.cookie-banner',
  '.banner',
  '[aria-label="breadcrumb"]',
  'script',
  'style',
  'noscript',
  '.admonition-note',
].join(', ');

const CONTENT_SELECTORS = [
  'article',
  'main',
  '[role="main"]',
  '.content',
  '.docs-content',
  '.prose',
  '.markdown-body',
  '#content',
  '#main-content',
];

export async function scrapeToMarkdown(url: string, selector?: string): Promise<string> {
  const html = await fetchText(url);
  const $ = cheerio.load(html);

  // Strip noise
  $(NOISE_SELECTORS).remove();

  let contentHtml: string | null = null;

  if (selector) {
    contentHtml = $(selector).first().html();
  }

  if (!contentHtml) {
    for (const sel of CONTENT_SELECTORS) {
      contentHtml = $(sel).first().html();
      if (contentHtml) break;
    }
  }

  if (!contentHtml) {
    contentHtml = $('body').html() ?? '';
  }

  return td.turndown(contentHtml);
}
