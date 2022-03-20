// External Imports
import { marked } from 'marked';
import { readFile } from 'node:fs/promises';

// Local Functions
async function main() {
  const targetVersion = '3.1.0';
  const fileContents = await readFile('./CHANGELOG.md', 'utf8');
  const tokens = marked.lexer(fileContents);

  // Store the markdown nodes between the matched, target version number heading and the following heading at the same depth
  let isCapturing = false;
  let targetNodeDepth = 0;
  const targetNodeType = 'heading'; // TODO: make this configurable
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

  // Compile the raw markdown output
  const rawCombinedMarkdown = tokensForOutput.map((token) => token.raw).join('');
  // console.log('NODES', tokensForOutput);
  console.log('RAW', rawCombinedMarkdown);
}

// Begin Execution
main();
