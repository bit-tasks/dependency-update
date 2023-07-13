# Bit Dependency Update for CI/CD Pipelines
Check for new updates of Bit components and create Pull Request with the updates.

# GitHub Actions

This CI Task, check for newer versions of Bit component dependencies in a workspace and create a Pull Request for any updates.

## Inputs

### `ws-dir`

**Optional** The workspace directory path from the root. Default `"Dir specified in Init Task or ./"`.

### `branch`

**Optional** Branch to check for dependency update. Default `main`.

### `git-user-name`

**Required** Github user name to commit back .bitmap file to the repository.

### `git-user-email`

**Required** Github user email to commit back .bitmap file to the repository.

## Example usage

Define the `bit-tasks/init@v1` action in your pipeline before using the Dependency Update.

```yaml
name: Test Bit Dependency Update
on:
  workflow_dispatch:
permissions:
  pull-requests: write
  contents: write
jobs:
  release:
    runs-on: ubuntu-latest
    env:
      BIT_TOKEN: ${{ secrets.BIT_TOKEN }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Initialize Bit
        uses: bit-tasks/init@v1
        with:
          ws-dir: '<WORKSPACE_DIR_PATH>'
      - name: Bit Dependency Update
        uses: bit-tasks/dependency-update@v1
          git-user-name: '<GIT_USER_NAME>'
          git-user-email: '<GIT_USER_EMAIL>'
          branch: 'main'
```

**Note:** Need to grant permission for the GitHub Action to Create Pull Requests. 
To do that view in your GitHub Organization and grant permission. You may also need to allow at Repository level as well, if its already disabled.

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

For more information refer [Create a javascript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)

## GitLab CI/CD

For more information refer [Specify a custom CI/CD file](https://docs.gitlab.com/ee/ci/pipelines/settings.html#specify-a-custom-cicd-configuration-file)

## Azure DevOps

For more information refer [Add build task](https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops)
