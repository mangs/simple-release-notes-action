#!/usr/bin/env node

// External Imports
import { marked } from 'marked';
import { Octokit } from '@octokit/action';
import { readFile } from 'node:fs/promises';

// Local Variables
const tagPrefix = 'v';
const changelogPath = './CHANGELOG.md';

// Local Functions
async function main() {
  // Get the target version from package.json
  const packageJsonContents = await readFile('./package.json', 'utf8');
  const { version: targetVersion } = JSON.parse(packageJsonContents);

  // Read the changelog contents, then parse it into tokens
  const fileContents = await readFile(changelogPath, 'utf8');
  const tokens = marked.lexer(fileContents);

  // Store the markdown nodes between the matched, target version number heading and the following heading at the same depth
  let isCapturing = false;
  let targetNodeDepth = 0;
  const targetNodeType = 'heading';
  const tokensForOutput = [];
  for (const token of tokens) {
    if (isCapturing) {
      if (token.type === targetNodeType && token.depth === targetNodeDepth) {
        break;
      }
      tokensForOutput.push(token);
    } else if (token.type === 'heading' && token.text === targetVersion) {
      isCapturing = true;
      targetNodeDepth = token.depth;
    }
  }

  // Store the tokens' combined markdown
  const combinedMarkdown = tokensForOutput
    .map((token) => token.raw)
    .join('')
    .trim();
  console.log('RAW MARKDOWN');
  console.log(combinedMarkdown);

  // Collect environment metadata
  const repositoryMetadata = process.env.GITHUB_REPOSITORY.split('/');
  const [repoOwner, repoName] = repositoryMetadata;
  const tagName = `${tagPrefix}${targetVersion}`;
  const commitHash = process.env.GITHUB_SHA;
  // const isDraft = false;
  // const isPrerelease = false;
  console.log('GITHUB');
  console.log(`OWNER "${repoOwner}"`);
  console.log(`REPO "${repoName}"`);
  console.log(`TAG "${tagName}"`);
  console.log(`COMMIT HASH "${commitHash}"`);

  // Authenticate on Github, then create a release note
  if (process.env.LOCAL) {
    process.exit(); // Don't make any requests to GitHub when doing local testing
  }
  const octokit = new Octokit();
  await octokit.request(`POST /repos/${repoOwner}/${repoName}/releases`, {
    body: combinedMarkdown,
    // draft: isDraft,
    generate_release_notes: false,
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
