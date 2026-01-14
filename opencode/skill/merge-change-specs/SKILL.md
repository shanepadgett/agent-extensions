---
name: merge-change-specs
description: Merge a change-set’s specs into canonical specs
---

# Merge Change Specs

## Collaboration

This skill is meant to be used collaboratively:

- Ask the user for the change set name/path (and confirm repo root if ambiguous).
- Summarize which canonical spec files will be created/modified.
- Run the merge script and report a deterministic summary + any errors.

## What I do

Outputs/artifacts this skill helps produce:

- Updated canonical specs under `specs/`.
- A deterministic merge report (what changed, what was created, what failed).

## Inputs I need

Questions to ask up front (only include questions that materially affect correctness):

- Which change set should be merged (typically `changes/<name>/`)?

## Workflow

1. Validate the change set exists and contains `specs/**/*.md`.
2. For each change-set spec:
   - Parse YAML frontmatter and determine `kind`.
   - Compute the canonical spec path by stripping `changes/<name>/specs/` prefix.
3. Apply changes deterministically:
   - `kind: new`: write canonical file with frontmatter removed.
   - `kind: delta`: patch the canonical spec by applying the delta file’s `### ADDED`, `### MODIFIED`, `### REMOVED` buckets.
4. Emit a one-page summary of created/changed files and any failures.

## Guardrails

- Fail fast if a `kind: delta` spec’s canonical file does not exist.
- Do not reorder unrelated canonical content; only modify targeted sections.
- Be deterministic: stable file ordering and stable output formatting.

## Examples

### Merge a change set

User:

- "Merge specs for `changes/auth-refresh/`."

Assistant:

- Runs `bun opencode/skill/merge-change-specs/scripts/merge-change-specs.ts --change auth-refresh`.
- Reports which canonical specs were created or patched.
