# Bit Dependency Update for CI/CD Pipelines

This task generates a pull request to update dependencies, Bit components, and environments used by the Bit workspace in your Git repository. It streamlines the process of keeping your Bit workspace up to date through scheduled jobs, manual runs, or component release events on the Bit platform.

This task allows you to modify and update components using Cloud Workspaces and Hope AI on the Bit Platform, while ensuring your repository stays synchronized with these changes.

## Types of dependency updates

1. **External Dependencies**: Updates packages and Bit components that are not maintained in the workspace but are used by the workspace components.
2. **Workspace Components**: Updates Bit components that are maintained in the workspace, including changes to their source files, dependencies, and configurations.
3. **Environments (envs)**: Updates reusable development environments used by workspace components.

## Inputs

### `ws-dir`

**Optional** The workspace directory path from the root. Default `"Dir specified in Init Task or ./"`.

### `allow`

**Optional** Allow different types of dependency updates. You can select multiple options, seperated by commas. For example: `'external-dependencies, envs'`.

**Default**: `'all'`

Options:

- `external-dependencies`: Only update the versions of Bit components and packages _installed_ in your workspace. See the `version-update-policy` input to learn how to restrict updates using Semver rules. 
- `workspace-components`: Only update Bit components that are maintained in your workspace (`bit checkout head --all`).
- `envs`: Only update the version of envs ('reusable development environments') used by Bit components maintained in your workspace.
- `all`: Allow for updates of all types.

### `version-update-policy`

**Optional** Defines the version update policy (semver, minor, patch). Used in combination with the `allow` input to restrict the version updates of **external dependencies**.

**Default** `''`. No restrictions on version updates. Update to the latest available version.

Options:

- `semver` - Only update to newer versions that satisfy the semver policy (as it is defined in the `workspace.jsonc`, or other sources).
- `minor` - Only update to newer minor versions.
- `patch` - Only update to newer patch versions.

### `branch`

**Optional** Branch to check for dependency updates. Default `main`.

### `package-patterns`

**Optional** A string list of package names or patterns, separated by spaces or commas. For example: `'@babel/runtime,@types/**'`. Patterns should be in glob format. Default: All packages are selected.

### `component-patterns`

**Optional** A string list of component names or patterns, separated by spaces or commas. For example: `'@teambit/**,@my-org/ui/**'`. Patterns should be in glob format. Default: All components are selected.

### `env-patterns`

**Optional** A string list of environment names or patterns, separated by spaces or commas. For example: `'@teambit/envs/**,@bitdev/envs/**'`. Patterns should be in glob format. Default: All environments are selected.

## Example usage

**Note:** Use `bit-task/init@v1` as a prior step in your action before running `bit-tasks/dependency-update@v1`. You also need to [allow GitHub Actions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#preventing-github-actions-from-creating-or-approving-pull-requests) to create pull requests.

```yaml
name: Bit Dependency Update
on:
  schedule:
    - cron: '0 0 * * *'
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
      BIT_CLOUD_ACCESS_TOKEN: ${{ secrets.BIT_CLOUD_ACCESS_TOKEN }}
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
          version-update-policy: 'semver'
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
