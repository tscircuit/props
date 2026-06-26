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

## Props API rules

Design props for TSX authors, not renderers. Prefer user intent over implementation detail.

Use the narrowest valid scope: component-specific first, shared/common only when the meaning is identical across many components.

Namespace ambiguous domains: `pcb*`, `sch*`, `cad*`, `sim*`, `bom*`, `supplier*`, `manufacturer*`.

Use common identity conventions: `name` is stable circuit identity; `displayName` is the human-facing alternate. Do not introduce generic `label`/`displayLabel` for this role.

Preserve naming patterns: `FooProps`, `fooProps`, `fooPinLabels`, `FooPinLabels`, `fooPins`, `connections`, `pinLabels`, `pcbPinLabels`, `schOrientation`, `pcbOrientation`, `pcbRotation`, `schStyle`, `pcbStyle`.

Prefer canonical props. Add aliases only for common domain vocabulary, normalize them to the canonical representation, and error on conflicting aliases.

Use `number | string` plus unit-aware parsing for physical/electrical/time values. Raw numbers must have obvious units.

Use enums for three or more modes. Booleans should read as clear yes/no decisions.

Defaults must be safe, boring, and unsurprising. Do not silently choose important electrical/design values.

Electrical connectivity should usually be `connections` keyed by known pin labels. Higher-level props like `pullupTo` are acceptable when they express intent.

Keep advanced escape hatches isolated and explicitly typed.

Document non-obvious props at declaration. Deprecations must name the replacement and remain parseable.

Every prop change must define accepted inputs, canonical parsed output, defaults, conflicts, aliases, and migration behavior.
