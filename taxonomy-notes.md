# Taxonomy notes (capability framing)

This document frames the blog-scaffold change set in terms of **business-facing capabilities** (portable across implementation choices), and captures *why the approach worked well* so it can be repeated.

## What we changed vs the initial shape

We started with a small number of broad specs (e.g., “routes”, “search”, “discovery”, “markdown”). That was directionally correct, but it became hard to:
- avoid duplicated requirements (canonical URLs, draft handling, tag rules)
- reason about cross-cutting behaviors (offline/prefetch) without polluting page specs
- keep specs testable (big specs accumulate subjective language and hidden edge cases)

We reorganized into a **domain taxonomy** that maps the website into surfaces and capabilities:

- **content/**: What a post *is* and how authored content becomes publishable units.
- **site/**: What the reader experiences (pages + discovery artifacts + findability/search + cross-cutting behaviors).

This yielded smaller, more “contract-like” specs with clear ownership boundaries.

## Principles that made this successful

1) **Capability-first, implementation-agnostic**
- Specs describe externally observable behavior (URLs, inclusion/exclusion rules, determinism, metadata). 
- Technology choices (language, generator approach, hosting, etc.) are recorded in `thoughts/` so they’re not lost, but they do not drive spec wording.

2) **Centralize invariants; reference them everywhere**
We treated some behaviors as *invariants* that must be consistent across the whole site:
- canonical URL rules
- social metadata rules
- “drafts are excluded from all public surfaces”
- tag case-insensitivity and tag resolution
- unified not-found semantics

Instead of re-stating those per-page (which drifts), we centralized them into dedicated specs and made pages/artifacts reference them.

3) **Split along “surfaces” and “mechanisms”**
- **Surfaces** are reader-facing endpoints (home, post, tag page, RSS, sitemap).
- **Mechanisms** are cross-cutting behaviors that affect multiple surfaces (offline, prefetch, search ranking).

This prevents pages from accumulating a bag of unrelated concerns.

4) **Prefer small specs that compose**
When a spec started to include multiple independent concerns, we split it:
- `site/discovery.md` → RSS, sitemap, robots, page-metadata, social-metadata, structured-data
- `site/search.md` → index, palette, ranking
- `content/markdown.md` → core + focused add-ons (anchors, code blocks, images, tables, footnotes, safety)

This keeps each document:
- easier to review
- easier to test
- less likely to contradict others

5) **Make “determinism” explicit**
Static sites tend to regress when ordering/tie-breakers aren’t specified. We repeatedly added:
- deterministic ordering rules (e.g., newest-first, stable tie-breakers)
- deterministic generation constraints (index outputs, routing behavior)

6) **Continuously dedupe during spec writing (not after)**
We performed a “duplicate requirement sweep” while reorganizing:
- if two specs said the same thing, we picked one canonical home and changed the other to a reference
- we avoided “shadow requirements” (a page spec subtly redefining a global rule)

7) **Keep user intent decisions separate from the contract**
We confirmed product decisions (page size = 10, featured posts, tag case-insensitivity, canonical domain, unified 404) and then treated them as requirements.

The key pattern: *decide → record once → reference everywhere*.

## Top-level capability areas (current)

### 1) Publishing (Content)

**What it is:** The system’s ability to ingest authored content and treat it as publishable units (posts) with metadata.

**Primary entry points:**
- Author adds/edits a post.
- The build process includes or excludes a post based on publication status.

**Sub-capabilities:**
- Post metadata (title/date/slug/description/tags)
- Draft vs published
- Updated date support
- Post-local assets (referenced by content)

### 2) Presentation (Site pages)

**What it is:** The system’s ability to present published content to readers via pages and navigational surfaces.

**Primary entry points:**
- Reader navigates to home.
- Reader navigates to a post.
- Reader browses tags.
- Reader visits colophon.

**Sub-capabilities:**
- Home page composition (curated “best of” + paginated recent)
- Post page
- Tags index and tag page
- Colophon page
- Not-found behavior (404)

### 3) Discovery (SEO / syndication)

**What it is:** The system’s ability to make content discoverable and correctly represented in external systems.

**Primary entry points:**
- Crawlers fetch site pages and discovery artifacts.
- Feed readers consume RSS.

**Sub-capabilities:**
- RSS feed
- Sitemap
- Robots policy (discovery allowed; training disallowed)
- Social cards / metadata
- Structured data for posts

### 4) Findability (On-site search)

**What it is:** The system’s ability to help readers find posts by query.

**Primary entry points:**
- Reader opens command palette.
- Reader enters a query and selects a result.

**Sub-capabilities:**
- Search index generation
- Querying and ranking (title + recency + fuzzy)
- Recent/visited shortcuts

### 5) Performance (Navigation acceleration)

**What it is:** The system’s ability to make navigation feel instant.

**Primary entry points:**
- Reader encounters links while reading/browsing.

**Sub-capabilities:**
- Prefetch policy and guardrails

### 6) Resilience (Offline-capable browsing)

**What it is:** The system’s ability to allow continued browsing under poor/no connectivity.

**Primary entry points:**
- Reader revisits previously visited content while offline.

**Sub-capabilities:**
- Offline caching strategy
- Cache scope (pages/assets/index/images)

## Boundary guidance

- Specs SHOULD describe **portable behaviors** and reader/author-facing capability.
- Specs SHOULD avoid naming implementation technology (language, libraries, specific file layouts), unless those are externally observable constraints.
- Specs SHOULD minimize “vibes language” (e.g., “clear”, “fast”, “impressive”) unless it’s backed by a testable outcome.
- Specs MAY include externally observable constraints such as:
  - URL structure
  - determinism of outputs
  - what content is included/excluded (draft handling)
  - offline caching behavior
  - performance guardrails (e.g., prefetch caps) phrased as outcomes

## Practical heuristics (reusable)

These are the quick checks we used implicitly while reorganizing:

- **If a rule must be identical across multiple pages**, it belongs in a central spec (and pages should reference it).
  - Examples: canonical URL policy, social metadata behavior, not-found semantics, tag resolution.

- **If a spec has more than one reader entry point**, split by entry point.
  - Example: “discovery” became multiple artifacts; “search” became index/palette/ranking.

- **If a requirement mentions multiple domains**, decide which domain owns it and make others reference it.
  - Example: tag case-insensitivity lives in `content/tags.md` even though it affects site routing.

- **If you can’t write a clear acceptance test from a sentence**, rewrite it until you can.

- **Keep decisions in one place**:
  - “decision” = product intent (page size, featured definition)
  - “spec” = contract that must be true everywhere
  - “thoughts” = why we chose it / how we might implement it
