---
description: Write change-set specifications for change
---

# Specs

Write change-set specifications for the change set.

## Inputs

> [!IMPORTANT]
> Ask the user for the change set name. Run `ls changes/ | grep -v archive/` to list options. If only one directory exists, use it. Otherwise, prompt the user.

## Instructions

Load `sdd-state-management`, `spec-format`, and `research` skills. Read state.md and proposal.md. If lane is not `full`, redirect to appropriate command.

Spec writing is collaborative. Don't start writing immediately. First, summarize the goal, actors, workflows, and constraints in your own words. Explain how the change maps to the existing capability hierarchy. Present concrete statements and decisions. Offer options for open decisions. Pause and wait for user confirmation.

After confirmation, use research skill to understand current spec structure, related capabilities, naming conventions, and build context for spec writing. Suggest user run `/sdd/tools/taxonomy-map <name>` to determine where capabilities live and confirm result.

With approval, create specs in `changes/<name>/specs/` using `spec-format` skill. Specs may be nested by domain. Use EARS syntax for requirements. Update state.md `## Notes` with progress and decisions. Review specs for atomic, testable, implementation-agnostic requirements using appropriate EARS patterns. Suggest `/sdd/tools/critique specs` when complete.

When approved, update state.md: `## Phase Status: complete`, clear `## Notes`, suggest `/sdd/discovery <name>`.

## Examples

**Writing specs with collaborative discovery:**

```text
Input: None (change: "password-reset")
Output: "Your goal is to allow users to reset passwords via email. Actors: user, admin. Workflow: request email → click link → set new password. Correct?"
       User confirms.
       Output: "This maps to auth/password spec boundary. Writing delta spec at changes/password-reset/specs/auth/password.md..."
```

**Lane check redirects:**

```text
Input: "vibe-lane" (not full lane)
Output: "Vibe lane should skip specs—redirecting to /sdd/plan."
```
