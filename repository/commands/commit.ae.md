---
description: Create high-quality git commits with clear Conventional Commit messages
---

# Commit Work

Create clean, reviewable commits from staged/unstaged changes with minimal back‑and‑forth.

## Goal

Make commits that are easy to review and safe to ship. Commit messages must describe behavior and intent.

## Agent behavior (non-interactive by default)

- **Default**: execute this workflow end-to-end without asking the user what to do.
- **Single commit**: if the changes are reasonably cohesive, proceed to stage, verify, and commit **without asking for approval**.
- **Multiple commits**: if a split is clearly beneficial (unrelated changes, risk isolation, large refactor + behavior change, etc.), present a short commit plan (commit messages + file groupings) and ask for approval **once**. After approval, execute the plan.
- **Only ask questions** when absolutely required (e.g., ambiguous ownership/intent, or the diff is so large/mixed that multiple reasonable splits exist). Prefer making a sensible determination yourself.

## Workflow

1. **Inspect**: Check state with `git status` and `git diff`.
2. **Boundary**: Group changes into logical units. Default to one commit; split only for clear review benefit or risk isolation.
3. **Stage**: Use `git add -p` for mixed files. Review with `git diff --cached` to ensure no secrets or debug logs.
4. **Verify**: Run the fastest relevant check (tests/lint) before committing.
5. **Commit**: Use `git commit -v` with Conventional Commits.
    - `type(scope): short summary` (imperative, what + why)
    - Body (rationale)
    - Footer (breaking changes)

### Mandatory guardrails

- Always run `git diff --cached` immediately before committing.
- If you detect secrets/credentials/keys, **stop** and warn the user.
- If checks fail, fix them and rerun checks; do not commit with failing validators unless the user explicitly approves skipping.

## Usage Examples

- **Do**: `feat(auth): add login rate limiting to prevent brute force`
- **Don't**: `update login.js` or `fix some bugs`
- **Do**: Split a risky database migration from a cosmetic UI fix.
- **Don't**: Mix 15 unrelated file changes into a single "cleanup" commit.

## Success Criteria

- [ ] Working tree is clean.
- [ ] Commit history is linear and logical.
- [ ] Messages follow Conventional Commits.
- [ ] Verification steps passed.

## Deliverable

Run `git log --oneline -5` to verify and prove work.
