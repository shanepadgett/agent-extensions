---
description: Show status of change sets
argument-hint: [change-set-name|all]
---

# Status

Show the status of SDD change sets.

## Arguments

- `$ARGUMENTS` - Optional: specific change set name, or "all"

## Instructions

### Specific Change Set

If name provided:

1. Read `changes/<name>/state.md`
2. Read `changes/<name>/tasks.md` if exists
3. Report:
   - Current phase
   - Lane
   - Pending items
   - Task progress (e.g., [x] 2, [o] 1, [ ] 5)
   - Next suggested action

### All Change Sets

If "all" or no arguments:

1. Find all `changes/*/state.md`
2. For each, report summary:
   - Name
   - Phase
   - Lane
   - Brief status (including task completion ratio if in tasks/plan/implement phase)

### Output Format

```markdown
## Change Set: <name>

**Phase:** <phase>
**Lane:** <lane>

### Progress

- Tasks: [x] <done>, [o] <active>, [ ] <pending>
- Current: <current task title if [o] exists, otherwise next action>

### Pending

- <any pending items from state.md>

### Next Action

<suggested command>
```
