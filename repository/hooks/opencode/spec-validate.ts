import type { Plugin } from "@opencode-ai/plugin";

declare const Bun: {
  file(path: string): { text(): Promise<string> };
  pathToFileURL(path: string): URL;
};

type SpecKind = "new" | "delta";

type SpecValidationIssue = {
  code: string;
  message: string;
};

type SpecValidationResult = {
  ok: boolean;
  kind: SpecKind | null;
  issues: SpecValidationIssue[];
};

function issue(code: string, message: string): SpecValidationIssue {
  return { code, message };
}

function splitFrontmatter(markdown: unknown): { frontmatterRaw: string | null; body: string } {
  if (typeof markdown !== "string") {
    return { frontmatterRaw: null, body: "" };
  }

  if (!markdown.startsWith("---\n")) {
    return { frontmatterRaw: null, body: markdown };
  }

  const endIndex = markdown.indexOf("\n---\n", "---\n".length);
  if (endIndex === -1) {
    return { frontmatterRaw: null, body: markdown };
  }

  const frontmatterRaw = markdown.slice(4, endIndex + 1);
  const body = markdown.slice(endIndex + "\n---\n".length);
  return { frontmatterRaw, body };
}

function parseKind(frontmatterRaw: string | null): SpecKind | null {
  if (!frontmatterRaw) return null;
  const kindMatch = frontmatterRaw.match(/^kind:\s*(new|delta)\s*$/m);
  if (!kindMatch) return null;
  return kindMatch[1] as SpecKind;
}

