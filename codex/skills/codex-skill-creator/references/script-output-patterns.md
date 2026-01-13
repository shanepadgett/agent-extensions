# Script Output Patterns

Use these patterns when a skill includes scripts, so humans and agents can reliably interpret results.

## Human-friendly default

Default output should be concise and actionable:

- What the script did
- What it changed (paths)
- What to do next

Example:

```text
Created:
- .codex/skills/my-skill/SKILL.md

Next:
- Edit .codex/skills/my-skill/SKILL.md description and workflow
```

## `--json` mode (optional)

If script output is consumed by other tools, support `--json`:

```json
{
  "ok": true,
  "created": [".codex/skills/my-skill/SKILL.md"],
  "warnings": []
}
```

Rules:

- JSON must be the only output in `--json` mode
- Keep fields stable across versions

## Error output

- Print a single clear summary line
- Include details below

Example:

```text
Error: invalid skill name "My Skill" (must match ^[a-z0-9]+(-[a-z0-9]+)*$)
```
