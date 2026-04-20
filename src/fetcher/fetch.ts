import axios from 'axios';

const UA = 'quickdocs/0.1.0 (https://github.com/ayuugoyal/quickdocs)';

export async function fetchText(url: string): Promise<string> {
  const res = await axios.get<string>(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/plain,text/html,*/*',
    },
    timeout: 15000,
    maxRedirects: 5,
    responseType: 'text',
  });
  return res.data;
}

export async function fetchMarkdownUrl(url: string): Promise<string | null> {
  // Try .md suffix variant first
  const mdUrl = url.endsWith('.md') ? url : url.replace(/\/?$/, '.md');
  try {
    const content = await fetchText(mdUrl);
    // Sanity check: if it returned HTML, discard
    if (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')) {
      return null;
    }
    return content;
  } catch {
    return null;
  }
}
