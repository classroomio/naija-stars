import { mdConverter } from '@ptm/mm-mark';
import { DOMParser } from '@b-fuze/deno-dom';
import { serve } from "https://deno.land/std/http/mod.ts";

interface Repository {
  repoName: string;
  repoLink: string;
  repoDescription: string;
  repoAuthor: string;
  repoAuthorLink: string;
  isInactive: boolean;
  isArchived: boolean;
  stars: number | null; // Can be null if fetching stars fails
}

const yourToken = '';

const GITHUB_API_BASE = 'https://api.github.com/repos';
const GITHUB_HEADERS = {
  Accept: 'application/vnd.github.preview+json',
  Authorization: `Bearer ${yourToken}`,
};

// In-memory cache object
let cache: { data: Repository[]; lastFetched: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000;

// Initialize Deno KV
const kv = await Deno.openKv();

const getData = async (): Promise<Repository[]> => {
  const now = Date.now();

  // Check if cache exists and is valid
  if (cache && now - cache.lastFetched < CACHE_DURATION) {
    console.log("Serving data from cache...");
    return cache.data;
  }

  console.log("Fetching fresh data...");
  const response = await fetch(
    'https://raw.githubusercontent.com/acekyd/made-in-nigeria/main/README.MD'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const markdownData = await response.text();
  const converter = mdConverter();

  const html = converter.makeHtml(markdownData);
  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');

  const liTextArray = Array.from(document.querySelectorAll('li')).map(
    (li) => li.innerHTML
  );

  const parsedRepos: Repository[] = convertToJSON(liTextArray);
  const updatedRepositories = await addStars(parsedRepos);

  updatedRepositories.sort((a, b) => (b.stars || 0) - (a.stars || 0));

  // Cache the fetched data with the current timestamp
  cache = {
    data: updatedRepositories,
    lastFetched: now,
  };

  // Save to Deno KV
  await kv.set(["repositories"], { data: updatedRepositories });
  console.log("Data saved to Deno KV");

  return updatedRepositories;
};

const addStars = async (repositories: Repository[]): Promise<Repository[]> => {
  const updatedRepositories: Repository[] = [];

  for (const repo of repositories) {
    try {
      const match = repo.repoLink.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        updatedRepositories.push({ ...repo, stars: null });
        continue;
      }

      const username = match[1];
      const repoName = match[2];

      const apiResponse = await fetch(
        `${GITHUB_API_BASE}/${username}/${repoName}`,
        {
          headers: GITHUB_HEADERS,
        }
      );

      const apiData = await apiResponse.json();
      const stars = apiData.watchers_count || 0;

      updatedRepositories.push({ ...repo, stars });
    } catch (error) {
      console.error(`Error processing repository ${repo.repoLink}:`, error);
      updatedRepositories.push({ ...repo, stars: null });
    }
  }

  return updatedRepositories;
};

function convertToJSON(repositories: string[]): Repository[] {
  return repositories.map((repository) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(repository, 'text/html');

    const repoName = doc.querySelector('a')?.textContent?.trim() || '';
    const repoLink = doc.querySelector('a')?.getAttribute('href') || '';
    const status = doc.querySelector('span')?.textContent || '';
    const isInactive = status.includes('Inactive');
    const isArchived = status.includes('Archived');

    const repoDescription = Array.from(doc.body.childNodes)
      .filter(
        (node) =>
          node.nodeType === node.TEXT_NODE && node.textContent?.trim().length
      )
      .map((node) => node.textContent?.trim())
      .join(' ')
      .split('-')
      .slice(1)
      .join('-')
      .split('@')[0]
      .trim();

    const repoAuthor = doc.querySelector('strong a')?.textContent?.trim() || '';
    const repoAuthorLink =
      doc.querySelector('strong a')?.getAttribute('href') || '';

    return {
      repoName,
      repoLink,
      repoDescription,
      repoAuthor,
      repoAuthorLink,
      isInactive,
      isArchived,
      stars: null, // Initial value; will be updated later
    };
  });
}

const serveHtml = async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === "/") {
    const result = await kv.get(["repositories"]);
    // deno-lint-ignore no-explicit-any
    const repositories = (result?.value as { data: any[] })?.data || [];
    console.log('kv repositories', repositories)

    const htmlTemplate = await Deno.readTextFile("./web/index.html");

    const tableRows = repositories
      .map(
        (repo: Repository) => `
        <tr>
          <td><a href="${repo.repoLink}" target="_blank">${repo.repoName}</a></td>
          <td>${repo.stars || 0}</td>
          <td>${repo.repoDescription}</td>
        </tr>`
      )
      .join("");

    const htmlContent = htmlTemplate.replace("<!-- TABLE_ROWS -->", tableRows);
    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html" },
    });
  } else if (path.endsWith(".css")) {
    try {
      const css = await Deno.readTextFile(`./web${path}`);
      return new Response(css, {
        headers: { "Content-Type": "text/css" },
      });
    } catch {
      return new Response("CSS file not found", { status: 404 });
    }
  } else if (path.endsWith(".js")) {
    try {
      const js = await Deno.readTextFile(`./web${path}`);
      return new Response(js, {
        headers: { "Content-Type": "application/javascript" },
      });
    } catch {
      return new Response("JavaScript file not found", { status: 404 });
    }
  }

  return new Response("Not Found", { status: 404 });
};

console.log("Server running on http://localhost:8000");
serve((req) => serveHtml(req));

// Set up a cron job to run every 3 hours
Deno.cron("Sample Cron", "0 */3 * * *", async () => {
  console.log("Running cron job...");
  await getData();
  console.log("Cron job completed.");
});