function hasHeadingPrefix(body: string, prefix: string): boolean {
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}\\s+.+$`, "m").test(body);
}

function validateNew(body: string): SpecValidationIssue[] {
  const issues: SpecValidationIssue[] = [];

  if (!hasHeadingPrefix(body, "#")) {
    issues.push(issue("new.missing_title", "Missing top-level '# <Title>' heading"));
  }
  if (!hasHeadingPrefix(body, "## Overview")) {
    issues.push(issue("new.missing_overview", "Missing '## Overview' section"));
  }
  if (!hasHeadingPrefix(body, "## Requirements")) {
    issues.push(issue("new.missing_requirements", "Missing '## Requirements' section"));
  }

  if (/^###\s+(ADDED|MODIFIED|REMOVED)\s*$/m.test(body)) {
    issues.push(
      issue(
        "new.delta_buckets",
        "`kind: new` spec must not include delta buckets (### ADDED/MODIFIED/REMOVED)",
      ),
    );
  }

  return issues;
}

function validateDelta(body: string): SpecValidationIssue[] {
  const issues: SpecValidationIssue[] = [];

  if (!hasHeadingPrefix(body, "#")) {
    issues.push(issue("delta.missing_title", "Missing top-level '# <Title>' heading"));
  }
  if (!hasHeadingPrefix(body, "## Requirements")) {
    issues.push(issue("delta.missing_requirements", "Missing '## Requirements' section"));
  }

  const requirementsIndex = body.indexOf("## Requirements");
  if (requirementsIndex !== -1) {
    const nextSectionIndex = body.indexOf("\n## ", requirementsIndex + "## Requirements".length);
    const requirementsSection = body.slice(
      requirementsIndex,
      nextSectionIndex === -1 ? body.length : nextSectionIndex + 1,
    );

    const hasBucket = /^(###\s+(ADDED|MODIFIED|REMOVED)\s*)$/m.test(requirementsSection);
    if (!hasBucket) {
      issues.push(
        issue(
          "delta.missing_buckets",
          "Delta spec must include at least one bucket under '## Requirements'",
        ),
      );
    }

    if (/^###\s+MODIFIED\s*$/m.test(requirementsSection)) {
      const modifiedStart = requirementsSection.indexOf("### MODIFIED");
      const nextBucketIndex = [
        requirementsSection.indexOf("### ADDED", modifiedStart + 1),
        requirementsSection.indexOf("### REMOVED", modifiedStart + 1),
      ]
        .filter((n) => n !== -1)
        .sort((a, b) => a - b)[0];

      const modifiedBlock = requirementsSection.slice(
        modifiedStart,
        nextBucketIndex === undefined ? requirementsSection.length : nextBucketIndex,
      );

      const topics = modifiedBlock
        .replace(/^###\s+MODIFIED\s*\n?/m, "")
        .trim()
        .split(/^####\s+/m)
        .map((s) => s.trim())
        .filter(Boolean);

      for (const topic of topics) {
        const beforeIndex = topic.indexOf("**Before:**");
        const afterIndex = topic.indexOf("**After:**");
        if (beforeIndex === -1 || afterIndex === -1 || afterIndex < beforeIndex) {
          issues.push(
            issue(
              "delta.modified_malformed",
              "Each MODIFIED topic must contain '**Before:**' followed by '**After:**'",
            ),
          );
          break;
        }
      }
    }
  }

  return issues;
}

export function validateChangeSpecMarkdown(markdown: unknown): SpecValidationResult {
  const { frontmatterRaw, body } = splitFrontmatter(markdown);
  const kind = parseKind(frontmatterRaw);

  const issues: SpecValidationIssue[] = [];

  if (!frontmatterRaw) {
    issues.push(issue("fm.missing", "Missing YAML frontmatter (--- ... ---)"));
  }
  if (!kind) {
    issues.push(issue("fm.kind_missing", "Missing required 'kind: new|delta' in frontmatter"));
  }

  if (kind === "new") issues.push(...validateNew(body));
  if (kind === "delta") issues.push(...validateDelta(body));

  return { ok: issues.length === 0, kind, issues };
}

function splitPathSegments(p: string): string[] {
  return p.split(/[\\/]+/).filter(Boolean);
}

function relPath(worktree: string, filePath: string): string {
  const wt = splitPathSegments(worktree);
  const fp = splitPathSegments(filePath);

  let i = 0;
  while (i < wt.length && i < fp.length && wt[i] === fp[i]) i++;

  return fp.slice(i).join("/");
}

function isChangeSpecPath(worktree: string, filePath: string): boolean {
  const wt = splitPathSegments(worktree);
  const fp = splitPathSegments(filePath);

  // Find the longest common prefix length.
  let i = 0;
  while (i < wt.length && i < fp.length && wt[i] === fp[i]) i++;

  const relSegments = fp.slice(i);
  const rel = relSegments.join("/");
  return /^changes\/[^/]+\/specs\/.*\.md$/.test(rel);
}

function formatIssues(rel: string, issues: { code: string; message: string }[]): string {
  return `Spec validation failed: ${rel}\n${issues.map((i) => `- [${i.code}] ${i.message}`).join("\n")}`;
}

function extractPathFromTitle(title: unknown): string | null {
  if (typeof title !== "string") return null;

  // Prefer backticked paths since they're unambiguous.
  const backticked = title.match(/`([^`]+)`/);
  if (backticked?.[1]) return backticked[1];

  // Fallback: grab a repo-relative path.
  const plain = title.match(/\b(changes\/[\w.-]+\/specs\/[^\s]+\.md)\b/);
  if (plain?.[1]) return plain[1];

  return null;
}

export const SpecValidatePlugin: Plugin = async ({ worktree }) => {
  const specFormatHint =
    "If you're unsure how to structure this spec, review the `spec-format` skill.";

  async function validateFile(filePath: string) {
    if (!isChangeSpecPath(worktree, filePath)) return;

    const markdown = await Bun.file(filePath).text();
    const result = validateChangeSpecMarkdown(markdown);
    if (result.ok) return;

    const rel = relPath(worktree, filePath);
    const message = formatIssues(rel, result.issues);

    throw new Error(`${message}\n\n${specFormatHint}`);
  }

  return {
    // Run as a post-edit "lint": validate the entire file content after edits.
    "tool.execute.after": async (input: any, output: any) => {
      if (input?.tool !== "edit" && input?.tool !== "write") return;

      // Per OpenCode docs, `output.title` should contain the human-readable
      // summary including the edited/written filepath.
      const filePath =
        (extractPathFromTitle(output?.title) ?? output?.args?.filePath ?? input?.args?.filePath) as unknown;

      if (typeof filePath !== "string") return;

      await validateFile(filePath);
    },
  };
};
