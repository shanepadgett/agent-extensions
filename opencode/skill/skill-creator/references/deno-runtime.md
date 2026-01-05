# Deno Runtime

This reference provides guidance for using Deno runtime in skill scripts.

## Prerequisites

Deno must be installed locally to run skill scripts. When Deno is not available:

**ALWAYS tell the user to install it** using one of these methods:

**macOS/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

**macOS via Homebrew:**
```bash
brew install deno
```

**Windows via winget:**
```powershell
winget install deno
```

**Check installation:**
```bash
deno -v
```

**DO NOT attempt to install Deno yourself.** Always instruct the user to install it.

Docs: https://docs.deno.com/runtime/getting_started/installation/

## Running Deno Scripts

Scripts in skills are run with Deno using appropriate permission flags:

```bash
# Read-only script
deno run --allow-read scripts/script.ts

# Read and write
deno run --allow-read --allow-write scripts/script.ts

# Network access
deno run --allow-read --allow-net scripts/script.ts

# Environment variables
deno run --allow-read --allow-env=VAR_NAME scripts/script.ts
```

## Permission Flags

Use the principle of least privilege. Only request the permissions your script needs:

| Flag | Purpose | Example Usage |
|------|---------|---------------|
| `--allow-read` | Read files from filesystem | `--allow-read=/path/to/files` |
| `--allow-write` | Write files to filesystem | `--allow-write=/output/path` |
| `--allow-net` | Network access | `--allow-net=api.example.com` |
| `--allow-env` | Access environment variables | `--allow-env=API_KEY` |
| `--allow-run` | Run subprocesses | `--allow-run=/usr/bin/git` |

For more details: https://docs.deno.com/runtime/manual/basics/permissions/

## Standard Library

Use Deno's standard library for common tasks. Import via central `deps.ts`:

```typescript
import { ensureDir } from "../scripts/deps.ts";
import { join } from "../scripts/deps.ts";
import { parse } from "../scripts/deps.ts";
```

This keeps version management centralized.

Available stdlib modules:
- `fs` - File system operations
- `path` - Path manipulation
- `yaml` - YAML parsing and encoding
- `http` - HTTP client and server
- `encoding` - Base64, hex, and other encodings
- And many more

Full reference: https://docs.deno.com/runtime/manual/basics/standard_library

## Script Structure

Follow this pattern for skill scripts:

```typescript
#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Brief description of what this script does.
 *
 * Usage:
 *   deno run --allow-read --allow-write scripts/script.ts [args]
 */

import { fs, path } from "./deps.ts";

export function main(): void {
  // Script logic
}

if (import.meta.main) {
  main();
}
```

## Error Handling

Handle errors gracefully with clear messages:

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

## CLI Arguments

Parse arguments using `Deno.args`:

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
- Be concise and clear
- Use JSON for programmatic output when `--json` flag present

```typescript
if (jsonOutput) {
  console.log(JSON.stringify({ success: true, result }));
} else {
  console.log("Operation completed successfully");
}
```

## Exit Codes

Use appropriate exit codes:
- `0`: Success
- `1`: General error
- `2`: Invalid usage
- `3`: Validation failed

## Additional Resources

- **CLI Reference**: https://docs.deno.com/runtime/reference/
- **Deno Namespace APIs**: https://deno.land/api
- **Modules and Dependencies**: https://docs.deno.com/runtime/fundamentals/modules/
- **Deno by Example**: https://examples.deno.land/
