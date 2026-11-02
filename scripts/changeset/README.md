# Changeset Scripts

This directory contains scripts for managing releases with changesets, adapted from [fuels-ts](https://github.com/FuelLabs/fuels-ts) for the fuels-wallet project.

## Available Scripts

### `changeset:get-latest-release`
```bash
pnpm changeset:get-latest-release
```
Fetches the latest release tag from GitHub. Used in CI workflows to determine version comparisons.

### `changeset:update-changelog`
```bash
pnpm changeset:update-changelog
```
Updates changelog content for both:
- **Changeset PRs**: Generates rich changelog preview with PR links and contributor information
- **Published releases**: Updates GitHub release descriptions with formatted content

Environment variables:
- `PUBLISHED`: "true" for releases, "false" for PR updates
- `GITHUB_TOKEN`: Required for GitHub API access
- `RELEASE_TAG`: Required when `PUBLISHED=true`
- `REF_NAME`: Branch name (usually "master")
- `LATEST_RELEASE`: Previous latest release tag
- `RELEASE_VERSION_HIGHER_THAN_LATEST`: "true" if this is a newer version

### `changeset:version-with-docs`
```bash
pnpm changeset:version-with-docs
```
Enhanced version of `changeset version` that:
- Runs the standard changeset version command
- Automatically commits any generated changes
- Can be extended to rebuild documentation or other version-dependent files

### `changeset:publish`
```bash
pnpm changeset:publish <TAG_NAME> <REF_NAME>
```
Custom publish script that:
- Publishes packages with appropriate NPM tags (`next` for master, `patch` for release branches)
- Handles git tagging after successful publication
- Ensures GitHub releases are tied to the correct commit

### `changeset:next`
```bash
pnpm changeset:next
```
Prepares packages for pre-release publishing:
- Temporarily makes private packages public
- Updates changeset configuration
- Generates a universal patch changeset for all packages
- Useful for creating preview releases

### `get-full-changelog.mts`
Core module that generates rich changelog content by:
- Extracting PR information from changeset commits
- Categorizing changes by type (feat/fix/chore/docs/ci)
- Generating structured release descriptions with contributor attribution
- Supporting breaking changes and migration notes

## Workflow Integration

These scripts are used in the GitHub Actions workflows:

### Changesets PR Workflow (`.github/workflows/changesets-pr.yaml`)
- Uses `changesets/action@v1` to create versioning PRs
- Could be enhanced with `changeset:update-changelog` for richer PR descriptions

### Release Workflow (`.github/workflows/release-npm-changeset.yaml`)
- Uses `changeset:get-latest-release` for version comparison
- Uses `changeset:update-changelog` for release description formatting
- Uses `FuelLabs/changesets-action@v2.0.0` for publishing

## Advanced Usage

### Enhanced Versioning
Replace `changeset version` with `changeset:version-with-docs` in workflows for automatic commit handling:

```yaml
- name: Version packages
  run: pnpm changeset:version-with-docs
```

### Custom Publishing
Use `changeset:publish` instead of direct changeset commands for better git tag management:

```yaml
- name: Publish packages
  run: pnpm changeset:publish v${{ env.BUILD_VERSION }} ${{ github.ref_name }}
```

### Pre-release Workflow
For beta/preview releases:

```bash
pnpm changeset:next
pnpm changeset:version-with-docs
pnpm changeset:publish v$VERSION-beta master
```

## Dependencies

All required dependencies are already included in the project:
- `@changesets/cli`
- `@changesets/get-github-info`
- `@changesets/read`
- `@changesets/types`
- `@actions/core`
- `@actions/github` 