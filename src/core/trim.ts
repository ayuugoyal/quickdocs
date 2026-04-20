/**
 * Smart content trimmer.
 * Splits markdown by sections, scores by topic relevance, returns top sections.
 * No AI — pure text scoring.
 */

interface Section {
  heading: string;
  body: string;
  score: number;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function score(section: Section, topicTokens: string[]): number {
  const haystack = tokenize(section.heading + ' ' + section.body.slice(0, 500));
  let hits = 0;
  for (const t of topicTokens) {
    if (haystack.includes(t)) hits++;
  }
  // Boost: heading match > body match
  const headingHits = topicTokens.filter((t) => tokenize(section.heading).includes(t)).length;
  return hits + headingHits * 2;
}

export function trimToRelevant(content: string, topic: string, maxChars = 4000): string {
  const topicTokens = tokenize(topic);

  // Split into sections by ## or # headings
  const parts = content.split(/(?=^#{1,3} )/m).filter((p) => p.trim());

  if (parts.length <= 1) {
    // No headings — just truncate with ellipsis
    return content.length > maxChars
      ? content.slice(0, maxChars) + '\n\n_...truncated. See source URL for full docs._'
      : content;
  }

  // Parse into sections
  const sections: Section[] = parts.map((part) => {
    const lines = part.split('\n');
    const heading = lines[0].replace(/^#+\s*/, '').trim();
    const body = lines.slice(1).join('\n').trim();
    return { heading, body, score: 0 };
  });

  // Score each section
  const scored = sections.map((s) => ({ ...s, score: score(s, topicTokens) }));

  // Always include intro (first section, usually no heading or title)
  const intro = scored[0];
  const rest = scored.slice(1).sort((a, b) => b.score - a.score);

  // Pick top sections that fit within maxChars
  const selected: Section[] = [];
  let chars = 0;

  // Add intro if short enough
  if (intro.body.length < 800) {
    selected.push(intro);
    chars += intro.body.length;
  }

  // Add top scored sections
  for (const s of rest) {
    if (chars >= maxChars) break;
    if (s.score === 0 && selected.length >= 2) continue; // skip irrelevant if already have content
    const sectionText = `## ${s.heading}\n${s.body}`;
    selected.push(s);
    chars += sectionText.length;
  }

  if (selected.length === 0) selected.push(...scored.slice(0, 3));

  const output = selected
    .map((s) => (s.heading ? `## ${s.heading}\n${s.body}` : s.body))
    .join('\n\n');

  const wasTrimmed = selected.length < sections.length;
  return wasTrimmed ? output + '\n\n_...see source URL for full docs._' : output;
}
