---
name: opencode-skill-creator
description: Collaboratively design and author OpenCode skills with correct frontmatter, naming, and placement conventions.
---

# OpenCode Skill Creator

## Optional: Quick fit check

Good fit if the user wants to:

- Create a new OpenCode skill
- Improve an existing `SKILL.md`
- Decide where a skill should live (project/global/custom)

Not needed if the user is asking for a normal code change, debugging help, or a one-off question.

If this skill isn’t needed, ignore it and continue.

## Outcomes

When used, this skill helps produce:

- A new skill folder containing a valid `SKILL.md`
- A clear, discovery-friendly `description`
- Optional supporting docs in `references/` to keep `SKILL.md` concise

## Core rules (OpenCode)

- Skills are discovered by **frontmatter only**: `name` + `description`.
- `SKILL.md` must start with YAML frontmatter. Only a small set of fields are recognized. See `references/opencode-skill-rules.md`.
- Skill `name` must match the directory name and pass OpenCode naming constraints.
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

1. **Project local (Recommended)**: `.opencode/skill/<name>/SKILL.md`
2. **Global**: `~/.config/opencode/skill/<name>/SKILL.md`
3. **Other (absolute path)**: user provides an absolute path

Rules for **Other**:

- If the provided path ends with `SKILL.md`, treat it as the exact file path.
- Otherwise treat it as a directory path and place the skill at `<path>/<name>/SKILL.md`.
- If the path isn’t absolute, ask again for an absolute path.

### 3) Validate before writing

Before creating files, verify:

- `name` matches OpenCode rules (see `references/opencode-skill-rules.md`)
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
- Include the context boundary: “...for OpenCode…”, “...for our monorepo…”, “...without changing runtime behavior…”

Examples:

- “Create a scoped `SKILL.md` and references for consistent API endpoint changes in this repo.”
- “Draft OpenCode agent skills for repeatable workflows, keeping `SKILL.md` concise and using `references/` for details.”

## Notes on Claude compatibility

OpenCode can also load Claude-compatible skills from `.claude/skills/*/SKILL.md` and `~/.claude/skills/*/SKILL.md`.

If the user didn’t ask for Claude compatibility, don’t optimize for it. Focus on OpenCode’s `.opencode/skill/` and `~/.config/opencode/skill/` locations.

## References

- OpenCode skill rules: `references/opencode-skill-rules.md`
- Skill template: `references/skill-template.md`

## References (Bun scripts, optional)

Only relevant if the skill you are creating will bundle scripts.

- Bun runtime: `references/bun-runtime.md`
- Bun script rules: `references/bun-script-rules.md`
- Script output patterns: `references/script-output-patterns.md`
- Script workflows: `references/script-workflows.md`
