/// <reference lib="deno.ns" />
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { cache } from 'npm:hono/cache';
import { rateLimiter } from 'npm:hono-rate-limiter';
import { Redis } from '@upstash/redis';
import { RedisStore } from '@hono-rate-limiter/redis';

import { scrape } from './utils/scrape/index.ts';

import RepositoryHandler from './routes/repository.ts';

import 'jsr:@std/dotenv/load';

const PORT = Number(Deno.env.get('PORT')) || 8000;

const app = new Hono();

/** MIDDLEWARES */

app.use('/v1/*', cors());

app.get(
  '/v1/*',
  cache({
    cacheName: 'nsapi-2',
    cacheControl: 'max-age=60',
    wait: true,
  })
);

if (Deno.env.get('NODE_ENV') === 'production') {
  console.log('Rate limiting enabled');

  const redis = new Redis({
    url: Deno.env.get('UPSTASH_REDIS_REST_URL'),
    token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN'),
  });

  const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 50 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-6', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c) => c.req.header('cf-connecting-ip') ?? '', // Method to generate custom identifiers for clients.
    store: new RedisStore({ client: redis }),
  });

  app.use(limiter);
}

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

/** Cron Jobs */

Deno.cron('scrape-repositories', '0 */12 * * *', async () => {
  console.log('Running repository scraper...');
  try {
    if (Deno.env.get('NODE_ENV') === 'production') {
      await scrape();
      console.log('Repository scrape completed successfully');
    } else {
      console.log('Skipping repository scrape in non-production environment');
    }
  } catch (error) {
    console.error('Error running repository scraper:', error);
  }
});
