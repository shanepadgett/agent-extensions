---
description: Fast-track bug investigation and fix initialization
---

# SDD Bug

## Required Skills

- `sdd-state-management`
- `research`

## Inputs

> [!IMPORTANT]
> You must ask the user for the following information; do not assume CLI arguments are provided.

- **Bug Context**: Ask for error messages, reproduction steps, or a description of what is failing.
- **Change Set Name**: Ask the user to confirm or provide a name for the new change set (e.g., `fix-login-error`).

## Instructions

1. **Resolution**: Check for existing change sets. If multiple exist, ask the user if this is a new issue or related to an existing one.
2. **Triage**: Determine if this is an **Actual Bug** (code fails to meet existing specs/intent) or a **Behavioral Change** (new capability requested). If it's a change, redirect the user to the full lane (`/sdd/init`).
3. **Research**: Use the `research` skill to locate the problem, trace the execution path, and identify the root cause. Compare findings against existing specs.
4. **Initialize**: Create the `changes/<name>/` directory if it doesnt exist.
   - **state.md**: Set lane to `bug`, phase to `plan`, and status to `in_progress`.
   - **context.md**: Document the problem, expected behavior, root cause, and high-level fix approach.
5. **Next Steps**: Instruct the user to run `/sdd/plan` to start the fix.

## Success Criteria

- Change set initialized with correct `bug` lane configuration.
- Root cause is clearly documented in `context.md`.
- User is ready to proceed to the planning phase.

## Usage Examples

### Do: Triage before fixing

"This appears to be a regression where the login button is disabled on mobile. I'll initialize a bug lane change set `fix-mobile-login` to research the root cause."

### Don't: Assume CLI arguments

Avoid starting work before asking the user for the bug details or the desired change set name.
