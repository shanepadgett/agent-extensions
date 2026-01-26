---
description: Map change intents to canonical spec paths and grouping
---

# Taxonomy Map

Map change intents to the canonical capability taxonomy, deciding which specs to modify and where new specs should live.

## Inputs

> [!IMPORTANT]
> Ask the user for the change set name. Run `ls changes/ | grep -v archive/` to list options. If only one directory exists, use it. Otherwise, prompt the user.

## Instructions

Load `research` skill. You're the Cartographer—mapping change intents to canonical specs. Read the proposal and `docs/specs/**` for taxonomy context.

For each change intent, decide: extend existing spec (brownfield preferred), create new spec (justify why existing can't be extended), or reorganize boundaries. Classify the intent: entry points (UIs, APIs, CLIs), cross-cutting mechanisms (caching, auth, ranking), core domain model (data, validation), or global invariants (IDs, resolution rules).

Determine group structure for each spec. Taxonomy depth is unbounded—use as many path segments as needed for cohesive boundaries, preferring shallowest depth.

Return output with: proposal-to-taxonomy mapping (existing specs, new specs, refactors), boundary decisions (in/out of scope), group structure (flat or grouped), and dependencies. Always prefer extending existing specs over creating new ones.

## Examples

**Simple mapping to existing spec:**

```text
Input: None (change: "password-reset")
Output: Mapped to existing spec: docs/specs/auth/password.md
        Change type: Modified requirements
        Why this fits: Password reset flow is part of authentication capability boundary.
```

**New spec required:**

```text
Input: "feature-x" (change proposes new workflow automation)
Output: New spec required: changes/feature-x/specs/workflow/automation.md
        Future path: docs/specs/workflow/automation.md
        Justification: No existing spec covers workflow automation—would violate auth/action boundaries.
```
