---
name: skill-creator
description: Guide for creating effective skills. Use when users want to create/update skills that extend Claude's capabilities with specialized knowledge, workflows, or tool integrations. Requires Deno runtime for scripts.
---

# Skill Creator

This skill provides guidance for creating effective skills.

## Prerequisites

This skill requires Deno to be installed locally.

Check your installed version:
```bash
deno -v
```

If Deno is not installed, tell the user to install it using one of these methods:

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

Or visit: https://docs.deno.com/runtime/getting_started/installation/

**IMPORTANT: DO NOT attempt to install Deno yourself. Always instruct the user to install it.**

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific domains or tasks.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

## Core Principles

### Concise is Key

The context window is a public good. Skills share the context window with everything else Claude needs.

**Default assumption: Claude is already very smart.** Only add context Claude doesn't already have.

Prefer concise examples over verbose explanations.

### Set Appropriate Degrees of Freedom

Match the level of specificity to the task's fragility and variability:

**High freedom (text-based instructions)**: Use when multiple approaches are valid, decisions depend on context, or heuristics guide the approach.

**Medium freedom (pseudocode or scripts with parameters)**: Use when a preferred pattern exists, some variation is acceptable, or configuration affects behavior.

**Low freedom (specific scripts, few parameters)**: Use when operations are fragile and error-prone, consistency is critical, or a specific sequence must be followed.

### Anatomy of a Skill

Every skill consists of a required SKILL.md file and optional bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (TypeScript with Deno)
    ├── references/       - Documentation loaded as needed
    └── assets/           - Files used in output (templates, images, etc.)
```

#### SKILL.md (required)

Every SKILL.md consists of:

- **Frontmatter** (YAML): Contains `name` and `description` fields. These are the only fields that Claude reads to determine when the skill gets used.
- **Body** (Markdown): Instructions and guidance for using the skill. Only loaded AFTER the skill triggers.

#### Bundled Resources (optional)

##### scripts/ (Deno/TypeScript)

Executable TypeScript code for tasks that require deterministic reliability or are repeatedly rewritten.

**When to include**: When the same code is being rewritten repeatedly or deterministic reliability is needed.

**Benefits**: Token efficient, deterministic, can be executed without loading into context.

**Note**: Scripts may still need to be read by Claude for patching or environment-specific adjustments.

##### references/

Documentation intended to be loaded as needed into context to inform Claude's process and thinking.

**When to include**: For documentation that Claude should reference while working.

**Use cases**: Database schemas, API documentation, domain knowledge, company policies, detailed workflow guides.

**Benefits**: Keeps SKILL.md lean, loaded only when Claude determines it's needed.

##### assets/

Files not intended to be loaded into context, but rather used within the output Claude produces.

**When to include**: When the skill needs files that will be used in the final output.

**Use cases**: Templates, images, icons, boilerplate code, fonts, sample documents.

**Benefits**: Separates output resources from documentation, enables Claude to use files without loading them into context.

### Progressive Disclosure Design Principle

Skills use a three-level loading system to manage context efficiently:

1. **Metadata (name + description)** - Always in context (~100 tokens)
2. **SKILL.md body** - When skill triggers (<5k tokens, <500 lines)
3. **Bundled resources** - As needed by Claude

Keep SKILL.md body to the essentials and under 500 lines. Split content into separate files when approaching this limit.

#### Progressive Disclosure Patterns

**Pattern 1: High-level guide with references**

```markdown
# PDF Processing

## Quick start

Extract text with pdfplumber:
[code example]

## Advanced features

- **Form filling**: See [FORMS.md](references/FORMS.md) for complete guide
- **API reference**: See [REFERENCE.md](references/REFERENCE.md) for all methods
```

**Pattern 2: Domain-specific organization**

```
bigquery-skill/
├── SKILL.md (overview and navigation)
└── references/
    ├── finance.md
    ├── sales.md
    ├── product.md
    └── marketing.md
