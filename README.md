# Bit Dependency Update for CI/CD Pipelines

This task simplifies the process of keeping dependencies in a Bit workspace up to date. It can be triggered manually, by a scheduled job, or in response to component release events on the Bit platform.

Once triggered, the task automatically generates a pull request with the updated dependencies, allowing the team to review and merge the changes.

## Types of dependency updates

1. **External Dependencies**: Updates packages and Bit components that are not maintained in the workspace but are used by the workspace components (refer to the `version-update-policy` input for more details).
2. **Workspace Components**: Updates Bit components that are maintained within the workspace, including changes to their source files, dependencies, and configurations.
3. **Environments (envs)**: Updates reusable development environments used by workspace components.

## Inputs

### `ws-dir`

**Optional** The workspace directory path from the root. Default `"Dir specified in Init Task or ./"`.

### `allow`

**Optional** Allow different types of dependencies. Options `all`, `external-dependencies`, `workspace-components`, `envs`. You can also use a combination of one or two values, e.g. `external-dependencies, workspace-components`. Default `"all"`.

### `version-update-policy`

**Optional** Defines the version update policy (semver, minor, patch). Used in combination with the `allow` input to restrict the version updates of **external dependencies**.

**Default** `''`. No restrictions on version updates. Update to the latest available version.

Options:

- `semver` - Only update to newer versions that satisfy the semver policy (as it is defined in the `workspace.jsonc`, or other sources).
- `minor` - Only update to newer minor versions.
- `patch` - Only update to newer patch versions.

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
