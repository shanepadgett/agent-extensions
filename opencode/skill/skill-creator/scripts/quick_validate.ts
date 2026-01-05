#!/usr/bin/env -S deno run --allow-read
/**
 * Validate a skill directory structure.
 *
 * Usage:
 *   deno run --allow-read scripts/quick_validate.ts <skill-path> [--json]
 *
 * Validates:
 *   - SKILL.md exists with valid frontmatter
 *   - Required fields are present
 *   - Naming conventions are followed
 */

import { path, yaml } from "@deps";

interface ValidationError {
  file?: string;
  field?: string;
  message: string;
  severity: "error" | "warning";
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

function parseArgs(): {
  skillPath: string;
  jsonOutput: boolean;
} {
  const args = Deno.args;

  if (args.length < 1) {
    console.error("Usage: quick_validate.ts <skill-path> [--json]");
    Deno.exit(2);
  }

  const skillPath = args[0];
  const jsonOutput = args.includes("--json");

  return { skillPath, jsonOutput };
}

function validateYamlFrontmatter(content: string): { message: string } | null {
  if (!content.startsWith("---")) {
    return { message: "No YAML frontmatter found (missing --- delimiters)" };
  }

  const match = content.match(/^---\n(.*?)\n---/s);
  if (!match) {
    return { message: "Invalid frontmatter format (missing closing ---)" };
  }

  try {
    const frontmatter = yaml.parse(match[1]);
    if (typeof frontmatter !== "object" || frontmatter === null) {
      return { message: "Frontmatter must be a YAML object/dictionary" };
    }
    return null;
  } catch (error) {
    return { message: `Invalid YAML: ${(error as Error).message}` };
  }
}

async function validateSkill(skillPath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  const skillDir = path.resolve(skillPath);

  let skillDirStat: Deno.FileInfo | undefined;
  try {
    skillDirStat = await Deno.stat(skillDir);
  } catch {
    result.errors.push({
      file: skillPath,
      message: "Skill directory does not exist",
      severity: "error",
    });
    result.valid = false;
    return result;
  }

  if (!skillDirStat?.isDirectory) {
    result.errors.push({
      file: skillPath,
      message: "Skill path is not a directory",
      severity: "error",
    });
    result.valid = false;
    return result;
  }

  const skillMdPath = path.join(skillDir, "SKILL.md");
  let skillMdStat: Deno.FileInfo | undefined;
  try {
    skillMdStat = await Deno.stat(skillMdPath);
  } catch {
    result.errors.push({
      file: "SKILL.md",
      message: "SKILL.md not found in skill directory",
      severity: "error",
    });
    result.valid = false;
    return result;
  }

  if (!skillMdStat?.isFile) {
    result.errors.push({
      file: "SKILL.md",
      message: "SKILL.md is not a file",
      severity: "error",
    });
    result.valid = false;
    return result;
  }

  const content = await Deno.readTextFile(skillMdPath);
  const lines = content.split("\n");
  if (lines.length > 500) {
    result.errors.push({
      file: "SKILL.md",
      message:
        `SKILL.md is too long (${lines.length} lines). Maximum is 500 lines. Use references/ for detailed content.`,
      severity: "error",
    });
    result.valid = false;
  }

  const frontmatterError = validateYamlFrontmatter(content);
  if (frontmatterError) {
    result.errors.push({
      file: "SKILL.md",
      message: frontmatterError.message,
      severity: "error",
    });
    result.valid = false;
    return result;
  }

  const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);
  const frontmatterText = frontmatterMatch?.[1] || "";
  let frontmatter: Record<string, unknown>;

  try {
    frontmatter = yaml.parse(frontmatterText) as Record<string, unknown>;
  } catch (error) {
    result.errors.push({
      file: "SKILL.md",
      message: `Failed to parse frontmatter: ${(error as Error).message}`,
      severity: "error",
    });
    result.valid = false;
    return result;
  }

  const allowedKeys = new Set([
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "allowed-tools",
  ]);
  const actualKeys = new Set(Object.keys(frontmatter));

  const unexpectedKeys = [...actualKeys].filter((key) => !allowedKeys.has(key));
  if (unexpectedKeys.length > 0) {
    result.errors.push({
      file: "SKILL.md",
      field: "frontmatter",
      message: `Unexpected key(s): ${unexpectedKeys.join(", ")}. Allowed: ${
        [...allowedKeys].join(", ")
      }`,
      severity: "error",
    });
    result.valid = false;
  }

