# Changelog

## 1.0.4

- Convert `action.yml` from a composite to a JavaScript action
- Replaced NPM dependencies needing installation with respecitive, bundled vendor files for each package in `vendor/`
- Added ignore config files for Prettier and ESLint
- Replaced Octokit-driven API requests with Node.js-native `node:https` ones

## 1.0.3

- Add missing `shell` reference for the `publish:release-notes` step of `action.yml`

## 1.0.2

- Removed invalid reference in `action.yml`

## 1.0.1

- Updating the action name to `mangs/simple-release-notes-action`

## 1.0.0

- First version of this action
