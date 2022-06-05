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

- When this action runs, the target version number is found in the `version` field in your `package.json`
- Your changelog must be structured into version number "sections" as follows (use [this repository's changelog](./CHANGELOG.md) as an example)
  - Version numbers must always be found at the same depth (e.g. always at `### <version>` or depth of 3)
  - Version number "section" ordering doesn't matter

```markdown
# <changelog title>

## <version number> (May 30, 2077)

<any markdown can go here>

## v<another version number> The Big Release

<any markdown can go here>

etc...
```

- A new GitHub release will be created automatically as follows:
  - Title will be the full text of the heading containing the target version number (a.k.a. the `version` field in your `package.json`)
  - Description will be the matched "section" of markdown
  - Tag will be either (1) the combination of the `tag_prefix` and target version number or (2) the `tag_override` value
- Use with a [Linux runner](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources) which is the default (this action was not tested with macOS or Windows runners, but it may function just fine)

## Action Inputs

| Name               | Required | Default Value                         | Descripition                                                                                                              |
| ------------------ | -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `changelog_path`   | N        | `"./CHANGELOG.md"`                    | Path to the target changelog file                                                                                         |
| `github_token`     | Y        | N/A                                   | GitHub authentication token used to authenticate on behalf of GitHub Actions                                              |
| `packagejson_path` | N        | `"./package.json"`                    | Path to the target `package.json` file                                                                                    |
| `tag_override`     | N        | `undefined`                           | String to enforce an exact tag version; overrides default behavior                                                        |
| `tag_prefix`       | N        | `"v"`                                 | Prefix to create a tag by combining this and the target version number; this is default behavior                          |
| `version_matcher`  | N        | `"^v?(?<version>\\d+\\.\\d+\\.\\d+)"` | String holding a regex to match the target version number in the changelog; the `version` named capture group is required |
