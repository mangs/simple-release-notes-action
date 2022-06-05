# Changelog

## 2.0.0

- Support SemVer patch version matching of non-numeric characters following [SemVer formatting rules](https://semver.org/#semantic-versioning-specification-semver) (e.g. `1.2.3-alpha.7+secret-release`)
- Remove the `version_matcher` action input because the new, internal regex added for the above change makes it redundant
- Added the experimental `packageManager` field to `package.json` to follow the developing [Corepack](https://nodejs.org/api/corepack.html) Node.js standard for package managers

## 1.1.4

- Readme clarification
- Update dependencies

## 1.1.3

- Properly handle the default case where `tag_override` is an empty string

## 1.1.2

- Correctly pass GitHub auth token to this action so it can publish

## 1.1.1

- Fix inability to match target version number

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
