#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Initialize a new skill directory with optional resource directories.
 *
 * Usage:
 *   deno run --allow-read --allow-write scripts/init_skill.ts <skill-name> --path <output-dir> [--scripts] [--references] [--assets]
 *
 * Examples:
 *   deno run scripts/init_skill.ts my-skill --path skill
 *   deno run scripts/init_skill.ts csv-processor --path skill --scripts --references
 *   deno run scripts/init_skill.ts pdf-tool --path skill --scripts --references --assets
 */

import { fs, path } from "@deps";

interface Args {
  skillName: string;
  outputPath: string;
  scripts: boolean;
  references: boolean;
  assets: boolean;
}

function parseArgs(): Args {
  const args = Deno.args;

  if (args.length < 3) {
    console.error(
      "Usage: init_skill.ts <skill-name> --path <output-dir> [--scripts] [--references] [--assets]",
    );
    console.error("\nArguments:");
    console.error(
      "  <skill-name>     Name of the skill (hyphen-case, e.g., 'my-skill')",
    );
    console.error("  --path <dir>      Output directory for skill");
    console.error("\nOptional flags:");
    console.error(
      "  --scripts         Create scripts/ directory with example script",
    );
    console.error(
      "  --references      Create references/ directory with example reference doc",
    );
    console.error(
      "  --assets          Create assets/ directory with example asset placeholder",
    );
    Deno.exit(2);
  }

  const skillName = args[0];
  let outputPath = "";
  const flags = { scripts: false, references: false, assets: false };

  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--path" && i + 1 < args.length) {
      outputPath = args[i + 1];
      i++;
    } else if (args[i] === "--scripts") {
      flags.scripts = true;
    } else if (args[i] === "--references") {
      flags.references = true;
    } else if (args[i] === "--assets") {
      flags.assets = true;
    }
  }

  if (!outputPath) {
    console.error("Error: --path argument is required");
    Deno.exit(2);
  }

  return { skillName, outputPath, ...flags };
}

function validateSkillName(name: string): void {
  if (!/^[a-z0-9-]+$/.test(name)) {
    console.error(
      `Error: Skill name '${name}' must be hyphen-case (lowercase letters, digits, and hyphens only)`,
    );
    Deno.exit(1);
  }
  if (name.startsWith("-") || name.endsWith("-")) {
    console.error(
      `Error: Skill name '${name}' cannot start or end with hyphen`,
    );
    Deno.exit(1);
  }
  if (name.includes("--")) {
    console.error(
      `Error: Skill name '${name}' cannot contain consecutive hyphens`,
    );
    Deno.exit(1);
  }
  if (name.length > 64) {
    console.error(
      `Error: Skill name '${name}' exceeds maximum length of 64 characters`,
    );
    Deno.exit(1);
  }
}

