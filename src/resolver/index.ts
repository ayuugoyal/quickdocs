import Fuse from 'fuse.js';
import { fetchText } from '../fetcher/fetch.js';

export interface DocEntry {
  title: string;
  url: string;
  description: string;
}

/**
 * Parse llms.txt content into structured entries.
 * Handles two formats:
 *   [Title](https://url): Description
 *   - [Title](https://url): Description
 */
export function parseLlmsTxt(content: string): DocEntry[] {
  const entries: DocEntry[] = [];
  const pattern = /\[([^\]]+)\]\((https?[^)]+)\)(?::\s*(.+))?/g;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    entries.push({
      title: match[1].trim(),
      url: match[2].trim(),
      description: match[3]?.trim() ?? '',
    });
  }

  return entries;
}

export async function fetchDocEntries(llmsTxtUrl: string): Promise<DocEntry[]> {
  const content = await fetchText(llmsTxtUrl);
  return parseLlmsTxt(content);
}

export function fuzzyMatch(entries: DocEntry[], topic: string): DocEntry | null {
  if (entries.length === 0) return null;

  const fuse = new Fuse(entries, {
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'description', weight: 0.4 },
    ],
    threshold: 0.5,
    includeScore: true,
    ignoreLocation: true,
  });

  const results = fuse.search(topic);
  return results.length > 0 ? results[0].item : null;
}

export function topMatches(entries: DocEntry[], topic: string, limit = 5): DocEntry[] {
  const fuse = new Fuse(entries, {
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'description', weight: 0.4 },
    ],
    threshold: 0.5,
    includeScore: true,
    ignoreLocation: true,
  });

  return fuse.search(topic, { limit }).map((r) => r.item);
}
