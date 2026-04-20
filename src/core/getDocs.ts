import { findService, type ServiceConfig } from '../registry/services.js';
import { fetchDocEntries, fuzzyMatch, topMatches, type DocEntry } from '../resolver/index.js';
import { fetchMarkdownUrl } from '../fetcher/fetch.js';
import { scrapeToMarkdown } from '../fetcher/extract.js';
import { trimToRelevant } from './trim.js';
import * as cache from '../cache/index.js';

export interface DocResult {
  service: string;
  topic: string;
  url: string;
  content: string;
  fromCache: boolean;
  strategy: string;
}

export interface TopicMatch {
  title: string;
  url: string;
  description: string;
}

export async function getDocs(
  serviceInput: string,
  topic: string,
  opts: { fresh?: boolean; full?: boolean } = {}
): Promise<DocResult> {
  const config = findService(serviceInput);
  if (!config) {
    throw new Error(
      `Unknown service: "${serviceInput}". Run \`quickdocs list\` to see available services.`
    );
  }

  const cacheKey = `${config.name.toLowerCase()}:${topic.toLowerCase()}`;

  if (!opts.fresh) {
    const cached = cache.get<DocResult>(cacheKey);
    if (cached) return { ...cached, fromCache: true };
  }

  const result = await fetchDocs(config, topic);

  // Trim to relevant sections unless --full requested
  if (!opts.full) {
    result.content = trimToRelevant(result.content, topic);
  }

  cache.set(cacheKey, result);
  return result;
}

async function fetchDocs(config: ServiceConfig, topic: string): Promise<DocResult> {
  if (config.strategy === 'llmstxt' && config.llmsTxtUrl) {
    return fetchViaLlmsTxt(config, topic);
  }
  return fetchViaScrape(config, topic);
}

async function fetchViaLlmsTxt(config: ServiceConfig, topic: string): Promise<DocResult> {
  const entries = await fetchDocEntries(config.llmsTxtUrl!);
  const match = fuzzyMatch(entries, topic);

  if (!match) {
    throw new Error(
      `No matching doc found for "${topic}" in ${config.name}. ` +
        `Try \`quickdocs ${config.aliases[0]} --list\` to browse available topics.`
    );
  }

  // Try markdown URL first (e.g. stripe uses .md suffix)
  const mdContent = await fetchMarkdownUrl(match.url);
  if (mdContent) {
    return {
      service: config.name,
      topic,
      url: match.url,
      content: mdContent,
      fromCache: false,
      strategy: 'llmstxt+md',
    };
  }

  // Fallback: scrape the HTML
  const content = await scrapeToMarkdown(match.url, config.searchSelector);
  return {
    service: config.name,
    topic,
    url: match.url,
    content,
    fromCache: false,
    strategy: 'llmstxt+scrape',
  };
}

async function fetchViaScrape(config: ServiceConfig, topic: string): Promise<DocResult> {
  const url = `${config.baseUrl}/${topic.replace(/\s+/g, '-').toLowerCase()}`;
  const content = await scrapeToMarkdown(url, config.searchSelector);
  return {
    service: config.name,
    topic,
    url,
    content,
    fromCache: false,
    strategy: 'scrape',
  };
}

/**
 * List all topics available for a service (from its llms.txt)
 */
export async function listTopics(serviceInput: string): Promise<DocEntry[]> {
  const config = findService(serviceInput);
  if (!config) throw new Error(`Unknown service: "${serviceInput}"`);

  if (!config.llmsTxtUrl) {
    throw new Error(`${config.name} does not have an llms.txt index. Topics cannot be listed.`);
  }

  return fetchDocEntries(config.llmsTxtUrl);
}

/**
 * Search topics by keyword within a service
 */
export async function searchTopics(serviceInput: string, query: string): Promise<DocEntry[]> {
  const config = findService(serviceInput);
  if (!config) throw new Error(`Unknown service: "${serviceInput}"`);

  if (!config.llmsTxtUrl) return [];

  const entries = await fetchDocEntries(config.llmsTxtUrl);
  return topMatches(entries, query, 10);
}
