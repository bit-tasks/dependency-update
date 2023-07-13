# Bit Dependency Update for CI/CD Pipelines
Check for new updates of Bit components and create Pull Request with the updates.

# GitHub Actions

This CI Task, check for newer versions of Bit component dependencies in a workspace and create a Pull Request for any updates.

## Inputs

### `ws-dir`

**Optional** The workspace directory path from the root. Default `"Dir specified in Init Task or ./"`.

## Example usage

Define the `bit-tasks/pull-request@v1` action in your pipeline before using the Verify.

```yaml
name: Test Bit Dependency Update
on:
  pull_request:
    types:
      - opened
      - synchronize
permissions:
  pull-requests: write
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