function toTitleCase(name: string): string {
  return name.split("-").map((word) =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
}

const SKILL_TEMPLATE = (
  skillName: string,
  titleCaseName: string,
  flags: { scripts: boolean; references: boolean; assets: boolean },
) => {
let content = `---
name: ${skillName}
description: TODO Complete description of what this skill does and when to use it. IMPORTANT: Include both what to skill does AND specific scenarios/tasks that should trigger using this skill.
---

# ${titleCaseName}

## Overview

TODO: 1-2 sentences explaining what this skill enables

## When to Use This Skill

TODO: Describe the specific triggers, user requests, or scenarios that should cause Claude to load this skill. Be concrete with examples.

${
    flags.scripts
      ? `
## Script Usage Guidelines

CRITICAL: When scripts are available, ALWAYS use them for the operations they handle.

**Why use scripts?** Scripts provide 100% deterministic results, eliminate human error on complex operations, and are token-efficient compared to manual code generation.

**Script-first workflow:** For any task where a script exists, use the script instead of manual work unless you have a specific reason not to.
`
      : ""
  }

${
    flags.scripts
      ? `
## Running Scripts

Scripts use Deno runtime. Always run with appropriate permissions:

\`\`\`bash
# Read-only operations
deno run --allow-read scripts/script.ts [args]

# Read and write operations
deno run --allow-read --allow-write scripts/script.ts [args]

# Network access
deno run --allow-read --allow-net scripts/script.ts [args]
\`\`\`

See [references/deno-runtime.md](references/deno-runtime.md) for Deno details.
`
      : ""
  }

## Workflows

TODO: Provide step-by-step workflows for using this skill. Use patterns from [references/workflows.md](references/workflows.md):

- **Sequential workflows**: Break complex tasks into ordered steps
- **Conditional workflows**: Guide through decision points with branching
- **Script-first workflows**: Always use scripts when available
- **Error recovery**: Include steps for handling failures

${
    flags.scripts
      ? `For script-heavy skills, use the "Script-First Workflow" pattern from workflows.md to compel script usage.`
      : ""
  }

## Output Guidelines

TODO: Specify output format requirements. Use patterns from [references/output-patterns.md](references/output-patterns.md):

- **Strict templates**: For APIs, data files, configs (no deviation allowed)
- **Flexible templates**: For reports, documentation (adapt based on context)
- **Code generation**: Language-specific conventions with error handling
- **Examples-driven**: Show concrete examples for quality targets
`;

  if (flags.references) {
    content += `

## Reference Documentation

Load these files when working on specific aspects:

- **deno-runtime.md**: Deno installation, permissions, and script structure
- **workflows.md**: Sequential, conditional, and script-first workflow patterns
- **output-patterns.md**: Template and example patterns for consistent output
`;
  }

  content += `

## Development Notes

This is a TODO template. Complete the TODO items above and remove this section.

**Important principles:**
- Start description with imperative language ("Validate JSON", "Generate reports")
- Include concrete examples of user requests that should trigger this skill
- Use "ALWAYS" language when scripts must be used
- Provide clear "why use" justifications for script-first workflows
`;
  return content;
};

const EXAMPLE_SCRIPT = (skillName: string) =>
  `#!/usr/bin/env -S deno run --allow-read
/**
 * Example script for ${skillName}.
 *
 * This is a placeholder script that can be executed directly.
 * Replace with actual implementation or delete if not needed.
 */

import { fs, path } from "./deps.ts";

export function main(): void {
  console.log(\`This is an example script for ${skillName}\`);
  // TODO: Add actual script logic here
}

if (import.meta.main) {
  main();
}
`;

const EXAMPLE_ASSET = `# Example Asset File

This placeholder represents where asset files would be stored.
Replace with actual asset files (templates, images, fonts, etc.) or delete if not needed.

Asset files are NOT intended to be loaded into context, but rather used within
the output Claude produces.

## Common Asset Types

- Templates: .pptx, .docx, boilerplate directories
- Images: .png, .jpg, .svg, .gif
- Fonts: .ttf, .otf, .woff, .woff2
- Boilerplate code: Project directories, starter files
- Icons: .ico, .svg
- Data files: .csv, .json, .xml, .yaml

Note: This is a text placeholder. Actual assets can be any file type.
`;

async function initSkill(args: Args): Promise<void> {
  const { skillName, outputPath, scripts, references, assets } = args;

  console.log(`\x1b[36m\u{1F680} Initializing skill: ${skillName}\x1b[0m`);
  console.log(`   Location: ${path.resolve(outputPath)}`);
  console.log();

  validateSkillName(skillName);

  const skillDir = path.resolve(outputPath, skillName);

  if (await fs.exists(skillDir)) {
    console.error(
      `\x1b[31m❌ Error: Skill directory already exists: ${skillDir}\x1b[0m`,
    );
    Deno.exit(1);
  }

  try {
    await fs.ensureDir(skillDir);
    console.log(`\x1b[32m✅ Created skill directory: ${skillDir}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m❌ Error creating directory: ${error}\x1b[0m`);
    Deno.exit(1);
  }

  const titleCaseName = toTitleCase(skillName);
  const skillMdContent = SKILL_TEMPLATE(skillName, titleCaseName, {
    scripts,
    references,
    assets,
  });

  const skillMdPath = path.join(skillDir, "SKILL.md");
  try {
    await Deno.writeTextFile(skillMdPath, skillMdContent);
    console.log(`\x1b[32m✅ Created SKILL.md\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m❌ Error creating SKILL.md: ${error}\x1b[0m`);
    Deno.exit(1);
  }

  if (scripts) {
    try {
      const scriptsDir = path.join(skillDir, "scripts");
      await fs.ensureDir(scriptsDir);

      const depsPath = path.join(scriptsDir, "deps.ts");
      await Deno.writeTextFile(
        depsPath,
        `export * as fs from "https://deno.land/std@0.224.0/fs/mod.ts";\nexport * as path from "https://deno.land/std@0.224.0/path/mod.ts";\nexport * as yaml from "https://deno.land/std@0.224.0/yaml/mod.ts";\n`,
      );

      const exampleScriptPath = path.join(scriptsDir, "example.ts");
      await Deno.writeTextFile(exampleScriptPath, EXAMPLE_SCRIPT(skillName));

      console.log(`\x1b[32m✅ Created scripts/deps.ts\x1b[0m`);
      console.log(`\x1b[32m✅ Created scripts/example.ts\x1b[0m`);
    } catch (error) {
      console.error(
        `\x1b[31m❌ Error creating scripts directory: ${error}\x1b[0m`,
      );
      Deno.exit(1);
    }
  }

  if (references) {
    try {
      const referencesDir = path.join(skillDir, "references");
      await fs.ensureDir(referencesDir);

      console.log(`\x1b[32m✅ Created references/ directory\x1b[0m`);
      console.log(
        `   \x1b[33mℹ️  Note: reference docs are added based on skill needs\x1b[0m`,
      );
    } catch (error) {
      console.error(
        `\x1b[31m❌ Error creating references directory: ${error}\x1b[0m`,
      );
      Deno.exit(1);
    }
  }

  if (assets) {
    try {
      const assetsDir = path.join(skillDir, "assets");
      await fs.ensureDir(assetsDir);

      const exampleAssetPath = path.join(assetsDir, "example_asset.txt");
      await Deno.writeTextFile(exampleAssetPath, EXAMPLE_ASSET);

      console.log(`\x1b[32m✅ Created assets/example_asset.txt\x1b[0m`);
    } catch (error) {
      console.error(
        `\x1b[31m❌ Error creating assets directory: ${error}\x1b[0m`,
      );
      Deno.exit(1);
    }
  }

  console.log(
    `\n\x1b[32m✅ Skill '${skillName}' initialized successfully at ${skillDir}\x1b[0m`,
  );
  console.log("\nNext steps:");
  console.log("1. Complete TODO items in SKILL.md");
  console.log(
    "   - Write compelling description with concrete trigger examples",
  );
  console.log(
    "   - Define workflows using patterns from references/workflows.md",
  );
  console.log(
    "   - Specify output patterns from references/output-patterns.md",
  );
  if (scripts) {
    console.log("2. Implement scripts/ or delete example.ts");
    console.log("   - Test scripts before finalizing");
    console.log("   - Use script-first workflows in SKILL.md");
  }
  if (references) {
    console.log("3. Add domain-specific docs to references/");
    console.log("   - Use progressive disclosure - load only when needed");
  }
  if (assets) {
    console.log("4. Add templates or data files to assets/");
    console.log("   - These are for output, not context");
  }
  console.log(
    "5. Run validator: deno run --allow-read skill-creator/scripts/quick_validate.ts " +
      skillName,
  );
}

const args = parseArgs();

if (import.meta.main) {
  await initSkill(args).catch((error) => {
    console.error(`\x1b[31m❌ Unexpected error: ${error}\x1b[0m`);
    Deno.exit(1);
  });
}
