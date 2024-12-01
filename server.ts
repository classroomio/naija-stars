import { serve } from 'https://deno.land/std/http/mod.ts';
import { neon } from '@neon/serverless';
import 'jsr:@std/dotenv/load';

const databaseUrl = Deno.env.get('DATABASE_URL')!;
const sql = neon(databaseUrl);

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // dandle the `/api/repositories` endpoint
  if (url.pathname === '/api/repositories') {
    try {
      const repositories = await sql`
        SELECT 
          repo_name, 
          repo_link, 
          repo_description, 
          repo_author, 
          repo_author_link, 
          is_inactive, 
          is_archived, 
          stars 
        FROM repositories
        ORDER BY stars DESC;
      `;

      return new Response(JSON.stringify(repositories), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error querying Neon database:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch repositories' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // 404 for other routes
  return new Response('Not Found', { status: 404 });
}

console.log('API server running on http://localhost:8000');
serve(handler);
