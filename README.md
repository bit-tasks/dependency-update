# Bit Dependency Update for CI/CD Pipelines
Check for new updates of Bit components and create Pull Request with the updates.

# GitHub Actions

This task checks for newer versions of Bit component dependencies in a workspace and creates a Pull Request for any updates.

## Inputs

### `ws-dir`

**Optional** The workspace directory path from the root. Default `"Dir specified in Init Task or ./"`.

### `allow`

**Optional** Allow different types of dependencies. Options `all`, `external-dependencies`, `workspace-components`, `envs`. You can also use a combination of one or two values, e.g. `external-dependencies, workspace-components`. Default `"all"`.

### `branch`

**Optional** Branch to check for dependency updates. Default `main`.

## Example usage

**Note:** Use `bit-task/init@v1` as a prior step in your action before running `bit-tasks/dependency-update@v1`. You also need to [allow GitHub Actions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#preventing-github-actions-from-creating-or-approving-pull-requests) to create pull requests.

```yaml
name: Test Bit Dependency Update
on:
  workflow_dispatch:
permissions:
  pull-requests: write
  contents: write
jobs:
  check-for-updates:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      GIT_USER_NAME: ${{ secrets.GIT_USER_NAME }}
      GIT_USER_EMAIL: ${{ secrets.GIT_USER_EMAIL }}
      BIT_CLOUD_ACCESS_TOKEN: ${{ secrets.BIT_CLOUD_ACCESS_TOKEN }} # Either BIT_CLOUD_ACCESS_TOKEN or BIT_CONFIG_USER_TOKEN is needed. Not both.
      BIT_CONFIG_USER_TOKEN: ${{ secrets.BIT_CONFIG_USER_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Initialize Bit
        uses: bit-tasks/init@v1
        with:
          ws-dir: '<WORKSPACE_DIR_PATH>'
      - name: Bit Dependency Update
        uses: bit-tasks/dependency-update@v1
          branch: 'main'
          allow: 'all'
```

**Note:** To do that, go to your GitHub Organization settings and grant permission. You may also need to allow it at the repository level if it's already disabled.

```
Settings -> Actions -> General -> Workflow permissions -> Allow GitHub Actions to create and approve pull requests
```

# Contributor Guide

Steps to create custom tasks in different CI/CD platforms.

## GitHub Actions

Go to the GithHub action task directory and build using NCC compiler. For example;

```
npm install
npm run build
git commit -m "Update task"
git tag -a -m "action release" v1 --force
git push --follow-tags
```

For more information, refer to [Create a javascript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
