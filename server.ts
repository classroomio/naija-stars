/// <reference lib="deno.ns" />
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import RepositoryHandler from './routes/repository.ts';

import 'jsr:@std/dotenv/load';

const PORT = Number(Deno.env.get('PORT')) || 8000;

const app = new Hono();

/** MIDDLEWARES */
app.use('/api/*', cors());

/** ROUTES */
// Root route
app.get('/', (c) => {
  return c.html(
    `<h4>Naija Stars API by <a href="https://classroomio.com">ClassroomIO</a></h4>`
  );
});

// Repository routes
app.route('/api', RepositoryHandler);

/** START THE SERVER */
console.log(`API server running on http://localhost:${PORT}`);

Deno.serve({ port: PORT }, app.fetch);
