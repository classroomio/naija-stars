import { neon } from '@neon/serverless';
import { mdConverter } from '@ptm/mm-mark';
import { DOMParser } from '@b-fuze/deno-dom';

export interface Repository {
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

const yourToken = Deno.env.get('GITHUB_TOKEN')!;
const GITHUB_API_BASE = 'https://api.github.com/repos';
const GITHUB_HEADERS = {
  Accept: 'application/vnd.github.preview+json',
  Authorization: `Bearer ${yourToken}`,
};


export const getData = async () => {
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

  const parsedRepos: Repository[] = convertToJSON(liTextArray);
  const updatedRepositories = await addStars(parsedRepos);

  updatedRepositories.sort((a, b) => (b.stars || 0) - (a.stars || 0));

  console.log('Saving to Neon Database...');

  for (const repo of updatedRepositories) {
    await sql`
      INSERT INTO repositories (
        repo_name,
        repo_link,
        repo_description,
        repo_author,
        repo_author_link,
        is_inactive,
        is_archived,
        stars
      ) VALUES (
        ${repo.repoName},
        ${repo.repoLink},
        ${repo.repoDescription},
        ${repo.repoAuthor},
        ${repo.repoAuthorLink},
        ${repo.isInactive},
        ${repo.isArchived},
        ${repo.stars || 0}
      )
      ON CONFLICT (repo_link) DO UPDATE
      SET
        stars = EXCLUDED.stars,
        is_inactive = EXCLUDED.is_inactive,
        is_archived = EXCLUDED.is_archived;
    `;
  }

  console.log('Data saved to Neon.');
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