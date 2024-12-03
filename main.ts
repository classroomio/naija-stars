/// <reference lib="deno.ns" />
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { cache } from 'npm:hono/cache';

import RepositoryHandler from './routes/repository.ts';

import 'jsr:@std/dotenv/load';

const PORT = Number(Deno.env.get('PORT')) || 8000;

const app = new Hono();

/** MIDDLEWARES */
app.use('/v1/*', cors());

app.get(
  '/v1/*',
  cache({
    cacheName: 'naijastars-api',
    cacheControl: 'max-age=3600',
    wait: true,
  })
);

/** ROUTES */
// Root route
app.get('/', (c) => {
  return c.html(
    `<h4>Naija Stars API by <a href="https://classroomio.com">ClassroomIO</a></h4>`
  );
});

// Repository routes
app.route('/v1', RepositoryHandler);

/** START THE SERVER */
console.log(`API server running on http://localhost:${PORT}`);

Deno.serve({ port: PORT }, app.fetch);
