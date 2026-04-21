import { findService, type ServiceConfig } from '../registry/services.js';
import { fetchDocEntries, fuzzyMatch, topMatches, type DocEntry } from '../resolver/index.js';
import { fetchMarkdownUrl } from '../fetcher/fetch.js';
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
  return fetchViaLlmsTxt(config, topic);
}

async function fetchViaLlmsTxt(config: ServiceConfig, topic: string): Promise<DocResult> {
  const entries = await fetchDocEntries(config.llmsTxtUrl);
  const match = fuzzyMatch(entries, topic);

  if (!match) {
    throw new Error(
      `No matching doc found for "${topic}" in ${config.name}. ` +
        `Try \`quickdocs ${config.aliases[0]} --list\` to browse available topics.`
    );
  }

  const content = await fetchMarkdownUrl(match.url);
  if (!content) {
    throw new Error(`Could not fetch doc at ${match.url}`);
  }

  return {
    service: config.name,
    topic,
    url: match.url,
    content,
    fromCache: false,
    strategy: 'llmstxt',
  };
}

/**
 * List all topics available for a service (from its llms.txt)
 */
export async function listTopics(serviceInput: string): Promise<DocEntry[]> {
  const config = findService(serviceInput);
  if (!config) throw new Error(`Unknown service: "${serviceInput}"`);

  return fetchDocEntries(config.llmsTxtUrl);
}

/**
 * Search topics by keyword within a service
 */
export async function searchTopics(serviceInput: string, query: string): Promise<DocEntry[]> {
  const config = findService(serviceInput);
  if (!config) throw new Error(`Unknown service: "${serviceInput}"`);

  const entries = await fetchDocEntries(config.llmsTxtUrl);
  return topMatches(entries, query, 10);
}
