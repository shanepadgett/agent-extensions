---
description: Create a new Codex custom prompt from a plain-English description
argument-hint: "<spec>"
---

Before executing, read the Codex custom prompts docs: https://developers.openai.com/codex/custom-prompts/

## Task

1. Treat `$ARGUMENTS` as the custom prompt spec.
2. Ask user for output path:
   - `(1) project` → `.codex/prompts/<name>.md`
   - `(2) global` → `~/.codex/prompts/<name>.md`
3. Choose a short, kebab-case name based on the spec.
   - Prompt names are the filename (no subdirectories).
4. Confirm the argument shape:
   - Positional: `$1`..`$9`, plus `$ARGUMENTS`
   - Named: `KEY=value` pairs with `$KEY` placeholders
5. Write the new prompt markdown:
   - YAML frontmatter: `description`, optional `argument-hint`
   - Body: clear, step-based instructions tailored to the spec
6. Output: filepath and an example invocation like `/prompts:<name> ...`.

## Guardrails

- Keep it specific and runnable.
- Ask at most 5 follow-ups if required.
- Prefer explicit instructions over tool-specific syntax; Codex will decide when to run commands.
- Do not include shell execution syntax or inline command blocks.
