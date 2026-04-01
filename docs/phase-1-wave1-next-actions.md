# Phase 1 Wave 1 Execution Next Actions

Snapshot date: `2026-04-01`
Scope: `industry_pages` Wave 1 only (`batch_01`)

## Current Execution Snapshot

- Source tracker: `data/phase1_wave1_execution_tracking.csv`
- Seed verifier report: `reports/wix-industry-implementation-verification.md`
- Live binding verifier report: `reports/wix-wave1-live-binding-verification.md`
- Dynamic binding hotfix runbook: `docs/wix-wave1-dynamic-binding-hotfix.md`
- Wave 1 editor value sheet: `reports/wix-wave1-editor-binding-sheet.csv`
- Latest seed verifier run (`npm run verify:wix` on `2026-04-01`): `Errors: 0`, `Warnings: 0`
- Latest live verifier run (`npm run verify:wix:live` on `2026-04-01`): `Errors: 15`, `Warnings: 4`
- Latest QA run (`npm run qa` on `2026-04-01`): `PASS` (CSV parser fix applied in `scripts/qa-check.ts`)
- Wave 1 slugs tracked: `5`
- Slugs with import evidence in `data/wix_changes.csv`: `5/5`
- Slugs with supporting `industryPageRef` resolved in Wix: `5/5` (`20 FAQ + 15 module + 15 link rows`)
- Slugs with required media bound (`heroImage`, `ogImage`): `5/5`
- Slugs rolled back to `ready_for_qa` after live-binding gate failure: `5/5`

## Active Blockers (Wave 1)

1. Live SEO binding mismatch on all 5 slugs:
   - public `<title>`, `meta description`, and `og:title` do not match Wave 1 CMS seed values.
2. Live content binding signal mismatch on 4 slugs:
   - expected Wave 1 hero/H1 signals are not present in public HTML for:
     - `ecommerce-business-funding`
     - `restaurant-funding`
     - `trucking-funding`
     - `construction-contractor-funding`
3. Lifecycle gate rollback applied to prevent premature scheduling:
   - `metadataApproved=false`, `qaPass=false`, `publishReady=false`
   - `status=ready_for_qa`
   - blocker reason recorded on each Wave 1 `industryPages` row.
4. Platform automation limit:
   - Wix REST APIs available to this workflow do not expose a direct write endpoint for dynamic template SEO field bindings, so correction must be completed in Wix Editor UI before re-verification.
5. Branch state confirmation:
   - default branch is `Original-Branch` and publish actions target it; no alternate active branch explains the mismatch.

## Next Actions (Execution Order)

1. Fix dynamic page/template bindings in Wix Editor (use `docs/wix-wave1-dynamic-binding-hotfix.md`):
   - ensure route `/industries/{slug}` is bound to the intended dataset item for each slug.
   - ensure SEO bindings map correctly from CMS fields:
     - `seoTitle` -> page title
     - `metaDescription` -> meta description
     - `ogTitle` -> OG title
2. Republish the dynamic template/page changes in Wix.
3. Re-run:
   - `npm run verify:wix`
   - `npm run verify:wix:live`
4. Only after live verifier returns `Errors: 0`:
   - set `metadataApproved=true`, `qaPass=true`, `publishReady=true`
   - advance lifecycle:
     - `ready_for_qa -> qa_passed -> publish_approved`
5. Log each status change in `data/wix_changes.csv` before any scheduling/publish action.
