---
name: codex-skill-creator
description: Collaboratively design and author Codex skills with correct frontmatter, naming, and placement conventions.
---

# Codex Skill Creator

## Optional: Quick fit check

Good fit if the user wants to:

- Create a new Codex skill
- Improve an existing `SKILL.md`
- Decide where a skill should live (project/global/custom)

Not needed if the user is asking for a normal code change, debugging help, or a one-off question.

If this skill isn’t needed, ignore it and continue.

## Outcomes

When used, this skill helps produce:

- A new skill folder containing a valid `SKILL.md`
- A clear, discovery-friendly `description`
- Optional supporting docs in `references/` to keep `SKILL.md` concise

## Core rules (Codex)

- Skills are discovered by **frontmatter only**: `name` + `description`.
- `SKILL.md` must start with YAML frontmatter. Only a small set of fields are recognized. See `references/codex-skill-rules.md`.
- Skill `name` must match the directory name and pass Codex naming constraints.
- Prefer progressive disclosure:
  - Keep `SKILL.md` short and actionable.
  - Put long or rarely-needed details in `references/`.

## Workflow

### 1) Gather requirements (collaborative)

This is a collaborative workflow: ask questions first, then draft, then confirm.

Ask for:

- Skill name (kebab-case)
- A single-sentence `description` that makes the discovery decision easy
- What the skill should reliably produce (outputs/artifacts)
- What questions the agent must ask up front (inputs)
- Guardrails (what to avoid, what not to assume)

Do not generate files until the user confirms the name, description, and placement.

### 2) Choose placement (three options)

Ask the user to choose where the new skill should live:

1. **Project local (Recommended)**: `.codex/skills/<name>/SKILL.md`
2. **Global**: `~/.codex/skills/<name>/SKILL.md`
3. **Other (absolute path)**: user provides an absolute path

Rules for **Other**:

- If the provided path ends with `SKILL.md`, treat it as the exact file path.
- Otherwise treat it as a directory path and place the skill at `<path>/<name>/SKILL.md`.
- If the path isn’t absolute, ask again for an absolute path.

### 3) Validate before writing

Before creating files, verify:

- `name` matches Codex rules (see `references/codex-skill-rules.md`)
- The directory name will exactly match `name`
- `description` is 1–1024 characters and describes when to use the skill

### 4) Author `SKILL.md`

Start from `references/skill-template.md` and fill it in.

Guidelines:

- Do not include a “when to use me” body section; put that information in frontmatter `description`.
- Prefer concise, step-based workflows.
- If the workflow is complex, include a small checklist or gates.

### 5) Add optional `references/`

Only add `references/` files when they keep the main `SKILL.md` smaller and more usable.

Good candidates:

- Company-specific conventions
- API references
- Codebase-specific patterns
- Templates that are too long for the main skill body

If you are considering bundling scripts in the new skill, use `references/bun-runtime.md` to decide if scripts are worth it.

## How to write a good `description`

A strong `description` makes the discovery decision obvious.

Patterns that work well:

- Start with an action verb: “Design…”, “Generate…”, “Review…”, “Refactor…”, “Draft…”, “Validate…”
- Include the artifact produced: “...a `SKILL.md`…”, “...a release checklist…”, “...a migration plan…”
- Include the context boundary: “...for Codex…”, “...for our monorepo…”, “...without changing runtime behavior…”

Examples:

- “Create a scoped `SKILL.md` and references for consistent API endpoint changes in this repo.”
- “Draft Codex skills for repeatable workflows, keeping `SKILL.md` concise and using `references/` for details.”

## References

- Codex skill rules: `references/codex-skill-rules.md`
- Skill template: `references/skill-template.md`

## References (Bun scripts, optional)

Only relevant if the skill you are creating will bundle scripts.

- Bun runtime: `references/bun-runtime.md`
- Bun script rules: `references/bun-script-rules.md`
- Script output patterns: `references/script-output-patterns.md`
- Script workflows: `references/script-workflows.md`
