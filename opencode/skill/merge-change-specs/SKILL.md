---
name: merge-change-specs
description: Merge a change-set’s specs into canonical specs
---

# Merge Change Specs

## Collaboration

This skill is meant to be used collaboratively:

- Ask the user for the change set name (the `<name>` in `changes/<name>/`).
- Summarize which canonical spec files will be created/modified.
- Run the merge script (often in `--dry-run` first) and report its JSON output + any errors.

## What I do

Outputs/artifacts this skill helps produce:

- Updated canonical specs under `specs/`.
- A deterministic, machine-readable merge report (JSON) listing created/modified files.

## Inputs I need

Questions to ask up front (only include questions that materially affect correctness):

- Which change set should be merged (the `<name>` in `changes/<name>/`)?
- Should this be a dry run (no writes), or should it actually write to `specs/`?

## How to run the script

The implementation lives at `opencode/skill/merge-change-specs/scripts/merge-change-specs.ts`.

Supported flags:

- `--change <name>` (or `-c <name>`) (required)
- `--dry-run` (optional): compute and report changes without writing any files

Examples:

- Dry run first:
  - `bun opencode/skill/merge-change-specs/scripts/merge-change-specs.ts --change auth-refresh --dry-run`
- Apply changes:
  - `bun opencode/skill/merge-change-specs/scripts/merge-change-specs.ts --change auth-refresh`

### Output format

The script prints a single JSON object to stdout:

- `change`: the change set name
- `dryRun`: boolean
- `counts.created|modified|skipped`
- `created|modified|skipped`: arrays of canonical `specs/...` paths

If anything is invalid or unsafe, the script exits non-zero and prints a human-readable error to stderr.

## Workflow

1. Validate `changes/<name>/specs/` exists and contains `**/*.md`.
2. For each change-set spec (`changes/<name>/specs/**/*.md`):
   - Validate it is a change-spec Markdown file.
   - Parse YAML frontmatter and read `kind` (`new` or `delta`).
   - Compute the canonical path by stripping the `changes/<name>/specs/` prefix and re-rooting under `specs/`.
3. Apply changes deterministically (stable ordering):
   - `kind: new`: write the change spec body (frontmatter removed) to the canonical file.
     - If the canonical file already exists, it is overwritten and reported as `modified`.
   - `kind: delta`: patch the canonical spec by applying `### ADDED`, `### MODIFIED`, `### REMOVED` buckets under `## Requirements`.
4. Emit JSON summary of created/modified/skipped and exit `0`.

## Guardrails

- Refuses unsafe `--change` values (absolute paths or `..`).
- Fails fast if a `kind: delta` spec targets a missing canonical file.
- Does not copy YAML frontmatter into canonical.
- Deterministic behavior: stable file ordering and stable output formatting.

## Examples

### Merge a change set (dry run, then apply)

User:

- "Merge specs for `changes/auth-refresh/`."

Assistant:

- Runs `bun opencode/skill/merge-change-specs/scripts/merge-change-specs.ts --change auth-refresh --dry-run`.
- Summarizes the JSON output (`created` / `modified`).
- If output looks correct, runs `bun opencode/skill/merge-change-specs/scripts/merge-change-specs.ts --change auth-refresh`.
- Reports the final JSON output and any errors.
