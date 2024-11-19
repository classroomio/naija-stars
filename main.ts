// deno-lint-ignore-file no-explicit-any
import { mdConverter } from '@ptm/mm-mark';
import { DOMParser } from '@b-fuze/deno-dom';

// adding your token increases the number of requests you can make
const yourToken = '';

const GITHUB_API_BASE = 'https://api.github.com/repos';
const GITHUB_HEADERS = {
  Accept: 'application/vnd.github.preview+json',
  Authorization: `Bearer ${yourToken}`,
};

// Credit to @made-in-nigeria for most of the code here
// Source code for the fetching and parsing code can be found here https://github.com/acekyd/made-in-nigeria/blob/main/app/utils/projects.ts

const getData = async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/acekyd/made-in-nigeria/main/README.MD'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const markdownData = await response.text();
  const converter = mdConverter(/*{Showdown Options} */);

  // step 2: convert Markdown to HTML
  const html = converter.makeHtml(markdownData);

  // step 4: extract <li> elements
  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');

  // step 4: Extract <li> elements and store them in an array
  const liTextArray = Array.from(document.querySelectorAll('li')).map(
    (li) => li.innerHTML
  );

  // step 5: convert to JSON
  const parsedRepos = convertToJSON(liTextArray);

  // step 6: add stars to each repository object
  const updatedRepositories = await addstars(parsedRepos);

  // step 7: sort repositories by stars
  updatedRepositories.sort((a, b) => (b.stars || 0) - (a.stars || 0));

  // step 8: convert sorted repositories to CSV string
  const finalOutput = convertToCSV(updatedRepositories);

  // step 9: save CSV file
  const filePath = './repositories.csv';
  await Deno.writeTextFile(filePath, finalOutput);
  console.log(`CSV file saved at ${filePath}`);
};

const addstars = async (repositories: any[]) => {
  const updatedRepositories = [];

  for (const repo of repositories) {
    try {
      // Step 1: get username and repoName from the repoLink
      const match = repo.repoLink.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        updatedRepositories.push({ ...repo, stars: null });
        continue;
      }

      const username = match[1];
      const repoName = match[2];

      // Step 2: get watchers_count from github API
      const apiResponse = await fetch(
        `${GITHUB_API_BASE}/${username}/${repoName}`,
        {
          headers: GITHUB_HEADERS,
        }
      );

      const apiData = await apiResponse.json();
      const stars = apiData.watchers_count || 0;

      // Step 3: add watchers_count to the repository object
      updatedRepositories.push({ ...repo, stars });
    } catch (error) {
      console.error(`Error processing repository ${repo.repoLink}:`, error);
      updatedRepositories.push({ ...repo, stars: null });
    }
  }

  // Convert the updated repositories into a CSV string format
  // const csvString = convertToCSVString(updatedRepositories);
  return updatedRepositories;
};


function convertToJSON(repositories: string[]) {
  return repositories.map((repository) => {
    // Create a new DOMParser instance
    const parser = new DOMParser();

    // Parse the HTML string into a DOM object
    const doc = parser.parseFromString(repository, 'text/html');

    // Extract repository details
    const repoName = doc.querySelector('a')?.textContent?.trim() || '';
    const repoLink = doc.querySelector('a')?.getAttribute('href') || '';

    const status = doc.querySelector('span')?.textContent || '';
    const isInactive = status.includes('Inactive');
    const isArchived = status.includes('Archived');

    // Extract the description
    const repoDescription = Array.from(doc.body.childNodes)
      .filter(
        (node) =>
          node.nodeType === node.TEXT_NODE && node.textContent?.trim().length
      )
      .map((node) => node.textContent?.trim())
      .join(' ') // Join all text nodes into a single string
      .split('-') // Split the string by dashes
      .slice(1) // Remove the first part before the first dash
      .join('-') // Rejoin the split parts with dashes
      .split('@')[0] // Take the part before the "@" symbol
      .trim(); // Trim any extra spaces

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
    };
  });
}

function convertToCSV(array: any) {
  // Get the headers from the object keys
  const headers = Object.keys(array[0]);

  // Map the data to an array of strings, where each element is a row in CSV
  const rows = array.map((obj) => {
    return headers.map((header) => JSON.stringify(obj[header] || '')).join(',');
  });

  // Combine the headers and rows to form the final CSV string
  return [headers.join(','), ...rows].join('\n');
}

getData();