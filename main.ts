import { marked } from "marked";
import { parse } from "json2csv";
import * as cheerio from "cheerio";

// used write because fs is under a security vulnerability thingy according to npm
import write from "write";

const yourToken = '';

const GITHUB_API_BASE = "https://api.github.com/repos";
const GITHUB_HEADERS = {
  Accept: "application/vnd.github.preview+json",
  Authorization: `Bearer ${yourToken}`,
};

// Credit to @made-in-nigeria for most of the code here
// Source code for the fetching and parsing code can be found here https://github.com/acekyd/made-in-nigeria/blob/main/app/utils/projects.ts

const getData = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/acekyd/made-in-nigeria/main/README.MD"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const markdownData = await response.text();

  // step 2: convert Markdown to HTML
  const html = marked(markdownData);

  // step 3: load HTML into Cheerio
  const $ = cheerio.load(html);

  // step 4: extract <li> elements
  const liTextArray = $("li")
    .map((index, element) => $(element).html())
    .get();

  // step 5: convert to JSON
  const repositories = convertToJSON(liTextArray);

  // step 6: add watchers_count to each repository object
  const updatedRepositories = await addstars(repositories);

  // sort repositories by stars
  updatedRepositories.sort((a, b) => (b.stars || 0) - (a.stars || 0));

  // export sorted data to CSV
  exportToCSV(updatedRepositories);
  console.log("Data exported to 'repositories.csv'.");
};

function convertToJSON(repositories: string[]) {
  return repositories.map((repository) => {
    const $ = cheerio.load(repository);

    // Extract repository details
    const repoName = $("a").first().text();
    const repoLink = $("a").first().attr("href");

    const status = $("span").first().text();
    const isInactive = status?.includes("Inactive");
    const isArchived = status?.includes("Archived");

    let description = $("*").contents()[3]?.data || "";
    const repoDescription = description.replace(/^ - /, "");

    const repoAuthor = $("strong a").text();
    const repoAuthorLink = $("strong a").attr("href");

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

const addstars = async (repositories: any[]) => {
  const updatedRepositories = [];

  for (const repo of repositories) {
    try {
      // step 1: get username and repoName from the repoLink
      const match = repo.repoLink.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        updatedRepositories.push({ ...repo, stars: null });
        continue;
      }

      const username = match[1];
      const repoName = match[2];

      // step 2: get watchers_count from github API
      const apiResponse = await fetch(`${GITHUB_API_BASE}/${username}/${repoName}`, {
        headers: GITHUB_HEADERS,
      });

      if (!apiResponse.ok) {
        throw new Error(`Failed to fetch GitHub data for ${username}/${repoName}`);
      }

      const apiData = await apiResponse.json();
      const stars = apiData.watchers_count || 0;

      // step 3: add watchers_count to the repository object
      updatedRepositories.push({ ...repo, stars });
    } catch (error) {
      console.error(`Error processing repository ${repo.repoLink}:`, error);
      updatedRepositories.push({ ...repo, stars: null });
    }
  }

  return updatedRepositories;
};

// function to export data to CSV
const exportToCSV = async (repositories: any[]) => {
  const fields = [
    "repoName",
    "repoLink",
    "repoDescription",
    "repoAuthor",
    "repoAuthorLink",
    "stars",
    "isInactive",
    "isArchived",
  ];

  const opts = { fields };
  try {
    const csv = parse(repositories, opts);
    await write("repositories.csv", csv);
    console.log("CSV file created successfully.");
  } catch (err) {
    console.error("Error generating CSV:", err);
  }
};
