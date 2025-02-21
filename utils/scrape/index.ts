import {
  DBRepository,
  GitHubRepository,
  ScrapedRepository,
} from '../types/repository.ts';

import { DOMParser } from '@b-fuze/deno-dom';
import { mdConverter } from '@ptm/mm-mark';
import { neon } from '@neon/serverless';
import { sleep } from './sleep.ts';

const databaseUrl = Deno.env.get('DATABASE_URL')!;
const sql = neon(databaseUrl);

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN')!;
const GITHUB_API_BASE = 'https://api.github.com/repos';
const GITHUB_HEADERS = {
  Accept: 'application/vnd.github.preview+json',
  Authorization: `Bearer ${GITHUB_TOKEN}`,
};
const SLEEP_TIME = 400;

const fetchDataFromGithub = async (
  scrapedRepos: ScrapedRepository[]
): Promise<DBRepository[]> => {
  const repositories: DBRepository[] = [];

  for (const repository of scrapedRepos) {
    console.log(`Fetching ${repository.name} from GitHub...`);
    try {
      const match = repository.link.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        continue;
      }

      const user = match[1];
      const repo = match[2];

      const apiResponse = await fetch(`${GITHUB_API_BASE}/${user}/${repo}`, {
        headers: GITHUB_HEADERS,
      });

      const apiData = (await apiResponse.json()) as GitHubRepository;

      repositories.push({
        name: apiData.name,
        link: repository.link,
        description: apiData.description || '',
        author: apiData.owner.login,
        author_link: apiData.owner.html_url,

        // Let's store the author's name and link from the scraped data
        author_madeinnigeria: repository.author,
        author_link_madeinnigeria: repository.authorLink,

        author_avatar: apiData.owner.avatar_url,
        stars: apiData.watchers_count || 0,
        topics: apiData.topics || [],
        license: {
          key: apiData.license?.key || '',
          name: apiData.license?.name || '',
          url: apiData.license?.url || '',
        },
        forks: apiData.forks || 0,
        open_issues_count: apiData.open_issues_count || 0,
        archived: apiData.archived || false,
        disabled: apiData.disabled || false,
        original_created_at: apiData.created_at,
        original_updated_at: apiData.updated_at,
      });

      await sleep(SLEEP_TIME);
    } catch (error) {
      console.error(`Error processing repository ${repository.link}:`, error);
    }
  }

  return repositories;
};

function cleanAuthor(link: string) {
  return link.replace(/[\(\)]/g, '');
}

function convertToJSON(repositories: string[]): ScrapedRepository[] {
  return repositories.map((repository) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(repository, 'text/html');

    const name = doc.querySelector('a')?.textContent?.trim() || '';
    const link = doc.querySelector('a')?.getAttribute('href') || '';

    const author = doc.querySelector('strong a')?.textContent?.trim() || '';
    const authorLink =
      doc.querySelector('strong a')?.getAttribute('href') || '';

    return {
      name,
      link,
      author: cleanAuthor(author),
      authorLink: cleanAuthor(authorLink),
    };
  });
}

export const scrape = async () => {
  console.log('Fetching Repositories From GitHub...');

  const response = await fetch(
    'https://raw.githubusercontent.com/acekyd/made-in-nigeria/main/README.MD'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  console.log('Fetch Complete');

  const markdownData = await response.text();
  const converter = mdConverter();

  const html = converter.makeHtml(markdownData);
  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');

  const liTextArray = Array.from(document.querySelectorAll('li')).map(
    (li) => li.innerHTML
  );

  const parsedRepos: ScrapedRepository[] = convertToJSON(liTextArray);
  const repos: DBRepository[] = await fetchDataFromGithub(parsedRepos);

  console.log('Saving to Neon Database...');

  for (const repo of repos) {
    console.log(`Saving ${repo.name} to Neon Database...`);
    await sql`
      INSERT INTO repository (
        name,
        link,
        description,
        author,
        author_link,
        author_avatar,
        stars,
        topics,
        license,
        forks,
        open_issues_count,
        archived,
        disabled,
        original_created_at,
        original_updated_at,
        author_madeinnigeria,
        author_link_madeinnigeria
      ) VALUES (
        ${repo.name},
        ${repo.link},
        ${repo.description},
        ${repo.author},
        ${repo.author_link},
        ${repo.author_avatar},
        ${repo.stars || 0},
        ${repo.topics},
        ${repo.license},
        ${repo.forks || 0},
        ${repo.open_issues_count || 0},
        ${repo.archived},
        ${repo.disabled},
        ${repo.original_created_at},
        ${repo.original_updated_at},
        ${repo.author_madeinnigeria},
        ${repo.author_link_madeinnigeria}
      )
      ON CONFLICT (link) DO UPDATE
      SET
        stars = EXCLUDED.stars,
        author_madeinnigeria = EXCLUDED.author_madeinnigeria,
        author_link_madeinnigeria = EXCLUDED.author_link_madeinnigeria,
        forks = EXCLUDED.forks,
        open_issues_count = EXCLUDED.open_issues_count,
        original_updated_at = EXCLUDED.original_updated_at,
        archived = EXCLUDED.archived,
        disabled = EXCLUDED.disabled;
    `;

    await sleep(SLEEP_TIME);
  }

  console.log('Data saved to Neon.');
};
