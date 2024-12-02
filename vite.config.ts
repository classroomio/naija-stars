import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';
import deno from '@deno/vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import process from 'node:process';

// https://vite.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [deno(), svelte()],
    // server: {
    //   port: 8000, // Replace 3000 with your desired port number
    //   strictPort: true // Optional: If true, the server will fail if the port is already in use
    // },
    resolve: {
      alias: {
        $lib: path.resolve(__dirname, './src/lib'),
      },
    },
  });
};
