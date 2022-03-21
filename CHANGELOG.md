# Changelog

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
