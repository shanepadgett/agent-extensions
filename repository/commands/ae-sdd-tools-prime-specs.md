---
name: sdd-tools-prime-specs
description: Prime LLM with all spec files for a change
---

# Spec Context for Change: <change-set-name>

If the change set name is not provided, ask the user for it before proceeding.

The following spec files are loaded for planning context:

## Spec Files

Run:
- `find changes/<change-set-name>/specs -name "*.md" -exec sh -c 'echo "=== {} ===" && cat "{}"' \; 2>/dev/null`

---

Use this context to inform your planning and implementation decisions for the `<change-set-name>` change. Respond "Got it." if you understand.
