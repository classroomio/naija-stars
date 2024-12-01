import { defineConfig } from 'vite';
import path from 'node:path';
import deno from '@deno/vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), svelte()],
  // server: {
  //   port: 8000, // Replace 3000 with your desired port number
  //   strictPort: true // Optional: If true, the server will fail if the port is already in use
  // },
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, './src/lib')
    }
  }
});
