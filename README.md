# `mangs/simple-release-notes-action`

GitHub Action that auto-publishes release notes using a very simple-to-follow set of rules

## Example Use

```yaml
- uses: mangs/simple-release-notes-action@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Rules for Use

As its name implies, this action is intended to be easy to use. Here are the rules to follow for using this action:

- When this action runs
  - The target version number is found in the `version` field in your `package.json`
  - The target "section" of your changelog is the one immediately following the heading containing your target version number; this "section" contains the version's release notes
- Your changelog must be structured into version number "sections" as follows (use [this repository's changelog](./CHANGELOG.md) as an example)
  - Version numbers must always be found at the same depth (e.g. always at `### <version>` or depth of 3)
  - Version number ordering doesn't matter

```markdown
# <changelog title>

## <version number> (May 30, 2077)

<any markdown can go here>

## v<another version number> The Big Release

<any markdown can go here>

etc...
```

- A new release will be created automatically as follows:
  - Title will be the target version number (a.k.a. the `version` field in your `package.json`)
  - Description will be the matched "section" of markdown
  - Tag will be the concatenation of the tag prefix and the target version number, in that order
- Use in a Linux environment; this is the default (this action was not tested with [macOS or Windows runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources), but it may function just fine)

## Action Inputs

| Name               | Required | Default Value                         | Descripition                                                                                                  |
| ------------------ | -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `changelog_path`   | N        | `"./CHANGELOG.md"`                    | Path to the target changelog file                                                                             |
| `github_token`     | Y        | N/A                                   | GitHub authentication token used to authenticate on behalf of GitHub Actions                                  |
| `packagejson_path` | N        | `"./package.json"`                    | Path to the target `package.json` file                                                                        |
| `tag_override`     | N        | `undefined`                           | String to enforce an exact tag version; overrides default behavior                                            |
| `tag_prefix`       | N        | `"v"`                                 | Prefix to create a tag by combining this and the target version from `package.json`; this is default behavior |
| `version_matcher`  | N        | `"^v?(?<version>\\d+\\.\\d+\\.\\d+)"` | String holding a regex to match the target version number; the `version` named capture group is required      |
