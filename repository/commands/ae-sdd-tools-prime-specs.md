---
description: Prime LLM with all spec files for a change
---

# Prime Specs

Prime the LLM with all spec files for context when planning a change.

## Inputs

> [!IMPORTANT]
> Ask the user for the change set name. Run `ls changes/ | grep -v archive/` to list options. If only one directory exists, use it. Otherwise, prompt the user.

## Instructions

Run `find changes/<change-set-name>/specs -name "*.md"` to load all spec files into context. This provides the full specification context for planning and implementation decisions. Respond "Got it." when loaded.

## Examples

**Single change set exists:**

```text
Input: None (only one change: "user-auth")
Output: Run find command, load user-auth/specs/*.md files into context, respond "Got it."
```

**Multiple change sets exist:**

```text
Input: "What change set specs would you like to load?" → "user-auth"
Output: Load user-auth/specs/*.md files, respond "Got it."
```
