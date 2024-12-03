import { z } from 'https://deno.land/x/zod@v3.16.1/mod.ts';
import { Hono } from 'npm:hono';
import { sql } from '../services/db.ts';

const app = new Hono();

const LIMIT_PER_PAGE = 10;

// Valid sort columns and orders
const VALID_SORT_COLUMNS = ['stars', 'author', 'forks'] as const;
const VALID_SORT_ORDERS = ['asc', 'desc'] as const;

// Zod schema for query parameters
const querySchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().max(LIMIT_PER_PAGE),
  sortBy: z.enum(VALID_SORT_COLUMNS).default('stars'),
  order: z.enum(VALID_SORT_ORDERS).default('desc'),
});

app.get('/repositories', async (c) => {
  console.log('Fetching repositories');

  try {
    // Validate query parameters
    const result = querySchema.safeParse({
      page: Number(c.req.query('page') || 1),
      limit: Number(c.req.query('limit') || LIMIT_PER_PAGE),
      sortBy: c.req.query('sortBy'),
      order: c.req.query('order'),
    });

    if (!result.success) {
      return c.json(
        { error: 'Invalid query parameters', details: result.error.issues },
        400
      );
    }

    const { page, limit, sortBy, order } = result.data;
    const offset = (page - 1) * limit;

    // Get total count for pagination metadata
    const countResult =
      (await sql`SELECT COUNT(*)::INT as count FROM repository;`) as {
        count: number;
      }[];

    const { count } = countResult[0];

    // Get paginated and sorted repositories
    const repositories = await sql`
      SELECT * FROM repository
      ORDER BY
        CASE WHEN ${sortBy} = 'stars' AND ${order} = 'asc' THEN stars END ASC,
        CASE WHEN ${sortBy} = 'stars' AND ${order} = 'desc' THEN stars END DESC,
        CASE WHEN ${sortBy} = 'forks' AND ${order} = 'asc' THEN forks END ASC,
        CASE WHEN ${sortBy} = 'forks' AND ${order} = 'desc' THEN forks END DESC,
        CASE WHEN ${sortBy} = 'author' AND ${order} = 'asc' THEN author END ASC,
        CASE WHEN ${sortBy} = 'author' AND ${order} = 'desc' THEN author END DESC
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return c.json({
      data: repositories,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
      sort: {
        sortBy,
        order,
      },
    });
  } catch (error) {
    console.error('Error querying Neon database:', error);
    return c.json({ error: 'Failed to fetch repositories' }, 500);
  }
});

export default app;
