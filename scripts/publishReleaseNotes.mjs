#!/usr/bin/env node

// External Imports
import { marked } from 'marked';
import { Octokit } from '@octokit/action';
import { readFile } from 'node:fs/promises';

// Local Variables
const changelogPath = './CHANGELOG.md';
const packageJsonPath = './package.json';
const tagPrefix = 'v';

// Local Functions
async function main() {
  // Get the target version from package.json
  const packageJsonContents = await readFile(packageJsonPath, 'utf8');
  const { version: targetVersion } = JSON.parse(packageJsonContents);

  // Read the changelog contents, then parse it into tokens
  const fileContents = await readFile(changelogPath, 'utf8');
  const markdownTokens = marked.lexer(fileContents);

  // Store the markdown nodes between the matched, target version number heading and the following heading at the same depth
  let isCapturing = false;
  let targetNodeDepth = 0;
  const tokensForOutput = [];
  for (const token of markdownTokens) {
    if (isCapturing) {
      if (token.type === 'heading' && token.depth === targetNodeDepth) {
        break;
      }
      tokensForOutput.push(token);
    } else if (token.type === 'heading' && token.text === targetVersion) {
      isCapturing = true;
      targetNodeDepth = token.depth;
    }
  }
  if (!isCapturing) {
    console.log(
      `No match for version "${targetVersion}" found in changelog file "${changelogPath}"`,
    );
    process.exit(1);
  }

  // Store the tokens' combined markdown
  const combinedMarkdown = tokensForOutput
    .map((token) => token.raw)
    .join('')
    .trim();

  // Prepare metadata
  const repositoryMetadata = process.env.GITHUB_REPOSITORY.split('/');
  const [repoOwner, repoName] = repositoryMetadata;
  const tagName = `${tagPrefix}${targetVersion}`;
  const commitHash = process.env.GITHUB_SHA;
  // const isDraft = false;
  // const isPrerelease = false;

  // Authenticate on Github, then create a release note
  if (process.env.CI !== 'true') {
    process.exit(); // Don't make any requests to GitHub when doing local testing
  }
  const octokit = new Octokit();
  await octokit.request(`POST /repos/${repoOwner}/${repoName}/releases`, {
    body: combinedMarkdown,
    // draft: isDraft,
    name: targetVersion,
    owner: repoOwner,
    // prerelease: isPrerelease,
    repo: repoName,
    tag_name: tagName,
    target_commitish: commitHash,
  });
}

// Begin Execution
main();
