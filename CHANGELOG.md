# Changelog

## 1.1.0

- Added new action inputs
  - Optional input `tag_override`: a string to enforce an exact tag version; overrides default behavior
  - Optional input `version_matcher`: a string holding a regex to match the target version number
- Updated readme with new inputs and to provide some more clarity
- Updated workflow files
  - Replace `mangs/dependency-super-cache-action@v2` with `mangs/super-cache-action@v3`
  - Replace `npm run publish:release-notes` with `uses: ./`
- Manually updated `marked` vendor dependency from version `4.0.12` to `4.0.16`
- Update dependencies

## 1.0.12

- Changed from `mangs/node-modules-super-cache-action` to renamed `mangs/dependency-super-cache-action` caching action

## 1.0.11

- Use `mangs/node-modules-super-cache-action` to simplify workflow `node_modules` caching
- Update `name` field of `.github/workflows/publishReleaseNotesWorkflow.yml` to `Publish Release Notes Workflow`

## 1.0.10

- Updated GitHub Action workflows
  - `actions/cache` updated from `v2` to `v3`
  - `actions/checkout` updated from `v2` to `v3`

## 1.0.9

- Add missing NPM scripts:
  - `format:code:yaml`
  - `validate:formatting:yaml`

## 1.0.8

- Change `.github/CODEOWNERS` file to be a symlink to `config/github/codeOwners` as originally intended

## 1.0.7

- Tweaked keyword in `package.json`
- Updated dependencies

## 1.0.6

- Fix parse error when error response codes are returned

## 1.0.5

- Pretty-print the API responses from GitHub

## 1.0.4

- Convert `action.yml` from a composite to a JavaScript action
- Replaced NPM dependency `marked` with bundled version in `vendor/` to enable the switch away from a composite action and for faster action execution
- Replaced Octokit-driven API request with Node.js-native `node:https` one
- Added ignore config files for Prettier and ESLint

## 1.0.3

- Add missing `shell` reference for the `publish:release-notes` step of `action.yml`

## 1.0.2

- Removed invalid reference in `action.yml`

## 1.0.1

- Updating the action name to `mangs/simple-release-notes-action`

## 1.0.0

- First version of this action
