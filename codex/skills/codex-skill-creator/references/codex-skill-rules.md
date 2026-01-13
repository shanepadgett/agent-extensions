# Codex Skill Rules (Summary)

This file summarizes the Codex rules that affect skill discovery and loading.

## Discovery locations

Codex searches for skills in:

- Project config: `.codex/skills/<name>/SKILL.md`
- Parent-of-current directory: `../.codex/skills/<name>/SKILL.md`
- Git root: `<repo>/.codex/skills/<name>/SKILL.md`
- Global config: `~/.codex/skills/<name>/SKILL.md`

## Skill frontmatter

Each `SKILL.md` must start with YAML frontmatter.

Only these fields are recognized by Codex:

- `name` (required)
- `description` (required)
- `license` (optional)
- `compatibility` (optional)
- `metadata` (optional, string-to-string map)

Unknown frontmatter fields are ignored.

## Name rules

`name` must:

- Be 1–64 characters
- Be lowercase alphanumeric with single hyphen separators
- Not start or end with `-`
- Not contain consecutive `--`
- Match the directory name that contains `SKILL.md`

Equivalent regex:

```
^[a-z0-9]+(-[a-z0-9]+)*$
```

## Description rules

- `description` must be 1–1024 characters
- Keep it specific: discovery is based on `name` + `description` only
