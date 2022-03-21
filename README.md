# Simple Release Notes Action

GitHub Action that auto-publishes release notes using a very simple-to-follow set of rules

## Rules for Use

As its name implies, this action is intended to be easy to use. Here are the rules to follow for using this action:

- When this action runs, it uses the `version` field in your `package.json` to find the relevant "section" in your changelog; this is the target version number
- Your changelog file is structured into version number "sections" as follows, "section" order does not matter (use [this repository's changelog](./CHANGELOG.md) as an example):

```markdown
# <changelog title>

## <version number>

<any markdown can go here>

## <another version number>

<any markdown can go here>

etc...
```

- A new release will be created automatically as follows:
  - Title will be the target version number (a.k.a the `version` field in your `package.json`)
  - Description will be the matched "section" of markdown
  - Tag will be the concatenation of the tag prefix and the target version number, in that order
- Use in a Linux environment; this is the default (this action was not tested with [macOS or Windows runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources), but it may function just fine)

## Action Inputs

| Name               | Required | Default Value    | Descripition                                                                                                                |
| ------------------ | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `changelog_path`   | N        | `./CHANGELOG.md` | Path to the target changelog file                                                                                           |
| `packagejson_path` | N        | `./package.json` | Path to the target `package.json` file                                                                                      |
| `tag_prefix`       | N        | `v`              | Prefix used to create the tag - the concatenation of the tag prefix and the version number from package.json, in that order |
