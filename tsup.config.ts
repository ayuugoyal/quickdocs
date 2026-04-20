import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'cli/index': 'src/cli/index.ts',
    'mcp/server': 'src/mcp/server.ts',
    index: 'src/index.ts',
  },
  format: ['esm'],
  target: 'node18',
  shims: true,
  clean: true,
  dts: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
