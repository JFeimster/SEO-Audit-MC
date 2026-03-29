# Phase 1 Kickoff

## Objective

Phase 1 moves the repo from remediation into controlled SEO expansion.

The goal is to plan and launch the first structured page families without breaking the controls established in Phase 0.

## Phase 1 Success Criteria

- A prioritized rollout sequence exists for the first scalable page families.
- Each page family has a defined purpose, search intent, schema pattern, internal linking role, and QA requirements.
- A source-of-truth data model exists for future page generation.
- At least one page family is ready for controlled production drafting.
- Phase 0 guardrails remain active during rollout.

## Recommended Scope

Focus Phase 1 on planning and preparing the first controlled rollout for these families:

1. **Industry pages**
   - Example: `/industries/*`
   - Purpose: capture high-intent vertical searches and create reusable service/industry relevance.

2. **Service / funding solution pages**
   - Example: `/solutions/*` or equivalent money-page expansion
   - Purpose: strengthen commercial coverage around funding products and use cases.

3. **Comparison / alternative pages**
   - Example: `[brand-or-option]-alternatives`, `[tool] vs [tool]`
   - Purpose: capture bottom-funnel comparison intent.

## Recommended Order

1. Industry pages
2. Core service / funding solution pages
3. Comparison / alternative pages
4. Tools / calculators / engineering-as-marketing assets

## Phase 1 Workstreams

### 1. Rollout Candidate Inventory

Create a first-pass inventory of candidate pages with:
- slug
- keyword
- page family
- intent
- funnel stage
- priority
- canonical target logic
- schema type
- internal-linking parent
- notes

### 2. Template and Governance Definitions

For each page family, define:
- required sections
- required metadata fields
- required schema pattern
- required CTA placement
- disallowed content shortcuts
- QA gates before publish

### 3. Internal Linking Architecture

Map how new pages will connect to:
- homepage
- primary money pages
- relevant blog content
- related industry / solution pages

### 4. Controlled Drafting

Choose one family and prepare a limited rollout batch.
Recommendation: start with **industry pages**.

## Guardrails

- Do not start mass generation.
- Do not publish new page families without a source-of-truth inventory.
- Keep verification workflows active.
- Keep `MC-005` and `MC-006` open until separately resolved.

## Recommendation

The first Phase 1 deliverable should be a rollout planner and source-of-truth CSV for the first scalable page family.

Recommendation:
- create `data/phase1_rollout_candidates.csv`
- create `docs/page-family-specs.md`
- define the first 10-20 candidate industry pages before drafting anything
