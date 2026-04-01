# Phase 1 Execution Checklists

## Industry Pages Family To-Do Checklist (15 Tasks)

- [ ] Finalize Wix CMS collections in production (`industryPages`, `industryFaqs`, `industryModules`, `industryLinks`) using `docs/wix-cms-industry-schema.md`.
- [ ] Generate fresh seed files from source of truth with `npm run wix:seed`.
- [ ] Import seed files in required order per `docs/wix-cms-industry-import-runbook.md`.
- [ ] Resolve `industryPageRef` in supporting collections by matching `industrySlug` to `industryPages.slug`.
- [ ] Build and bind the dynamic route `/industries/{slug}`.
- [ ] Bind dynamic SEO controls (title, meta description, canonical, OG, robots).
- [ ] Enforce publish gates so pages cannot publish when `publishReady=false` or QA booleans are incomplete.
- [ ] Complete Wave 1 content for `batch_01` slugs (`wix-seller-financing`, `ecommerce-business-funding`, `restaurant-funding`, `trucking-funding`, `construction-contractor-funding`).
- [ ] Complete QA booleans for each Wave 1 page (`metadataApproved`, `schemaApproved`, `linksApproved`, `disclosureApproved`, `contentApproved`, `qaPass`).
- [ ] Move status through controlled lifecycle (`planned -> brief_ready -> drafting -> ready_for_qa -> qa_passed -> publish_approved -> scheduled -> published`).
- [ ] Publish only Wave 1 pages that pass all gates.
- [ ] Run post-publish verification with `npm run verify`.
- [ ] Log implementation and outcomes in `data/wix_changes.csv` and update open issue references where needed.
- [ ] Monitor performance/indexing/canonical stability for 7-14 days and move weak pages to `refresh_needed`.
- [ ] Start Wave 2 (`batch_02`) only after Wave 1 pass-rate and workflow stability are confirmed.

## Broader SEO Tasks Beyond Industry Pages

### Phase 1 Remaining Families

- [ ] Define borrower profile page family spec (required sections, metadata, schema, CTA, QA gates).
- [ ] Build borrower profile rollout candidate inventory (initial 10-20 slugs with intent/funnel/priority).
- [ ] Implement borrower profile CMS model and dynamic template with the same gate logic used for industry pages.
- [ ] Draft and QA a controlled borrower profile Wave 1 before scaling.
- [ ] Define comparison/alternatives page legal-safe claim policy and evidence requirements.
- [ ] Build comparison page family inventory only for supportable, non-speculative targets.
- [ ] Implement comparison template and schema rules with stricter legal QA gate.
- [ ] Define service/funding solution page expansion map (`/solutions/*` or approved equivalent) tied to money-page goals.
- [ ] Add internal linking architecture map across `industries`, `solutions`, and trust pages.
- [ ] Publish one family at a time; do not overlap family launch waves until QA pass criteria are stable.

### Phase 1 Cross-Cutting SEO Operations

- [ ] Keep open follow-up items active (`MC-005` robots meta policy validation, `MC-006` legacy URL intent triage) until explicitly resolved.
- [ ] Populate `data/keyword_clusters.csv` to support publish-ready status transitions.
- [ ] Expand verification sample set beyond the original five URLs to include newly published dynamic pages.
- [ ] Add recurring QA routine for metadata, canonical, schema, and trust/disclosure checks across live template pages.
- [ ] Establish schema governance updates for each new family in `schemas/` before rollout.
- [ ] Maintain consistent bridge brand usage (`Distilled Funding by Moonshine Capital`) across all new templates.
- [ ] Keep disallowed claims blocked unless evidence and approval exist (approval rates, guaranteed outcomes, unsupported comparisons).

### Beyond Phase 1 (After Family Rollout Stability)

- [ ] Introduce controlled tool/calculator pages only after logic QA and maintenance ownership are defined.
- [ ] Add structured refresh cadence for all dynamic family pages (content refresh, schema refresh, link refresh).
- [ ] Add KPI tracking by family (indexation, ranking movement, qualified CTA starts, page-level conversion assist).
- [ ] Formalize scale gate for Phase 2 (minimum QA pass rate, verification SLA, and issue remediation turnaround).
- [ ] Document migration path from Phase 1 controlled rollout to larger pSEO expansion with unchanged guardrails.