```

When a user asks about sales metrics, Claude only reads sales.md.

## Skill Creation Process

Skill creation involves these steps:

1. Understand the skill with concrete examples
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize the skill (run init_skill.ts)
4. Edit the skill (implement resources and write SKILL.md)
5. Iterate based on real usage

### Step 1: Understanding the Skill with Concrete Examples

To create an effective skill, clearly understand concrete examples of how the skill will be used.

For example, when building a skill for PDF manipulation:
- "What functionality should this skill support?"
- "Can you give some examples of how this skill would be used?"
- "What would a user say that should trigger this skill?"

### Step 2: Planning the Reusable Skill Contents

Analyze each example by:
1. Considering how to execute from scratch
2. Identifying what scripts, references, and assets would be helpful

Example: For a skill to rotate PDFs:
- Rotating requires rewriting the same code each time
- A `scripts/rotate_pdf.ts` script would be helpful

Example: For a frontend webapp builder skill:
- Writing webapps requires the same boilerplate HTML/React each time
- An `assets/hello-world/` template would be helpful

Example: For a BigQuery skill:
- Querying requires re-discovering table schemas each time
- A `references/schema.md` file would be helpful

### Step 3: Initializing the Skill

Run the init script with CLI flags based on what the skill needs:

```bash
deno run --allow-read --allow-write skill-creator/scripts/init_skill.ts <skill-name> --path skill --scripts --references --assets
```

Flags:
- `--scripts`: Create scripts/ directory with example script
- `--references`: Create references/ directory with example reference doc
- `--assets`: Create assets/ directory with example asset placeholder

Only include flags for resources the skill actually needs.

### Step 4: Edit the Skill

When editing the skill, include information that would be beneficial and non-obvious to Claude.

#### Start with Reusable Skill Contents

To begin, start with the reusable resources: `scripts/`, `references/`, and `assets/` files.

Any example files not needed for the skill should be deleted.

#### Update SKILL.md

**Writing Guidelines:** Always use imperative/infinitive form.

##### Frontmatter

Write YAML frontmatter with `name` and `description`:

- `name`: The skill name (hyphen-case, max 64 chars)
- `description`: This is primary triggering mechanism. Include both what to skill does and specific triggers/contexts for when to use it.
```yaml
---
name: docx
description: Comprehensive document creation, editing, and analysis. Use when Claude needs to work with professional documents (.docx files) for creating, editing, tracked changes, or comments.
```

Do not include any other fields unless needed.

##### Body

Write instructions for using the skill and its bundled resources.

**Use the reference patterns** from `references/workflows.md` and `references/output-patterns.md`:

- **Workflows**: Use "Script-First Workflow" patterns for skills with scripts. Always use "ALWAYS" language and provide "why use" justifications.
- **Sequential workflows**: Break complex tasks into ordered steps with clear progression
- **Conditional workflows**: Guide through decision points with branching logic
- **Output patterns**: Specify exact templates or patterns for consistent, high-quality output

**Key principles:**
- Be directive, not passive: "Use `validate.ts` script" not "You can use `validate.ts` script"
- Include concrete trigger examples in description
- Explain WHY scripts should be used (deterministic, error-free, token-efficient)
- Link to reference docs for detailed patterns

### Step 5: Iterate

After testing the skill, users may request improvements.

**Iteration workflow:**
1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes and test again

## Running This Skill's Scripts

This skill includes scripts that you can run with Deno.

### Initialize a New Skill

```bash
deno run --allow-read --allow-write skill-creator/scripts/init_skill.ts <skill-name> --path skill [--scripts] [--references] [--assets]
```

Example:
```bash
deno run --allow-read --allow-write skill-creator/scripts/init_skill.ts csv-processor --path skill --scripts --references
```

### Validate a Skill

```bash
deno run --allow-read skill-creator/scripts/quick_validate.ts <skill-path>
```

For JSON output:
```bash
deno run --allow-read skill-creator/scripts/quick_validate.ts <skill-path> --json
```

Example:
```bash
deno run --allow-read skill-creator/scripts/quick_validate.ts skill/csv-processor
```

## Resources

### references/

Contains documentation for creating effective skills.

- `workflows.md` - Sequential and conditional workflow patterns
- `output-patterns.md` - Template and examples patterns
- `deno-runtime.md` - Deno-specific guidance and permissions
- `script_rules.md` - Guidelines for writing Deno scripts
