#!/usr/bin/env node

// External Imports
import { readFile } from 'node:fs/promises';
import { request } from 'node:https';

// Internal Imports
import { marked } from '../vendor/marked-4.0.12.vendor.mjs';
// import { Octokit } from '../vendor/octokit-action-3.18.0.vendor.mjs';

// Local Variables
const changelogPath = process.env.INPUT_CHANGELOG_PATH ?? './CHANGELOG.md';
const githubToken = process.env.INPUT_GITHUB_TOKEN;
const packageJsonPath = process.env.INPUT_PACKAGEJSON_PATH ?? './package.json';
const tagPrefix = process.env.INPUT_TAG_PREFIX ?? 'v';

// Local Functions
// Slight tweaks from this original implementation: https://stackoverflow.com/a/50891354
function httpsPost({ body, ...options }) {
  return new Promise((resolve, reject) => {
    const postRequest = request(
      {
        method: 'POST',
        ...options,
      },
      (response) => {
        const chunks = [];
        response.on('data', (data) => chunks.push(data));
        response.on('end', () => {
          let responseBody = Buffer.concat(chunks);
          if (response.headers['content-type'] === 'application/json') {
            responseBody = JSON.parse(responseBody);
          }
          if (response.statusCode > 399) {
            const error = new RangeError(`[STATUS CODE ${response.statusCode}] ${responseBody}`);
            reject(error);
          }
          resolve(responseBody);
        });
      },
    );
    postRequest.on('error', reject);
    if (body) {
      postRequest.write(body);
    }
    postRequest.end();
  });
}

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
  // const octokit = new Octokit();
  // await octokit.request(`POST /repos/${repoOwner}/${repoName}/releases`, {
  //   body: combinedMarkdown,
  //   // draft: isDraft,
  //   name: targetVersion,
  //   owner: repoOwner,
  //   // prerelease: isPrerelease,
  //   repo: repoName,
  //   tag_name: tagName,
  //   target_commitish: commitHash,
  // });

  const postData = JSON.stringify({
    body: combinedMarkdown,
    // draft: isDraft,
    name: targetVersion,
    owner: repoOwner,
    // prerelease: isPrerelease,
    repo: repoName,
    tag_name: tagName,
    target_commitish: commitHash,
  });
  const requestOptions = {
    body: postData,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${githubToken}`,
      // 'Content-Length': postData.length,
      'Content-Type': 'application/json',
      'User-Agent': repositoryMetadata,
    },
    hostname: 'api.github.com',
    // method: 'POST',
    path: `/repos/${repoOwner}/${repoName}/releases`,
  };
  // const postRequest = request(requestOptions, (response) => {
  //   console.log(response.mess);
  // });
  // postRequest.write(postData);
  // postRequest.end();

  const response = await httpsPost(requestOptions);
  console.log(`RESPONSE FROM GITHUB API:\n${response}`);
}

// Begin Execution
main();
