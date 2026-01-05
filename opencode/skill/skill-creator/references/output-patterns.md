# Output Patterns

Use these patterns to guide Claude toward consistent, high-quality output.

## Strict Template Pattern

For outputs with strict format requirements (APIs, data files, config):

```markdown
## Output Format

ALWAYS use this exact structure for output:

```yaml
metadata:
  version: "1.0"
  created_at: "<ISO-8601-timestamp>"
  source: "<data-source>"

content:
  items:
    - id: "<unique-id>"
      name: "<item-name>"
      value: <numeric-value>

summary:
  total_items: <count>
  processed_at: "<ISO-8601-timestamp>"
```

**Do not deviate from this structure.** All fields are required.
```

## Flexible Template Pattern

For outputs where structure matters but adaptation is needed:

```markdown
## Output Structure

Use this as a default template, but adapt sections based on content:

```markdown
# [Analysis Title]

## Executive Summary
[One paragraph summarizing key findings - 3-5 sentences]

## Detailed Findings
[Organize into logical sections with specific data]

### Section 1: [Section Title]
- Finding with supporting evidence
- Finding with supporting evidence

### Section 2: [Section Title]
- Finding with supporting evidence
- Finding with supporting evidence

## Recommendations
[Numbered, specific, actionable items]
1. Specific action with responsible party
2. Specific action with timeline

## Conclusion
[Brief wrap-up paragraph]
```

**Adaptation guidelines:**
- Add sections if more categories are needed
- Merge sections if content is sparse
- Keep Executive Summary to one paragraph
- Ensure all recommendations are actionable
```

## Code Generation Pattern

For generating code in specific languages:

```markdown
## Code Output Format

Generate code following these standards:

**Language conventions:**
- Use modern syntax (ES6+, Python 3.9+, etc.)
- Follow language-specific style guides (PEP 8, ESLint, etc.)
- Include type annotations where appropriate
- Add comments for non-obvious logic

**Structure:**
```typescript
/**
 * Brief description of what this code does
 * 
 * @param param1 - Description of parameter
 * @returns Description of return value
 */
export function functionName(param1: type1): ReturnType {
  // Implementation
  // Comments for complex logic
  
  return result;
}
```

**Error handling:**
- Always handle potential errors
- Use try-catch for I/O operations
- Provide meaningful error messages
- Log relevant context for debugging

**Testing:**
- Include example usage
- Document expected behavior
- Note any edge cases handled
```

## Data Transformation Pattern

When converting between formats:

```markdown
## Transformation Rules

Apply these rules when converting data:

**Field mappings:**
| Source Field | Target Field | Transformation |
|--------------|---------------|----------------|
| `user_id` | `id` | Direct copy |
| `created_at` | `timestamp` | Convert to ISO-8601 |
| `status_code` | `status` | Map numeric to text |

**Data validation:**
- Required fields must be present
- Null values become empty strings or default values
- Numeric fields validated against min/max
- Dates standardized to ISO-8601 format

**Structural changes:**
- Flatten nested objects up to 2 levels deep
- Arrays converted to comma-separated strings
- Booleans converted to "true"/"false" strings
- Null becomes default: empty string for text, 0 for numbers

**Output example:**
```json
{
  "id": "user-123",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "active"
}
```
```

## Examples-Driven Pattern

For tasks where quality depends on seeing good examples:

```markdown
## Expected Output Style

Generate outputs following these concrete examples:

**Example 1 - Standard case:**
```
Input: User requested password reset
Output:
```
Subject: Reset Your Password

Hi [Name],

We received a request to reset your password. Click below to proceed:

[Reset Password Link]

If you didn't request this, ignore this email.
```

**Example 2 - Urgent case:**
```
Input: Security alert: unusual login detected
Output:
```
Subject: ⚠️ Security Alert: New Login Detected

Hi [Name],

We detected a login from:

Location: San Francisco, CA
Time: January 15, 2024 at 10:30 AM
Device: MacBook Pro / Chrome

Was this you? If not, secure your account immediately.

[Secure Account Button]
```

**Key patterns to follow:**
- Use clear, action-oriented subject lines
- Provide relevant context (what happened, when, where)
- Include specific next steps or actions
- Use urgency indicators only when appropriate
- Keep under 200 words total
```

## Interactive Output Pattern

For outputs that require user interaction:

```markdown
## Interactive Response Structure

Structure responses for conversational clarity:

1. **Acknowledge request** - Confirm understanding
2. **Provide primary answer** - Main solution or information
3. **Offer alternatives** - Other valid approaches if relevant
4. **Request clarification** - Ask about missing context if needed
5. **Propose next steps** - Suggest logical follow-up actions

**Example:**
```
I can help you generate TypeScript types from that JSON schema.

Here's what I'll do:
1. Read the schema file
2. Parse all type definitions and constraints
3. Generate TypeScript interfaces with proper types
4. Handle optional fields and nested objects correctly

Before I start, do you:
- Need these types for a specific framework (React, Node, etc.)?
- Want interfaces as standalone or in a single file?
- Need JSDoc comments included?

Once you clarify, I'll generate the types for you.
```
```

## Error Reporting Pattern

For reporting issues or failures:

```markdown
## Error Reporting Format

Always report errors with complete context:

```markdown
## Error: [Brief Error Title]

**What happened:**
[Clear description of what failed]

**Location:**
- Script: `scripts/failed_script.ts`
- Function: `processData()`
- Line: 42

**Error message:**
```
[Full error message from script]
```

**Input that caused error:**
```json
{ "sample": "input" }
```

**Possible causes:**
1. [Most likely cause]
2. [Secondary cause]
3. [Less likely cause]

**Suggested fixes:**
1. [Fix for cause 1]
2. [Fix for cause 2]

**Need help?** Provide this information when reporting issue
```

**Important:** Always include the full error message and sample input.
```

## Progress Update Pattern

For long-running operations with multiple steps:

```markdown
## Progress Reporting

Provide updates at key milestones:

**Completed steps:** ✅ Step 1, ✅ Step 2
**Current step:** 🔄 Step 3 - Processing data...
**Remaining steps:** ⏳ Step 4, ⏳ Step 5

**Current output:** [Show intermediate result if useful]

**Estimated completion:** [Time estimate if possible]

**Errors encountered:** [List any issues and how they were handled]

```

## Quality Checklist Pattern

For outputs requiring verification:

```markdown
## Quality Checklist

Before finalizing, verify these requirements:

**Required elements:**
- [ ] All mandatory sections present
- [ ] Data accuracy verified
- [ ] Formatting consistent throughout
- [ ] No placeholder text remaining

**Quality standards:**
- [ ] Clear and concise language
- [ ] Professional tone maintained
- [ ] Technical terms used correctly
- [ ] Appropriate for target audience

**Completeness:**
- [ ] All requested information included
- [ ] Edge cases addressed
- [ ] Dependencies documented
- [ ] Next steps clear

**Only mark as complete when all items checked.**
```
