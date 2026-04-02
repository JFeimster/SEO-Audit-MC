# Phase 1 Execution Checklists

## Wave 1 Execution Tracking (Industry Pages)

- Latest execution tracker CSV: `data/phase1_wave1_execution_tracking.csv`
- Latest Wave 1 next-actions brief: `docs/phase-1-wave1-next-actions.md`
- Latest seed validation report: `reports/wix-industry-implementation-verification.md` (`npm run verify:wix` run on `2026-04-01`, errors `0`, warnings `0`)
- Latest live binding report: `reports/wix-wave1-live-binding-verification.md` (`npm run verify:wix:live` run on `2026-04-01`, errors `16`, warnings `5`)
- Router diagnostic report: `reports/wix-wave1-router-diagnostic.md` (missing `industries` dynamic router prefix confirmed on `2026-04-01`)
- Router verifier command: `npm run verify:wix:router` (fails loudly until the published site exposes the `industries` dynamic router prefix)
- API remediation note: `industryPages` now includes collection-defined PAGE_LINK fields and `PUBLISH` plugin, but live router output is still static/fallback and requires Wix Editor route/template correction.
- Dynamic binding hotfix runbook: `docs/wix-wave1-dynamic-binding-hotfix.md`
- Wave 1 editor value sheet: `reports/wix-wave1-editor-binding-sheet.csv`
- Exact Wix UI `industryPageRef` operator checklist: `docs/wix-wave1-industryPageRef-mapping-checklist.md`
- Scope note: tracking is intentionally limited to Wave 1 (`batch_01`) and does not recreate candidate planning artifacts.

## Industry Pages Family To-Do Checklist (Wave 1 Status)

- [x] Finalize Wix CMS collections in production (`industryPages`, `industryFaqs`, `industryModules`, `industryLinks`) using `docs/wix-cms-industry-schema.md`.
- [x] Generate seed files from source of truth with `npm run wix:seed`.
- [x] Run `npm run verify:wix` and resolve binding-blocking errors before import (`Errors: 0`, `Warnings: 0` on `2026-04-01`).
- [x] Import seed files in required order per `docs/wix-cms-industry-import-runbook.md`.
- [x] Resolve `industryPageRef` in supporting collections by matching `industrySlug` to `industryPages.slug`.
- [ ] Recreate and bind the live dynamic route `/industries/{slug}` so router prefix `industries` exists in published config.
- [ ] Bind dynamic SEO controls from CMS fields (title, meta description, canonical, OG, robots) on the live dynamic template.
- [ ] Verify dynamic template bindings in Wix Editor (hero/H1/body/CTA + repeater filters by `industryPageRef` + publish gate logic) and ensure they render on public URLs.
- [x] Enforce publish gates so pages cannot proceed when `publishReady=false` or QA booleans are incomplete.
- [x] Complete Wave 1 content/media for `batch_01` slugs (`wix-seller-financing`, `ecommerce-business-funding`, `restaurant-funding`, `trucking-funding`, `construction-contractor-funding`).
- [ ] Re-complete QA booleans for each Wave 1 page after live binding fix (`metadataApproved`, `schemaApproved`, `linksApproved`, `disclosureApproved`, `contentApproved`, `qaPass`).
- [ ] Advance lifecycle from `ready_for_qa -> qa_passed -> publish_approved` only after live/router verification passes.
- [ ] Publish Wave 1 pages only after all gates pass.
- [x] Run post-publish verification cycle (`npm run verify`, `npm run verify:wix`, `npm run verify:wix:router`, `npm run verify:wix:live`) and capture reports.
- [x] Keep Wave 1 implementation outcomes and blocker evidence current in tracking artifacts.
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