  if (!frontmatter.name || typeof frontmatter.name !== "string") {
    result.errors.push({
      file: "SKILL.md",
      field: "name",
      message: "Missing or invalid 'name' field (must be a string)",
      severity: "error",
    });
    result.valid = false;
  } else {
    const name = frontmatter.name.trim();

    if (!/^[a-z0-9-]+$/.test(name)) {
      result.errors.push({
        file: "SKILL.md",
        field: "name",
        message:
          `Name '${name}' must be hyphen-case (lowercase letters, digits, and hyphens only)`,
        severity: "error",
      });
      result.valid = false;
    }

    if (name.startsWith("-") || name.endsWith("-")) {
      result.errors.push({
        file: "SKILL.md",
        field: "name",
        message: `Name '${name}' cannot start or end with hyphen`,
        severity: "error",
      });
      result.valid = false;
    }

    if (name.includes("--")) {
      result.errors.push({
        file: "SKILL.md",
        field: "name",
        message: `Name '${name}' cannot contain consecutive hyphens`,
        severity: "error",
      });
      result.valid = false;
    }

    if (name.length > 64) {
      result.errors.push({
        file: "SKILL.md",
        field: "name",
        message:
          `Name is too long (${name.length} characters). Maximum is 64 characters`,
        severity: "error",
      });
      result.valid = false;
    }

    const skillDirName = path.basename(skillDir);
    if (name !== skillDirName) {
      result.warnings.push({
        file: "SKILL.md",
        field: "name",
        message:
          `Name '${name}' does not match directory name '${skillDirName}'`,
        severity: "warning",
      });
    }
  }

  if (!frontmatter.description || typeof frontmatter.description !== "string") {
    result.errors.push({
      file: "SKILL.md",
      field: "description",
      message: "Missing or invalid 'description' field (must be a string)",
      severity: "error",
    });
    result.valid = false;
  } else {
    const description = frontmatter.description.trim();

    if (description.length === 0) {
      result.errors.push({
        file: "SKILL.md",
        field: "description",
        message: "Description cannot be empty",
        severity: "error",
      });
      result.valid = false;
    }

    if (/<|>/.test(description)) {
      result.errors.push({
        file: "SKILL.md",
        field: "description",
        message: "Description cannot contain angle brackets (< or >)",
        severity: "error",
      });
      result.valid = false;
    }

    if (description.length > 1024) {
      result.errors.push({
        file: "SKILL.md",
        field: "description",
        message:
          `Description is too long (${description.length} characters). Maximum is 1024 characters`,
        severity: "error",
      });
      result.valid = false;
    }
  }

  const license = frontmatter.license;
  if (license !== undefined && typeof license !== "string") {
    result.errors.push({
      file: "SKILL.md",
      field: "license",
      message: "'license' field must be a string",
      severity: "error",
    });
    result.valid = false;
  }

  const compatibility = frontmatter.compatibility;
  if (compatibility !== undefined && typeof compatibility !== "string") {
    result.errors.push({
      file: "SKILL.md",
      field: "compatibility",
      message: "'compatibility' field must be a string",
      severity: "error",
    });
    result.valid = false;
  }

  if (typeof compatibility === "string" && compatibility.length > 500) {
    result.errors.push({
      file: "SKILL.md",
      field: "compatibility",
      message:
        `Compatibility field is too long (${compatibility.length} characters). Maximum is 500 characters`,
      severity: "error",
    });
    result.valid = false;
  }

  const metadata = frontmatter.metadata;
  if (metadata !== undefined && typeof metadata !== "object") {
    result.errors.push({
      file: "SKILL.md",
      field: "metadata",
      message: "'metadata' field must be an object",
      severity: "error",
    });
    result.valid = false;
  }

  const allowedTools = frontmatter["allowed-tools"];
  if (allowedTools !== undefined && typeof allowedTools !== "string") {
    result.errors.push({
      file: "SKILL.md",
      field: "allowed-tools",
      message: "'allowed-tools' field must be a string",
      severity: "error",
    });
    result.valid = false;
  }

  return result;
}

function printResult(result: ValidationResult, jsonOutput: boolean): void {
  if (jsonOutput) {
    console.log(JSON.stringify(
      {
        valid: result.valid,
        errors: result.errors,
        warnings: result.warnings,
      },
      null,
      2,
    ));
    return;
  }

  if (result.valid && result.warnings.length === 0) {
    console.log("\x1b[32m✅ Skill is valid!\x1b[0m");
  } else if (result.valid && result.warnings.length > 0) {
    console.log("\x1b[33m⚠️  Skill is valid but has warnings:\x1b[0m");
    for (const warning of result.warnings) {
      console.log(`  \x1b[33m⚠️  ${warning.message}\x1b[0m`);
    }
  } else {
    console.log("\x1b[31m❌ Validation failed:\x1b[0m");
    for (const error of result.errors) {
      const prefix = error.file ? `${error.file}: ` : "";
      const field = error.field ? `[${error.field}] ` : "";
      console.log(`  \x1b[31m❌ ${prefix}${field}${error.message}\x1b[0m`);
    }
    for (const warning of result.warnings) {
      const prefix = warning.file ? `${warning.file}: ` : "";
      const field = warning.field ? `[${warning.field}] ` : "";
      console.log(`  \x1b[33m⚠️  ${prefix}${field}${warning.message}\x1b[0m`);
    }
  }
}

async function main(): Promise<void> {
  const { skillPath, jsonOutput } = parseArgs();
  const result = await validateSkill(skillPath);
  printResult(result, jsonOutput);
  Deno.exit(result.valid ? 0 : 1);
}

if (import.meta.main) {
  main();
}
