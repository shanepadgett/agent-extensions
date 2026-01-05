# Workflow Patterns

Use these patterns to guide Claude through complex tasks with clear, actionable steps.

## Script-First Workflows

For operations where scripts exist, ALWAYS prioritize using them over manual work:

```markdown
## Validation Workflow

ALWAYS follow these steps when validating JSON data:

1. Run the validation script:
   ```bash
   deno run --allow-read scripts/validate_schema.ts <schema.json> <data.json>
   ```

2. Review the output:
   - If validation passes: Proceed with next steps
   - If validation fails: Examine error messages with property paths

3. Fix issues (found in step 2):
   - Update data to match schema constraints
   - Or update schema if requirements changed

4. Re-run validation (step 1) until successful

**Why use the script:** Validation is fragile - manual checking misses edge cases with nested objects, patterns, enums, and array constraints. The script provides 100% reliable validation with detailed error reporting including exact property paths.
```

## Sequential Workflows

For complex tasks, break operations into clear, sequential steps. Provide overview first:

```markdown
## Processing Workflow

This task involves these sequential steps:

1. **Analyze input** - Run `scripts/analyze.py` to understand structure
2. **Transform data** - Run `scripts/transform.py` with analysis output
3. **Validate result** - Run `scripts/validate.py` against schema
4. **Generate output** - Run `scripts/generate.py` with validated data
5. **Verify quality** - Review output and fix any issues

Do not skip steps - each builds on the previous.
```

## Conditional Workflows

For tasks with branching logic, guide Claude through decision points:

```markdown
## Determine Your Approach

1. **What type of document are you working with?**
   - **New document**: Follow [Creation Workflow](#creation-workflow)
   - **Existing document**: Follow [Modification Workflow](#modification-workflow)

2. Creation Workflow:
   1. Run `scripts/init_doc.py` to create base structure
   2. Edit generated template as needed
   3. Run `scripts/validate_doc.py` to check structure

3. Modification Workflow:
   1. Run `scripts/analyze_doc.py` to understand current state
   2. Make changes based on analysis
   3. Run `scripts/validate_doc.py` to verify integrity
```

## Iterative Workflows

For tasks that may require refinement:

```markdown
## Quality Assurance Workflow

Follow this loop until quality is acceptable:

1. **Generate output** - Run appropriate script or manual process
2. **Review against requirements** - Check all constraints are met
3. **Fix issues found** - Address problems identified in review
4. **Re-validate** - Run validation script again
5. **Repeat** from step 2 until all requirements pass

Stop when: Validation passes AND output meets quality standards
```

## Error Recovery Workflows

Include error handling guidance:

```markdown
## Error Recovery

If script execution fails:

1. **Read error message** - Check for clear cause
2. **Check input data** - Verify format and structure match expectations
3. **Review script requirements** - Ensure all dependencies are available
4. **Test with known-good input** - Use example from `assets/` if available
5. **Report detailed error** - Include script name, input, and full error message

Common issues:
- Missing required fields in input
- Incorrect file paths or permissions
- Dependencies not installed
```

## Workflow Integration

When workflows use multiple scripts, show how output flows:

```markdown
## Pipeline Workflow

This task chains multiple scripts together:

1. **Extract data** (from source file)
   ```bash
   deno run --allow-read scripts/extract.ts input.json > extracted.json
   ```

2. **Process extracted data** (transformation)
   ```bash
   deno run --allow-read --allow-write scripts/process.ts extracted.json > processed.json
   ```

3. **Validate processed data** (quality check)
   ```bash
   deno run --allow-read scripts/validate.ts schema.json processed.json
   ```

4. **Generate final output** (production-ready)
   ```bash
   deno run --allow-read --allow-write scripts/generate.ts processed.json output.json
   ```

**Important:** Each step's output becomes the next step's input. Do not skip validation.
```

## Human-in-the-Loop Workflows

For tasks requiring human feedback:

```markdown
## Review-Driven Workflow

Use this workflow when quality requires human judgment:

1. **Generate initial output** - Use script or manual process
2. **Present for review** - Show output with clear structure
3. **Collect feedback** - Note specific changes requested
4. **Apply changes** - Update based on feedback
5. **Re-present** - Show revised output for confirmation
6. **Finalize** - Mark as complete when approved

Stop when: User explicitly approves the output
```

## When Manual Work is Appropriate

Not all tasks need scripts. Use manual work when:

- **High variability**: Each case is unique and no pattern exists
- **Requires judgment**: Decisions depend on context not easily captured
- **Simple operations**: Task is straightforward and error rate is low
- **Creative work**: Original thinking is required (not transformation)

**When in doubt, ask:** "Would this benefit from a deterministic script that guarantees consistent results?"
