import { defineConfig } from 'vite';
import path from 'node:path';
import deno from '@deno/vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), svelte()],
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, './src/lib'),
    },
  },
});
