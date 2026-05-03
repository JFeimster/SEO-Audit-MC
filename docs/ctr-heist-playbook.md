# CTR Heist Playbook

Snapshot date: `2026-05-03`
Purpose: improve click-through rate on existing or planned high-intent pages without inventing claims, redirects, or performance numbers

## First-Page / Low-CTR Logic

Use this playbook only when all conditions are true:

1. The URL already ranks on page 1 or near-page-1 based on an approved source such as Google Search Console or a trusted rank export.
2. The page has meaningful impressions for the target query family.
3. The page has a CTR problem relative to its query intent, or its current title/meta pairing does not clearly match the searcher need.
4. Canonical, indexation, and trust/disclosure status are not blocked.

If performance evidence is missing, mark the target `needs_data` in `data/ctr_heist_targets.csv` instead of guessing.

## Title / Meta Rewrite Formula

Title formula:

`[Primary keyword]: [specific use case or decision angle] | Distilled Funding by Moonshine Capital`

Allowed title levers:

- audience clarity
- use-of-funds clarity
- comparison or alternative intent
- review angle only when the page actually evaluates that target
- year modifier only when the page is genuinely current and maintained

Disallowed title levers:

- guaranteed approvals
- best-on-the-internet claims without evidence
- fake urgency
- ratings or review counts not backed by first-party proof

Meta description formula:

`[Who the page is for] + [what the page helps compare or decide] + [one evidence-backed qualifier] + [neutral CTA]`

Example pattern:

`Compare funding options for [audience/use case], review what to prepare, and decide whether this path fits before you apply.`

## At-a-Glance Box Requirements

Use an above-the-fold or early-page summary box on priority CTR pages.

Required fields:

- best fit for
- common use of funds
- typical documents to prepare
- decision angle such as review, alternative, or industry fit
- key caution or qualification note
- primary CTA

Rules:

- keep every item factual and supportable
- do not promise rates, timing, or approvals unless approved evidence exists
- if a page compares another brand, keep the box descriptive rather than score-based unless a scoring rubric is documented

## FAQ / Schema Recommendations

Default schema options by page type:

- industry pages: `WebPage | Service | FAQPage | BreadcrumbList`
- review pages: `WebPage | FAQPage | BreadcrumbList`
- comparison or alternatives pages: `WebPage | FAQPage | BreadcrumbList`
- informational pillar pages: `WebPage | FAQPage | BreadcrumbList`

Schema restrictions:

- add `FAQPage` only when the FAQs are visible on the page
- do not use `Review` or `AggregateRating` schema unless first-party review evidence and governance approval exist
- use `Service` only when the page clearly maps to the funding offer
- canonical in schema must match the approved page canonical

Recommended FAQ themes:

- qualification expectations
- when this option fits or does not fit
- what documents to prepare
- how this page differs from adjacent options
- what to compare before applying

## Priority Page Families

Priority order for CTR rewrite review:

1. SellersFi review pages
   - focus on credibility, fit, and decision-support framing
2. Amazon Lending alternatives pages
   - focus on comparison clarity and alternative-path intent
3. Wix seller financing pages
   - focus on seller-specific use cases and application-readiness signals
4. Fund&Grow review pages
   - focus on qualification clarity and evidence-backed caveats
5. David Allen Capital reviews pages
   - focus on review intent, process clarity, and trust framing
6. Gig worker pages
   - focus on platform-specific funding questions and qualification reality

## Operating Guardrails

- Do not rewrite titles or metas for pages with unresolved canonical or redirect decisions.
- Do not ship CTR rewrites on pages still blocked by Wix live binding issues.
- Do not invent performance deltas; use approved reporting exports for prioritization.
- Keep bridge brand naming consistent with `docs/brand-rules.md`.
