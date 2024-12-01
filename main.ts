import 'jsr:@std/dotenv/load';
import { neon } from '@neon/serverless';
import {getData} from './utils/getData.ts'
import { serve } from 'https://deno.land/std/http/mod.ts';

interface Repository {
  repoName: string;
  repoLink: string;
  repoDescription: string;
  repoAuthor: string;
  repoAuthorLink: string;
  isInactive: boolean;
  isArchived: boolean;
  stars: number | null;
}

const databaseUrl = Deno.env.get('DATABASE_URL')!;
const sql = neon(databaseUrl);

const serveHtml = async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === '/') {
    console.log('Fetching Repositories from Neon...');
    let repositories: Repository[] = [];

    const response = await fetch("/api/repositories");
    repositories = await response.json();
    console.log('Fetching Complete', response);

    const htmlTemplate = await Deno.readTextFile('./web/index.html');

    const tableRows = repositories
      .map(
        (repo: Repository) => `
        <tr>
          <td><a href="${repo.repoLink}" target="_blank">${
          repo.repoName
        }</a></td>
          <td>${repo.stars || 0}</td>
          <td>${repo.repoDescription}</td>
        </tr>`
      )
      .join('');

    const htmlContent = htmlTemplate.replace('<!-- TABLE_ROWS -->', tableRows);
    return new Response(htmlContent, {
      headers: { 'Content-Type': 'text/html' },
    });
  } else if (path.endsWith('.css')) {
    try {
      const css = await Deno.readTextFile(`./web${path}`);
      return new Response(css, {
        headers: { 'Content-Type': 'text/css' },
      });
    } catch {
      return new Response('CSS file not found', { status: 404 });
    }
  } else if (path.endsWith('.js')) {
    try {
      const js = await Deno.readTextFile(`./web${path}`);
      return new Response(js, {
        headers: { 'Content-Type': 'application/javascript' },
      });
    } catch {
      return new Response('JavaScript file not found', { status: 404 });
    }
  }

  return new Response('Not Found', { status: 404 });
};

console.log('Server running on http://localhost:8000');
serve((req) => serveHtml(req));

// /api/repositories

// Cron Job to run every 3 hours for revalidation
Deno.cron('Sample Cron', '0 */3 * * *', async () => {
  console.log('Running cron job...');
  await getData();
  console.log('Cron job completed.');
});
