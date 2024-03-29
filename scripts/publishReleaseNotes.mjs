#!/usr/bin/env node

// External Imports
import { readFile } from 'node:fs/promises';

// Internal Imports
import { marked } from '../vendor/marked-v12.0.1.vendor.mjs';
import major from '../vendor/semver-v7.6.0-functions-major.vendor.mjs';

// Local Variables
const changelogPath = process.env.INPUT_CHANGELOG_PATH ?? './CHANGELOG.md';
const githubToken = process.env.INPUT_GITHUB_TOKEN;
const packageJsonPath = process.env.INPUT_PACKAGEJSON_PATH ?? './package.json';
const shouldUpdateMajorTag = process.env.INPUT_MAJOR_TAG_AUTO_UPDATE ?? true;
const tagOverride = process.env.INPUT_TAG_OVERRIDE;
const tagPrefix = process.env.INPUT_TAG_PREFIX ?? 'v';
const urlRegex = /\[(?<linkText>[^\]]*)\]\([^)]+\)/g; // eslint-disable-line unicorn/better-regex -- stuck in a lint error loop, this is as good as it can get
const versionMatchRegex =
  // eslint-disable-next-line regexp/no-unused-capturing-group -- having version number parts broken out may be useful in the future
  /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*))?(?:\+([\da-z-]+(?:\.[\da-z-]+)*))?/i;

// Local Functions
function prettyPrintJson(json) {
  const prettyString = JSON.stringify(json, undefined, 2);
  console.log(prettyString);
}

// BEGIN EXECUTION
// Get the target version from package.json
const packageJsonContents = await readFile(packageJsonPath, 'utf8');
const { version: targetVersion } = JSON.parse(packageJsonContents);

// Read the changelog contents, then parse it into tokens
const changelogContents = await readFile(changelogPath, 'utf8');
const markdownTokens = marked.lexer(changelogContents);

// Store the markdown nodes between the matched, target version number heading and the following heading at the same depth
let isCapturing = false;
let targetNodeDepth = 0;
let versionMatchHeadingText = '';
const tokensForOutput = [];
for (const token of markdownTokens) {
  if (isCapturing) {
    if (token.type === 'heading' && token.depth === targetNodeDepth) {
      // We've reached the next version number, so we can stop collecting tokens
      break;
    }
    tokensForOutput.push(token);
  } else if (
    token.type === 'heading' &&
    versionMatchRegex.exec(token.text)?.[0] === targetVersion
  ) {
    isCapturing = true;
    targetNodeDepth = token.depth;
    versionMatchHeadingText = token.text.trim().replaceAll(urlRegex, (...a) => a[4].linkText);
  }
}
if (!isCapturing) {
  throw new Error(
    `No match for version "${targetVersion}" found in changelog file "${changelogPath}"`,
  );
}

// Store the tokens' combined markdown
const combinedMarkdown = tokensForOutput
  .map((token) => token.raw)
  .join('')
  .trim();

// Prepare metadata
const repositoryMetadata = process.env.GITHUB_REPOSITORY.split('/');
const [repoOwner, repoName] = repositoryMetadata;
const tagName = tagOverride || `${tagPrefix}${targetVersion}`;
const commitHash = process.env.GITHUB_SHA;
// const isDraft = false;
// const isPrerelease = false;

if (process.env.CI !== 'true') {
  // eslint-disable-next-line n/no-process-exit -- don't make any requests to GitHub when doing local testing
  process.exit();
}

// Create a GitHub release
try {
  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`, {
    body: JSON.stringify({
      body: combinedMarkdown,
      // draft: isDraft,
      name: versionMatchHeadingText,
      owner: repoOwner,
      // prerelease: isPrerelease,
      repo: repoName,
      tag_name: tagName,
      target_commitish: commitHash,
    }),
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  if (response.ok) {
    console.log(`✅ SUCCESS CREATING RELEASE: ${tagName}`);
  } else {
    console.error(`❌ ERROR CREATING RELEASE: ${tagName}`);
  }
  prettyPrintJson(await response.json());
} catch (error) {
  console.error('❌❌❌ UNEXPECTED RELEASE ERROR');
  throw error;
}

// Update the latest major tag version to the latest commit SHA
if (!shouldUpdateMajorTag) {
  // eslint-disable-next-line n/no-process-exit -- don't continue because remaining functionality has been disabled
  process.exit(0);
}
try {
  const majorTag = tagOverride ? tagOverride.split('.')[0] : `${tagPrefix}${major(tagName)}`;
  const ref = `refs/tags/${majorTag}`; // eslint-disable-line unicorn/prevent-abbreviations -- required name
  const tagData = {
    owner: repoOwner,
    ref,
    repo: repoName,
    sha: process.env.GITHUB_SHA,
  };

  const updateResponse = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/git/${ref}`,
    {
      body: JSON.stringify({ ...tagData, force: true }),
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    },
  );

  if (updateResponse.ok) {
    console.log(`✅ SUCCESS UPDATING MAJOR TAG: ${majorTag}`);
    prettyPrintJson(await updateResponse.json());
  } else {
    console.log(`🔨 CREATING MAJOR TAG: ${majorTag}`);
    const createResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`,
      {
        body: JSON.stringify({ ...tagData }),
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );
    if (createResponse.ok) {
      console.log(`✅ SUCCESS CREATING MAJOR TAG: ${majorTag}`);
    } else {
      console.error(`❌ ERROR CREATING MAJOR TAG: ${majorTag}`);
    }
    prettyPrintJson(await createResponse.json());
  }
} catch (error) {
  console.error('❌❌❌ UNEXPECTED TAG ERROR');
  throw error;
}
