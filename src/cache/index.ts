import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CACHE_DIR = join(homedir(), '.quickdocs', 'cache');
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  ts: number;
}

function ensureDir() {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function keyToFile(key: string): string {
  return join(CACHE_DIR, key.replace(/[^a-z0-9]/gi, '_') + '.json');
}

export function get<T>(key: string): T | null {
  try {
    const file = keyToFile(key);
    if (!existsSync(file)) return null;
    const entry: CacheEntry<T> = JSON.parse(readFileSync(file, 'utf-8'));
    if (Date.now() - entry.ts > TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export function set<T>(key: string, data: T): void {
  try {
    ensureDir();
    const entry: CacheEntry<T> = { data, ts: Date.now() };
    writeFileSync(keyToFile(key), JSON.stringify(entry));
  } catch {
    // cache write failure is non-fatal
  }
}

export function clear(): void {
  try {
    if (!existsSync(CACHE_DIR)) return;
    readdirSync(CACHE_DIR).forEach((f) => unlinkSync(join(CACHE_DIR, f)));
  } catch {
    // ignore
  }
}
