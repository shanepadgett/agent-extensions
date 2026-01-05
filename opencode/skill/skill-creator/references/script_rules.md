# Deno Script Rules

This document provides guidelines for writing Deno scripts that are part of skills.

## Imports

Use the central `deps.ts` file for all Deno standard library imports:

```typescript
import { ensureDir } from "../scripts/deps.ts";
import { join } from "../scripts/deps.ts";
import { parse } from "../scripts/deps.ts";
```

This makes version updates easy and keeps imports consistent.

## Permission Flags

Use the principle of least privilege. Only request the permissions your script needs:

**Read-only scripts:**
```bash
deno run --allow-read=<(read paths) scripts/script.ts
```

**Write scripts:**
```bash
deno run --allow-read=<(read paths) --allow-write=<(write paths) scripts/script.ts
```

**Network access:**
```bash
deno run --allow-net scripts/script.ts
```

**Environment variables:**
```bash
deno run --allow-env=<(var names) scripts/script.ts
```

**Multiple permissions:**
```bash
deno run --allow-read --allow-write scripts/script.ts
```

## Error Handling

All scripts must handle errors gracefully and provide clear error messages:

```typescript
try {
  const content = await Deno.readTextFile(filePath);
  // Process content
} catch (error) {
  console.error(`Failed to read file: ${filePath}`);
  console.error(error.message);
  Deno.exit(1);
}
```

## Documentation

Each script should have a clear docstring explaining its purpose:

```typescript
/**
 * Validates a skill directory structure.
 *
 * Usage:
 *   deno run --allow-read scripts/quick_validate.ts <skill-path>
 *
 * Validates:
 *   - SKILL.md exists with valid frontmatter
 *   - Required fields are present
 *   - Naming conventions are followed
 */
```

## File Naming

- Use kebab-case for file names: `init_skill.ts`, `quick_validate.ts`
- Name files descriptively based on their purpose
- Keep file names concise but meaningful

## TypeScript Best Practices

- Use explicit types where clarity is needed
- Prefer async/await over raw Promises
- Use const for immutable variables
- Use let only when reassignment is necessary

```typescript
// Good
const result = await processData(data);
for (const item of items) {
  console.log(item);
}

// Acceptable when needed
let total = 0;
for (const item of items) {
  total += item.value;
}
```

## Exit Codes

Use appropriate exit codes:
- `0`: Success
- `1`: General error
- `2`: Invalid usage (wrong arguments)
- `3`: Validation failed

```typescript
Deno.exit(0); // Success
Deno.exit(1); // Error
```

## CLI Arguments

Parse CLI arguments cleanly. Use `Deno.args` for simple scripts:

```typescript
const args = Deno.args;
if (args.length < 1) {
  console.error("Usage: script.ts <required-arg> [--optional-flag]");
  Deno.exit(2);
}

const [requiredArg] = args;
const optionalFlag = args.includes("--optional-flag");
```

## Output Format

- Use `console.log()` for informational output
- Use `console.error()` for error messages
- Be concise and clear in output
- Use JSON output for programmatic use when `--json` flag is present

```typescript
if (jsonOutput) {
  console.log(JSON.stringify({ success: true, result }));
} else {
  console.log("Operation completed successfully");
}
```

## Testing

Scripts should be testable. Export functions for unit testing:

```typescript
export function validateSkill(skillPath: string): ValidationResult {
  // Validation logic
}

if (import.meta.main) {
  const skillPath = Deno.args[0];
  const result = validateSkill(skillPath);
  // Handle result
}
```
