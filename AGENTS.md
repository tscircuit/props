# Repository Guidance

This repository contains the generated props documentation and supporting scripts for the `@tscircuit/props` package. Many files—especially under `docs/` and `generated/`—are produced by scripts inside the `scripts/` directory. Keeping these generated artifacts in sync is critical for ensuring the package consumers receive up-to-date information.

## Required Workflow Before Committing
- Always run the generation scripts and include their results in your commit before opening a pull request or merging changes. Run the scripts with:
  ```sh
  bun scripts/generate-component-types.ts
  bun scripts/generate-manual-edits-docs.ts
  bun scripts/generate-readme-docs.ts
  bun scripts/generate-props-overview.ts
  ```
- After running the scripts, confirm that `git status` reports a clean working tree (or that you have staged all generated changes) before committing.

Following these steps helps prevent CI failures and ensures generated content stays in sync with the source definitions.
