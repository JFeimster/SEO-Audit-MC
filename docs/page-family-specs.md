# Page Family Specs

Input note: `docs/phase-1-kickoff.md` was not present in this checkout on 2026-03-29. This spec is based on `docs/phase-0-closeout.md`, `data/url_inventory.csv`, and `data/audit_issues.csv`.

## Family: Industry Pages

### Page Purpose

- Capture high-commercial-intent industry funding queries that map directly to the existing revenue-based financing offer.
- Convert qualified operators into application starts without publishing unverified claims.
- Reuse one controlled structure while requiring industry-specific proof points before publish.

### Required Sections

1. `H1`: `Funding for <industry> businesses`
2. Industry context:
   - 2 to 4 short paragraphs explaining financing pressure unique to that industry
3. Common use-of-funds:
   - working capital
   - payroll
   - inventory or materials
   - equipment or project timing
4. Qualification and documentation expectations:
   - what operators should prepare before applying
5. Process and timelines:
   - factual process steps only
6. FAQ block:
   - 4 to 6 questions mapped to real objections from sales or support notes
7. Trust/disclosure block:
   - bridge brand naming and disclosure language per brand rules
8. Primary CTA block:
   - single clear application action

### Required Metadata

- `title`: include primary keyword plus bridge brand; keep intent commercial.
- `meta_description`: describe the funding use case and CTA; no promises or guarantees.
- `h1`: match page purpose and keyword variant.
- `canonical`: explicit final URL for this industry slug.
- `indexation`: explicit `indexable` decision documented before publish.
- `open_graph_title` and `open_graph_description`: aligned with title and meta description.
- `brand_name`: must use `Distilled Funding by Moonshine Capital` or approved short form.

### Required Schema Pattern

- Page-level JSON-LD must include:
  - `WebPage`
  - `Service` (funding service intent tied to the industry page)
  - `FAQPage` when FAQ content is present
  - `BreadcrumbList`
- Required schema checks:
  - visible content and schema claims match
  - canonical URL in schema matches page canonical
  - bridge brand naming matches approved rules
- Fail condition:
  - if any required property is missing or unverifiable then page status remains `blocked` and does not publish

### Internal Linking Rules

- Required outbound internal links on every industry page:
  - one link to primary service page (`/revenuebased`)
  - one link to trust page (`/privacy-policy` until a stronger trust page is designated)
  - one sibling industry link
- Required inbound links before publish:
  - linked from `/industries` index page
  - linked from at least one money page or navigation surface
- Link text must be descriptive and industry-specific; avoid repeated generic `learn more` anchors.

### CTA Rules

- Primary CTA type: `start_application`.
- Placement:
  - once above the fold
  - once after qualification/documentation section
  - once near page end
- CTA copy must be neutral and direct; no urgency gimmicks, no guaranteed outcome wording.

### QA Gates

1. Data gate:
   - row exists in `data/phase1_rollout_candidates.csv`
   - keyword cluster row exists and is approved
2. Content gate:
   - all required sections complete
   - no placeholder copy or unresolved notes
3. Metadata gate:
   - title, meta description, canonical, and indexation set
4. Schema gate:
   - required pattern present and validated
5. Trust gate:
   - bridge brand naming compliant
   - disclosure block present
6. Verification gate:
   - included in next representative URL verification batch and passes

### Disallowed Shortcuts

- Publishing industry pages with generic copy swaps only.
- Reusing one FAQ block unchanged across multiple industries.
- Leaving canonical or indexation blank pending later cleanup.
- Shipping schema copied from another page without industry alignment.
- Adding performance claims, approval rates, or borrower outcomes without verified evidence.
