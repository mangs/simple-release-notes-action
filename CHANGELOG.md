# Changelog

## 3.0.2

- Return non-zero response code when an error occurs so dependent workflows will correctly fail
- Rename action source directory from `scripts/` to `src/`

## 3.0.1

- Add pull request template

## 3.0.0

- Latest major tag now automatically updated to the latest commit SHA when new release is published
- Update action to Node.js version 20
- `POST` requests now done with `fetch()`
- Linting now uses `@babbel/eslint-config`
- Due to download reliability problems, NPM scripts `list:todo-comments` and `list:eslint:disable-directives` use a local version of Ripgrep instead of one downloaded from NPM
- Update dependencies to latest

## 2.1.4

- Update dependencies to latest

## 2.1.3

- Readme update wherein the usage example uses `v2` instead of `v1`

## 2.1.2

- Updated workflows to use operating system `ubuntu-22.04` and Node.js version `16.17.0`
- Updated the [`packageManager` field of `package.json`](https://nodejs.org/dist/latest-v16.x/docs/api/all.html#all_packages_packagemanager) to enforce the use of NPM version `8.15.0` for environments with [Corepack](https://nodejs.org/dist/latest-v16.x/docs/api/corepack.html) enabled
- Added `validate:linting:eslint` NPM script check to the pull request CI workflow to ensure no conflicts between ESLint and Prettier
- Update dependencies to latest

## 2.1.1

- Update dependencies to latest
- Update GitHub Action workflow files to use Node.js version `16.15.1`

## 2.1.0

- For release note titles, replace link markup with just the link's user-visible text

## 2.0.0

- Support SemVer patch version matching of non-numeric characters following [SemVer formatting rules](https://semver.org/#semantic-versioning-specification-semver) (e.g. `1.2.3-alpha.7+secret-release`)
- Remove the `version_matcher` action input because [the regex added for the above change](https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string) makes it redundant
- [Added](./package.json#L21) the experimental `packageManager` field to `package.json` to follow the developing [Corepack](https://nodejs.org/api/corepack.html) Node.js standard for package managers
- `marked` vendor library version stayed the same but was updated using esm.sh version 85

## 1.1.4

- Readme clarification
- Update dependencies to latest

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
- Update dependencies to latest

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
